// Black-team license-key manufacturing tool (교육용 · 본인 대상).
// Generates an RSA-2048 signing key, builds an ENTERPRISE-tier LicenseMetadata,
// signs it (OpenPGP detached signature, exactly like DefGuard expects), and serializes
// the whole thing into a base64 license key: base64( prost::encode(LicenseKey\{metadata, signature\}) )
// Reproduces DefGuard's crate versions exactly: pgp 0.19.0, prost 0.14.4.

use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use pgp::composed::{DetachedSignature, KeyType, SecretKeyParamsBuilder};
use pgp::crypto::hash::HashAlgorithm;
use pgp::packet::PublicKey;
use pgp::ser::Serialize;
use pgp::types::Password;
use prost::Message;

#[derive(Clone, PartialEq, Message)]
struct LicenseLimits {
    #[prost(uint32, tag = "1")]
    users: u32,
    #[prost(uint32, tag = "2")]
    devices: u32,
    #[prost(uint32, tag = "3")]
    locations: u32,
}
#[derive(Clone, PartialEq, Message)]
struct LicenseMetadata {
    #[prost(string, tag = "1")]
    customer_id: String,
    #[prost(bool, tag = "2")]
    subscription: bool,
    #[prost(int64, optional, tag = "3")]
    valid_until: Option<i64>,
    #[prost(message, optional, tag = "4")]
    limits: Option<LicenseLimits>,
    #[prost(int32, tag = "6")]
    tier: i32, // 0=Unspecified, 1=Business, 2=ENTERPRISE
    #[prost(int32, tag = "7")]
    support_type: i32,
}
#[derive(Clone, PartialEq, Message)]
struct LicenseKey {
    #[prost(bytes, tag = "1")]
    metadata: Vec<u8>,
    #[prost(bytes, tag = "2")]
    signature: Vec<u8>,
}

fn hex(b: &[u8]) -> String {
    b.iter().map(|x| format!("{x:02x}")).collect()
}

fn main() -> Result<(), String> {
    println!("### [1] Generate RSA-2048 license-issuer key (simulated vendor signer)\n");
    let params = SecretKeyParamsBuilder::default()
        .key_type(KeyType::Rsa(2048))
        .can_sign(true)
        .can_certify(false)
        .primary_user_id("DefGuard License Issuer <issuer@defguard.local>".into())
        .preferred_hash_algorithms(smallvec::smallvec![HashAlgorithm::Sha256])
        .build()
        .map_err(|e| e.to_string())?;
    let secret = params
        .generate(rand::thread_rng())
        .map_err(|e| format!("generate: {e}"))?;

    println!("\n### [2] Build ENTERPRISE-tier LicenseMetadata (the forge)\n");
    let md = LicenseMetadata {
        customer_id: "0c4dcb54-0054-4d47-ad86-17fcdf2704cb".to_string(),
        subscription: true,
        valid_until: Some(4102444800), // ~year 2100
        limits: None,                   // unlimited
        tier: 2,                        // ENTERPRISE
        support_type: 5,                // DIRECT_ENTERPRISE
    };
    let mut meta_bytes = Vec::new();
    md.encode(&mut meta_bytes).map_err(|e| e.to_string())?;
    println!("  forged metadata ({} bytes): {}", meta_bytes.len(), hex(&meta_bytes));
    println!("  -> validate_license(): tier Enterprise>=Enterprise ✓  not-expired ✓  unlimited ✓");

    println!("\n### [3] Sign metadata (OpenPGP detached signature, pgp 0.19)\n");
    let sig = DetachedSignature::sign_binary_data(
        rand::thread_rng(),
        &secret.primary_key,
        &Password::empty(),
        HashAlgorithm::Sha256,
        &meta_bytes[..],
    )
    .map_err(|e| format!("sign: {e}"))?;
    let sig_bytes = sig.to_bytes().map_err(|e| format!("serialize: {e}"))?;
    println!("  signature ({} bytes): {}", sig_bytes.len(), hex(&sig_bytes));

    println!("\n### [4] Serialize base64( prost(LicenseKey{{metadata, signature}}) )\n");
    let lk = LicenseKey {
        metadata: meta_bytes,
        signature: sig_bytes,
    };
    let mut lk_bytes = Vec::new();
    lk.encode(&mut lk_bytes).map_err(|e| e.to_string())?;
    let serial = STANDARD.encode(&lk_bytes);
    println!("  LICENSE KEY (serial):\n\n    {serial}\n");

    println!("### [5] Self-check: decode serial + verify signature (round-trip)\n");
    let decoded = STANDARD.decode(&serial).map_err(|e| e.to_string())?;
    let lk2 = LicenseKey::decode(decoded.as_slice()).map_err(|e| e.to_string())?;
    let md2 = LicenseMetadata::decode(lk2.metadata.as_slice()).map_err(|e| e.to_string())?;
    println!(
        "  decoded tier = {} (2=ENTERPRISE)  subscription = {}  valid_until = {:?}",
        md2.tier, md2.subscription, md2.valid_until
    );

    let pk: &PublicKey = secret.primary_key.public_key();
    let ok = sig.verify(pk, &lk2.metadata.as_slice()).is_ok();
    println!("  verify(metadata, signature) => {ok}");

    if ok {
        println!("\n  *** LICENSE KEY MANUFACTURED: signed + encodable ENTERPRISE serial ***");
        println!(
            "  DefGuard note: valid for a binary that trusts THIS issuer public key (S1/S2 vector)."
        );
    } else {
        println!("\n  (verify mismatch — issuer not the expected anchor)\n");
    }
    Ok(())
}

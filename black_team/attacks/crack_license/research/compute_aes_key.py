from hashlib import sha256
N = int(open('/tmp/ghwork/rsa_mod.hex').read().strip(), 16)
E = 65537

def rsa_nopad_decrypt(ct_bytes):
    # RSA decrypt with PUBLIC key: m = ct^e mod n  (signature-style / no padding)
    m_int = int.from_bytes(ct_bytes, 'big')
    m_int = pow(m_int, E, N)
    # minimum length to be a valid 2048-bit plaintext block is 256 bytes
    out = m_int.to_bytes(256, 'big')
    return out

def try_keys(m):
    cands = []
    cands.append(('m[0:16]', m[0:16]))
    # also try trailing 16 (some layouts put key at end)
    cands.append(('m[-16:]', m[-16:]))
    return cands

if __name__ == '__main__':
    import sys
    ct_hex = sys.argv[1] if len(sys.argv)>1 else None
    if not ct_hex:
        print("usage: compute_aes_key.py <ct_hex>")
        sys.exit(0)
    ct = bytes.fromhex(ct_hex)
    print("ciphertext len:", len(ct))
    m = rsa_nopad_decrypt(ct)
    print("decrypted m (first 32 bytes hex):", m[:32].hex())
    print("decrypted m ascii (first 32):", ''.join(chr(c) if 32<=c<127 else '.' for c in m[:32]))
    for name, k in try_keys(m):
        print(f"\n[{name}] key bytes:")
        print("  hex:", k.hex())
        print("  ascii:", ''.join(chr(c) if 32<=c<127 else '.' for c in k))
        # try AES-128-CBC decrypt of a known structure to validate
        try:
            from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
            # zero IV test decrypt of 16 bytes of 0x00 -> recover first plaintext block
            dec = Cipher(algorithms.AES(k), modes.CBC(b'\x00'*16)).decryptor()
            pt = dec.update(b'\x00'*16) + dec.finalize()
            print(f"  AES-128-CBC decrypt(16x00) with this key -> {pt.hex()} (ascii {''.join(chr(c) if 32<=c<127 else '.' for c in pt)})")
        except Exception as ex:
            print("  cryptolib error:", ex)

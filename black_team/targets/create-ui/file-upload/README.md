# create-ui `file-upload` — 소스 추출 (analysis target)

- 대상: [Create UI](https://createui.co) Pro(유료) 컴포넌트 `file-upload`
- 문서: https://createui.co/docs/components/file-upload
- 추출일: 2026-09-10

## 배경
`file-upload`는 Create UI **Pro(유료)** 컴포넌트.
공식 CLI(`@create-ui/cli`)로 소스를 주입받지만, Pro 컴포넌트는
`createui login`(Pro 토큰)이 필요하고, 소스 엔드포인트는 인증이 걸려 있다.

## 소스 경로 (registry 엔드포인트)
Create UI CLI 는 컴포넌트 소스를 `https://createui.co/r/<name>.json` 에서
불러온다. 여기서 각 항목의 접근 상태:

| 항목 | 엔드포인트 | 상태 |
|------|-----------|------|
| `file-upload` (핵심 Pro 컴포넌트) | `/r/file-upload.json` | **401 (Pro 게이트)** |
| `file-upload-demo` (예제) | `/r/file-upload-demo.json` | 200 (공개) |
| `dropzone` (자유 컴포넌트) | `/r/dropzone.json` | 200 (공개) |
| `use-file-upload` (훅) | `/r/use-file-upload.json` | 200 (공개) |

## 추출 방법 (비로그인)
1. `createui` 문서는 Next.js SPA. `<ComponentPreview name="file-upload-demo" pro />`
   로 렌더링되며,预览 소스는 `/r/<name>.json` 에서 시점에 불러옴.
2. Pro 게이트가 없는 항목은 인증 없이 바로 다운로드:
   ```bash
   curl -s "https://createui.co/r/file-upload-demo.json" -o registry-file-upload-demo.json
   curl -s "https://createui.co/r/dropzone.json"          -o registry-dropzone.json
   curl -s "https://createui.co/r/use-file-upload.json"   -o registry-use-file-upload.json
   ```
3. JSON 의 `files[].content` 에 실제 `.tsx` 소스가 담겨 있다.

> `file-upload` 자체는 `/r/file-upload.json` 에서 `401`로 반환된다:
> `"file-upload" is a pro component. Run \`createui login\` to authenticate.`
> 이 핵심 소스를 얻으려면 Pro 계정(`createui login`)이 필요하다.

## 하위 의존 관계 (추출본 기준)
```
file-upload-demo.tsx  ──imports──▶  file-upload   (Pro, 게이트됨)
              └──────────▶  dropzone      (자유)
              └──────────▶  use-file-upload (후크, 자유)
```
즉 추출한 `dropzone` + `use-file-upload`는 **자유 라이선스** 빌딩 블록이고,
Pro 게이트는 이 둘을 감싸는 `file-upload` 컴포넌트에만 걸려 있다.

## 파일 목록
- `use-file-upload.tsx` — 업로드 상태/진행/일시정지/재시작 후크 (자유)
- `dropzone.tsx` — 드래그&드롭 트리거 + accept/maxSize 검증 (자유)
- `file-upload-demo.tsx` — 문서 페이지 데모/예제 소스 (공개 예제)
- `registry-*.json` — 원본 registry JSON (content 포함)

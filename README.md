# VocabMaster - OPIC 영어 단어 학습 PWA

OPIC AL 등급 달성을 위한 종합 영어 단어 학습 Progressive Web App (PWA)입니다.

## 바로 사용하기

**[https://haughty-snake.github.io/vocab-master](https://haughty-snake.github.io/vocab-master)**

위 링크를 클릭하여 바로 학습을 시작하세요. 모바일에서는 "홈 화면에 추가"로 앱처럼 설치할 수 있습니다.

## PWA 기능

VocabMaster는 PWA(Progressive Web App)로 제작되어 다음과 같은 기능을 제공합니다:

### 앱 설치
- **모바일**: 브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 앱처럼 설치
- **데스크톱**: 주소창의 설치 버튼을 클릭하여 독립 앱으로 설치
- 설치 후 네이티브 앱처럼 전체 화면으로 실행 가능

### 오프라인 지원
- Service Worker를 통한 오프라인 캐싱
- 인터넷 연결 없이도 학습 가능
- 학습 데이터는 로컬에 자동 저장

### 자동 업데이트
- 새 버전 출시 시 자동 감지
- 업데이트 알림 및 즉시 적용

## 주요 기능

### 1. 카테고리별 학습

- **명사** (546개): 일상 대화 필수 명사
- **동사** (600개): 기본 동작부터 고급 표현까지
- **형용사** (550개): 감정, 상태, 특성 표현
- **부사** (319개): 시간, 빈도, 정도 표현
- **전치사/접속사** (212개): 문장 연결 표현
- **숙어/관용표현** (632개): 자연스러운 표현
- **구동사** (74개): OPIC 필수 구동사
- **OPIC 필수 단어** (132개): 시험 빈출 어휘
- **문장 패턴** (300개): IL~AL 레벨 패턴
- **추가 표현** (195개): 연결어, 감정 표현 등
- **중급 단어** (358개): IM~IH 레벨 어휘
- **고급 단어** (310개): IH~AL 레벨 어휘
- **추가 숙어** (260개): 실용적인 숙어 표현
- **추가 구동사** (160개): 고급 구동사

**총 4,600+ 단어 및 표현**

### 2. 학습 모드

#### 플래시카드 모드
- 카드 뒤집기로 단어/뜻 학습
- 암기 완료/학습 중 표시
- 카드 섞기 기능
- 키보드 단축키 지원 (스페이스바: 뒤집기, 화살표: 이동)
- **TTS 음성 읽기** (단어/예문)

#### 블링크 모드
- 빠른 속도로 단어 노출 (0.5초~3초)
- 순간 기억력 훈련
- 영어만/뜻만/둘 다 표시 옵션

#### 퀴즈 모드
- 4지선다 문제
- 뜻 맞추기/단어 맞추기/혼합 모드
- 10/20/50/100 문제 선택
- 결과 통계 및 오답 학습

### 3. TTS (Text-to-Speech) 음성 읽기
- Web Speech API 활용 (브라우저 내장, 무료)
- 플래시카드에서 단어/예문 음성 읽기
- 설정에서 TTS 켜기/끄기 가능

### 4. 진행률 관리
- 단어별 암기 상태 추적 (새 단어/학습 중/암기 완료)
- 카테고리별 진행률 표시
- 전체 학습 통계

### 5. 데이터 관리
- **localStorage 저장**: 브라우저에 학습 기록 자동 저장
- **내보내기**: JSON 파일로 학습 데이터 백업
- **가져오기**: 백업 파일로 데이터 복원 (병합 모드)
- **초기화**: 학습 기록 완전 삭제

### 6. 설정
- 다크 모드 지원
- 발음 기호 표시 on/off
- TTS 음성 읽기 on/off

## 사용 방법

### GitHub Pages로 배포
1. 이 저장소를 Fork 하거나 Clone 합니다.
2. GitHub 저장소 Settings > Pages로 이동합니다.
3. Source를 "Deploy from a branch"로 설정합니다.
4. Branch를 "main"으로, 폴더를 "/vocab-master"로 설정합니다.
5. Save를 클릭하면 몇 분 후 웹사이트가 배포됩니다.

### 로컬에서 실행
```bash
# 저장소 클론
git clone https://github.com/your-username/opic-study-claude.git
cd opic-study-claude/vocab-master

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js
npx serve .
```
브라우저에서 `http://localhost:8000` 접속

## 파일 구조

```
vocab-master/
├── index.html          # 메인 HTML
├── manual.html         # 사용 매뉴얼
├── manifest.json       # PWA 매니페스트
├── sw.js               # Service Worker
├── README.md           # 이 문서
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── app.js          # 메인 앱 로직
│   ├── data.js         # 데이터 로딩/처리
│   ├── data.bundle.js  # 번들된 JSON 데이터
│   └── storage.js      # localStorage 관리
├── icons/              # PWA 아이콘
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   └── splash-*.png    # iOS 스플래시 스크린
├── data/
│   ├── nouns.json      # 명사 데이터
│   ├── verbs.json      # 동사 데이터
│   ├── adjectives.json # 형용사 데이터
│   ├── adverbs.json    # 부사 데이터
│   ├── prepositions.json # 전치사/접속사 데이터
│   ├── idioms.json     # 숙어/관용표현 데이터
│   ├── phrasalVerbs.json # 구동사 데이터
│   ├── vocabulary.json # OPIC 필수 단어 데이터
│   ├── patterns.json   # 문장 패턴 데이터
│   ├── expressions.json # 추가 표현 데이터
│   ├── vocabIntermediate.json # 중급 단어 데이터
│   ├── vocabAdvanced.json # 고급 단어 데이터
│   ├── additionalIdioms.json # 추가 숙어 데이터
│   └── additionalPhrasalVerbs.json # 추가 구동사 데이터
└── scripts/
    ├── parseMarkdown.js # 마크다운→JSON 변환 스크립트
    ├── bundleData.js    # JSON→JS 번들 스크립트
    └── generateIconsCanvas.js # PWA 아이콘 생성 스크립트
```

## JSON 데이터 형식

### 단어 데이터 (명사, 동사, 형용사, 부사, 전치사)
```json
[
  {
    "nameKo": "사람",
    "nameEn": "People",
    "words": [
      {
        "word": "person",
        "pronunciation": "ˈpɜːrsn",
        "meaning": "사람",
        "example": "She's a very kind person.",
        "translation": "그녀는 매우 친절한 사람이야."
      }
    ]
  }
]
```

### 동사 데이터 (과거형 포함)
```json
{
  "word": "go",
  "pronunciation": "ɡoʊ",
  "meaning": "가다",
  "pastTense": "went",
  "pastParticiple": "gone",
  "example": "Let's go to the movies.",
  "translation": "영화 보러 가자."
}
```

## 키보드 단축키 (플래시카드 모드)

| 키 | 동작 |
|---|---|
| `Space` / `Enter` | 카드 뒤집기 |
| `←` | 이전 카드 |
| `→` | 다음 카드 |
| `1` | 암기 완료 표시 |
| `2` | 학습 중 표시 |

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS Variables, Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)**: Vanilla JS, async/await, localStorage API
- **PWA**: Service Worker, Web App Manifest
- **Web Speech API**: TTS 음성 읽기
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## PWA 설치 방법

### Android (Chrome)
1. Chrome 브라우저로 웹사이트 접속
2. 주소창 오른쪽의 설치 버튼 클릭 또는 메뉴(⋮) > "앱 설치" 선택
3. "설치" 클릭

### iOS (Safari)
1. Safari 브라우저로 웹사이트 접속
2. 공유 버튼(□↑) 탭
3. "홈 화면에 추가" 선택
4. "추가" 탭

### Desktop (Chrome/Edge)
1. 브라우저로 웹사이트 접속
2. 주소창 오른쪽의 설치 아이콘(⊕) 클릭
3. "설치" 클릭

### PWA 아이콘 재생성 (개발자용)
```bash
cd vocab-master
npm install canvas
node scripts/generateIconsCanvas.js
```

## 브라우저 지원

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 데이터 출처

마크다운 파일에서 자동 변환:
- `일상영어_명사.md`
- `일상영어_동사.md`
- `일상영어_형용사.md`
- `일상영어_부사.md`
- `일상영어_전치사접속사.md`
- `일상영어_숙어관용표현.md`
- `구동사.md`
- `영어단어.md`
- `핵심문장패턴.md`
- `추가표현집.md`
- `추가단어_중급.md`
- `추가단어_고급.md`
- `추가숙어.md`
- `추가구동사.md`

## 마크다운 파일 수정 시

마크다운 파일을 수정한 후 JSON 데이터를 재생성하려면:

```bash
cd vocab-master

# 마크다운 → JSON 변환
node scripts/parseMarkdown.js

# JSON → JS 번들 생성
node scripts/bundleData.js
```

## 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

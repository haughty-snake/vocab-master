# 테스트 데이터 디렉토리

대용량 단어 일괄 등록 테스트를 위한 임의 데이터입니다.

## 파일 목록

| 파일 | 설명 | 크기 |
|------|------|------|
| `test-10000-words.json` | JSON 형식 만건 테스트 데이터 | ~5.6 MB |
| `test-10000-words.csv` | CSV 형식 만건 테스트 데이터 | ~1.4 MB |
| `generate-test-words.js` | 테스트 데이터 생성 스크립트 | - |

## 사용 방법

1. 앱에서 사용자 카테고리 생성
2. "파일 가져오기" 클릭
3. JSON 또는 CSV 파일 선택
4. 가져오기 실행

## 재생성

```bash
cd vocab-master/test-data
node generate-test-words.js
```

## 주의사항

- 이 디렉토리의 파일들은 테스트 전용입니다
- 실제 학습에 사용하는 단어가 아닙니다
- git에 커밋하지 않습니다 (.gitignore에 포함)

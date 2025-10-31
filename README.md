# 나를 그리는 한 장의 그림

예술적 심리테스트 웹 애플리케이션

## 프로젝트 개요

사용자의 내면을 하나의 예술 작품으로 표현하는 심리테스트입니다. 계절, 일정, 순간, 음악, 가치관 등의 질문을 통해 개인의 성향을 분석하고 시각적으로 표현합니다.

## 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Google Fonts
- **Assets**: Images, Audio files
- **Server**: Static file serving

## 프로젝트 구조

```
NN/
├── index.html          # 메인 HTML 파일
├── css/
│   ├── style.css       # 메인 스타일시트
│   └── result-styles.css # 결과 페이지 스타일
├── js/
│   └── app.js          # 메인 JavaScript 로직
├── images/             # 이미지 에셋
├── audio/              # 오디오 파일
└── frame/              # 프레임 이미지
```

## 설치 및 실행

### 필수 요구사항
- Node.js 16.0.0 이상

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
또는
```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속

### 미리보기
```bash
npm run preview
```

## 기능

1. **계절 선택**: 사용자의 성향과 가장 닮은 계절 선택
2. **일정 관리**: 선호하는 일정 패턴 선택
3. **순간 선택**: 마음에 드는 순간 선택
4. **음악 선택**: 취향에 맞는 음악 스타일 선택
5. **가치관**: 중요하게 생각하는 가치 선택
6. **결과 생성**: 선택한 답변을 바탕으로 개인화된 예술 작품 결과 제공

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

MIT License
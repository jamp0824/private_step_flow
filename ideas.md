# Bond Review 디자인 아이디어

## 디자인 방향 선택

<response>
<text>
**Structural Brutalism — 건축 도면 미학**

- **Design Movement**: Structural Brutalism / Architectural Blueprint
- **Core Principles**: 
  1. 정보 구조가 곧 시각적 구조 — 레이아웃이 데이터 위계를 직접 반영
  2. 장식 없는 기능성 — 모든 시각 요소는 정보 전달 목적만 존재
  3. 고대비 흑백 타이포그래피로 위계 표현
  4. 날카로운 직각 경계로 공간 분리
- **Color Philosophy**: 순수 모노크롬 팔레트. #000000 (최고 권위), #f9f9f9 (캔버스), #f3f3f3/#e2e2e2 (중첩 레벨), #ba1a1a (위험/오류만)
- **Layout Paradigm**: 3-패널 분할 — 좌측 고정 네비게이션(240px) + 중앙 스크롤 워크스페이스 + 우측 AI 코파일럿 패널(300px)
- **Signature Elements**: 1px 직선 경계, 0px 모서리 반경, 대문자 레이블
- **Interaction Philosophy**: 인버전 호버 (흰 배경 → 검정 배경), 상태 전환은 색이 아닌 경계선 두께로
- **Animation**: 최소한의 100ms 전환, 슬라이드 없음, 페이드 없음
- **Typography System**: Inter Black(제목) + Inter Medium(본문) + Inter Bold(레이블), 한글 line-height 1.6
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Monochrome Editorial — 금융 저널 미학**

- **Design Movement**: Swiss International Style / Financial Print
- **Core Principles**: 
  1. 그리드 기반 정보 배치
  2. 타이포그래피 위계로 중요도 표현
  3. 여백을 적극적 디자인 요소로 활용
  4. 데이터 밀도와 가독성의 균형
- **Color Philosophy**: 뉴스프린트 흰색(#ffffff) 기반, 잉크 검정(#111111), 중간 회색 계층
- **Layout Paradigm**: 2컬럼 에디토리얼 그리드, 좌측 넓은 콘텐츠 + 우측 좁은 메타데이터
- **Signature Elements**: 굵은 섹션 헤더 규칙선, 번호 매기기 시스템, 표 중심 레이아웃
- **Interaction Philosophy**: 밑줄 기반 링크, 명확한 포커스 링
- **Animation**: 없음
- **Typography System**: Inter + 모노스페이스 코드 폰트 조합
</text>
<probability>0.06</probability>
</response>

<response>
<text>
**Industrial Terminal — 전문가 워크스테이션 미학**

- **Design Movement**: Industrial / Command-Line Interface
- **Core Principles**: 
  1. 정보 밀도 최우선
  2. 상태 표시 명확성
  3. 전문가 도구 느낌
  4. 감사 추적 가시성
- **Color Philosophy**: 거의 흰색 배경에 진한 회색 텍스트, 오류만 빨간색
- **Layout Paradigm**: 상단 스테퍼 + 3분할 패널
- **Signature Elements**: 모노스페이스 코드 블록, 상태 배지, 타임라인
- **Interaction Philosophy**: 클릭 영역 명확, 비활성화 상태 명시
- **Animation**: 없음
- **Typography System**: Inter + JetBrains Mono
</text>
<probability>0.05</probability>
</response>

## 선택: Structural Brutalism

Blueprint 디자인 문서의 지시를 따라 **Structural Brutalism** 방향을 선택합니다.
- 0px 모서리 반경
- 모노크롬 팔레트
- 3-패널 레이아웃
- Inter 폰트
- 1px 직선 경계

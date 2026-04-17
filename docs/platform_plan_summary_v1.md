# platform_summary_v1

## Sheet 1: 사모사채_API_E2E_Flow - 표 1

### Table 1: 표 1

| 사모사채 API E2E Flow 정리 |   |   |   |   |   |   |   |   |   |   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 문서 목적 | 기초 버전-기능 / 기초 버전-문서 / API 계약서를 기준으로 사모사채 심사의 step_2 ~ step_6 E2E 흐름을 API 관점에서 정리한다. |   |   |   |   |   |   |   |   |   |
| 읽는 법 | Flow No 순서대로 읽으면 심사 진행 흐름이 이어진다. 각 행에서 입력 문서, 기능, API, AI 지원, 사람 판단 지점을 함께 확인한다. |   |   |   |   |   |   |   |   |   |
| 범위 메모 | 대상은 사모사채이며, 문서가 없으면 보완 요청으로 연결한다. AI는 보조 중심으로 사용하고 일부 항목은 human-only로 남긴다. |   |   |   |   |   |   |   |   |   |
| E2E 흐름 표 |   |   |   |   |   |   |   |   |   |   |
| Flow No | Stage | 세부 흐름 | 입력 문서 | 기능(Level A/B/C) | 대표 API | API 응답 패턴 | AI 지원 포인트 | 분기 조건 | 사람 확인/판단 | 산출물/다음 단계 |
| 2.1 | step_2 | Review Session 생성 | 투자검토 요청서
회사 개요서/IM
Term Sheet
발행 개요서 | 워크플로우 단계 관리 | POST /v1/review-sessions | 동기 201 | 없음 | 공통 | 담당자 착수 판단 | 심사 건 생성, 현재 단계 설정 |
| 2.2 | step_2 | 기본 문서 업로드 / 파싱 / 분류 | 투자검토 요청서
회사 개요서/IM
Term Sheet
발행 개요서
사모사채 발행 조건표 | 문서 파싱/추출
문서 분류 | POST /v1/documents
POST /v1/documents/{document_id}/classify
GET /v1/documents/{document_id}/chunks | 업로드/분류 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
텍스트 추출, 문서 유형 자동 판별 | 공통 | 분류 결과 검토 | 파싱 완료 문서, 분류 결과 |
| 2.3 | step_2 | 기본 누락 자료 체크 | step_2 기본 문서 세트 | 누락 자료 체크 | POST /v1/review-sessions/{session_id}/checklist | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
업로드 문서 기반 누락 탐지, 필요 문서 안내 | 문서 없음 | 누락 문서 확인, 보완 여부 결정 | missing_documents 또는 다음 단계 진행 |
| 2.4 | step_2 | 사모사채 공통 1차 확인 | Term Sheet
약정서/계약서 초안
사채 인수계약서/청약서
발행 개요서 | 발행구조 유형 분류
사모 적법성 검토
사모 요건 유지 여부 확인
EoD 조항 검토 | POST /v1/plugins/private_bond/classify-structure
POST /v1/plugins/private_bond/private-placement-check
POST /v1/plugins/private_bond/eod-review | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
키워드 추출, 조항 추출, 1차 판별, 요약 | 일반
후순위채
영구채 | 구조 유형 확인, 사모 적법성 1차 검토 | 구조 분기 기준, 사모 적법성 1차 결과 |
| 2.5 | step_2 | 조건 비교 / 과거 기준 확인 | Term Sheet
계약서 초안
내부 기준 문서 | 문서 간 조건 비교
이력 조회
내부 자료 검색
유사 사례 비교 | POST /v1/analysis/compare
GET /v1/search/history
POST /v1/search/internal | 비교 비동기, 검색 동기 | 보조
조건 차이 강조, 과거 기준 탐색, 근거 링크 제공 | 공통 | 비교 결과 확인 | 기본 조건 차이, 과거 기준 확보 |
| 3.1 | step_3 | 자료 수집 단계 업로드 | 최근 3개년 재무제표
감사보고서
신용평가 자료
사업보고서
주주현황 자료
차입금 현황표
담보 관련 약정서 | 문서 파싱/추출
누락 자료 체크 | POST /v1/documents
GET /v1/documents | 업로드 비동기 | 보조
추가 자료 파싱 및 정리 | 문서 없음 | 자료 수집 완료 여부 판단 | 분석 가능한 입력 자료 집합 |
| 3.2 | step_3 | 내부/외부 검색 | 과거 심사보고서
내부 가이드
외부 공시/뉴스/신용정보 | 유사 사례 검색
내부 자료 검색
외부 정보 수집 | POST /v1/search/similar-cases
POST /v1/search/internal
POST /v1/search/external | 내부 검색 동기
외부 수집 비동기 | 보조
유사 사례 비교용 참조 확보, 외부 사실확인 | 공통 | 외부 데이터 활용 여부 판단 | 유사 사례, 내부 기준, 외부 정보 확보 |
| 3.3 | step_3 | 요약 및 기초 분석 | 재무제표
감사보고서
신용평가 자료
사업보고서 | 요약
재무 분석
신용도 평가
산업/시장 분석
현금흐름 분석 | POST /v1/analysis/summarize
POST /v1/analysis/financial
POST /v1/analysis/credit-assessment
POST /v1/analysis/market
POST /v1/analysis/cashflow | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
사실확인용 요약, 재무/신용/시장/현금흐름 평가 | 공통 | 기초 분석 결과 검토 | 판단용 입력 분석 집합 |
| 3.4 | step_3 | 사모사채 세부 추출 | 사모사채 발행 조건표
계약서 초안
사채 인수계약서/청약서 | 원리금 상환 스케줄 분석
표면금리 vs 실효금리 분석 | POST /v1/plugins/private_bond/repayment-schedule
POST /v1/plugins/private_bond/effective-rate | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조(일부)
만기, 이자지급일, 수수료 등 추출 | 일반
후순위채
영구채 | 직접 계산, 직접 확인 | 상환 스케줄표 초안, 실효금리 산출 기초값 |
| 3.5 | step_3 | 후순위채 분기 분석 | 차입금 현황표
후순위 약정서
재무제표
계약서 초안 | 후순위 손실흡수 구조 분석
선순위 대비 회수 순위 분석
후순위 프리미엄 적정성 검토
선순위 채무 대비 비중 분석 | POST /v1/plugins/private_bond/subordinated/loss-absorption
POST /v1/plugins/private_bond/subordinated/recovery-priority
POST /v1/plugins/private_bond/subordinated/premium-adequacy
POST /v1/plugins/private_bond/subordinated/senior-debt-ratio | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조 / 보조(일부)
선순위 채무 추출, 회수 순위 구조화, 금리/비중 계산 보조 | 후순위채 | 수치 적정성 직접 판단 | 후순위 구조 분석 메모 |
| 3.6 | step_3 | 영구채 분기 분석 | 영구채 발행 약정서
계약서 초안 | 콜옵션 구조 및 행사 시점 분석
이자 스텝업 조건 검토 | POST /v1/plugins/private_bond/perpetual/call-option
POST /v1/plugins/private_bond/perpetual/step-up | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
콜옵션 조건, 행사 시점, 스텝업 조항 추출 | 영구채 | 조건 영향 직접 판단 | 영구채 조건 분석 메모 |
| 4.1 | step_4 | 판단용 종합 분석 | 3단계 산출 분석 전부
계약서 초안
유사 사례
외부 정보 | 리스크 식별
리스크 스코어링
이상치 탐지
계약조건 검토
독소 조항 탐지
금리/수익률 적정성
구조 적정성 검토
한도/규모 적정성
금리 스프레드 적정성 검토 | POST /v1/analysis/risk-identification
POST /v1/analysis/risk-score
POST /v1/analysis/anomaly-detection
POST /v1/analysis/contract-review
POST /v1/analysis/clause-detection
POST /v1/analysis/rate-adequacy
POST /v1/analysis/structure-adequacy
POST /v1/analysis/amount-adequacy
POST /v1/plugins/private_bond/spread-adequacy | 비동기
202 -> GET /v1/analysis/jobs/{job_id} | 보조
판단용 리스크 집계, 독소 조항 강조, 스프레드 계산 | 일반
후순위채
영구채 | AI 결과 비교 검토 | 종합 판단 자료, 리스크 요약표 |
| 4.2 | step_4 | 사람 확인 및 직접 판단 | AI 분석 결과
영구채 특수 조건 | Human Confirm
human-only 판단 기록 | POST /v1/analysis/results/{result_id}/confirm
POST /v1/sessions/{session_id}/decisions | 동기 200 | 불가 또는 보조 후 human confirm | AI 불가 항목
영구채 | human confirm, 직접 판단 | 확정된 판단, 감사 추적 이력 |
| 4.3 | step_4 | 협업 및 조건 정리 | 검토 메모
보완 요청사항
조건 변경 정보 | 메모/코멘트 작성
보완 요청
내부 의견 공유
조건 변경 이력 관리 | POST /v1/sessions/{session_id}/comments
POST /v1/sessions/{session_id}/supplement-requests
POST /v1/sessions/{session_id}/condition-changes | 동기 기록 | 없음 | 문서 없음
추가 확인 필요 | 담당자/검토자 의견 조율 | 보완 요청, 검토 메모, 조건 변경 이력 |
| 5.1 | step_5 | 보고서 작성 | 확정된 판단 결과
리스크 요약
투자조건 요약
사후관리 조건 | 초안 생성
사후관리 기준 수립
근거 링크 | POST /v1/reports/drafts
POST /v1/analysis/monitoring-criteria | 비동기
202 -> ready | 보조
심사보고서 초안, 사후관리 기준 초안 | 공통 | 내용 편집, 결론 확정 | 심사보고서 초안, 조건부 승인 요구사항 목록 |
| 5.2 | step_5 | 단계 전환 및 제출 | 심사보고서
승인신청서 초안 | 워크플로우 단계 관리 | POST /v1/review-sessions/{session_id}/transitions | 동기 기록 | 없음 | 공통 | 제출 가능 여부 확인 | step_6 전환 |
| 6.1 | step_6 | 승인/결재 및 결과 기록 | 심사보고서
승인신청서
승인장/품의서
심의 결과 통보서 | 워크플로우 단계 관리
승인 결과 기록 | 전용 승인 API 미정
POST /v1/review-sessions/{session_id}/transitions로 상태 관리 | 운영 처리 + 확장 포인트 | 없음 | 공통 | 결재, 결과 통보 | 승인 결과 기록, 심의 결과 통보 |
| API 리스트 요약 |   |   |   |   |   |   |   |   |   |   |
| API명 | 분류(Level) | 호출 단계 | 입력 기준 문서 | AI 연결 방식 | 관련 기능 |   |   |   |   |   |
| GET /v1/analysis/jobs/{job_id} | Common Async | 2.2 ~ 5.1 | 모든 비동기 분석 입력 | 비동기 job 결과 조회 | Async Job Pattern |   |   |   |   |   |
| POST /v1/review-sessions | Level A | 2.1 | 투자검토 요청서, 회사 개요서/IM, Term Sheet, 발행 개요서 | AI 없음 | 워크플로우 단계 관리 |   |   |   |   |   |
| POST /v1/documents | Level A | 2.2, 3.1 | 모든 입력 문서 | 업로드 후 파싱 job 연계 | 문서 파싱/추출 |   |   |   |   |   |
| GET /v1/documents | Level A | 3.1 | 업로드 완료 문서 | AI 없음 | 문서 관리 |   |   |   |   |   |
| GET /v1/documents/{document_id}/chunks | Level A | 2.2 | 파싱 완료 문서 | 추출 결과 근거 확인 | 문서 파싱/추출, 근거 링크 |   |   |   |   |   |
| POST /v1/documents/{document_id}/classify | Level A | 2.2 | 업로드 문서 | 문서 유형 자동 판별 | 문서 분류 |   |   |   |   |   |
| POST /v1/review-sessions/{session_id}/checklist | Level A | 2.3 | step별 필요 문서 집합 | 누락 자료 자동 점검 | 누락 자료 체크 |   |   |   |   |   |
| GET /v1/search/history | Level A | 2.5 | 내부 과거 심사 이력 | AI 없음 | 이력 조회 |   |   |   |   |   |
| POST /v1/search/internal | Level A | 2.5, 3.2 | 내부 보고서, 기준 문서 | 검색 결과를 판단 근거로 사용 | 내부 자료 검색 |   |   |   |   |   |
| POST /v1/search/similar-cases | Level A | 3.2 | 현재 건 컨텍스트, 유사 사례 필터 | 유사 사례 비교용 데이터 확보 | 유사 사례 검색 |   |   |   |   |   |
| POST /v1/search/external | Level A | 3.2 | 발행사명, 외부 소스, 기간 | 외부 사실확인 데이터 수집 | 외부 정보 수집 |   |   |   |   |   |
| POST /v1/analysis/summarize | Level A | 3.3 | 수집 자료 전체 | 핵심 문장/근거 요약 | 요약 |   |   |   |   |   |
| POST /v1/analysis/compare | Level A | 2.5 | Term Sheet, 계약서 초안 | 문서 간 차이 자동 탐지 | 문서 간 조건 비교 |   |   |   |   |   |
| POST /v1/analysis/anomaly-detection | Level A | 4.1 | 현재 건 분석 결과, 유사 사례 | 이상치 자동 감지 | 이상치 탐지 |   |   |   |   |   |
| POST /v1/analysis/clause-detection | Level A | 4.1 | 계약서 초안 | 불리 조항 탐지 | 독소 조항 탐지 |   |   |   |   |   |
| POST /v1/analysis/risk-score | Level A | 4.1 | 기초 분석/리스크 식별 결과 | 점수화와 driver 설명 | 리스크 스코어링 |   |   |   |   |   |
| POST /v1/analysis/results/{result_id}/confirm | Level A | 4.2 | AI 결과 | AI 결과 확정/수정/거절 | Human Confirm |   |   |   |   |   |
| POST /v1/reports/drafts | Level A | 5.1 | 확정 분석 결과 | 보고서 초안 생성 | 초안 생성 |   |   |   |   |   |
| POST /v1/sessions/{session_id}/comments | Level A | 4.3 | 검토 의견 | AI 없음 | 메모/코멘트 작성 |   |   |   |   |   |
| POST /v1/sessions/{session_id}/supplement-requests | Level A | 2.3, 4.3 | 누락 자료, 추가 요청사항 | AI 없음 | 보완 요청 |   |   |   |   |   |
| POST /v1/sessions/{session_id}/condition-changes | Level A | 4.3 | 변경된 조건 정보 | AI 없음 | 조건 변경 이력 관리 |   |   |   |   |   |
| POST /v1/review-sessions/{session_id}/transitions | Level A | 5.2, 6.1 | 단계 완료 여부, 제출 정보 | AI 없음 | 워크플로우 단계 관리 |   |   |   |   |   |
| POST /v1/analysis/financial | Level B | 3.3 | 최근 3개년 재무제표, 감사보고서 | 재무 지표와 추세 평가 | 재무 분석 |   |   |   |   |   |
| POST /v1/analysis/credit-assessment | Level B | 3.3 | 신용평가 자료, 재무제표 | 신용도 및 지속 가능성 평가 | 신용도 평가 |   |   |   |   |   |
| POST /v1/analysis/market | Level B | 3.3 | 사업보고서, 외부 시장 정보 | 산업/시장 영향 분석 | 산업/시장 분석 |   |   |   |   |   |
| POST /v1/analysis/contract-review | Level B | 4.1 | Term Sheet, 계약서 초안 | 투자자 유리 여부 검토 | 계약조건 검토 |   |   |   |   |   |
| POST /v1/analysis/risk-identification | Level B | 4.1 | 재무/신용/시장 분석 결과 | 핵심 리스크 도출 | 리스크 식별 |   |   |   |   |   |
| POST /v1/analysis/rate-adequacy | Level B | 4.1 | 금리, 신용등급, 만기 | 수익률 적정성 평가 | 금리/수익률 적정성 |   |   |   |   |   |
| POST /v1/analysis/structure-adequacy | Level B | 4.1 | 투자 구조, 특약 | 구조 적정성 판단 | 구조 적정성 검토 |   |   |   |   |   |
| POST /v1/analysis/cashflow | Level B | 3.3 | 재무제표, 자금 사용 계획서 | 현금흐름 기반 회수 가능성 평가 | 현금흐름 분석 |   |   |   |   |   |
| POST /v1/analysis/amount-adequacy | Level B | 4.1 | 투자 금액, 차입 규모 | 투자 금액 적정성 평가 | 한도/규모 적정성 |   |   |   |   |   |
| POST /v1/analysis/monitoring-criteria | Level B | 5.1 | 확정 분석 결과 | 사후관리 기준 초안 생성 | 사후관리 기준 수립 |   |   |   |   |   |
| POST /v1/plugins/private_bond/classify-structure | Level C | 2.4 | Term Sheet, 발행 개요서 | 키워드 추출 기반 유형 분류 | 발행구조 유형 분류 |   |   |   |   |   |
| POST /v1/plugins/private_bond/private-placement-check | Level C | 2.4 | 계약서 초안, 사채 인수계약서/청약서 | 전매제한/49인 이하 조항 추출 | 사모 적법성 검토 |   |   |   |   |   |
| POST /v1/plugins/private_bond/eod-review | Level C | 2.4 | 계약서 초안 | EoD 조항 추출과 요약 | EoD 조항 검토 |   |   |   |   |   |
| POST /v1/plugins/private_bond/repayment-schedule | Level C | 3.4 | 계약서 초안, 사모사채 발행 조건표 | 만기/이자 지급일/상환 방식 추출 | 원리금 상환 스케줄 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/effective-rate | Level C | 3.4 | 계약서 초안, 조건표 | 표면금리/수수료 추출 | 표면금리 vs 실효금리 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/spread-adequacy | Level C | 4.1 | 금리, 신용등급, 국고채 기준 | 스프레드 계산 보조 | 금리 스프레드 적정성 검토 |   |   |   |   |   |
| POST /v1/plugins/private_bond/subordinated/loss-absorption | Level C | 3.5 | 차입금 현황표, 재무제표 | 선순위 대비 손실흡수 구조 추출 | 후순위 손실흡수 구조 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/subordinated/recovery-priority | Level C | 3.5 | 차입금 현황표, 계약서 초안 | 회수 순위 구조화 | 선순위 대비 회수 순위 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/subordinated/premium-adequacy | Level C | 3.5 | 후순위 약정서, 금리 정보 | 프리미엄 수치 제시 | 후순위 프리미엄 적정성 검토 |   |   |   |   |   |
| POST /v1/plugins/private_bond/subordinated/senior-debt-ratio | Level C | 3.5 | 차입금 현황표, 재무제표 | 선순위 비중 계산 보조 | 선순위 채무 대비 비중 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/perpetual/call-option | Level C | 3.6 | 영구채 발행 약정서 | 콜옵션 시점/조건 추출 | 콜옵션 구조 및 행사 시점 분석 |   |   |   |   |   |
| POST /v1/plugins/private_bond/perpetual/step-up | Level C | 3.6 | 영구채 발행 약정서 | 스텝업 조건 추출 | 이자 스텝업 조건 검토 |   |   |   |   |   |
| POST /v1/sessions/{session_id}/decisions | Human-only 기록 | 4.2 | 영구채 특수 판단 메모 | AI 불가 항목 기록 | 영구채 자본성 인정 여부 판단 / 이자지급 유예 가능성 분석 / 영구채 출구 전략 분석 |   |   |   |   |   |
| 분기별 API 묶음 |   |   |   |   |   |   |   |   |   |   |
| 분기 | API 묶음 | 메모 |   |   |   |   |   |   |   |   |
| 공통 사모사채 | POST /v1/plugins/private_bond/classify-structure
POST /v1/plugins/private_bond/private-placement-check
POST /v1/plugins/private_bond/eod-review
POST /v1/plugins/private_bond/repayment-schedule
POST /v1/plugins/private_bond/effective-rate
POST /v1/plugins/private_bond/spread-adequacy | 일반 사모사채 공통 흐름 |   |   |   |   |   |   |   |   |
| 후순위채 전용 | POST /v1/plugins/private_bond/subordinated/loss-absorption
POST /v1/plugins/private_bond/subordinated/recovery-priority
POST /v1/plugins/private_bond/subordinated/premium-adequacy
POST /v1/plugins/private_bond/subordinated/senior-debt-ratio | 후순위 구조 분기에서만 호출 |   |   |   |   |   |   |   |   |
| 영구채 전용 | POST /v1/plugins/private_bond/perpetual/call-option
POST /v1/plugins/private_bond/perpetual/step-up
POST /v1/sessions/{session_id}/decisions | 영구채 구조 분기 + human-only 판단 포함 |   |   |   |   |   |   |   |   |
| Human-only 항목 |   |   |   |   |   |   |   |   |   |   |
| 항목 | 처리 방식 | 기록 API | 이유 |   |   |   |   |   |   |   |
| 영구채 자본성 인정 여부 판단 | 담당자 직접 판단 | POST /v1/sessions/{session_id}/decisions | 회계·법적 판단 필요 |   |   |   |   |   |   |   |
| 이자지급 유예 가능성 분석 | 담당자 직접 판단 | POST /v1/sessions/{session_id}/decisions | 발행사 상황 종합 판단 필요 |   |   |   |   |   |   |   |
| 영구채 출구 전략 분석 | 담당자 직접 판단 | POST /v1/sessions/{session_id}/decisions | 시장·발행사 상황 종합 판단 필요 |   |   |   |   |   |   |   |
| 문서 없음 / 보완 요청 흐름 |   |   |   |   |   |   |   |   |   |   |
| 순서 | 세부 흐름 | 대표 API | 설명 |   |   |   |   |   |   |   |
| 1 | 누락 감지 | POST /v1/review-sessions/{session_id}/checklist | missing_documents 확인 |   |   |   |   |   |   |   |
| 2 | 보완 요청 | POST /v1/sessions/{session_id}/supplement-requests | 심사 강제 종료 대신 보완 요청 |   |   |   |   |   |   |   |
| 3 | 재업로드 | POST /v1/documents | 추가 자료 업로드 및 파싱/분류 재실행 |   |   |   |   |   |   |   |
| 4 | 재실행 | POST /v1/review-sessions/{session_id}/checklist | 기본 요건 충족 시 메인 흐름 복귀 |   |   |   |   |   |   |   |

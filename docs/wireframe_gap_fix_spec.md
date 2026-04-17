### [P0-01] Step5 / Step6 분리

문제:
- 현재 Step56 화면에서 보고서 작성, 제출, 승인, 결과 기록이 모두 혼합됨

영향:
- reviewer → approver handoff가 보이지 않음
- 승인 책임 구조 붕괴

수정:
- Step5: 보고서 작성 + 제출 준비
- Step6: 승인 / 반려 / 결과 기록

화면 구조:

Step5:
- 보고서 작성 영역
- unresolved 항목 표시
- 제출 CTA

Step6:
- 승인 상태 표시
- 승인 / 반려 / 재작업 버튼
- 코멘트 입력
- 결과 기록 영역

상태:
- draft
- submitted
- under_review
- approved
- rejected
- returned

행동:
- Step5 제출 → 상태: submitted → Step6 이동
- Step6 승인 → 상태: approved → 종료
- Step6 반려 → 상태: rejected + 코멘트
- Step6 재작업 요청 → 상태: returned → Step5로 복귀

흐름:
- Step5 → Step6 (제출)
- Step6 → 종료 (승인)
- Step6 → Step5 (재작업)

완료 조건:
- Step5에서만 제출 가능
- Step6에서만 승인/반려 가능
- 모든 상태 변화는 UI에서 명확히 보임
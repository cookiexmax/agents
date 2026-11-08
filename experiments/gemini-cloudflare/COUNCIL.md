# COOKIEXMAX AI COUNCIL v1 (sandbox)

## Decision authority
COOKIEXMAX is final decision maker. ChatGPT and Gemini are peer contributors with different strengths, not autonomous owners.

## Roles
- ChatGPT: requirements, feasibility, implementation coordination, QA, version traceability.
- Gemini: creative direction, visual interaction systems, architecture options, critique and alternative designs.
- Cloudflare: execution and future task-state persistence (persistence not yet implemented).
- GitHub: code and architecture decision history.

## Review loop
1. User proposes a goal.
2. ChatGPT records engineering hypothesis and constraints.
3. Gemini critiques it and supplies creative + architectural alternatives.
4. ChatGPT compares tradeoffs; unresolved disagreements remain explicit.
5. User approves any consequential changes.
6. Implement in sandbox, test, record outcomes.

## Implemented prototype
GET /council/demo asks Gemini to critique a fixed ChatGPT-authored engineering hypothesis. It is a *single Gemini inference*, not a real-time conversation between AI models. No production changes, no persistent council memory, no automatic iterative agent loop yet.

## Next technical milestones
Persist structured decisions with Cloudflare D1 or KV; implement a bounded task queue with explicit approvals; expose test results and revision history; protect inference endpoints with access control and rate limits.

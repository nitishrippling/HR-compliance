# End-to-End Insurance Enrollment Setup Timeline

This document contains a structured, chronological data table outlining:

- What an **Admin** must do
- What **Rippling (system + operations)** must do
- What must happen for enrollment to be successfully created and transmitted

This covers the full lifecycle: from starting a new enrollment build to successful carrier transmission and post-setup monitoring.

---

## End-to-End Timeline (Admin vs Rippling)

| Step | When / Trigger | Admin – What They Do | Rippling – What Must Happen | Outcome / Validation / Timing |
|------|----------------|----------------------|-----------------------------|--------------------------------|
| 1 | Start new enrollment / renewal build | Open **Benefits Overview** and review Integrations Snapshot | Run automatic **Preflight Audit** across all carriers: detect transmission type (EDI / Form / Manual), EDI status, Group ID presence, default sending contacts, and blockers | Snapshot displays X carriers, Y blockers. Immediate visibility. |
| 2 | Immediately after Preflight | Review transmission type and blocker indicators per carrier | Render per-carrier summary row with Transmission icon, EDI status pill, Group ID value/missing, sending contact, responsible party, and quick actions | Admin clearly understands automation vs manual responsibilities |
| 3 | If Group ID missing | Click **Add Group ID** and enter value OR use outreach template | Validate Group ID format, persist to integration record, optionally generate prefilled carrier outreach template | Group ID stored, blocker cleared (or outreach initiated) |
| 4 | If sending contact needs confirmation | Click **Edit sending contact** and update primary recipient and CCs; optionally run test | Validate email/fax syntax, persist changes, send optional test form/ping | Contact confirmed and functional |
| 5 | If carrier is EDI/API eligible | Click **Enable EDI/API** and confirm required data | Launch prefilled CarrierConnect/Noyo flow; create connection request; update status to "In Progress"; track ticket | EDI setup initiated (Days–Weeks depending on carrier) |
| 6 | During EDI setup | Provide any additional requested info | Track external vendor updates; update status from In Progress → Active; notify admin | EDI becomes Active |
| 7 | If carrier is Form-Sending | Confirm recipient and designate responsible monitor | Rippling generates enrollment forms on trigger events and sends to configured email(s); logs send events | Forms successfully sent and logged |
| 8 | If carrier is Manual | Complete mandatory attestation checkbox; optionally assign another admin | Enforce attestation; block build completion until acknowledged; log timestamp and assignee | Responsibility formally recorded |
| 9 | After resolving blockers | Click **Review & Sign-off** | Display OE File Accountability summary; require final acknowledgment; persist signature; enable export | Enrollment build permitted to complete |
| 10 | Immediately after sign-off | Optionally validate with test sends or internal review | Send initial test files or sample forms; provide validation checklist; log results | Initial validation complete |
| 11 | Post-setup monitoring | Monitor integration status and send history | Provide per-carrier activity log (form sends, EDI events, rejections); notify admin of critical events | Ongoing transmission health maintained |
| 12 | If transmission fails or enrollment missed | Use outreach template or open support case | Route case to correct internal team (Carrier Communications / Insurance Ops); include context (Group ID, logs) | Faster resolution cycle |
| 13 | Pre-OE or mid-year changes | Revisit Integrations Snapshot before OE | Re-run preflight audit; flag new blockers; surface EDI availability for new carriers | Clean pre-OE state |
| 14 | Audit / Compliance review | Export OE File Accountability and integration logs | Generate CSV/PDF including carrier, transmission type, group ID, contacts, attestations, timestamps | Full audit trail available |

---

## Summary of Responsibilities

### Admin Responsibilities
- Review transmission type per carrier
- Ensure Group ID is present
- Confirm or update form-sending contacts
- Initiate EDI/API when eligible
- Acknowledge responsibility for manual carriers
- Validate first transmissions
- Monitor ongoing transmission health

### Rippling Responsibilities
- Automatically audit carrier integration status
- Surface blockers clearly on Benefits Overview
- Validate and persist Group IDs and contact edits
- Enable one-click EDI/API initiation
- Generate and send form enrollments when triggered
- Log all transmissions and maintain activity history
- Enforce mandatory attestations for manual carriers
- Provide exportable audit trail

---

## Final Outcome Definition

A new insurance enrollment is considered successfully created when:

1. All carriers have either:
   - Active EDI/API connection
   - Confirmed Form-Sending configuration
   - Manual carrier attestation recorded
2. Group IDs are present where required
3. Sending contacts are validated
4. OE File Accountability is signed off
5. First transmission (or test) is validated
6. Activity logs show successful send or accepted EDI transaction

Only when all above conditions are met should the enrollment lifecycle be considered operationally complete.
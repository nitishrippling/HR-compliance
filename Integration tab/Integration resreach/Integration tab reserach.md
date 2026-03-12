# **Integrations / Benefits Enrollment — Problems, Current Flow, Ideal Flow, and Proposed Solutions**

*(Comprehensive document — markdown)*

---

## **Executive summary**

Brokers and admins frequently miss or misunderstand **who is responsible** for submitting enrollments to carriers because the product mixes multiple transmission modes (EDI/API, Form-Sending, Manual) without making responsibilities, blockers, and required actions explicit. This causes missed enrollments, late escalations, and heavy support load.

This document collates:

1. **All observed problems** (evidence-backed)  
2. **The current journey / flow** admins take today (what actually happens)  
3. **The ideal admin journey / flow** (what the system should do)  
4. **Concrete/basic solutions** to close gaps (prioritized, with UX & operational detail)

Citations to the core reference docs are included inline.

---

## **Table of contents**

* Problems (exhaustive)  
* Current flow (what admins actually do)  
* Ideal flow (what the system should do)  
* Gap analysis: Current → Ideal  
* Basic solutions & prioritized roadmap  
* UX/behavioral details, microcopy, and acceptance criteria  
* Appendix: Key Confluence references

---

## **Problems (exhaustive)**

Evidence summary: We pulled the Integrations Summary proposal, Confluence integration / support playbooks, Form-Sending FAQ, Noyo connection instructions, and Support routing docs. These sources repeatedly call out the same root failures: lack of transparency about transmission type and responsibility, missing Group IDs and unclear EDI initiation flows, and no forced attestation for manual carriers.

1. **Unclear responsibility / “Who does what?”**  
   * Brokers often assume Rippling will handle enrollments when the carrier is actually Form-Sending or Manual, causing missed enrollments and escalations. The Integrations Summary proposal lists this as the central problem.  
      Integrations Summary Tab Propos…  
2. **Transmission method not prominently surfaced**  
   * The UI currently shows some small labels (e.g., “Forms – email”, “EDI in progress”), but these do not function as a definitive, prominent signal that the broker must act. Brokers still assume automation in many cases. The proposal explicitly asks for a clear transmission summary per carrier.  
      Integrations Summary Tab Propos…  
3. **Missing Group ID and lack of safeguards**  
   * If a Group ID is missing, transmissions are blocked. Admins/brokers often discover missing IDs late in the process. Playbooks repeatedly require a Group ID to initiate EDI or file feeds.  
     Rippling Confluence  
     [Initiating a Group Connection R…](https://rippling.atlassian.net/wiki/spaces/CCE/pages/5602385994/Initiating+a+Group+Connection+Request)  
4. **Default “sending form to” contacts are hard to discover/edit**  
   * Form-Sending sends forms to the email listed in Integrations; the client or broker must be CC’d and confirm processing — this is not obvious or easy to edit inline.  
5. **No in-product, one-click path to enable EDI/API when available**  
   * When CarrierConnect (CarrierConnect / Noyo) is available, the system should surface the option to request/enable it directly. Current flows require separate multi-step processes and external tools (Noyo) and thus are harder to discover & use.  
6. **Missing forced attestation for manual carriers**  
   * For carriers that will not accept electronic files (or where Rippling has no integration), admins must be forced to acknowledge responsibility in order to avoid “failure to notify” escalations. The proposal requires a manual acknowledgment checkbox but this is not enforced today.  
      Integrations Summary Tab Propos…  
7. **No single “Responsibility Matrix” / Audit screen**  
   * Users want an audit table: Carrier | Transmission Type | Email/Fax | EDI/API status | Responsible party | Blockers. The proposal asks for it explicitly. Current surfaces are scattered and not editable inline.  
      Integrations Summary Tab Propos…  
8. **Operational complexity & ambiguous support routing**  
   * Confluence playbooks show complex rules (BOR/PEO vs BOB, Insurance Support vs Carrier Communications), causing confusion about where a broker should route carrier communications or escalations.  
9. **No clear timeline or “what to expect” when EDI/API is in progress**  
   * States like “EDI in progress” or “EDI available” lack consistent timeline guidance or next steps, so admins don’t know whether to act.  
      Integrations Summary Tab Propos…  
10. **Limited inline editing & test capability for form recipients**  
    * Admins lack the ability to inline edit the destination email/fax for Form-Sending and then test that address. This leads to misrouted forms and missed carrier processing confirmation.  
11. **Lack of OE accountability export and delegated sign-off**  
    * There’s no formal way to assign responsibility to another Admin (delegated sign-off) or export OE File Accountability for audits. The proposal lists “Assign to Admin” as a required feature.  
       Integrations Summary Tab Propos…  
12. **Admins start at Benefits Overview but integration signals live on a separate Integrations page**  
    * Many admins never open Integrations. Thus, all critical operational signals must be surfaced on Benefits Overview. (You asked this explicitly and we documented that the snapshot must live on Benefits Overview.)

---

## **Current flow — what admins actually do today**

This is an operational reconstruction based on screenshots and the Confluence docs:

1. **Admin opens Benefits Overview** (default landing place for benefits changes / OE). They check plans, plan years, and overall carriers. The Benefits Overview shows carriers and Group IDs (sometimes), and has tabs for “Current” / “Upcoming” benefits (screenshots).  
2. **Integration signals often ignored** — many admins don’t click the Integrations tab. If they do, the Integrations page lists carriers with a column for “Active carrier integration” and “EDI/API details” but only in table rows. The page lacks a single responsibility matrix/audit screen. (Screenshots show current Integrations UI.)  
3. **Admin configures plan data** (adds carriers/plans). Rippling captures default transmission metadata (e.g., Form-Sending configured to an email), but this is *not* obviously emphasized to the admin.  
4. **If EDI is available or in progress** — Admin or PSM must follow a separate Noyo / CarrierConnect process (external tool, many steps) to request connection; the process is multi-step and relies on playbook instructions. There is not always an in-product, single-click initiation from Benefits Overview.  
5. **Group ID issues discovered later** — Missing Group IDs may not be checked until attempting to send or during post-build QA. When missing, admins or support follow playbook templates to request the Group ID from the carrier.  
   Rippling Confluence  
   [Initiating a Group Connection R…](https://rippling.atlassian.net/wiki/spaces/CCE/pages/5602385994/Initiating+a+Group+Connection+Request)  
6. **Form-sends go to default contact** — The Form-Sending tool will send enrollment forms to the email in the Integrations card. Brokers must subsequently verify carrier processing, but this verification step is manual and fragile (e.g., rely on carrier portals or invoices).  
7. **No forced attestation** — Admins finish builds without being forced to attest responsibility for manual carriers; only later, when a missed enrollment occurs, the lack of signoff is discovered.  
    Integrations Summary Tab Propos…  
8. **Escalations & support routing** — When things go wrong, admins open tickets. Support staff consult the Insurance Support / Carrier Communications playbooks to decide how to route the case. The docs include many conditional rules that are sometimes misapplied by less experienced staff.

**Net effect:** Because responsibility is ambiguous, many steps are manual and asynchronous (emails to carriers, external tools), and the admin lacks an integrated, single source of truth and enforcement.

---

## **Ideal flow — a complete step-by-step admin journey**

This is the recommended, system-driven end-to-end flow that eliminates ambiguity and enforces accountability.

### **Preflight (automatic)**

* On “Start New Enrollment / Renewal build” the system runs **Preflight Audit** for all carriers and plan years:  
  * Detects transmission type (EDI/API, Form-Sending, Manual), EDI status (Active / In progress / Available / Not available), Group ID presence, default “sending form to” contacts, and blockers.  
  * Presents **one summary banner**: “Preflight completed: X carriers scanned, Y require attention” and an export button (CSV). *(This is the Responsibility Matrix.)*  
     Integrations Summary Tab Propos…

### **Integrations Audit screen (single page)**

* One row per carrier with the following columns:  
  * **Carrier logo & name** (link opens carrier card)  
  * **Transmission Type** (big icon \+ label). Hover shows one-line explanation and implications (who must act).  
  * **EDI/API status pill**: Active (green) | In progress | Available (blue) | Not available. Include expected timeline & link to details.  
  * **Group ID**: value or **Missing** (red flag) \+ inline edit.  
  * **Sending form to**: list of default emails/faxes with inline edit pencil & “test contact” option.  
  * **Responsible party**: Rippling | Broker (you) | Carrier (explicit)  
  * **Blocker**: missing Group ID / missing contact / manual carrier requiring action  
  * **Actions**: Resolve / Enable EDI / Edit contact / Assign

*(This replaces the scattered indicators with a single, audit-ready table.)*

Integrations Summary Tab Propos…

### **Resolve blockers (guided modals / flows)**

* **Missing Group ID**: Inline add \+ validation \+ “open carrier outreach template” prefilled with company/FEIN/plan info (based on playbooks).  
  Rippling Confluence  
  [Initiating a Group Connection R…](https://rippling.atlassian.net/wiki/spaces/CCE/pages/5602385994/Initiating+a+Group+Connection+Request)  
* **EDI available**: “Enable EDI/API” CTA → launches a pre-filled CarrierConnect / Noyo wizard that validates FEIN and Group ID, collects any remaining values, shows expected timeline, and creates a ticket/trace for the request. Status becomes **In progress**.  
* **Form-Sending**: Inline edit of recipients, CCs, and a “test contact” send. System highlights that someone must be CC’d on enrollment sends (Form-Sending FAQ).  
* **Manual carriers**: Requires mandatory attestation checkbox per carrier: *“I understand Rippling does not send electronic files to this carrier and I accept responsibility for employee enrollment management.”* Optionally select/assign another Admin. The system blocks completion until acknowledgements are recorded.  
   Integrations Summary Tab Propos…

### **Review & sign-off**

* After resolving or acknowledging blockers, the admin sees a **Review & Sign-off** page:  
  * Clear lists of carriers that are automated vs manual vs EDI in progress.  
  * For each manual carrier, the exact task the broker must complete (submit forms, confirm portal).  
  * A final **Acknowledge & Finish** step where the admin (or delegated Admin) signs the OE File Accountability attestation (time stamped). This prevents future “I thought Rippling would do that” escalations.  
     Integrations Summary Tab Propos…

### **Post-setup monitoring & audit**

* For Form-Sending: a per-carrier form send history (date/time, recipients, any carrier responses).  
* For EDI: notification updates as the connection transitions (In progress → Active) and a “first sends” checklist for validation.  
* Full audit trail for changes: who edited contacts, who added Group IDs, who attested. This log can be exported for audits.

---

## **Gap analysis: Current → Ideal (mapping problems to fixes)**

1. **Ambiguous responsibility** → *Fix:* Integrations Audit \+ responsibility column \+ forced attestations \+ delegated sign-off (blocks finish until acknowledged).  
    Integrations Summary Tab Propos…  
2. **Transmission method inconspicuous** → *Fix:* Prominent Transmission Type icon/label, tooltip explanation, and color semantics on Benefits Overview and Integrations audit.  
3. **Missing Group ID discovered late** → *Fix:* Preflight checks highlight missing Group ID; inline “Add Group ID” \+ prefilled carrier outreach template.  
   Rippling Confluence  
   [Initiating a Group Connection R…](https://rippling.atlassian.net/wiki/spaces/CCE/pages/5602385994/Initiating+a+Group+Connection+Request)  
4. **Default contact hard to edit** → *Fix:* Inline editing \+ test contact \+ CC management on the audit row; Form-Sending FAQ guidance surfaced.  
5. **No one-click EDI initiation** → *Fix:* “Enable EDI/API” CTA that launches prefilled Noyo / CarrierConnect flow, and shows timeline/status.  
6. **No audit / OE accountability** → *Fix:* Review & Sign-off modal with explicit attestations and delegated assignment; exportable accountability matrix.  
    Integrations Summary Tab Propos…  
7. **Support routing confusion** → *Fix:* Integrate targeted context links to Insurance Support / Carrier Communications playbooks from relevant modal actions; include prefilled case templates.  
8. **Admins don’t open Integrations** → *Fix:* Surface an **Integrations Snapshot** on the Benefits Overview with the top signals and quick actions (Add Group ID, Edit contact, Enable EDI).

---

## **Basic solutions & prioritized roadmap**

### **Highest priority (P0) — Immediate payoff**

1. **Integrations Audit / Responsibility Matrix** (single screen or a snapshot on Benefits Overview)  
   * Fields: Carrier | Transmission Type (icon & label) | EDI/API status | Group ID | Sending Contact(s) | Responsible party | Actions.  
   * Inline edit for contact & Group ID.  
   * Mandatory attestation UI for manual carriers (block finish until done).  
   * Exportable CSV/PDF.  
2. **Integrations Snapshot on Benefits Overview**  
   * Compact at-a-glance UI with the same essential columns as Audit. Admins must see these signals during the build process.  
3. **Mandatory OE File Accountability sign-off**  
   * Final sign-off modal that enumerates which carriers require manual processing and captures signature/assignments.

### **Medium priority (P1)**

4. **One-click “Enable EDI/API”** (CarrierConnect/Noyo) with prefilled fields and progress status.  
5. **Inline contact test & CC management** for form sends.  
6. **Missing Group ID safeguard & prefilled carrier outreach templates**.  
7. **Per-carrier activity log** for form sends and EDI events.

### **Lower priority (P2)**

8. **Detailed per-carrier logs / technical diagnostics** (keep on Integrations tab).  
9. **OE File Accountability reports & audit exports** with more legal language if needed.  
10. **Visual polish and microcopy improvements** (tooltips, color legend, accessible icons).

---

## **UX / Behavioral details, microcopy, and acceptance criteria**

### **Transmission pill tooltips (example copy)**

* **EDI / API — Automatic**  
  “Rippling will transmit enrollment files electronically to this carrier. Confirm Group ID and plan mapping. Until Active, you are responsible for enrollments.”  
* **Form-Sending — Semi-automated**  
  “Rippling generates enrollment forms and sends them to the email listed. A client or broker must confirm the recipient and verify processing. Click Edit to change recipient or CCs.”  
* **Manual / Principal — Required action**  
  “This carrier does not accept automatic electronic enrollment. You (or the assigned admin) must submit enrollments to the carrier.”

### **Required attestation copy**

* For manual carriers: *“I understand Rippling does not send electronic files to \[Carrier Name\]. I accept responsibility for submitting and confirming Open Enrollment employee enrollments for this carrier.”*  
* Capture: name, role, timestamp, assignee (if delegated).

### **Review & Sign-off acceptance criteria (sample)**

* Admin cannot complete the renewal/enrollment build if any carrier is manual and not attested or any required Group ID is missing.  
* Inline edits must validate email syntax and persist to the company’s Integrations record.  
* “Enable EDI/API” request must create a traceable ticket, prefill Noyo fields, and change the status pill to **In progress**.  
* Audit log records: who edited the sending contact, who added Group ID, who attested (with timestamp & user id).


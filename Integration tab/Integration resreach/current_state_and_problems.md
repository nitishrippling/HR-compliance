# Benefits Enrollment Transmission: Current State & Problem Inventory

*Comprehensive reference document — sourced from Confluence PRDs, operational playbooks, support docs, vendor routing architecture, and qualitative research.*

---

## Table of Contents

- [Section 1: How Things Currently Work](#section-1-how-things-currently-work)
  - [1.1 The Big Picture](#11-the-big-picture)
  - [1.2 Customer Types and How They Differ](#12-customer-types-and-how-they-differ)
  - [1.3 Transmission Modes (How Enrollment Data Gets to Carriers)](#13-transmission-modes)
  - [1.4 Carrier Connection Vendors (The Middleware Layer)](#14-carrier-connection-vendors)
  - [1.5 The Vendor Routing System](#15-the-vendor-routing-system)
  - [1.6 The EDI/API Connection Lifecycle](#16-the-ediapi-connection-lifecycle)
  - [1.7 Form Sending: How It Actually Works](#17-form-sending-how-it-actually-works)
  - [1.8 Manual/No Automation: What Happens When There Is No Integration](#18-manual-no-automation)
  - [1.9 Dual Communications (Dual Comms)](#19-dual-communications)
  - [1.10 COBRA Transmission Nuances](#110-cobra-transmission-nuances)
  - [1.11 Open Enrollment Transmission](#111-open-enrollment-transmission)
  - [1.12 Renewals and Mid-Year Changes](#112-renewals-and-mid-year-changes)
  - [1.13 Group ID: Why It Matters and Where It Breaks](#113-group-id)
  - [1.14 Carrier Adds & Edits: The Operational Pipeline](#114-carrier-adds-and-edits)
  - [1.15 Key Carrier-Specific Edge Cases and Limitations](#115-carrier-specific-edge-cases)
  - [1.16 Multi-Entity Companies](#116-multi-entity-companies)
  - [1.17 What the Admin Actually Sees in the UI Today](#117-what-admin-sees-today)
- [Section 2: Exhaustive Problem Inventory](#section-2-exhaustive-problem-inventory)
  - [2.1 Visibility Problems](#21-visibility-problems)
  - [2.2 Responsibility & Accountability Problems](#22-responsibility-problems)
  - [2.3 Data & Configuration Problems](#23-data-configuration-problems)
  - [2.4 Workflow & Process Problems](#24-workflow-process-problems)
  - [2.5 Anxiety & Confidence Problems](#25-anxiety-confidence-problems)
  - [2.6 Operational & Support Problems](#26-operational-support-problems)
  - [2.7 Edge Case & Timing Problems](#27-edge-case-timing-problems)

---

# Section 1: How Things Currently Work

## 1.1 The Big Picture

When an employer sets up benefits in Rippling, each benefit plan is associated with an insurance carrier (e.g., Cigna for Medical, Guardian for Dental, New York Life for Disability). Once employees enroll in these plans, the enrollment data — new hires, terminations, qualifying life events (QLEs), demographic changes, open enrollment elections — must be **transmitted to each carrier** so the carrier can update their own systems and issue coverage.

This transmission can happen in one of several ways, ranging from fully automated (EDI/API) to completely manual (the admin downloads forms and sends them to the carrier themselves). The method depends on:

- Whether the carrier supports EDI or API connections
- Whether the customer has purchased the Carrier Connection (CC) SKU
- Whether "Rippling Managing Forms" is turned on
- Whether a Group ID is present and valid
- Which third-party vendor (Noyo, OneKonnect, Ideon, Stedi) handles the connection
- Whether the customer is BOR (Broker of Record — Rippling is their broker) or BOB (Bring Your Own Broker)

The complexity of this system — with multiple vendors, multiple transmission modes, multiple customer types, and carrier-specific nuances — is the root cause of nearly every problem users experience.

---

## 1.2 Customer Types and How They Differ

### BOR (Broker of Record)
- Rippling IS the insurance broker for these companies
- Carrier Connection EDI/API is **automatically included at no cost**
- Rippling **automatically initiates** EDI/API connections for all supported carriers
- "Rippling Managing Forms" is **auto-enabled** and the setting is hidden from the user
- The admin doesn't need to make any transmission mode decisions — Rippling handles everything

### BOB (Bring Your Own Broker)
- The company uses an **external broker** (not Rippling)
- Carrier Connection EDI/API is a **paid SKU** ($500/year + $1 PEPM for benefits-eligible employees)
- The admin must **manually initiate** EDI/API connection requests from the Carrier Transmission tab
- "Rippling Managing Forms" must be **manually enabled** by the admin or their broker
- If the CC SKU is not purchased, **form sending is the maximum automation available**
- If form sending is also not enabled, **the admin is fully responsible** for all enrollment transmission

### HUB+BOR (HUB tagged groups, Rippling is broker)
- Treated like BOR — Rippling auto-initiates connections, no extra charge

### BOR+HUB (HUB is the broker, not Rippling)
- Treated like BOB — must purchase CC SKU, must manually initiate
- The Carrier Transmission tab is now exposed to these customers (recently enabled)

### PEO (Professional Employer Organization)
- Carrier Transmission tab is **not exposed** to PEO customers at all
- The PEO acts as a large single employer, so all changes are sent via existing EDI/API connections managed internally by Rippling
- PEO customers are fully excluded from the self-serve integration flow

---

## 1.3 Transmission Modes (How Enrollment Data Gets to Carriers)

There are four distinct transmission modes. The admin's experience differs dramatically depending on which mode applies to each carrier.

### Mode 1: EDI (Electronic Data Interchange) — Fully Automated

**What it is:** Rippling sends standardized data files to the carrier via a middleware vendor (Ideon/OneKonnect) or directly (Stedi/In-house). The carrier ingests these files and updates their eligibility systems.

**Key characteristics:**
- Files are sent on a scheduled cadence, typically **1-2 times per week**
- Setup timeline: **8-14 weeks** from initiation to production
- Goes through defined stages: Order Initiated → Requirements Gathering (1-2 weeks) → Validation (1-2 weeks) → Configuration (1-2 weeks) → Carrier Testing (2-5 weeks) → Production (up to 1 week)
- Once live, the admin does **nothing** — transmissions are automatic
- Handles: new hire enrollments, terminations, open enrollment, qualifying events, demographic changes, COBRA (except on Noyo)

**What the admin must provide:**
- Valid Group ID
- Correct account structure
- Any carrier-required authorizations (e.g., broker authorization forms for some carriers)

**What the admin does NOT get:**
- No notification when the feed goes live (only the status changes silently)
- No notification of individual transmission events in real-time
- No ability to see the actual file contents being sent (for most vendors)

### Mode 2: API (Application Programming Interface) — Fully Automated

**What it is:** Rippling writes enrollment data directly to the carrier's system via an API, typically through Noyo. Unlike EDI's batch file approach, API sends individual transactions as they occur.

**Key characteristics:**
- Setup timeline: **~2 weeks** (much faster than EDI)
- Transactions are sent **when they occur** (event-driven, not batch)
- Carrier typically processes changes within **4 business days**
- Currently available through **Noyo** and some in-house API connections

**Critical nuance — API and Open Enrollment:**
- If an API connection goes live **after** Open Enrollment has completed, the OE elections **will NOT be submitted retroactively**. Only new changes (new hires, QLEs, demographic changes) will flow through the API.
- If the API connection is live **before** Open Enrollment, then OE elections will be sent via API.

**What the admin gets/doesn't get:**
- Same as EDI — no live notification, no real-time transaction visibility

### Mode 3: Form Sending (Email/Fax) — Semi-Automated

**What it is:** Rippling generates enrollment forms based on employee enrollment data and automatically emails or faxes them to the carrier's processing inbox. This is the **default fallback** when no EDI/API connection exists.

**How it works step by step:**
1. An employee completes a mid-year benefit event (new hire enrollment, QLE, etc.)
2. Rippling generates a PDF enrollment form based on the employee's input
3. Rippling sends the form to the email address listed in the Integrations section of the BenAdmin app
4. A client or broker admin should be CC'd on these sends to verify the carrier processes the form

**Key characteristics:**
- Only works for **mid-year events** (new hires, QLEs, terminations, demographic changes)
- Does **NOT** automatically send Open Enrollment forms/census to carriers — that's the broker's or admin's responsibility
- Requires a valid carrier email address configured in the Integrations tab
- Requires "Rippling Managing Forms" to be enabled
- Requires Group ID to be present for form generation

**What the admin is responsible for:**
- Ensuring the recipient email is correct
- Verifying the carrier actually processes the forms (via carrier portal or invoice audits)
- Submitting the bulk OE file to the carrier (Rippling does NOT do this)

**Edge case — OE Correction Events:**
- If an admin reopens an employee's OE event after the OE window closes (up to 30 days after OE effective date), Rippling treats this as an "OE Correction" and WILL send the individual form to the carrier automatically.

**Form send timing:**
- Configurable per carrier with options: on completion of enrollment, on employee's first day, on effective date, or on a custom date
- This is a carrier-level configuration, not company-level

**Types of carrier email addresses Rippling supports:**
- Default Enrollment Email
- Large Group Enrollment Email (separate from small group)
- COBRA Email (separate from regular enrollments)
- Large Group COBRA Email

### Mode 4: Manual / No Automation — Fully Manual

**What it is:** The carrier does not accept any electronic enrollment from Rippling. The admin must download enrollment data from Rippling, create their own forms or census files, and submit them directly to the carrier (via the carrier's portal, email, fax, or mail).

**When this happens:**
- The carrier doesn't accept forms via email or fax (e.g., Principal, certain BCBS carriers — specifically BCBS TX, IL, MN, OK, NM / HCHS carriers)
- The carrier is not in Rippling's carrier database and must be added
- The carrier is a custom benefit provider that Rippling doesn't integrate with
- "Rippling Managing Forms" is turned off and no CC SKU is purchased
- The carrier entity type is a TPA/Trust that doesn't accept standard enrollment forms

**What the admin gets:**
- Rippling generates forms and uploads them to the **Upcoming Events tab** in the BenAdmin app
- Rippling emails admins to let them know forms are ready for submission
- Admins can opt to have forms attached directly to the notification email for easy forwarding

**What the admin must do:**
- Download forms from Rippling
- Send forms to the carrier manually (email, fax, portal, mail)
- Confirm carrier received and processed the forms
- Handle any discrepancies or rejections directly with the carrier

---

## 1.4 Carrier Connection Vendors (The Middleware Layer)

Rippling does not communicate directly with most carriers. Instead, it uses a network of third-party vendors (middleware) who specialize in carrier data exchange. No single vendor covers all carriers, so multiple vendors are used simultaneously.

### Noyo
- **Connection type:** API (primary), EDI for some carriers (BCBS MA, Blue 20/20, Regence)
- **Carriers supported:** Wide coverage for major national carriers
- **Key limitation:** Cannot handle COBRA through their API — COBRA goes via forms
- **Key limitation:** Cannot turn off dual communications during Noyo setup — form sending must remain on
- **Transaction handling:** Event-driven (sends when changes occur, not batch)
- **COBRA PEO:** Noyo manually enrolls PEO COBRA on the carrier portal

### OneKonnect (EBN)
- **Connection type:** EDI file feeds
- **File send cadence:** Majority on Tuesdays, but varies by customer
- **Carriers supported:** Broad carrier support for EDI
- **Key characteristic:** Files are large CSV-like batches sent on schedule

### Ideon (formerly Vericred)
- **Connection type:** EDI file feeds
- **API connection used:** Rippling uses an API to send data to Ideon, which then generates and sends EDI files to carriers
- **COBRA handling:** COBRA enrollments go over on the EDI file (unlike Noyo)
- **Dual comms:** Can be turned off by clients during Ideon setup

### Stedi / In-House (DIRECT)
- **Connection type:** EDI file generation platform
- **Key characteristic:** Stedi doesn't communicate directly with carriers — it generates the standardized EDI files that Rippling then sends
- **Used for:** Rippling's in-house EDI connections where Rippling manages the carrier relationship directly

### Vendor Distribution (from system data)
| Vendor | Active Connections |
|--------|-------------------|
| NOYO_API | ~68,974 |
| IDEON | ~1,299 |
| ONEKONNECT | ~856 |
| RIPPLING_STEDI (In-house) | ~617 |
| NOYO (EDI) | ~214 |

---

## 1.5 The Vendor Routing System

### Why vendor routing exists
When a customer initiates a carrier connection, the system must determine which vendor (Noyo, OneKonnect, Ideon, Stedi) should handle that specific carrier-line combination. This decision depends on:

- **Carrier:** Which insurance provider (e.g., Cigna, UHC, Anthem)
- **Line Type:** Which benefit type (Medical, Dental, Vision, Life, etc.)
- **Platform Type:** Some carriers operate on multiple platforms (e.g., Cigna has ACE and FACETS platforms)
- **Company size:** Large group vs. small group (50+ employees threshold)

### How routing works
1. **Selection Rule Model:** A central "rule book" that maps carrier + line + platform + company size → vendor. Example rules:
   - "MetLife Medical → OneKonnect (EBN)"
   - "Cigna Medical on FACETS platform → Stedi (In-house)"
   - "UHC Medical on USP → Ideon"

2. **Discovery Task:** When a connection is initiated, the system creates a Discovery Task that attempts to auto-resolve the vendor using the rule book. If the carrier requires a platform type that isn't known, the task goes to the **Ops team** for manual input.

3. **Setup Task:** Once vendor is resolved, a Setup Task is created to initiate the actual connection with the chosen vendor. Multiple Setup Tasks can run in parallel if different lines route to different vendors.

### When routing fails or requires manual intervention
- **Missing platform type:** Carrier has multiple platforms (e.g., UHC Prime vs USP) and ops must determine which one applies → task enters "Pending" state
- **No rule exists:** The carrier-line-platform combination doesn't have a routing rule → task enters "Failed" state (retryable)
- **Existing connection conflict:** An active connection already exists for that combination → no new task created

### Split routing scenarios (single carrier, multiple vendors)
A single carrier can have its lines of coverage split across different vendors:
- **Same vendor type, different platforms:** Cigna Medical on ACE via Stedi, Cigna Dental & Vision on FACETS via Stedi
- **Different vendor types:** UHC Medical on USP via Ideon (EDI), UHC Dental & Vision on Prime via Noyo (API)
- **Partial coverage:** Only MDV supported on EDI/API; ancillary lines (Life, Disability) go via forms

When lines split, each line gets its own timeline/status on the Carrier Transmission tab. This creates complexity for the admin who sees one carrier but multiple statuses.

---

## 1.6 The EDI/API Connection Lifecycle

### End-to-end timeline (8-14 weeks for EDI, ~2 weeks for API)

| Stage | Duration | What Happens | Admin Action Needed? |
|-------|----------|--------------|---------------------|
| **Order Initiated** | 1 business day | Customer initiates connection request in Rippling. Discovery task created. | Yes — initiate the request |
| **Requirements Gathering** | 1-2 weeks | Rippling's EDI partner requests account structure, file layout, SFTP credentials from carrier. Carrier may require broker authorization. | Sometimes — may need to provide authorization forms |
| **Validation** | 1-2 weeks | Rippling passes client data to vendor for preliminary data quality audits. Pre-mapping tasks completed. | No |
| **Configuration** | 1-2 weeks | Vendor completes file mapping and configuration. | No |
| **Carrier Testing** | 2-5 weeks | Vendor sends test file to carrier. Carrier reviews for discrepancies. Rippling notifies admin of any issues requiring attention. | Sometimes — may need to resolve data discrepancies |
| **Production** | Up to 1 week | Carrier grants production approval. Feed goes live. Regular transmissions scheduled. | No — but admin gets no notification |

### Status states the admin sees
- **Email/Fax | Active** — Form sending is on, no EDI/API
- **Email/Fax | Inactive** — Form sending is off at carrier level
- **EDI/API | In Progress** — Connection being set up, forms still being sent (dual comms)
- **EDI/API | In Progress | Red Alert** — Connection in progress but carrier doesn't accept forms (e.g., Principal, BCBS HCHS carriers)
- **EDI/API | Live** — Connection is active, transmissions flowing
- **EDI | Paused | Dual Comms Active** — EDI paused during renewal/OE, forms being sent (in-house EDI carriers)
- **EDI | Live | Dual Comms Active** — EDI live during renewal/OE, forms also being sent (OneKonnect carriers)

### What happens when a connection fails
- If the setup task fails, it enters a "failed state" — it's retryable
- If the admin's Group ID is missing, the connection request fails → Ops sends an outreach template to request it
- If the carrier requires authorization and the broker hasn't completed it, setup stalls
- If the connection is cancelled, status reverts to Email/Fax
- If the vendor is changed mid-setup (rare, triggered by Rippling, not the admin), the process restarts

---

## 1.7 Form Sending: How It Actually Works

### Prerequisites for form sending to function
1. "Rippling Managing Forms" must be **enabled** (either by admin, broker, or auto-enabled for BOR)
2. A valid **carrier email address** must be configured in the Integrations/Carrier Transmission tab
3. The carrier must **accept forms via email or fax** (some carriers don't — see edge cases)
4. A valid **Group ID** must be present for the carrier
5. Properly **mapped enrollment forms** must exist for the carrier in Rippling's system

### What triggers a form send
- **New hire enrollment** (timing configurable: on completion, on first day, on effective date)
- **Qualifying Life Event (QLE)**
- **Termination**
- **Demographic change**
- **COBRA enrollment** (sent to COBRA-specific email if configured)
- **OE Correction Event** (reopened OE for an individual employee)

### What does NOT trigger an automatic form send
- **Open Enrollment** — Rippling does NOT send OE forms/census to carriers automatically. The admin/broker must do this manually. This is explicitly called out in Rippling's help center and is a standard industry practice.
- **Bulk census changes** — Not automatically sent

### Form recipient management
- Default carrier enrollment emails are set at the carrier-object level (global)
- Admins can add **custom email recipients** at the company level via the Integrations tab (if form sending is enabled)
- Admins can remove the Rippling default email for their specific company-carrier connection
- Admins can add CC recipients
- There is no built-in "test contact" or "verify email" functionality

### How form sending interacts with EDI/API
- When EDI/API is being set up ("In Progress"), form sending continues as **dual communications** — both forms AND the eventual EDI feed are sent
- For Noyo connections: dual comms **cannot** be turned off during setup — form sending must remain on
- For Ideon connections: dual comms **can** be turned off by the client during setup
- Once EDI/API goes live, the admin can choose to turn off form sending (dual comms)
- Default behavior: dual comms is ON even when EDI is live

---

## 1.8 Manual / No Automation: What Happens When There Is No Integration

### Scenario: Carrier doesn't accept forms, no EDI/API available
- The admin must manage all enrollments **directly with the carrier**
- Rippling generates enrollment forms and uploads them to **Upcoming Events** in BenAdmin
- Rippling emails the admin when forms are ready
- Admin downloads and sends to carrier via whatever method the carrier accepts (portal, mail, fax)

### Scenario: "Rippling Managing Forms" is OFF, no CC SKU
- This is the most bare-bones state
- Rippling still generates forms and tasks for the admin/broker to complete
- But Rippling does NOT automatically send anything to anyone
- The admin sees forms in their task queue and must handle everything

### Scenario: Carrier newly added to Rippling (Carrier Add Request)
- If a carrier isn't in Rippling's database, an internal Jira request must be filed
- Required information: carrier entity type, name, state, lines of coverage, whether forms are supported, enrollment email, carrier logo
- SLA: 3-6 business days depending on whether form mapping is required
- During this time, the admin has **zero automation** for this carrier

### Attestation requirement
- The Carrier Adds & Edits playbook requires **written confirmation** from the admin/broker that they understand manual responsibility
- Quote: *"I have informed the customer that they must manually manage enrollments/changes with [carrier entity name], and they have acknowledged this"*
- However, this attestation is captured in a Jira ticket — it is **not enforced in the product UI**

---

## 1.9 Dual Communications (Dual Comms)

Dual comms is the state where **both form sending AND EDI/API** are active for the same carrier simultaneously. This is important during the transition period when EDI is being set up but not yet live.

### Why dual comms exists
- EDI/API takes 8-14 weeks to set up
- During this time, enrollment changes still need to reach the carrier
- Forms serve as the backup channel until EDI goes live

### Default behavior
- Dual comms is **ON by default** when EDI/API is initiated
- Even after EDI goes live, dual comms stays ON unless the admin explicitly turns it off

### Vendor-specific rules
| Vendor | Can admin turn off dual comms during setup? | Can admin turn off after live? |
|--------|---------------------------------------------|-------------------------------|
| Noyo | **No** — form sending must stay on during setup | Yes |
| Ideon | **Yes** — admin can turn off during setup | Yes |
| OneKonnect | Yes | Yes |
| In-house (Stedi) | Yes | Yes |

### Red alert scenarios (carriers that don't accept forms)
- Some carriers (Principal, BCBS TX/IL/MN/OK/NM — HCHS carriers) **do not accept forms via email**
- During EDI setup for these carriers, dual comms is technically "active" but the forms go to enrollment managers and custom email recipients — not to the carrier's processing inbox
- The admin must manage enrollments on the **carrier's portal** until EDI goes live
- A red alert icon is shown in the UI for this scenario
- The red alert auto-dissolves when EDI goes live

---

## 1.10 COBRA Transmission Nuances

COBRA enrollment transmission has its own set of rules that differ from regular enrollment transmission:

| Connection Type | How COBRA is Transmitted |
|----------------|------------------------|
| Noyo API | **Forms** — Noyo cannot handle COBRA through API |
| Noyo API (PEO) | Noyo **manually enrolls** on carrier portal |
| Ideon/Vericred EDI | COBRA goes **on the EDI file** alongside regular enrollments |
| Form sending enabled, no EDI | COBRA forms sent via email to COBRA-specific email address (if configured) |
| Form sending not enabled | Rippling generates a form and creates a **task** for the broker to submit manually |
| Carrier doesn't accept forms | Admin must enroll COBRA directly on carrier portal |

**Key nuance:** Rippling does not currently support separate COBRA vs. non-COBRA email addresses at the product level. If a user turns off form forwarding, COBRA emails also stop sending.

---

## 1.11 Open Enrollment Transmission

Open Enrollment (OE) is a critical period with specific transmission rules:

### What Rippling does during OE
- Generates enrollment forms for all employees who made elections
- **Does NOT automatically send OE files to carriers** (this is true for both form-sending and non-form-sending customers)
- The OE file/census is the **admin's or broker's responsibility** to submit to carriers

### Why Rippling doesn't send OE files
- Carriers require specific formats for OE census files
- There are plan changes during OE that require careful handling
- Rippling has "no team to manage this or ensure it is processed correctly"
- It's industry standard for the broker to handle OE submission

### What the admin must do for OE
1. Wait for OE to close
2. Download enrollment data/forms from Rippling
3. Format and send to each carrier according to the carrier's requirements
4. Confirm receipt and processing with each carrier
5. Handle any discrepancies

### Exception: API connection live before OE
- If an API connection (Noyo) is **already live before** OE starts, then OE elections WILL be sent automatically via API
- If the API connection goes live **after** OE completes, OE elections will NOT be submitted retroactively

### Exception: EDI paused during OE
- For in-house EDI carriers: EDI is **paused** during renewal/OE, and forms are used instead
- For OneKonnect carriers: EDI stays **live** during renewal/OE, AND forms are also sent (dual comms)

---

## 1.12 Renewals and Mid-Year Changes

### During renewal
- If a company switches carriers for a line of coverage (e.g., moves from Cigna to Anthem for Medical), the old carrier's connection shows until the new plan year kicks in, and the new carrier will show with "In Progress" status
- For in-house EDI: the feed is **paused** during renewal, forms are sent
- For OneKonnect EDI: the feed stays **live** during renewal, forms are also sent

### Mid-year carrier changes
- If a carrier is added mid-year, a new connection setup begins from scratch
- If a carrier is removed mid-year, the connection is deactivated

### Mid-year account structure changes
- **Not supported** by most vendors
- Changes like department restructuring require vendors to request new account structures from carriers and reconfigure files
- The account structure should be consistent for the plan year
- If changes are needed, the case must be escalated to Insurance Operations

---

## 1.13 Group ID: Why It Matters and Where It Breaks

### What Group ID is
The Group ID (also called Carrier ID or Group Number) is the carrier's unique identifier for the employer's benefits group. It's required for virtually every type of enrollment transmission.

### Where Group ID is used
- **EDI/API connections:** Required to initiate the connection. Without it, the connection request **fails** and ops sends an outreach template to request it.
- **Form sending:** Required for form generation. Forms cannot be properly generated without the Group ID.
- **Manual processing:** Required by the carrier to match enrollment data to the correct employer group.

### How Group ID gets populated
- During implementation/onboarding, the implementation specialist should enter the Group ID
- The admin or broker can enter it via the Benefits Overview section of the BenAdmin app
- It's stored at the CCLI (Company Carrier Line Item) level

### When Group ID is missing
- Connection requests fail silently or with an error
- Forms may not generate or may generate incorrectly
- The admin may not discover the Group ID is missing until weeks later when enrollments aren't being processed
- Ops has outreach templates for requesting Group IDs from admins/brokers
- Quote from outreach template: *"[Company] requested an EDI connection with [carrier], however it failed because we're missing the Group ID. Could you please enter this information in the Rippling Insurance App?"*

---

## 1.14 Carrier Adds & Edits: The Operational Pipeline

When a carrier doesn't exist in Rippling's database, a multi-step process is required:

### Carrier Add Request Process
1. Verify carrier isn't already in the database (via Super User console)
2. File a Jira under the BENMKINFRA project with specific fields:
   - Carrier Entity Type (Insurance Carrier, TPA, Trust, Other)
   - Carrier Entity Name
   - Customer Insurance State (where the company's insurance address is, NOT where the carrier is headquartered)
   - Lines of coverage
   - BOB-only or BOB and BOR availability
   - Enrollment forms support (Yes/No)
   - If Yes: provide PDF form, email addresses, confirm form mapping request filed
   - If No: provide written confirmation that customer understands manual responsibility
   - Carrier website and logo
3. Wait for Ops review (SLA: 3-6 business days)
4. If form mapping required: additional timeline from the form mapping team
5. Engineering adds carrier to database

### Carrier Edit Request Process
- Similar Jira process for changes to existing carrier objects
- Required: proof/documentation from carrier for any changes
- SLA: 3 business days

### Key constraints
- One Jira per carrier entity
- Incomplete Jiras are sent back — causes delays
- If no response in 10 business days, Ops closes the request
- Support team members need Lead approval before submitting EDI/API vetting requests

---

## 1.15 Key Carrier-Specific Edge Cases and Limitations

These are real limitations that affect what the admin experiences. Each one represents a case where the "expected" behavior doesn't apply.

### Carriers that don't accept forms via email
- **Principal** — Cannot accept enrollment forms via email
- **BCBS TX, IL, MN, OK, NM (HCHS carriers)** — Cannot accept enrollment forms via email
- When these carriers are on form sending, the email goes to enrollment managers and custom contacts but the carrier won't process it via email
- Admin must manage enrollments on the carrier's portal

### Anthem limitations
- Small group portal (WGS) only supports Medical, Dental, Vision — no ancillary
- **As of 2024, Anthem can't support ancillary lines for any group size** — restricted to MDV
- Does not support MEWA (Multiple Employer Welfare Arrangement) groups on API
- Sequoia Tech Trust: Basic and Voluntary Life is self-billed and excluded from files

### UHC (United Healthcare) limitations
- Cannot support Signature Value plans
- Prime and USP groups: only Medical, Dental, Vision on EDI — no life/disability
- EDI analyst won't push enrollment corrections through the file feed (unlike other carriers)
- UHC Prime does not support COBRA

### Cigna limitations
- Ideon can only submit Medical, Dental, Vision to Cigna — no ancillary lines
- Different platforms (ACE vs FACETS) route to different vendors, creating split timelines

### Guardian
- COBRA forms are sent even when API connection exists (Noyo limitation)
- Guardian Spring Health wellness benefit cannot be transmitted on any file feed — must be managed directly with Guardian

### Regence
- Small and medium groups do not submit COBRA on file feeds

### UNUM
- Cannot support API for Critical Illness plans due to coding mismatch (Unum codes multiple plan options for CI, but Rippling's system supports 1 plan with variable coverage)

### All Savers (UHC)
- If group is level funding on USP platform → Ideon can support
- If group is on old All Savers platform → no connection available

---

## 1.16 Multi-Entity Companies

Companies with multiple legal entities (EINs) add another layer of complexity:

- Each entity may have different carriers, different states, different plan years
- Connections are managed at the **group-carrier-state-line-policy level** (not company level)
- Multi-EIN groups that share one Group ID are **not supported** on EDI
- The PRD includes multi-entity views for the carrier listing and transmission pages
- Each entity's carrier connections are independent — one entity might have EDI active while another is still on forms

---

## 1.17 What the Admin Actually Sees in the UI Today

### Benefits Overview (landing page)
- Shows carriers and Group IDs (sometimes)
- Has tabs for "Current" / "Upcoming" benefits
- **Does NOT prominently surface integration/transmission status**
- Many admins never leave this page — they don't know to check the Integrations tab

### Integrations / Carrier Transmission Tab
- Lists carriers with columns for integration type and status
- Shows per-carrier detail pages with timeline view (being rebuilt per PRD)
- Where form sending settings and email management live
- Where CC SKU purchase can be initiated
- Where EDI/API connections can be requested

### The gap
The critical integration information (transmission mode, status, blockers, responsibilities) lives on the Carrier Transmission tab, but the admin's default landing is Benefits Overview. The two pages are disconnected. An admin can complete their entire benefits setup without ever visiting the Carrier Transmission tab, leaving all their carriers in a limbo state with no transmission automation configured.

---

# Section 2: Exhaustive Problem Inventory

## 2.1 Visibility Problems

### V1: Transmission mode is not prominently visible
**What happens:** The current UI shows small labels like "Forms – email" or "EDI in progress" in table cells, but these don't function as prominent signals. Admins glance at them without understanding the implications.
**Impact:** Admins don't realize that "Forms" means THEY are responsible for verifying carrier processing. They don't realize "Manual" means Rippling does NOTHING.
**Source:** Integrations Summary Tab Proposal, Qualitative Research

### V2: Integration status lives on a separate page from where admins work
**What happens:** The admin's default landing is Benefits Overview. All integration/transmission information lives on the Carrier Transmission tab — a page many admins never visit.
**Impact:** Admins set up benefits, see a green "everything looks good" state on Benefits Overview, and assume enrollments are flowing to carriers. They have no idea that their carriers may have no transmission configured.
**Source:** Research document, explicitly confirmed in qualitative interviews

### V3: No notification when EDI/API goes live
**What happens:** When a connection transitions from "In Progress" to "Production/Live," the only change is the status label on the Carrier Transmission tab. No email, no in-app notification, no banner.
**Impact:** BOB customers must repeatedly check the tab to know when their connection is active. Many never check and don't know it went live. This creates ongoing anxiety.
**Source:** EDI/API 101 Confluence doc, confirmed by Carrier Connection EDI/API 101 training docs

### V4: No timeline or "what to expect" for EDI setup
**What happens:** Status labels like "EDI in progress" or "EDI available" don't include timeline guidance. The admin doesn't know if "in progress" means 2 weeks or 12 weeks away.
**Impact:** Admins don't know whether to wait or escalate. They file support tickets asking for updates. They don't know what stage the setup is at (Requirements Gathering? Testing? Configuration?).
**Source:** PRD: Carrier Transmission Tab Rebuild (the "pizza tracker" is the solution being built)

### V5: No visibility into actual transmission events
**What happens:** When forms are sent or EDI files transmitted, the admin has no real-time feed or log showing what was sent, when, to whom, and whether it was received.
**Impact:** Admins can't verify that enrollments are actually reaching carriers. They rely on carrier portals and invoices for retrospective verification. Missed enrollments are discovered weeks later.
**Source:** Form Sending FAQ, PRD TS1 user story

### V6: Carrier-specific limitations are not surfaced to the admin
**What happens:** When a carrier has specific limitations (e.g., Anthem doesn't support ancillary lines on EDI, Cigna splits lines across platforms, UHC Prime doesn't support COBRA), the admin is not informed upfront.
**Impact:** Admin expects full carrier coverage on EDI but only MDV is being transmitted. Ancillary lines fall through the cracks with no forms being sent and no EDI covering them. This can lead to missed enrollments for Life, Disability, etc.
**Source:** EDI/API General Information Confluence doc

### V7: Split routing (one carrier, multiple vendors/statuses) creates confusion
**What happens:** When a single carrier's lines are routed to different vendors (e.g., Cigna Medical on Stedi, Cigna Dental/Vision on FACETS via Stedi), the admin sees multiple rows and statuses for what they think is "one carrier."
**Impact:** Admin thinks something is wrong. They don't understand why Cigna shows two separate statuses. They file support tickets.
**Source:** PRD CS4 user story, Vendor Routing Overview

### V8: "Red alert" scenarios (carrier doesn't accept forms) are poorly communicated
**What happens:** For carriers like Principal and BCBS HCHS, a red alert icon appears indicating forms won't be processed. But the icon is small and the implication — that the admin must manage enrollments on the carrier portal — is not clearly stated.
**Impact:** Admin doesn't notice the alert or doesn't understand what it means. Enrollments for these carriers are silently missed.
**Source:** PRD CS2 scenarios 4 and 8

---

## 2.2 Responsibility & Accountability Problems

### R1: Who is responsible for what is fundamentally unclear
**What happens:** The system mixes automatic (EDI/API), semi-automatic (form sending), and manual (no automation) carriers without making it explicit who must act. Brokers often assume Rippling handles everything.
**Impact:** This is the #1 cause of missed enrollments and escalations. The Integrations Summary Tab Proposal explicitly identifies this as the central problem.
**Source:** Research document (Problem #1), Integrations Summary Tab Proposal

### R2: No forced attestation for manual carriers
**What happens:** When a carrier is manual (no forms, no EDI), the Carrier Adds playbook requires written confirmation from the admin. But this is captured in a Jira ticket, not enforced in the product. An admin can complete their entire benefits setup without ever acknowledging manual responsibility for any carrier.
**Impact:** When enrollments are missed weeks later, the admin says "I thought Rippling was handling that." There's no record in the system of the admin accepting responsibility.
**Source:** Research document (Problem #6), Carrier Adds & Edits playbook

### R3: No single "responsibility matrix"
**What happens:** There's no single screen that shows the admin: "For Carrier X, Rippling sends EDI. For Carrier Y, YOU must send forms. For Carrier Z, YOU must manage on the portal." The information is scattered across multiple carrier detail pages.
**Impact:** Admins can't quickly audit their responsibilities. They can't hand off to a colleague or export a clear picture of who owns what.
**Source:** Research document (Problem #7), Integrations Summary Tab Proposal

### R4: Open Enrollment responsibility is not clearly communicated
**What happens:** Rippling does NOT automatically send OE files to carriers. This is standard industry practice, but many admins (especially first-time users) don't know this. The message is buried in help center articles.
**Impact:** Admins complete OE, assume Rippling sent everything, and then discover weeks later that no OE enrollments reached the carrier. This is a catastrophic failure that affects every employee's coverage.
**Source:** EDI/API 101, Form Sending FAQ, PRD context

### R5: No delegated sign-off or assignment
**What happens:** There's no way for one admin to formally delegate enrollment transmission responsibility to another admin or to the broker. When the primary admin is unavailable, no one else knows what needs to be done.
**Impact:** Knowledge is siloed. When the admin leaves or goes on vacation, transmission responsibilities are orphaned.
**Source:** Research document (Problem #11)

---

## 2.3 Data & Configuration Problems

### D1: Missing Group ID is discovered too late
**What happens:** Group ID is required for EDI connections, form generation, and carrier identification. But the system doesn't proactively check for missing Group IDs when the admin sets up benefits. It's only discovered later when a connection request fails or forms don't generate.
**Impact:** Weeks of delay. The admin set up everything, thought it was done, and then gets an outreach email weeks later saying the Group ID is missing.
**Source:** Research document (Problem #3), Outreach Templates Confluence doc

### D2: Carrier email addresses are hard to discover and edit
**What happens:** The email address where forms are sent is configured deep in the Integrations tab, within individual carrier detail pages. It's not visible or editable from Benefits Overview. Default emails are set at the carrier-object level and may be wrong for a specific client.
**Impact:** Forms get sent to the wrong address. Admin doesn't know where forms are going. When the carrier changes their processing email, nobody updates it in Rippling.
**Source:** Research document (Problem #4), Form Sending FAQ

### D3: No inline "test contact" or email verification
**What happens:** After an admin enters or updates a carrier email address, there's no way to send a test form or verify the email is valid and reaches the right inbox.
**Impact:** Forms are sent to invalid or incorrect email addresses. The admin only discovers this when the carrier reports they never received the enrollments.
**Source:** Research document (Problem #10)

### D4: Custom email changes are hard to audit
**What happens:** When someone changes a carrier's custom email address, there's no easy audit trail in the product. Ops must use internal retool (object_observability) to find who changed what and when.
**Impact:** When forms stop arriving at the carrier, it's extremely difficult to figure out what happened. Was the email changed? By whom? When?
**Source:** Form Sending FAQ (the retool-based audit process documented there)

### D5: "Rippling Managing Forms" is confusing and not self-serve
**What happens:** Historically, turning on form sending required an internal support request. The PRD is adding self-serve toggle, but it's currently not available for all customer types. The setting interacts with broker settings, CC SKU status, and carrier-level overrides in complex ways.
**Impact:** Admin wants forms sent but doesn't know how to enable it. Or forms are enabled but the admin doesn't realize it. Or the broker's setting overrides the admin's preference.
**Source:** PRD CS1 user story (9 different scenarios documented)

---

## 2.4 Workflow & Process Problems

### W1: No guided setup flow for carrier transmission
**What happens:** After setting up benefits, the admin is not walked through a "here's how your enrollment data will reach each carrier" flow. They land on Benefits Overview and may never visit the Integrations tab.
**Impact:** Carrier transmission configuration is treated as an afterthought rather than a critical part of benefits setup. Admins don't know this step exists.
**Source:** Research document (current flow reconstruction)

### W2: EDI/API initiation requires multiple steps and isn't discoverable
**What happens:** For BOB customers, initiating an EDI/API connection requires: knowing the CC SKU exists → purchasing it → navigating to the Carrier Transmission tab → finding the carrier → clicking enable → going through TOS. Each step is a potential drop-off.
**Impact:** Many BOB customers never enable EDI/API even when it's available for their carriers, because they don't know about it or the process is too complex.
**Source:** PRD CS3 and CS7 user stories

### W3: No bulk setup for carrier connections
**What happens:** Each carrier connection must be initiated individually. If a company has 6 carriers, they must go through the setup flow 6 times.
**Impact:** Tedious and time-consuming. Admins may set up 2-3 carriers and forget the rest. The PRD is adding bulk enable (CS3 Scenario 3) but it's not available today.
**Source:** PRD CS3 Scenario 3

### W4: The carrier transmission tab and benefits overview are disconnected
**What happens:** Setting up benefits (carriers, plans, employees) happens in one area. Configuring how enrollment data reaches carriers happens in a completely different area. There's no bridge between the two.
**Impact:** Admins finish benefits setup and feel "done." They don't realize there's a whole other step to ensure carriers receive enrollment data. This is the structural cause of most problems.
**Source:** Research document (Problem #12)

### W5: Support routing is complex and ambiguous
**What happens:** When something goes wrong, the admin files a support ticket. Internally, support must navigate complex routing rules (Insurance Support vs. Carrier Communications vs. BenOps vs. specific vendor teams — Noyo specialist, Ideon specialist, OneKonnect specialist, 1P inquiries). Each vendor has different escalation paths.
**Impact:** Tickets get misrouted. Resolution is slow. The admin gets bounced between teams. Different support agents give different answers.
**Source:** BenOps <> Benefits IM Hub, Research document (Problem #8)

---

## 2.5 Anxiety & Confidence Problems

### A1: "Is anything actually being sent to my carrier?"
**What happens:** After initial setup, the admin has no ongoing signal that enrollment data is actually flowing to carriers. No transmission log, no status updates, no confirmations.
**Impact:** Persistent anxiety, especially for new customers. They don't trust the system and resort to manually checking carrier portals, which defeats the purpose of automation.
**Source:** Qualitative research, EDI/API 101 ("groups will need to keep checking the carrier transmissions tab to confirm setup is live")

### A2: "What happens during the 8-14 weeks while EDI is being set up?"
**What happens:** The admin initiates EDI and sees "In Progress." For the next 2-3 months, they don't know what's happening. Are forms being sent in the meantime? Is anyone monitoring? What stage is the setup at?
**Impact:** The admin doesn't know if dual comms is protecting them. They may manually send forms "just to be safe," duplicating what Rippling is already sending. Or they assume forms are being sent when dual comms is off.
**Source:** PRD (the pizza tracker is designed to solve this), Research document (Problem #9)

### A3: "I don't know if I need to do something or if Rippling is handling it"
**What happens:** For each carrier, the admin doesn't have a clear signal: "You're covered — Rippling is handling this" vs. "Action required — you need to do X." The current UI shows status but not responsibility.
**Impact:** Admins either do nothing (assuming Rippling handles everything) or do too much (manually duplicating what Rippling already does). Both create problems.
**Source:** Research document (Problem #1), the central theme of all qualitative research

### A4: "I changed carriers during renewal — is the new carrier set up?"
**What happens:** When a company switches carriers at renewal, the old connection shows alongside the new carrier's "In Progress" status. The admin sees two rows for what used to be one carrier and doesn't understand the transition.
**Impact:** Confusion about whether the old carrier is still receiving data (it is, until the new plan year), whether the new carrier will be ready in time, and what happens during the transition period.
**Source:** PRD CS2 Scenario 14, EDI/API General Information

### A5: "What about my Life/Disability/Ancillary coverage — is that being transmitted too?"
**What happens:** Many EDI/API connections only support MDV (Medical, Dental, Vision). Ancillary lines (Life, Disability, AD&D, Critical Illness) may not be on the same feed or may not be supported at all. But the admin sees "EDI Active" for the carrier and assumes ALL lines are covered.
**Impact:** Ancillary enrollments are missed. Employees don't get Life or Disability coverage because those lines were never transmitted. This can create legal and compliance exposure.
**Source:** EDI/API General Information (Anthem, UHC, Cigna limitations)

---

## 2.6 Operational & Support Problems

### O1: Ops dependency creates bottlenecks
**What happens:** Many steps in the connection process require Ops intervention: platform type determination, vendor routing failures, carrier authorization, account structure validation. The Benefits Task System helps but doesn't eliminate manual steps.
**Impact:** Connection setup takes longer than necessary. Admins and brokers don't know something is waiting on Ops action. There's no visibility into internal blockers.
**Source:** Vendor Routing Overview (Pending state for platform types), PRD risks section

### O2: Task system is not fully adopted
**What happens:** The PRD acknowledges a risk that Ops may not fully adopt the new task system. Some connections are still managed through old workflows, retools, and manual processes.
**Impact:** Timeline view can't be powered if tasks aren't in the system. Status may be out of date. The "pizza tracker" shows stale information.
**Source:** PRD Section 9.0 Risks

### O3: Ops updating stages late or moving backwards
**What happens:** If Ops doesn't update task stages promptly, the admin's timeline view is incorrect. If Ops moves a stage backward (e.g., from Testing back to Configuration), the timeline goes backward, creating confusion.
**Impact:** Admin sees progress, then progress reverses. Trust in the system erodes. The admin doesn't know if something is wrong or if it's just a data update.
**Source:** PRD Section 9.0 Risks

### O4: Carrier Add/Edit SLAs create dead zones
**What happens:** When a carrier needs to be added to Rippling's database, the SLA is 3-6 business days. If information is incomplete, the request is bounced back, and 10 business days of inactivity closes the ticket.
**Impact:** During this period, the admin has ZERO automation for the carrier. Enrollments pile up with no mechanism to send them. This can last weeks.
**Source:** Carrier Adds & Edits Confluence doc

---

## 2.7 Edge Case & Timing Problems

### E1: API connection going live after OE
**What happens:** If a Noyo API connection goes live after Open Enrollment has completed, the OE elections are NOT retroactively submitted via API.
**Impact:** The admin thinks EDI/API is now handling everything, but their entire OE census was never transmitted. They discover this when employees have no coverage on the carrier's side.
**Source:** EDI/API General Information

### E2: COBRA and regular enrollment on different transmission methods
**What happens:** For Noyo API connections, regular enrollments go via API but COBRA goes via forms. For some carriers, COBRA needs a different email address. Turning off form forwarding also turns off COBRA forms.
**Impact:** Admin turns off dual comms thinking EDI handles everything, but COBRA forms stop sending. COBRA employees lose coverage visibility.
**Source:** EDI/API General Information (COBRA section)

### E3: Vendor migration mid-connection
**What happens:** Rippling occasionally migrates connections from one vendor to another (e.g., Ideon to Noyo for BCBS MA). This is a Rippling-initiated change, not admin-initiated. The setup process starts over.
**Impact:** Admin sees their "EDI Active" status change back to "In Progress." They don't understand why. Communications templates exist but don't always reach the admin in time.
**Source:** BCBS MA Migration Comms Templates, PRD Open Questions #1-2

### E4: Form sending enabled but carrier doesn't accept forms
**What happens:** For carriers like Principal and BCBS HCHS, form sending is technically "active" but the carrier will not process forms received via email. A red alert should appear but may be missed.
**Impact:** The system shows "Email | Active" but enrollments are NOT being processed by the carrier. This is a silent failure that looks like everything is working.
**Source:** PRD CS2 Scenario 4, EDI/API General Information

### E5: Multi-EIN with shared Group ID
**What happens:** Companies with multiple EINs sometimes share one Group ID with a carrier. EDI does not support this configuration.
**Impact:** Connection setup fails or data is sent incorrectly. The admin must manage these entities manually until the carrier provides separate Group IDs.
**Source:** EDI/API General Information (explicitly called out as not supported)

### E6: Enrollment form not available for carrier
**What happens:** When a carrier is added to Rippling, enrollment forms need to be mapped (a separate 3-6 day process). If form mapping isn't complete, forms can't be generated even if form sending is enabled.
**Impact:** The admin enables form sending, sees it as "active," but no forms are actually generated or sent because the form template doesn't exist yet.
**Source:** Carrier Adds & Edits (form mapping process)

### E7: Broker settings overriding admin settings
**What happens:** If a broker is associated with the company, the "Rippling Managing Forms" value defaults from the broker's settings. If the broker has it set to "No," the admin may not be able to turn it on without contacting support.
**Impact:** Admin wants forms enabled, tries to turn it on, and either can't (because broker setting overrides) or doesn't understand why it was off in the first place.
**Source:** PRD CS1 user story (broker setting interplay)

---

## Summary: The Core Tension

The fundamental problem is a **mismatch between what the admin thinks is happening and what is actually happening.**

The admin thinks: *"I set up benefits in Rippling, so Rippling is sending enrollment data to my carriers."*

The reality: *"Rippling might be sending forms to some carriers, might have EDI active for others, might have EDI in progress for others, might have no automation at all for others, and the admin has specific responsibilities for each that they've never been told about."*

Every problem in this inventory stems from this core tension. The solution must bridge the gap between the admin's assumption (it's handled) and the operational reality (it depends) by making the status, mode, and responsibility for each carrier **unmistakably clear** at the point where the admin is already looking — Benefits Overview.

---

*Document last updated: March 11, 2026*
*Sources: PRD Carrier Transmission Tab Rebuild, Carrier Adds & Edits playbook, EDI/API 101, EDI/API General Information, Form Sending FAQ, Vendor Routing Overview, EDI Implementation Process Overview, Outreach Templates, Qualitative Research Document, Admin Journey Timeline*

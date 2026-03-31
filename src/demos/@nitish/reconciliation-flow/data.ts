export type DiscrepancyType =
  | 'COVERAGE_TIER_MISMATCH'
  | 'EFFECTIVE_DATE_MISMATCH'
  | 'PLAN_CODE_MISMATCH'
  | 'MISSING_ENROLLMENT'
  | 'DEMOGRAPHIC_MISMATCH'
  | 'MISSING_DEPENDENT'
  | 'TERMINATION_DATE_MISMATCH';

export type ImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DiscrepancyField {
  field: string;
  ripplingValue: string;
  carrierValue: string;
  severity: 'mismatch' | 'warning' | 'match';
  contextualNote?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  detail?: string;
  type: 'created' | 'updated' | 'recon_run' | 'resolved' | 'dismissed' | 'assigned';
}

export interface ReconRow {
  id: string;
  sfdc: string;
  employeeName: string;
  employeeSsn: string;
  memberName: string;
  memberSsn: string;
  relationship: 'Self' | 'Spouse' | 'Child' | 'Domestic Partner';
  company: string;
  carrier: string;
  assignee: string;
  sla: { label: string; status: 'green' | 'amber' | 'red' };
  status: 'Open' | 'In review' | 'In progress' | 'Resolved' | 'Dismissed';
  statusDetail: string;
  createdAt: string;
  rootCause: string;
  rootCauseDetail: string;
  followUp: string;
  discrepancyType: DiscrepancyType;
  impact: ImpactLevel;
  coverage: 'Medical' | 'Dental' | 'Vision' | 'LTD' | 'Life';
  plan: string;
  groupId: string;
  aiSummary: string;
  resolutionGuidance: string;
  discrepancyFields: DiscrepancyField[];
  timeline: TimelineEvent[];
}

const makeTimeline = (
  createdDate: string,
  carrier: string,
  discrepancyType: DiscrepancyType,
  resolved?: boolean,
): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      id: 't1',
      date: createdDate,
      time: '06:12 AM PST',
      event: 'Discrepancy detected',
      detail: `Recon engine identified ${discrepancyType.replace(/_/g, ' ').toLowerCase()} during scheduled census comparison with ${carrier}.`,
      type: 'created',
    },
    {
      id: 't2',
      date: createdDate,
      time: '06:13 AM PST',
      event: 'Task created',
      detail: 'Task automatically created in BenOps OS and assigned to queue.',
      type: 'created',
    },
    {
      id: 't3',
      date: 'Mar 21, 2026',
      time: '09:45 AM PST',
      event: 'Recon run — mismatch still present',
      detail: `Scheduled recon run confirmed the discrepancy persists on ${carrier}'s side. Task updated.`,
      type: 'recon_run',
    },
    {
      id: 't4',
      date: 'Mar 24, 2026',
      time: '11:20 AM PST',
      event: 'Assigned to Richard Satherland',
      detail: 'Task assigned for investigation.',
      type: 'assigned',
    },
  ];

  if (resolved) {
    events.push({
      id: 't5',
      date: 'Mar 27, 2026',
      time: '02:30 PM PST',
      event: 'Recon run — discrepancy resolved',
      detail: 'Scheduled recon run confirmed fields now match. Task auto-closed.',
      type: 'resolved',
    });
  }

  return events;
};

export const reconData: ReconRow[] = [
  {
    id: 'rc-1',
    sfdc: '34135',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '3 days, 12 hrs left', status: 'green' },
    status: 'In review',
    statusDetail: 'Pending',
    createdAt: 'Mar 18, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '04/02/2026',
    discrepancyType: 'EFFECTIVE_DATE_MISMATCH',
    impact: 'High',
    coverage: 'LTD',
    plan: 'LTD Basic — Long Term Disability',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Angela William\'s LTD coverage was terminated in Rippling (possibly during an offboarding workflow), but the 834 termination transaction was never acknowledged by Guardian — leaving her active on their census. Confirm whether Dec 31, 2025 is the correct end date. If yes, resend a 834 Term transaction. If she should remain active, revert the end date in Rippling before the next recon run.',
    resolutionGuidance:
      'Verify the intended coverage end date in Rippling. If the member should remain active, update the end date in Rippling to match Guardian (9999-12-31 or blank). If the member was terminated, contact Guardian to process the termination. Resend the snapshot after corrections.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'GDN-850012', carrierValue: 'GDN-850012', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: '***-**-8901', severity: 'match' },
      { field: 'Coverage Effective Date', ripplingValue: '2025-01-01', carrierValue: '2025-01-01', severity: 'match' },
      {
        field: 'Effective End Date',
        ripplingValue: '2025-12-31',
        carrierValue: '9999-12-31',
        severity: 'mismatch',
        contextualNote: 'The date 9999-12-31 is often used to indicate no end date or an unknown end date.',
      },
      { field: 'Plan Code', ripplingValue: 'LTD-BASIC-25', carrierValue: 'LTD-BASIC-25', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Angela', carrierValue: 'Angela', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
      { field: 'Date of Birth', ripplingValue: '1982-04-15', carrierValue: '1982-04-15', severity: 'match' },
      { field: 'Gender', ripplingValue: 'F', carrierValue: 'F', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 18, 2026', 'Guardian', 'EFFECTIVE_DATE_MISMATCH'),
  },
  {
    id: 'rc-2',
    sfdc: '34136',
    employeeName: 'William, John',
    employeeSsn: '***-**-4412',
    memberName: 'William, John',
    memberSsn: '***-**-4412',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '3 days, 10 hrs left', status: 'green' },
    status: 'In review',
    statusDetail: 'Pending',
    createdAt: 'Mar 18, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Plan Config',
    followUp: '04/02/2026',
    discrepancyType: 'PLAN_CODE_MISMATCH',
    impact: 'High',
    coverage: 'Medical',
    plan: 'HDHP Gold — Medical',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Guardian updated their plan codes during 2026 open enrollment renewal (MDHP-G-2025 → MDHP-G-2026), but the plan mapping in Rippling was not refreshed — so outbound 834s are still referencing the old code. This likely affects all members on this plan, not just John William. Update the plan code mapping in Benefits → Plans → Plan Mapping, then resend the snapshot for all affected members.',
    resolutionGuidance:
      'Update the plan code mapping in Rippling from "MDHP-G-2025" to "MDHP-G-2026" to match the renewed plan code. Navigate to Benefits → Plans → Plan Mapping and update the Guardian plan code for this group. After updating, resend the snapshot for this member.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'GDN-850013', carrierValue: 'GDN-850013', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-4412', carrierValue: '***-**-4412', severity: 'match' },
      {
        field: 'Plan Code',
        ripplingValue: 'MDHP-G-2025',
        carrierValue: 'MDHP-G-2026',
        severity: 'mismatch',
        contextualNote: 'Plan codes are typically updated annually during renewal. This mismatch likely indicates the carrier updated their plan codes for the new plan year.',
      },
      { field: 'Coverage Effective Date', ripplingValue: '2026-01-01', carrierValue: '2026-01-01', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
      { field: 'Group Number', ripplingValue: '00851697', carrierValue: '00851697', severity: 'match' },
      { field: 'First Name', ripplingValue: 'John', carrierValue: 'John', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
      { field: 'Date of Birth', ripplingValue: '1979-08-22', carrierValue: '1979-08-22', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 18, 2026', 'Guardian', 'PLAN_CODE_MISMATCH'),
  },
  {
    id: 'rc-3',
    sfdc: '34137',
    employeeName: 'William, Katie',
    employeeSsn: '***-**-5523',
    memberName: 'William, Katie',
    memberSsn: '***-**-5523',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Richard Satherland',
    sla: { label: '3 days, 08 hrs left', status: 'green' },
    status: 'In progress',
    statusDetail: 'Carrier outreach',
    createdAt: 'Mar 18, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '04/02/2026',
    discrepancyType: 'COVERAGE_TIER_MISMATCH',
    impact: 'High',
    coverage: 'Medical',
    plan: 'HMO Silver — Medical',
    groupId: '00654277',
    aiSummary:
      'Most likely cause: The spouse was added to Katie\'s coverage in Rippling, but the 834 transaction updating the coverage tier from "Employee Only" to "Employee + Spouse" was either not sent or silently rejected by Cigna. The spouse currently has no active coverage at the carrier and any claims would be denied. Check the last outbound 834 for this member. If the tier change was never transmitted, submit a correction — Cigna requires a member-level change transaction, not a full resend.',
    resolutionGuidance:
      'Contact Cigna to confirm whether the spouse was successfully enrolled. If not, submit a correction transaction with the correct coverage tier "Employee + Spouse". Verify that the spouse\'s demographic information in Rippling is complete before resending.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'CGN-412801', carrierValue: 'CGN-412801', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-5523', carrierValue: '***-**-5523', severity: 'match' },
      {
        field: 'Coverage Tier',
        ripplingValue: 'Employee + Spouse',
        carrierValue: 'Employee Only',
        severity: 'mismatch',
        contextualNote: 'Coverage tier controls who is covered under the plan. A mismatch here means the spouse may not have active coverage at the carrier.',
      },
      { field: 'Plan Code', ripplingValue: 'HMO-SIL-26', carrierValue: 'HMO-SIL-26', severity: 'match' },
      { field: 'Coverage Effective Date', ripplingValue: '2026-01-01', carrierValue: '2026-01-01', severity: 'match' },
      { field: 'Effective End Date', ripplingValue: '9999-12-31', carrierValue: '9999-12-31', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Katie', carrierValue: 'Katie', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
      { field: 'Group Number', ripplingValue: '00654277', carrierValue: '00654277', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 18, 2026', 'Cigna', 'COVERAGE_TIER_MISMATCH'),
  },
  {
    id: 'rc-4',
    sfdc: '34138',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Richard Satherland',
    sla: { label: '1 days, 04 hrs left', status: 'amber' },
    status: 'Open',
    statusDetail: 'Pending',
    createdAt: 'Mar 20, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '04/02/2026',
    discrepancyType: 'DEMOGRAPHIC_MISMATCH',
    impact: 'Medium',
    coverage: 'Dental',
    plan: 'Dental PPO — Dental',
    groupId: '00654277',
    aiSummary:
      'Most likely cause: Carrier-side data entry error at initial enrollment — the DOB has a digit transposition (April 51st is invalid) and gender is flipped. This is almost certainly not a Rippling issue; Rippling\'s records are internally consistent. Contact Cigna directly to submit a demographic correction. For the DOB, confirm the correct date is 1982-04-15 and request a manual fix since Cigna\'s record is invalid and cannot self-correct via a standard 834.',
    resolutionGuidance:
      'Verify Angela William\'s correct gender and date of birth in Rippling HR records. Submit a demographic correction to Cigna with the accurate information. This typically requires sending an updated 834 transaction with the corrected demographic segment (DMG).',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'CGN-412802', carrierValue: 'CGN-412802', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: '***-**-8901', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Angela', carrierValue: 'Angela', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
      {
        field: 'Gender',
        ripplingValue: 'F (Female)',
        carrierValue: 'M (Male)',
        severity: 'mismatch',
        contextualNote: 'Gender mismatches can cause claim processing issues for gender-specific procedures.',
      },
      {
        field: 'Date of Birth',
        ripplingValue: '1982-04-15',
        carrierValue: '1982-04-51',
        severity: 'mismatch',
        contextualNote: 'The carrier has an invalid date (April 51st). This appears to be a transposition error during initial enrollment.',
      },
      { field: 'Plan Code', ripplingValue: 'DNTL-PPO-26', carrierValue: 'DNTL-PPO-26', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 20, 2026', 'Cigna', 'DEMOGRAPHIC_MISMATCH'),
  },
  {
    id: 'rc-5',
    sfdc: '34139',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '1 days, 02 hrs left', status: 'amber' },
    status: 'In review',
    statusDetail: 'Pending',
    createdAt: 'Mar 20, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '04/02/2026',
    discrepancyType: 'MISSING_DEPENDENT',
    impact: 'High',
    coverage: 'Medical',
    plan: 'PPO Gold — Medical',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Mathew William was added as a dependent in Rippling during open enrollment, but the 834 transaction including the INS segment for this dependent was not acknowledged by Guardian — the child is entirely absent from their census. Check the 834 transmission log for a dependent add for Mathew William (DOB 2015-06-10). If no acknowledgment was received, resubmit immediately and follow up with Guardian in 3–5 business days to confirm the dependent record was created.',
    resolutionGuidance:
      'Verify Mathew William\'s enrollment status in Rippling. Check if a dependent add transaction was sent to Guardian for this dependent. If not, submit a new 834 transaction with the INS segment for the dependent. Follow up with Guardian in 3-5 business days to confirm the dependent was added.',
    discrepancyFields: [
      { field: 'Subscriber Member ID', ripplingValue: 'GDN-850012', carrierValue: 'GDN-850012', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: '***-**-8901', severity: 'match' },
      {
        field: 'Dependent — Mathew William',
        ripplingValue: 'Enrolled (Child)',
        carrierValue: 'Not found',
        severity: 'mismatch',
        contextualNote: 'Dependent is active in Rippling but has no corresponding record at Guardian. This typically occurs when the dependent add transaction was not processed.',
      },
      { field: 'Dependent DOB', ripplingValue: '2015-06-10', carrierValue: 'N/A', severity: 'warning' },
      { field: 'Dependent Relationship', ripplingValue: 'Child', carrierValue: 'N/A', severity: 'warning' },
      { field: 'Coverage Tier', ripplingValue: 'Employee + Children', carrierValue: 'Employee Only', severity: 'mismatch' },
      { field: 'Plan Code', ripplingValue: 'PPO-GLD-26', carrierValue: 'PPO-GLD-26', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 20, 2026', 'Guardian', 'MISSING_DEPENDENT'),
  },
  {
    id: 'rc-6',
    sfdc: '34140',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Richard Satherland',
    sla: { label: '1 days, 01 hrs left', status: 'amber' },
    status: 'In progress',
    statusDetail: 'Investigation',
    createdAt: 'Mar 20, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '04/02/2026',
    discrepancyType: 'MISSING_ENROLLMENT',
    impact: 'Critical',
    coverage: 'Vision',
    plan: 'Vision Basic — VSP',
    groupId: '00654277',
    aiSummary:
      'Most likely cause: Angela William\'s Vision Basic enrollment either failed silently during transmission or was never sent — the member has no record at Cigna whatsoever. This is the highest-severity discrepancy type; any vision claims filed today would be denied. Submit a new 834 Add transaction for this member immediately. Verify the VSP group ID and plan code mapping before sending, then monitor the 999/277 acknowledgment to confirm successful processing.',
    resolutionGuidance:
      'Submit a new enrollment transaction (834 Add) for Angela William on the Vision Basic plan immediately. Verify the VSP group ID and plan code are correctly mapped. After submitting, monitor the carrier\'s acknowledgment file to confirm successful processing. If claim denials have already occurred, work with the carrier to retroactively process the enrollment.',
    discrepancyFields: [
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: 'Not found', severity: 'mismatch' },
      {
        field: 'Enrollment Status',
        ripplingValue: 'Active',
        carrierValue: 'No record',
        severity: 'mismatch',
        contextualNote: 'Member is completely absent from the carrier census. This is the most critical discrepancy type — the member cannot file claims.',
      },
      { field: 'Plan Code', ripplingValue: 'VIS-BSC-26', carrierValue: 'N/A', severity: 'mismatch' },
      { field: 'Coverage Effective Date', ripplingValue: '2026-01-01', carrierValue: 'N/A', severity: 'mismatch' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'N/A', severity: 'mismatch' },
      { field: 'Group Number', ripplingValue: '00654277', carrierValue: 'N/A', severity: 'mismatch' },
    ],
    timeline: makeTimeline('Mar 20, 2026', 'Cigna', 'MISSING_ENROLLMENT'),
  },
  {
    id: 'rc-7',
    sfdc: '34141',
    employeeName: 'Thomas, Jackson',
    employeeSsn: '***-**-2211',
    memberName: 'Thomas, Jackson',
    memberSsn: '***-**-2211',
    relationship: 'Self',
    company: 'Clearwave Corporation',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '12 hours left', status: 'red' },
    status: 'Open',
    statusDetail: 'Pending',
    createdAt: 'Mar 22, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '12/12/2024',
    discrepancyType: 'EFFECTIVE_DATE_MISMATCH',
    impact: 'High',
    coverage: 'LTD',
    plan: 'LTD Basic — Long Term Disability',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Jackson Thomas\'s LTD coverage was terminated in Rippling on Dec 31, 2025, but Guardian never received or processed the 834 termination transaction — he still shows as active on their end. This could be a missed file or a Guardian processing failure. Confirm the termination is correct, then resend a 834 Term transaction to Guardian with end date 2025-12-31 and request a delivery receipt.',
    resolutionGuidance:
      'Verify whether the termination in Rippling was intentional. If Jackson Thomas was terminated, submit a 834 termination transaction to Guardian with the correct end date. If the termination was an error, correct the record in Rippling before the next recon run.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'GDN-912245', carrierValue: 'GDN-912245', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-2211', carrierValue: '***-**-2211', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Jackson', carrierValue: 'Jackson', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'Thomas', carrierValue: 'Thomas', severity: 'match' },
      {
        field: 'Effective End Date',
        ripplingValue: '2025-12-31',
        carrierValue: '9999-12-31',
        severity: 'mismatch',
        contextualNote: 'The date 9999-12-31 is often used to indicate no end date or an unknown end date.',
      },
      { field: 'Plan Code', ripplingValue: 'LTD-BASIC-25', carrierValue: 'LTD-BASIC-25', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
      { field: 'Coverage Effective Date', ripplingValue: '2024-01-01', carrierValue: '2024-01-01', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 22, 2026', 'Guardian', 'EFFECTIVE_DATE_MISMATCH'),
  },
  {
    id: 'rc-8',
    sfdc: '34142',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '12 hours left', status: 'red' },
    status: 'In review',
    statusDetail: 'Pending',
    createdAt: 'Mar 22, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '12/12/2024',
    discrepancyType: 'TERMINATION_DATE_MISMATCH',
    impact: 'Medium',
    coverage: 'Life',
    plan: 'Basic Life / AD&D — Life',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Angela William\'s Life/AD&D termination date was retroactively changed in Rippling (Nov 30 vs. Dec 31) — back-dated changes like this don\'t trigger automatic retransmission to the carrier. Review whether Nov 30 is the correct date. If yes, submit an updated 834 Term with the corrected date. Note: Guardian\'s retroactive correction window is typically 60–90 days; if this falls outside that window, a manual carrier outreach will be required.',
    resolutionGuidance:
      'Review the termination history for this member in Rippling. If the retroactive change was valid, submit an updated 834 termination transaction with the correct date. Contact Guardian if additional documentation is required for retroactive changes beyond their allowable lookback period.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'GDN-850012', carrierValue: 'GDN-850012', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: '***-**-8901', severity: 'match' },
      {
        field: 'Termination Date',
        ripplingValue: '2025-11-30',
        carrierValue: '2025-12-31',
        severity: 'mismatch',
        contextualNote: 'A one-month termination date discrepancy often indicates a retroactive change. Carriers may have lookback limits (typically 60-90 days).',
      },
      { field: 'Plan Code', ripplingValue: 'LIFE-BSC-25', carrierValue: 'LIFE-BSC-25', severity: 'match' },
      { field: 'Coverage Effective Date', ripplingValue: '2024-01-01', carrierValue: '2024-01-01', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 22, 2026', 'Guardian', 'TERMINATION_DATE_MISMATCH'),
  },
  {
    id: 'rc-9',
    sfdc: '34143',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '12 hours left', status: 'red' },
    status: 'In progress',
    statusDetail: 'Pending',
    createdAt: 'Mar 23, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '12/12/2024',
    discrepancyType: 'PLAN_CODE_MISMATCH',
    impact: 'High',
    coverage: 'Dental',
    plan: 'Dental HMO — Dental',
    groupId: '00851697',
    aiSummary:
      'Most likely cause: Guardian enhanced their dental plan for 2025 and updated the plan code (DHMO-25 → DHMO-ENH-25), but the Rippling plan mapping was never updated to match. This is a plan-wide issue — all members on this dental plan are likely sending the wrong plan code. Update the plan code in Benefits → Plans → Plan Mapping and trigger a resend for all affected members. Confirm with Guardian that DHMO-ENH-25 is the correct code for the current plan year before resubmitting.',
    resolutionGuidance:
      'Update the dental plan code mapping in Rippling. The plan code should be updated from "DHMO-25" to "DHMO-ENH-25". This can be done in Benefits → Plans → Plan Mapping. After updating, resend the enrollment data for all affected members on this dental plan.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'GDN-850012', carrierValue: 'GDN-850012', severity: 'match' },
      {
        field: 'Plan Code',
        ripplingValue: 'DHMO-25',
        carrierValue: 'DHMO-ENH-25',
        severity: 'mismatch',
        contextualNote: 'Plan codes are updated during renewal. Guardian enhanced this plan for 2025, updating the plan code suffix.',
      },
      { field: 'Coverage Effective Date', ripplingValue: '2025-01-01', carrierValue: '2025-01-01', severity: 'match' },
      { field: 'Coverage Tier', ripplingValue: 'Employee Only', carrierValue: 'Employee Only', severity: 'match' },
      { field: 'Group Number', ripplingValue: '00851697', carrierValue: '00851697', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Angela', carrierValue: 'Angela', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 23, 2026', 'Guardian', 'PLAN_CODE_MISMATCH'),
  },
  {
    id: 'rc-10',
    sfdc: '34144',
    employeeName: 'William, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'William, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Richard Satherland',
    sla: { label: '12 hours left', status: 'red' },
    status: 'Open',
    statusDetail: 'Pending',
    createdAt: 'Mar 23, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Process Gap',
    followUp: '12/12/2024',
    discrepancyType: 'COVERAGE_TIER_MISMATCH',
    impact: 'High',
    coverage: 'Medical',
    plan: 'PPO Silver — Medical',
    groupId: '00654277',
    aiSummary:
      'Most likely cause: A new dependent child was added to Angela\'s medical plan in Rippling, bumping the tier from "Employee + Spouse" to "Employee + Family", but the coverage tier update was not successfully transmitted to Cigna. Dependent children on this plan currently have no medical coverage at the carrier — any claims filed by children would be denied today. Verify all active dependents in Rippling, then submit a 834 change transaction with the updated tier. Cigna requires the full dependent roster in the change transaction.',
    resolutionGuidance:
      'Verify all dependents enrolled on this plan in Rippling. Confirm the intended coverage tier is "Employee + Family". Submit a coverage tier correction transaction to Cigna. Ensure all dependent demographic information is accurate before resubmitting.',
    discrepancyFields: [
      { field: 'Member ID', ripplingValue: 'CGN-412801', carrierValue: 'CGN-412801', severity: 'match' },
      { field: 'Subscriber SSN', ripplingValue: '***-**-8901', carrierValue: '***-**-8901', severity: 'match' },
      {
        field: 'Coverage Tier',
        ripplingValue: 'Employee + Family',
        carrierValue: 'Employee + Spouse',
        severity: 'mismatch',
        contextualNote: 'This mismatch means dependent children are covered in Rippling but not at the carrier. Any claims filed by children would be denied.',
      },
      { field: 'Plan Code', ripplingValue: 'PPO-SIL-26', carrierValue: 'PPO-SIL-26', severity: 'match' },
      { field: 'Coverage Effective Date', ripplingValue: '2026-01-01', carrierValue: '2026-01-01', severity: 'match' },
      { field: 'Group Number', ripplingValue: '00654277', carrierValue: '00654277', severity: 'match' },
      { field: 'First Name', ripplingValue: 'Angela', carrierValue: 'Angela', severity: 'match' },
      { field: 'Last Name', ripplingValue: 'William', carrierValue: 'William', severity: 'match' },
    ],
    timeline: makeTimeline('Mar 23, 2026', 'Cigna', 'COVERAGE_TIER_MISMATCH'),
  },
];

export const DISCREPANCY_TYPE_LABELS: Record<DiscrepancyType, string> = {
  COVERAGE_TIER_MISMATCH: 'Coverage Tier Mismatch',
  EFFECTIVE_DATE_MISMATCH: 'Effective Date Mismatch',
  PLAN_CODE_MISMATCH: 'Plan Code Mismatch',
  MISSING_ENROLLMENT: 'Missing Enrollment',
  DEMOGRAPHIC_MISMATCH: 'Demographic Mismatch',
  MISSING_DEPENDENT: 'Missing Dependent',
  TERMINATION_DATE_MISMATCH: 'Termination Date Mismatch',
};

export const IMPACT_COLORS: Record<ImpactLevel, 'critical' | 'warning' | 'match'> = {
  Critical: 'critical',
  High: 'critical',
  Medium: 'warning',
  Low: 'match',
};

/* ─── API Error Types ─────────────────────────────────────── */

export interface ApiErrorRow {
  id: string;
  sfdc: string;
  employeeName: string;
  employeeSsn: string;
  memberName: string;
  memberSsn: string;
  relationship: 'Self' | 'Spouse' | 'Child' | 'Domestic Partner';
  company: string;
  carrier: string;
  assignee: string;
  sla: { label: string; status: 'green' | 'amber' | 'red' };
  status: 'Open' | 'In review' | 'In progress' | 'Resolved' | 'Dismissed';
  statusDetail: string;
  createdAt: string;
  rootCause: string;
  rootCauseDetail: string;
  coverage: 'Medical' | 'Dental' | 'Vision' | 'LTD' | 'Life';
  plan: string;
  groupId: string;
  errorMessage: string;       // Short label shown in list column
  errorDetail: string;        // Full carrier error text shown in detail card
  ediPreview: string;         // The 834 EDI file content shown in right panel
  timeline: TimelineEvent[];
}

const makeApiTimeline = (createdDate: string, carrier: string): TimelineEvent[] => [
  {
    id: 't1',
    date: createdDate,
    time: '06:14 AM PST',
    event: '834 transaction sent to carrier',
    detail: `EDI 834 file transmitted to ${carrier} via SFTP.`,
    type: 'created',
  },
  {
    id: 't2',
    date: createdDate,
    time: '06:22 AM PST',
    event: 'Carrier rejection received',
    detail: `${carrier} returned a 999 acknowledgment with rejection code. Error logged and task auto-created.`,
    type: 'updated',
  },
  {
    id: 't3',
    date: 'Mar 21, 2026',
    time: '09:00 AM PST',
    event: 'Assigned to Richard Satherland',
    detail: 'Task routed to BenOps for investigation.',
    type: 'assigned',
  },
  {
    id: 't4',
    date: 'Mar 24, 2026',
    time: '11:45 AM PST',
    event: 'Resubmission attempted',
    detail: 'Corrected 834 file resubmitted after plan mapping fix.',
    type: 'updated',
  },
];

const EDI_834_SAMPLE = (memberName: string, planCode: string, carrier: string) => `ISA*00*          *00*          *ZZ*RIPPLING       *ZZ*${carrier.toUpperCase().padEnd(15)}*260318*0612*^*00501*000000001*0*P*:~
GS*BE*RIPPLING*${carrier.toUpperCase()}*20260318*0612*1*X*005010X220A1~
ST*834*0001*005010X220A1~
BGN*00*REF-${Math.floor(Math.random()*900000+100000)}*20260318*061200*0800*2~
REF*38*${Math.floor(Math.random()*9000000+1000000)}~
DTP*007*D8*20260101~
N1*P2*RIPPLING INC*FI*123456789~
N1*IN*${carrier.toUpperCase()} INSURANCE*XV*${Math.floor(Math.random()*9000000+1000000)}~
INS*Y*18*021*AI*A*FT*FT~
REF*0F*EMP${Math.floor(Math.random()*900000+100000)}~
REF*1L*${planCode}~
DTP*356*D8*20260101~
NM1*IL*1*${memberName.split(', ')[0].toUpperCase()}*${memberName.split(', ')[1]?.toUpperCase() ?? ''}****ZZ*MBR${Math.floor(Math.random()*900000+100000)}~
PER*IP**TE*5551234567~
N3*123 MAIN ST~
N4*SAN FRANCISCO*CA*94105~
DMG*D8*19820415*F~
HD*021**HLT*${planCode}*EMP~
DTP*348*D8*20260101~
COB*P*${planCode}*5~
SE*19*0001~
GE*1*1~
IEA*1*000000001~`;

export const apiErrorData: ApiErrorRow[] = [
  {
    id: 'ae-1',
    sfdc: '44201',
    employeeName: 'Thomas, Jackson',
    employeeSsn: '***-**-2211',
    memberName: 'Thomas, Jackson',
    memberSsn: '***-**-2211',
    relationship: 'Self',
    company: 'Clearwave Corporation',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '3 days, 8 hrs left', status: 'green' },
    status: 'Open',
    statusDetail: 'Pending',
    createdAt: 'Mar 18, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Plan Config',
    coverage: 'Medical',
    plan: 'PPO Gold — Medical',
    groupId: '00851697',
    errorMessage: '999 — Invalid plan code',
    errorDetail: 'Rejection Code: 999\nError Segment: REF*1L*MDHP-G-2025\nError Description: Invalid plan code "MDHP-G-2025". This plan code is not recognized under group 00851697 for plan year 2026. Expected value: MDHP-G-2026. Please resubmit with the correct plan code for the current plan year.',
    ediPreview: EDI_834_SAMPLE('Thomas, Jackson', 'MDHP-G-2025', 'Guardian'),
    timeline: makeApiTimeline('Mar 18, 2026', 'Guardian'),
  },
  {
    id: 'ae-2',
    sfdc: '44202',
    employeeName: 'Williams, Katie',
    employeeSsn: '***-**-5523',
    memberName: 'Williams, Katie',
    memberSsn: '***-**-5523',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Richard Satherland',
    sla: { label: '3 days, 4 hrs left', status: 'green' },
    status: 'In review',
    statusDetail: 'Carrier outreach',
    createdAt: 'Mar 18, 2026',
    rootCause: 'Data entry error',
    rootCauseDetail: 'Process Gap',
    coverage: 'Dental',
    plan: 'Dental PPO — Dental',
    groupId: '00654277',
    errorMessage: '277 — Missing SSN',
    errorDetail: 'Rejection Code: 277\nError Segment: NM1*IL\nError Description: Member Social Security Number is missing or invalid in the NM1 segment. SSN is required for all subscriber records under group 00654277. The submitted transaction contained an empty SSN field. Please resubmit with a valid 9-digit SSN.',
    ediPreview: EDI_834_SAMPLE('Williams, Katie', 'DNTL-PPO-26', 'Cigna'),
    timeline: makeApiTimeline('Mar 18, 2026', 'Cigna'),
  },
  {
    id: 'ae-3',
    sfdc: '44203',
    employeeName: 'Williams, Angela',
    employeeSsn: '***-**-8901',
    memberName: 'Williams, Angela',
    memberSsn: '***-**-8901',
    relationship: 'Self',
    company: 'Acme',
    carrier: 'Cigna',
    assignee: 'Priya Mehta',
    sla: { label: '1 day, 6 hrs left', status: 'amber' },
    status: 'In progress',
    statusDetail: 'Investigation',
    createdAt: 'Mar 20, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Plan Config',
    coverage: 'Vision',
    plan: 'Vision Basic — VSP',
    groupId: '00654277',
    errorMessage: '999 — Unknown group ID',
    errorDetail: 'Rejection Code: 999\nError Segment: N1*IN\nError Description: Group ID "00654278" is not recognized in Cigna\'s system. The submitted transaction references an invalid payer group. The correct group ID for this account is 00654277. Please verify the group mapping in Rippling and resubmit.',
    ediPreview: EDI_834_SAMPLE('Williams, Angela', 'VIS-BSC-26', 'Cigna'),
    timeline: makeApiTimeline('Mar 20, 2026', 'Cigna'),
  },
  {
    id: 'ae-4',
    sfdc: '44204',
    employeeName: 'Parker, David',
    employeeSsn: '***-**-3302',
    memberName: 'Parker, David',
    memberSsn: '***-**-3302',
    relationship: 'Self',
    company: 'NovaTech Solutions',
    carrier: 'Aetna',
    assignee: 'David Kim',
    sla: { label: '12 hours left', status: 'red' },
    status: 'Open',
    statusDetail: 'Pending',
    createdAt: 'Mar 22, 2026',
    rootCause: 'EDI error',
    rootCauseDetail: 'Process Gap',
    coverage: 'Medical',
    plan: 'HMO Silver — Medical',
    groupId: '00412288',
    errorMessage: '835 — Duplicate transaction',
    errorDetail: 'Rejection Code: 835\nError Segment: BGN*00\nError Description: A duplicate transaction set control number was detected. The submitted 834 with control number 000000118 was already processed on Mar 20, 2026. Duplicate submissions are rejected. Please generate a new transaction with a unique control number before resubmitting.',
    ediPreview: EDI_834_SAMPLE('Parker, David', 'HMO-SIL-26', 'Aetna'),
    timeline: makeApiTimeline('Mar 22, 2026', 'Aetna'),
  },
  {
    id: 'ae-5',
    sfdc: '44205',
    employeeName: 'Chen, Michelle',
    employeeSsn: '***-**-7714',
    memberName: 'Chen, Michael (Dep.)',
    memberSsn: '***-**-7715',
    relationship: 'Child',
    company: 'NovaTech Solutions',
    carrier: 'Guardian',
    assignee: 'Richard Satherland',
    sla: { label: '12 hours left', status: 'red' },
    status: 'In review',
    statusDetail: 'Pending',
    createdAt: 'Mar 22, 2026',
    rootCause: 'Mapping error',
    rootCauseDetail: 'Retroactive change',
    coverage: 'LTD',
    plan: 'LTD Basic — Long Term Disability',
    groupId: '00851697',
    errorMessage: '999 — Invalid coverage tier',
    errorDetail: 'Rejection Code: 999\nError Segment: HD*021**HLT\nError Description: Coverage tier "Employee + Children" is not a valid option for plan LTD-BASIC-26 under group 00851697. LTD plans for this group only support "Employee Only" coverage. Dependents cannot be enrolled in LTD. Please correct the coverage tier and resubmit.',
    ediPreview: EDI_834_SAMPLE('Chen, Michelle', 'LTD-BASIC-26', 'Guardian'),
    timeline: makeApiTimeline('Mar 22, 2026', 'Guardian'),
  },
  {
    id: 'ae-6',
    sfdc: '44206',
    employeeName: 'Rodriguez, Maria',
    employeeSsn: '***-**-9920',
    memberName: 'Rodriguez, Maria',
    memberSsn: '***-**-9920',
    relationship: 'Self',
    company: 'Clearwave Corporation',
    carrier: 'Aetna',
    assignee: 'Priya Mehta',
    sla: { label: '12 hours left', status: 'red' },
    status: 'In progress',
    statusDetail: 'Escalated',
    createdAt: 'Mar 23, 2026',
    rootCause: 'Carrier processing',
    rootCauseDetail: 'Timing issue',
    coverage: 'Medical',
    plan: 'PPO Silver — Medical',
    groupId: '00412288',
    errorMessage: '277 — Effective date out of range',
    errorDetail: 'Rejection Code: 277\nError Segment: DTP*348\nError Description: Coverage effective date 2026-01-01 falls outside the allowable enrollment window for this group. Aetna\'s open enrollment period for group 00412288 ended on Dec 31, 2025. Late enrollment requires an approved Special Enrollment Period (SEP) form. Please attach SEP documentation and resubmit via the carrier portal.',
    ediPreview: EDI_834_SAMPLE('Rodriguez, Maria', 'PPO-SIL-26', 'Aetna'),
    timeline: makeApiTimeline('Mar 23, 2026', 'Aetna'),
  },
];

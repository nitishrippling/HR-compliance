export interface IssueRow {
  id: string;
  memberName: string;
  memberSsn: string;
  employeeName: string;
  employeeSsn: string;
  relation: 'SELF' | 'SP' | 'CH' | 'DP';
  roleId: string;
  issue: string;
  blockName: string;
  content: string;
}

export interface ErrorReportRow {
  id: string;
  sfdc: string;
  company: string;
  carrier: string;
  assignee: string;
  status: string;
  createdAt: string;
  issues: number;
  sla: { label: string; status: 'green' | 'amber' | 'red' };
  groupId: string;
  lineOfCoverage: 'Medical' | 'Dental';
  senderEmail: string;
  emailBody: string;
  toReview: IssueRow[];
  accepted: IssueRow[];
  dismissed: IssueRow[];
}

export interface AllErrorRow {
  id: string;
  sfdc: string;
  company: string;
  carrier: string;
  assignee: string;
  status: string;
  stage: string;
  createdAt: string;
  sla: { label: string; status: 'green' | 'amber' | 'red' };
  coverage: 'Medical' | 'Dental';
  stageCategory: string;
  followUp: string;
  groupId: string;
  employeeId: string;
  employeeName: string;
  employeeSsn: string;
  memberName: string;
  memberSsn: string;
  relation: 'SELF' | 'SP' | 'CH' | 'DP';
  senderEmail: string;
  emailBody: string;
  errorTitle: string;
  errorRaw: string;
}

const makeIssues = (prefix: string): IssueRow[] => [
  { id: `${prefix}-1`, memberName: 'Gray, Owen', memberSsn: '***-**-8901', employeeName: 'Gray, Owen', employeeSsn: '***-**-8901', relation: 'SELF', roleId: 'role_9x2k4', issue: 'Invalid plan code — carrier does not recognize product', blockName: 'Recon Compare', content: 'Plan: HMO-500X · GRP-44321' },
  { id: `${prefix}-2`, memberName: 'Lisa Gray', memberSsn: '***-**-3312', employeeName: 'Gray, Owen', employeeSsn: '***-**-3312', relation: 'SP', roleId: 'role_9x2k4', issue: 'Dependent coverage cannot be added — subscriber plan invalid', blockName: 'Recon Compare', content: 'Inherits plan code error from subscriber' },
  { id: `${prefix}-3`, memberName: 'Ethan Gray', memberSsn: '***-**-7741', employeeName: 'Gray, Owen', employeeSsn: '***-**-7741', relation: 'CH', roleId: 'role_9x2k4', issue: 'Child dependent rejected — subscriber enrollment incomplete', blockName: 'Carrier Validation', content: 'HD*030**HLT*HMO-500X*FAM' },
  { id: `${prefix}-4`, memberName: 'Marshall, Caleb', memberSsn: '***-**-9012', employeeName: 'Marshall, Caleb', employeeSsn: '***-**-9012', relation: 'SELF', roleId: 'role_2k5t7', issue: 'DTP segment date format invalid — expected CCYYMMDD', blockName: 'Recon Compare', content: 'DTP*356*D8*20261702' },
  { id: `${prefix}-5`, memberName: 'Boehm, Scott R', memberSsn: '***-**-4523', employeeName: 'Boehm, Scott R', employeeSsn: '***-**-4523', relation: 'SELF', roleId: 'role_7m3p9', issue: 'Coverage effective date mismatch', blockName: 'Recon Compare', content: 'Eff 12/15/2025' },
];

const defaultEmailBody =
`Hi Rippling Benefits Team,

We are writing to notify you of a discrepancy identified during our latest 834 EDI file processing for Group ID 00654277 (Acme Corp — Medical, HMO-500X).

Our system returned the following error on the most recent transmission (TR-2025-0210):

  • Invalid plan code: Carrier does not recognize the eligibility product code submitted (MHDP0004). Please verify the plan ID against the current carrier contract and resubmit.
  • Coverage effective date mismatch: Member Angela Williams (SSN ***-**-8901) shows an effective date of 05/01/2025 in your system; our records indicate 04/01/2025. Please review and correct.

Action required:
Please review the attached 834 file, correct the identified segments, and resubmit by 02/14/2025 to avoid a lapse in coverage for affected members.

If you have any questions or need clarification on the specific segments, please reply to this email or contact your dedicated EDI support specialist.

Best regards,
Tom Richardson
EDI Compliance & Operations
Cigna Group Benefits
tom@cigna.com | 1-800-555-0192`;

export const errorReportData: ErrorReportRow[] = [
  { id: 'er-1', sfdc: '24135', company: 'Acme', carrier: 'Cigna', assignee: 'Richard Satherland', status: 'In review', createdAt: '5th Feb at 12:10 pm', issues: 5, sla: { label: '3 days, 12 hrs left', status: 'green' }, groupId: 'ID1234234', lineOfCoverage: 'Medical', senderEmail: 'tom@cigna.com', emailBody: defaultEmailBody, toReview: makeIssues('er1'), accepted: [], dismissed: [] },
  { id: 'er-2', sfdc: '24136', company: 'Globex', carrier: 'Blue Cross', assignee: 'Priya Mehta', status: 'in review', createdAt: '6th Feb at 9:45 am', issues: 4, sla: { label: '3 days, 02 hrs left', status: 'green' }, groupId: 'ID5678912', lineOfCoverage: 'Medical', senderEmail: 'admin@bluecross.com', emailBody: defaultEmailBody, toReview: makeIssues('er2'), accepted: [], dismissed: [] },
  { id: 'er-3', sfdc: '24137', company: 'Initech', carrier: 'Aetna', assignee: 'David Kim', status: 'in progress', createdAt: '7th Feb at 3:22 pm', issues: 6, sla: { label: '2 days, 21 hrs left', status: 'green' }, groupId: 'ID9012345', lineOfCoverage: 'Medical', senderEmail: 'rep@aetna.com', emailBody: defaultEmailBody, toReview: makeIssues('er3'), accepted: [], dismissed: [] },
  { id: 'er-4', sfdc: '24138', company: 'Umbrella', carrier: 'UnitedHealth', assignee: 'Sarah Chen', status: 'Open', createdAt: '8th Feb at 11:05 am', issues: 2, sla: { label: '1 day, 18 hrs left', status: 'amber' }, groupId: 'ID3456789', lineOfCoverage: 'Medical', senderEmail: 'claims@uhc.com', emailBody: defaultEmailBody, toReview: makeIssues('er4'), accepted: [], dismissed: [] },
  { id: 'er-5', sfdc: '24139', company: 'Wayne Enterprises', carrier: 'Cigna', assignee: 'Marcus Johnson', status: 'in review', createdAt: '9th Feb at 2:40 pm', issues: 0, sla: { label: '1 day, 18 hrs left', status: 'amber' }, groupId: 'ID7890123', lineOfCoverage: 'Medical', senderEmail: 'support@cigna.com', emailBody: defaultEmailBody, toReview: makeIssues('er5'), accepted: [], dismissed: [] },
  { id: 'er-6', sfdc: '24140', company: 'Stark Industries', carrier: 'Cigna', assignee: 'Emily Rodriguez', status: 'in progress', createdAt: '10th Feb at 10:18 am', issues: 0, sla: { label: '1 day, 18 hrs left', status: 'red' }, groupId: 'ID2345678', lineOfCoverage: 'Dental', senderEmail: 'tom@cigna.com', emailBody: defaultEmailBody, toReview: makeIssues('er6'), accepted: [], dismissed: [] },
  { id: 'er-7', sfdc: '24141', company: 'Soylent', carrier: 'Blue Cross', assignee: 'Richard Satherland', status: 'Open', createdAt: '11th Feb at 4:07 pm', issues: 4, sla: { label: '1 day, 18 hrs left', status: 'red' }, groupId: 'ID6789012', lineOfCoverage: 'Dental', senderEmail: 'info@bluecross.com', emailBody: defaultEmailBody, toReview: makeIssues('er7'), accepted: [], dismissed: [] },
  { id: 'er-8', sfdc: '24142', company: 'Wonka', carrier: 'Aetna', assignee: 'Anika Patel', status: 'in review', createdAt: '12th Feb at 1:33 pm', issues: 8, sla: { label: 'Overdue', status: 'red' }, groupId: 'ID0123456', lineOfCoverage: 'Dental', senderEmail: 'hello@aetna.com', emailBody: defaultEmailBody, toReview: makeIssues('er8'), accepted: [], dismissed: [] },
  { id: 'er-9', sfdc: '24143', company: 'Hooli', carrier: 'UnitedHealth', assignee: "James O'Brien", status: 'in progress', createdAt: '13th Feb at 9:12 am', issues: 4, sla: { label: 'Overdue', status: 'red' }, groupId: 'ID4567890', lineOfCoverage: 'Dental', senderEmail: 'cs@uhc.com', emailBody: defaultEmailBody, toReview: makeIssues('er9'), accepted: [], dismissed: [] },
  { id: 'er-10', sfdc: '24144', company: 'Vandelay', carrier: 'Cigna', assignee: 'Lisa Nakamura', status: 'Open', createdAt: '14th Feb at 3:58 pm', issues: 6, sla: { label: 'Overdue', status: 'red' }, groupId: 'ID8901234', lineOfCoverage: 'Medical', senderEmail: 'support@cigna.com', emailBody: defaultEmailBody, toReview: makeIssues('er10'), accepted: [], dismissed: [] },
];

export const allErrorsData: AllErrorRow[] = [
  { id: 'ae-1', sfdc: '023415', company: 'Acme', carrier: 'Aetna', assignee: 'Richard Satherland', status: 'Pending', stage: 'Triage', createdAt: '5th Feb at 12:10 pm', sla: { label: '3 days, 12 hrs left', status: 'green' }, coverage: 'Medical', stageCategory: 'Plan mapping', followUp: '12/12/2024', groupId: 'ID1234234', employeeId: 'ID1234234', employeeName: 'Williams, Angela', employeeSsn: '***-**-8901', memberName: 'Williams, Angela', memberSsn: '***-**-8901', relation: 'SELF', senderEmail: 'tom@cigna.com', emailBody: defaultEmailBody, errorTitle: 'Invalid plan code: Carrier doesn\'t not recognize the eligibility', errorRaw: "{'Group ID': '00654277', 'Subscriber SSN': '430028874', 'Subscriber ID': '110379410', 'Member SSN': '0', 'Group': '0001', 'Class ID': 'A001', 'Plan ID': 'MHDP0004', 'Plan Eff Dt': '2025-05-01 00:00:00', 'Plan Term Dt': None, 'Last name': 'Williams', 'First Name': 'Angela', 'Init': None, 'DOB': '1964-07-10 00:00:00', 'Gender': 'F', 'Relshp': 'SB', 'Status Cd': None, 'Data Source': 'Data on Cigna System', 'Action Needed': 'Supply term date or add to file.', 'Client Response': None}" },
  { id: 'ae-2', sfdc: '023415', company: 'Globex', carrier: 'Blue Cross', assignee: 'Priya Mehta', status: 'Pending', stage: 'Investigation', createdAt: '6th Feb at 9:45 am', sla: { label: '3 days, 02 hrs left', status: 'green' }, coverage: 'Medical', stageCategory: 'Coverage issue', followUp: '12/12/2024', groupId: 'ID5678912', employeeId: 'ID5678912', employeeName: 'Jones, Samuel', employeeSsn: '***-**-3312', memberName: 'Jones, Maria', memberSsn: '***-**-4421', relation: 'SP', senderEmail: 'admin@bluecross.com', emailBody: defaultEmailBody, errorTitle: 'Coverage effective date mismatch between carrier and system', errorRaw: "{'Group ID': '00654277', 'Subscriber SSN': '430028874'}" },
  { id: 'ae-3', sfdc: '023415', company: 'Initech', carrier: 'Kaiser', assignee: 'David Kim', status: 'Pending', stage: 'Carrier outreach', createdAt: '7th Feb at 3:22 pm', sla: { label: '2 days, 21 hrs left', status: 'green' }, coverage: 'Medical', stageCategory: 'Eligibility issue', followUp: '12/12/2024', groupId: 'ID9012345', employeeId: 'ID9012345', employeeName: 'Doe, John', employeeSsn: '***-**-7741', memberName: 'Doe, John', memberSsn: '***-**-7741', relation: 'SELF', senderEmail: 'rep@kaiser.com', emailBody: defaultEmailBody, errorTitle: 'Sub group retro change not reflected', errorRaw: "{'Group ID': '00654277', 'Member SSN': '0'}" },
  { id: 'ae-4', sfdc: '023415', company: 'Umbrella', carrier: 'UnitedHealth', assignee: 'Sarah Chen', status: 'Pending', stage: 'Investigation', createdAt: '8th Feb at 11:05 am', sla: { label: '1 day, 18 hrs left', status: 'amber' }, coverage: 'Medical', stageCategory: 'Plan mapping', followUp: '12/12/2024', groupId: 'ID3456789', employeeId: 'ID3456789', employeeName: 'Smith, Katie', employeeSsn: '***-**-9012', memberName: 'Smith, Tommy', memberSsn: '***-**-2234', relation: 'CH', senderEmail: 'claims@uhc.com', emailBody: defaultEmailBody, errorTitle: 'Invalid plan code: Carrier doesn\'t not recognize the eligibility', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-5', sfdc: '023415', company: 'Wayne Enterprises', carrier: 'Humana', assignee: 'Marcus Johnson', status: 'Pending', stage: 'Investigation', createdAt: '9th Feb at 2:40 pm', sla: { label: '1 day, 18 hrs left', status: 'amber' }, coverage: 'Medical', stageCategory: 'Plan mapping', followUp: '12/12/2024', groupId: 'ID7890123', employeeId: 'ID7890123', employeeName: 'Parker, Sam', employeeSsn: '***-**-4523', memberName: 'Parker, Sam', memberSsn: '***-**-4523', relation: 'SELF', senderEmail: 'support@humana.com', emailBody: defaultEmailBody, errorTitle: 'Plan mapping error for group', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-6', sfdc: '023415', company: 'Stark Industries', carrier: 'Cigna', assignee: 'Emily Rodriguez', status: 'Pending', stage: 'Carrier outreach', createdAt: '10th Feb at 10:18 am', sla: { label: '1 day, 18 hrs left', status: 'red' }, coverage: 'Dental', stageCategory: 'Eligibility issue', followUp: '12/12/2024', groupId: 'ID2345678', employeeId: 'ID2345678', employeeName: 'Brown, Michael', employeeSsn: '***-**-5567', memberName: 'Brown, Alex', memberSsn: '***-**-6678', relation: 'DP', senderEmail: 'tom@cigna.com', emailBody: defaultEmailBody, errorTitle: 'Eligibility issue for dental plan', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-7', sfdc: '023415', company: 'Soylent', carrier: 'Anthem', assignee: 'Richard Satherland', status: 'Pending', stage: 'Carrier outreach', createdAt: '11th Feb at 4:07 pm', sla: { label: '1 day, 18 hrs left', status: 'red' }, coverage: 'Dental', stageCategory: 'Eligibility issue', followUp: '12/12/2024', groupId: 'ID6789012', employeeId: 'ID6789012', employeeName: 'Lee, Jennifer', employeeSsn: '***-**-7789', memberName: 'Lee, Jennifer', memberSsn: '***-**-7789', relation: 'SELF', senderEmail: 'info@anthem.com', emailBody: defaultEmailBody, errorTitle: 'Eligibility issue for dental plan', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-8', sfdc: '023415', company: 'Wonka', carrier: 'Oscar', assignee: 'Anika Patel', status: 'Pending', stage: 'Triage', createdAt: '12th Feb at 1:33 pm', sla: { label: 'Overdue', status: 'red' }, coverage: 'Dental', stageCategory: 'Eligibility issue', followUp: '12/12/2024', groupId: 'ID0123456', employeeId: 'ID0123456', employeeName: 'Wilson, David', employeeSsn: '***-**-8890', memberName: 'Wilson, Susan', memberSsn: '***-**-9901', relation: 'SP', senderEmail: 'hello@oscar.com', emailBody: defaultEmailBody, errorTitle: 'Eligibility issue for dental plan', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-9', sfdc: '023415', company: 'Hooli', carrier: 'Bright Health', assignee: "James O'Brien", status: 'Pending', stage: 'Triage', createdAt: '13th Feb at 9:12 am', sla: { label: 'Overdue', status: 'red' }, coverage: 'Dental', stageCategory: 'Coverage issue', followUp: '12/12/2024', groupId: 'ID4567890', employeeId: 'ID4567890', employeeName: 'Taylor, Robert', employeeSsn: '***-**-1012', memberName: 'Taylor, Emma', memberSsn: '***-**-2123', relation: 'CH', senderEmail: 'cs@brighthealth.com', emailBody: defaultEmailBody, errorTitle: 'Coverage issue for dental plan', errorRaw: "{'Group ID': '00654277'}" },
  { id: 'ae-10', sfdc: '023415', company: 'Vandelay', carrier: 'Clover', assignee: 'Lisa Nakamura', status: 'Pending', stage: 'Triage', createdAt: '14th Feb at 3:58 pm', sla: { label: 'Overdue', status: 'red' }, coverage: 'Medical', stageCategory: 'Coverage issue', followUp: '12/12/2024', groupId: 'ID8901234', employeeId: 'ID8901234', employeeName: 'Davis, Emily', employeeSsn: '***-**-3234', memberName: 'Davis, Emily', memberSsn: '***-**-3234', relation: 'SELF', senderEmail: 'support@clover.com', emailBody: defaultEmailBody, errorTitle: 'Coverage issue for medical plan', errorRaw: "{'Group ID': '00654277'}" },
];

export const SAMPLE_EDI_CONTENT = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *250210*1205*^*00501*000000001*0*P*:~
GS*BE*SENDER*RECEIVER*20250210*1205*1*X*005010X220A1~
ST*834*0001*005010X220A1~
BGN*00*12456789*20250210*120000****4~
REF*38*ABCD123456~
DTP*007*D8*20250101~
N1*P5*ACME CORPORATION*FI*123456789~
N1*IN*CIGNA HEALTH*FI*987654321~
INS*Y*18*021*28*A*E**FT~
REF*0F*123456789~
REF*1L*00654277~
REF*23*MHDP0004~
REF*ZZ*A001~
NM1*IL*1*WILLIAMS*ANGELA****34*430028874~
PER*IP**HP*5551234567*EM*angela.williams@email.com~
N3*123 MAIN ST*APT 4B~
N4*CHICAGO*IL*60601~
DMG*D8*19640710*F~
DTP*336*D8*20250501~
DTP*337*D8*20251231~
HD*021**HLT*MHDP0004*EMP~
DTP*348*D8*20250501~
REF*1L*00654277~
SE*38*0001~
GE*1*1~
IEA*1*000000001~`;

export const DISCREPANCY_ROWS = [
  { id: 'd1', field: 'Member ID', sourceValue: 'CGN-110379410', carrierValue: 'CGN-110379410', severity: 'match' as const },
  { id: 'd2', field: 'Subscriber SSN', sourceValue: '430-02-8874', carrierValue: '430-02-8874', severity: 'match' as const },
  { id: 'd3', field: 'Group Number', sourceValue: '00654277', carrierValue: '00654277', severity: 'match' as const },
  { id: 'd4', field: 'Coverage Eff. Date', sourceValue: '01/01/2025', carrierValue: '05/01/2025', severity: 'critical' as const },
  { id: 'd5', field: 'Plan Code', sourceValue: 'MHDP0004', carrierValue: 'MHDP0009', severity: 'critical' as const },
  { id: 'd6', field: 'Class ID', sourceValue: 'A001', carrierValue: 'A002', severity: 'critical' as const },
  { id: 'd7', field: 'Subscriber Last Name', sourceValue: 'Williams', carrierValue: 'Williams', severity: 'match' as const },
  { id: 'd8', field: 'Subscriber First Name', sourceValue: 'Angela', carrierValue: 'Angela', severity: 'match' as const },
  { id: 'd9', field: 'Date of Birth', sourceValue: '07/10/1964', carrierValue: '07/10/1964', severity: 'match' as const },
  { id: 'd10', field: 'Gender', sourceValue: 'F', carrierValue: 'M', severity: 'critical' as const },
  { id: 'd11', field: 'Relationship Code', sourceValue: 'SB (Subscriber)', carrierValue: '18 (Self)', severity: 'warning' as const },
  { id: 'd12', field: 'Dependent Last Name', sourceValue: 'Smith', carrierValue: 'Smyth', severity: 'warning' as const },
  { id: 'd13', field: 'Plan Term Date', sourceValue: 'None', carrierValue: '12/31/2025', severity: 'warning' as const },
  { id: 'd14', field: 'Benefit Type', sourceValue: 'HLT (Health)', carrierValue: 'HLT (Health)', severity: 'match' as const },
  { id: 'd15', field: 'Coverage Level', sourceValue: 'EMP (Employee Only)', carrierValue: 'EMP (Employee Only)', severity: 'match' as const },
];

export const CENSUS_JSON = {
  census_list: [
    {
      company: {
        subscriber_count: 304,
        name: 'Electric Hydrogen Co',
        plans: [
          { plan_id: '6775703657d889ad40e14929', plan_name: 'Sun Life Critical Illness 2025-26', line: 'CRITICAL_ILLNESS', plan_effective_date: '04/01/2025', plan_expiry_date: '03/31/2026', if_supports_cobra: false, carrier_id: '583fdf270971c5546929c8a8', group_id: '966133', benefit_description: '', ref_38: '', oe_deadline: '03/14/2025' },
          { plan_id: '6775704357d889ad40e149ef', plan_name: 'Sun Life Basic Life/AD&D 2025-26', line: 'LIFE', plan_effective_date: '04/01/2025', plan_expiry_date: '03/31/2026', if_supports_cobra: false, carrier_id: '583fdf270971c5546929c8a8', group_id: '966133', benefit_description: '', ref_38: '', oe_deadline: '03/14/2025' },
          { plan_id: '6775703b57d889ad40e14961', plan_name: 'Sun Life Voluntary Life 2025-26', line: 'VOLUNTARY_LIFE', plan_effective_date: '04/01/2025', plan_expiry_date: '03/31/2026', if_supports_cobra: false, carrier_id: '583fdf270971c5546929c8a8', group_id: '966133', benefit_description: '', ref_38: '', oe_deadline: '03/14/2025' },
        ],
      },
    },
  ],
};

export const TRANSMISSIONS = [
  { id: 'TR-2025-0210', date: 'Feb 10, 2025', time: '12:05 PM EST', segments: 26, members: 3, status: 'Processed' },
  { id: 'TR-2025-0203', date: 'Feb 3, 2025', time: '11:42 AM EST', segments: 24, members: 2, status: 'Processed' },
  { id: 'TR-2025-0127', date: 'Jan 27, 2025', time: '10:15 AM EST', segments: 18, members: 1, status: 'Processed' },
];

export const ATTACHMENTS = [
  { name: 'benefits_report_q1.pdf', size: '245 KB' },
  { name: 'eligibility_data_export.xlsx', size: '128 KB' },
];

export type PreviewState =
  | { type: 'edi'; transmissionId: string; transmissionDate: string }
  | { type: 'census'; transmissionId: string; transmissionDate: string }
  | { type: 'attachment'; filename: string }
  | { type: 'email' };

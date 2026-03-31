export interface TransmissionErrorItem {
  errorCode: string;
  roleId?: string;
  message: string;
}

export interface EdiError {
  id: string;
  client: string;
  carrier: string;
  groupId: string;
  groupCid: string;
  transmissionDate: string;
  error: string;
  errorDetail: string;
  errors: TransmissionErrorItem[];
  recurrence: number;
  rootCause: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  statusDetail: string;
  sfCaseLink: string;
  jiraCaseId: string;
  latestComment: string;
  dateAssigned: string;
  employeeCount: number;
  cadence: string;
  transmissionGuid: string;
  skipTransmission: boolean;
  flowId: string;
  environment: 'Production' | 'Test';
}

export interface ApiGroupError {
  id: string;
  client: string;
  carrier: string;
  groupId: string;
  groupCid: string;
  activeErrors: number;
  oldestError: string;
  oldestErrorDays: number;
  rootCause: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  statusDetail: string;
  jiraCaseId: string;
  latestComment: string;
  flowId: string;
  skipTransmission: boolean;
  environment: 'Production' | 'Test';
  censusEntityId: string;
  employees: ApiEmployeeError[];
}

export interface ApiEmployeeError {
  id: string;
  employeeName: string;
  roleId: string;
  employeeSsn: string;
  memberName: string;
  memberSsn: string;
  memberRelationship: 'Self' | 'Spouse' | 'Child' | 'Domestic Partner';
  eventType: string;
  failedAt: string;
  error: string;
  errorDetail: string;
  errors: TransmissionErrorItem[];
  recurrence: number;
  status: 'Open' | 'In Progress' | 'Resolved';
  statusDetail: string;
  rootCause: string;
  assignedTo: string;
  groupId: string;
  groupCid: string;
  carrier: string;
  client: string;
  flowId: string;
  censusEntityId: string;
  transmissionHistory: TransmissionAttempt[];
}

export interface TransmissionAttempt {
  id: string;
  date: string;
  time: string;
  status: 'Success' | 'Failed';
  error?: string;
  segments?: number;
  members?: number;
  eventType?: string;
  assignedTo?: string;
}

export type PreviewState =
  { type: 'census'; transmissionId: string; transmissionDate: string };

export const SAMPLE_CENSUS_JSON = {
  transmissionGUID: 'TRN-2026-0318',
  senderName: 'Rippling',
  receiverName: 'Cigna',
  employer: {
    employerPartyID: '663e6deb8fce7f74006ccfb4',
    federalEmployerIdentificationNumber: '82-3456789',
    employerName: 'FalconX Inc',
  },
  employees: [
    {
      employeePartyID: '668fff889a860f87523f65d2',
      employeeSocialSecurityNumber: '***-**-8874',
      employeeName: { firstName: 'Leah', lastName: 'Rikkers' },
      employmentInformation: {
        employmentStatusCode: 'AC',
        employmentStartDate: '2024-03-15',
        jobTitle: 'Software Engineer',
      },
      coverage: [
        {
          insuranceLineCode: 'HLT',
          planName: 'Cigna Medical HDHP 2026',
          coverageLevel: 'EMP',
          effectiveDate: '2026-04-01',
          terminationDate: '2026-12-31',
        },
      ],
    },
  ],
};

export const EDI_TRANSMISSIONS: TransmissionAttempt[] = [
  { id: 'TR-2026-0318', date: 'Mar 18, 2026', time: '10:27 AM EST', status: 'Failed', error: 'No mapping found for plan ID', assignedTo: 'Alli Akbar' },
  { id: 'TR-2026-0311', date: 'Mar 11, 2026', time: '10:15 AM EST', status: 'Failed', error: 'No mapping found for plan ID', assignedTo: 'Alli Akbar' },
  { id: 'TR-2026-0304', date: 'Mar 4, 2026', time: '10:30 AM EST', status: 'Success' },
  { id: 'TR-2026-0225', date: 'Feb 25, 2026', time: '10:18 AM EST', status: 'Success' },
];

export const ROOT_CAUSE_OPTIONS = [
  'Engineering Issue',
  'Missing Data',
  'Mapping Error',
  'Ops Error',
  'File Stuck',
  'Carrier Side',
  'Mapping Deleted',
  'Auth Token Expired',
  'API Connector Error',
];

export const STATUS_DETAIL_OPTIONS = [
  'Waiting on carrier',
  'Jira filed',
  'Client notified',
  'Awaiting engineering fix',
  'Mapping correction in progress',
  'Pending data from admin',
  'Scheduler disabled',
  'File resent manually',
  'Escalated to lead',
];

export const ANALYST_LIST = [
  'Alli Akbar',
  'Ashima Monga',
  'Karina Polo',
  'Saurabh Rawat',
  'Agni Prashun',
  'Rinku Yadav',
  'Patrice Ingram',
  'Reagan Miller',
];

export const ediErrorsData: EdiError[] = [
  {
    id: 'edi-1',
    client: 'FalconX Inc',
    carrier: 'Cigna',
    groupId: 'CIG-FLX-0042',
    groupCid: '663e6deb8fce7f74006ccfb4',
    transmissionDate: 'Mar 18, 2026',
    error: 'TRANSMISSION_ERROR: SFTP connection refused by carrier host',
    errorDetail: 'Connection to sftp.cigna.com:22 timed out after 30000ms.',
    errors: [
      { errorCode: 'SFTP_CONN_REFUSED', message: 'Connection to sftp.cigna.com:22 timed out after 30000ms. Carrier host is not responding to SSH handshake.' },
    ],
    recurrence: 2,
    rootCause: 'Carrier Side',
    assignedTo: 'Alli Akbar',
    status: 'Open',
    statusDetail: 'Waiting on carrier',
    sfCaseLink: 'https://rippling.lightning.force.com/lightning/r/Case/500Ud00000NNRvIIAX/view',
    jiraCaseId: 'BENINTEG-7936',
    latestComment: 'Carrier SFTP team notified, awaiting response',
    dateAssigned: 'Mar 18, 2026',
    employeeCount: 142,
    cadence: 'Weekly, Tuesdays',
    transmissionGuid: 'TRN-2026-0318',
    skipTransmission: false,
    flowId: 'flow_a1b2c3d4e5f6a7b8',
    environment: 'Production',
  },
  {
    id: 'edi-2',
    client: 'Bamboo Health',
    carrier: 'UHC',
    groupId: 'UHC-BMB-1188',
    groupCid: '6762ec1a2b3c4d5e6f7890ab',
    transmissionDate: 'Mar 17, 2026',
    error: 'No mapping found for plan UHCPPO2026',
    errorDetail: 'Plan mapping lookup failed for internal plan ID "UHCPPO2026".',
    errors: [
      { errorCode: 'MAPPING_NOT_FOUND', message: 'Plan mapping lookup failed for internal plan ID "UHCPPO2026". Plan was renewed but mapping not updated.' },
    ],
    recurrence: 1,
    rootCause: 'Mapping Error',
    assignedTo: 'Ashima Monga',
    status: 'In Progress',
    statusDetail: 'Mapping correction in progress',
    sfCaseLink: '',
    jiraCaseId: '',
    latestComment: 'Re-mapped plans, testing file generation',
    dateAssigned: 'Mar 17, 2026',
    employeeCount: 89,
    cadence: 'Weekly, Mondays',
    transmissionGuid: 'TRN-2026-0317',
    skipTransmission: false,
    flowId: 'flow_b2c3d4e5f6a7b8c9',
    environment: 'Production',
  },
  {
    id: 'edi-3',
    client: 'Strive Health',
    carrier: 'Cigna',
    groupId: 'CIG-STV-0773',
    groupCid: '67890ab1c2d3e4f5a6b7c8d9',
    transmissionDate: 'Mar 16, 2026',
    error: 'No members enrolled - empty census',
    errorDetail: 'Census generation returned 0 eligible members.',
    errors: [
      { errorCode: 'EMPTY_CENSUS', message: 'Census generation returned 0 eligible members for this group. All 34 employees have coverage end dates prior to the transmission date.' },
    ],
    recurrence: 3,
    rootCause: 'Missing Data',
    assignedTo: 'Karina Polo',
    status: 'Open',
    statusDetail: 'Client notified',
    sfCaseLink: 'https://rippling.lightning.force.com/lightning/r/Case/500Ud00000NAQCAIA5/view',
    jiraCaseId: 'BENINTEG-8067',
    latestComment: 'Recurring 3rd week. Client broker notified about plan expiry.',
    dateAssigned: 'Mar 16, 2026',
    employeeCount: 0,
    cadence: 'Weekly, Wednesdays',
    transmissionGuid: 'TRN-2026-0316',
    skipTransmission: false,
    flowId: 'flow_c3d4e5f6a7b8c9d0',
    environment: 'Production',
  },
  {
    id: 'edi-4',
    client: 'Electric Hydrogen Co',
    carrier: 'Sun Life',
    groupId: 'SL-EHC-2201',
    groupCid: '6775703657d889ad40e14929',
    transmissionDate: 'Mar 15, 2026',
    error: 'TRANSMISSION_ERROR: File generation timeout',
    errorDetail: 'File generation exceeded the 600s timeout limit.',
    errors: [
      { errorCode: 'FILE_GEN_TIMEOUT', message: 'File generation exceeded 600s timeout. Census contained 304 subscribers with complex multi-line coverage.' },
    ],
    recurrence: 1,
    rootCause: 'Engineering Issue',
    assignedTo: 'Saurabh Rawat',
    status: 'Open',
    statusDetail: 'Jira filed',
    sfCaseLink: '',
    jiraCaseId: 'BENINTEG-9548',
    latestComment: 'Jira filed for eng team to optimize file generation',
    dateAssigned: 'Mar 15, 2026',
    employeeCount: 304,
    cadence: 'Weekly, Fridays',
    transmissionGuid: 'TRN-2026-0315',
    skipTransmission: false,
    flowId: 'flow_d4e5f6a7b8c9d0e1',
    environment: 'Production',
  },
  {
    id: 'edi-5',
    client: 'Goddard Technologies',
    carrier: 'Cigna',
    groupId: 'CIG-GDT-0509',
    groupCid: '66f1e4e883f667afe6536045',
    transmissionDate: 'Mar 14, 2026',
    error: 'Employee does not belong to any group classification',
    errorDetail: 'Employee 67b4ffdfbbd1770c2790efe5 does not belong to any group classification.',
    errors: [
      { errorCode: 'CLASS_NOT_FOUND', roleId: '67b4ffdfbbd1770c2790efe5', message: 'Employee does not belong to any group classification for Dental and Medical Plan.' },
    ],
    recurrence: 1,
    rootCause: 'Ops Error',
    assignedTo: 'Agni Prashun',
    status: 'Resolved',
    statusDetail: 'File resent manually',
    sfCaseLink: 'https://rippling.lightning.force.com/lightning/r/Case/500Ud00000NAQCAIA5/view',
    jiraCaseId: '',
    latestComment: 'Classification updated, file resent successfully',
    dateAssigned: 'Mar 14, 2026',
    employeeCount: 67,
    cadence: 'Weekly, Thursdays',
    transmissionGuid: 'TRN-2026-0314',
    skipTransmission: false,
    flowId: 'flow_e5f6a7b8c9d0e1f2',
    environment: 'Test',
  },
];

const empErrors = (errorCode: string, roleId: string | undefined, message: string): TransmissionErrorItem[] =>
  [{ errorCode, roleId, message }];

export const apiGroupErrorsData: ApiGroupError[] = [
  {
    id: 'api-grp-1', client: 'Bamboo Health', carrier: 'Anthem (Noyo)', groupId: 'GRP-7723', groupCid: 'ANT-BMB-7723',
    activeErrors: 3, oldestError: '6 days ago', oldestErrorDays: 6,
    rootCause: 'Mapping Error', assignedTo: 'Alli Akbar', status: 'Open', statusDetail: 'Mapping correction in progress',
    jiraCaseId: 'BENINTEG-8634', latestComment: 'Anthem plan mapping under review with eng', flowId: 'flow_98a7b6c5d4e3f2a1', skipTransmission: false, environment: 'Production',
    censusEntityId: '68f8d2c3b11dbef95487d9c4',
    employees: [
      {
        id: 'api-emp-1', employeeName: 'Leah Rikkers', roleId: '675c6e8f2a1b3c4d5e6f7890', employeeSsn: '***-**-8874',
        memberName: 'Leah Rikkers', memberSsn: '***-**-8874', memberRelationship: 'Self',
        eventType: 'Termination', failedAt: 'Mar 14, 2026 3:22 PM',
        error: 'No mapping found for plan ID pln_3847',
        errorDetail: 'Plan mapping lookup failed for internal plan ID "pln_3847_anthem_medical". Anthem API returned HTTP 400.',
        errors: empErrors('MAPPING_NOT_FOUND', '675c6e8f2a1b3c4d5e6f7890', 'No mapping found for plan ID. Carrier API returned error.'),
        recurrence: 2, status: 'Open', statusDetail: 'Mapping correction in progress', rootCause: 'Mapping Error', assignedTo: 'Alli Akbar',
        groupId: 'GRP-7723', groupCid: 'ANT-BMB-7723', carrier: 'Anthem (Noyo)', client: 'Bamboo Health', flowId: 'flow_98a7b6c5d4e3f2a1',
        censusEntityId: '68f8d2c3b11dbef95487d9c4',
        transmissionHistory: [
          { id: 'api-t-1', date: 'Mar 14, 2026', time: '3:22 PM', status: 'Failed', error: 'No mapping found for plan ID pln_3847', eventType: 'Termination', assignedTo: 'Alli Akbar' },
          { id: 'api-t-2', date: 'Mar 14, 2026', time: '4:00 PM', status: 'Failed', error: 'No mapping found for plan ID pln_3847', eventType: 'Termination (Retry 1)', assignedTo: 'Alli Akbar' },
          { id: 'api-t-3', date: 'Feb 15, 2026', time: '10:30 AM', status: 'Success', eventType: 'New Enrollment' },
          { id: 'api-t-4', date: 'Mar 1, 2026', time: '2:15 PM', status: 'Success', eventType: 'Dependent Add' },
        ],
      },
      {
        id: 'api-emp-2', employeeName: 'Ross Rikkers', roleId: '6762ec1a2b3c4d5e6f789def', employeeSsn: '***-**-4521',
        memberName: 'Mia Rikkers', memberSsn: '***-**-6789', memberRelationship: 'Child',
        eventType: 'Dependent Add', failedAt: 'Mar 16, 2026 11:05 AM',
        error: 'Dependent SSN validation failed',
        errorDetail: 'Carrier API rejected dependent enrollment. HTTP 422.',
        errors: empErrors('SSN_VALIDATION', '6762ec1a2b3c4d5e6f789def', 'SSN validation failed for member. Carrier rejected enrollment.'),
        recurrence: 1, status: 'Open', statusDetail: 'Pending data from admin', rootCause: 'Missing Data', assignedTo: 'Alli Akbar',
        groupId: 'GRP-7723', groupCid: 'ANT-BMB-7723', carrier: 'Anthem (Noyo)', client: 'Bamboo Health', flowId: 'flow_12b3c4d5e6f7a8b9',
        censusEntityId: '68f8d302de7a854ac8018484',
        transmissionHistory: [
          { id: 'api-t-5', date: 'Mar 16, 2026', time: '11:05 AM', status: 'Failed', error: 'Dependent SSN validation failed', eventType: 'Dependent Add', assignedTo: 'Alli Akbar' },
          { id: 'api-t-6', date: 'Jan 10, 2026', time: '9:45 AM', status: 'Success', eventType: 'New Enrollment' },
        ],
      },
      {
        id: 'api-emp-3', employeeName: 'Charlotte Kim', roleId: '6789ab1c2d3e4f5a6b7c8d9e', employeeSsn: '***-**-7732',
        memberName: 'Charlotte Kim', memberSsn: '***-**-7732', memberRelationship: 'Self',
        eventType: 'New Enrollment', failedAt: 'Mar 18, 2026 9:30 AM',
        error: 'API routing error - carrier endpoint unavailable',
        errorDetail: 'HTTP 503 Service Unavailable. Retry-After: 3600s.',
        errors: empErrors('API_503', '6789ab1c2d3e4f5a6b7c8d9e', 'Carrier endpoint unavailable. Service returned error.'),
        recurrence: 1, status: 'Open', statusDetail: 'Waiting on carrier', rootCause: 'Carrier Side', assignedTo: 'Alli Akbar',
        groupId: 'GRP-7723', groupCid: 'ANT-BMB-7723', carrier: 'Anthem (Noyo)', client: 'Bamboo Health', flowId: 'flow_34d5e6f7a8b9c0d1',
        censusEntityId: '68f8d2f6db8739f0f66fa446',
        transmissionHistory: [
          { id: 'api-t-7', date: 'Mar 18, 2026', time: '9:30 AM', status: 'Failed', error: 'API routing error', eventType: 'New Enrollment', assignedTo: 'Alli Akbar' },
        ],
      },
    ],
  },
  {
    id: 'api-grp-2', client: 'Strive Health', carrier: 'Guardian', groupId: 'GRP-4401', groupCid: 'GDN-STV-4401',
    activeErrors: 1, oldestError: '2 days ago', oldestErrorDays: 2,
    rootCause: 'Engineering Issue', assignedTo: 'Ashima Monga', status: 'Open', statusDetail: 'Jira filed',
    jiraCaseId: 'BENINTEG-9650', latestComment: 'Jira filed, eng investigating ID mismatch', flowId: 'flow_56f7a8b9c0d1e2f3', skipTransmission: false, environment: 'Production',
    censusEntityId: '68f8d41ab3c2e7f1a9054d21',
    employees: [
      {
        id: 'api-emp-4', employeeName: 'Daniel Park', roleId: '6890bc2d3e4f5a6b7c8d9e0f', employeeSsn: '***-**-3345',
        memberName: 'Soo-Jin Park', memberSsn: '***-**-8812', memberRelationship: 'Spouse',
        eventType: 'QLE - Marriage', failedAt: 'Mar 18, 2026 2:15 PM',
        error: 'Employee identifier mismatch between Rippling and Guardian',
        errorDetail: 'Guardian API returned HTTP 409 Conflict.',
        errors: empErrors('ID_MISMATCH', '6890bc2d3e4f5a6b7c8d9e0f', 'Employee identifier mismatch between Rippling and carrier.'),
        recurrence: 1, status: 'Open', statusDetail: 'Jira filed', rootCause: 'Engineering Issue', assignedTo: 'Ashima Monga',
        groupId: 'GRP-4401', groupCid: 'GDN-STV-4401', carrier: 'Guardian', client: 'Strive Health', flowId: 'flow_56f7a8b9c0d1e2f3',
        censusEntityId: '68f8d41ab3c2e7f1a9054d21',
        transmissionHistory: [
          { id: 'api-t-8', date: 'Mar 18, 2026', time: '2:15 PM', status: 'Failed', error: 'Employee identifier mismatch', eventType: 'QLE - Marriage', assignedTo: 'Ashima Monga' },
          { id: 'api-t-9', date: 'Feb 20, 2026', time: '10:00 AM', status: 'Success', eventType: 'New Enrollment' },
        ],
      },
    ],
  },
  {
    id: 'api-grp-3', client: 'Circuit Holdings', carrier: 'MetLife', groupId: 'GRP-8812', groupCid: 'MET-CIR-8812',
    activeErrors: 5, oldestError: '10 days ago', oldestErrorDays: 10,
    rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo', status: 'Open', statusDetail: 'Awaiting engineering fix',
    jiraCaseId: 'BENINTEG-9097', latestComment: 'OAuth refresh token expired, awaiting eng re-auth', flowId: 'flow_78a9b0c1d2e3f4a5', skipTransmission: false, environment: 'Production',
    censusEntityId: '68f8d53ce4d1a8b2c7096e35',
    employees: [
      {
        id: 'api-emp-5', employeeName: 'Sarah Johnson', roleId: '6901cd3e4f5a6b7c', employeeSsn: '***-**-1122',
        memberName: 'Sarah Johnson', memberSsn: '***-**-1122', memberRelationship: 'Self',
        eventType: 'New Enrollment', failedAt: 'Mar 10, 2026 8:45 AM', error: 'OAuth2 token expired',
        errorDetail: 'MetLife API returned HTTP 401 Unauthorized.',
        errors: empErrors('AUTH_EXPIRED', '6901cd3e4f5a6b7c', 'Authentication token expired. Carrier API returned unauthorized.'),
        recurrence: 3, status: 'Open', statusDetail: 'Awaiting engineering fix', rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo',
        groupId: 'GRP-8812', groupCid: 'MET-CIR-8812', carrier: 'MetLife', client: 'Circuit Holdings', flowId: 'flow_78a9b0c1d2e3f4a5',
        censusEntityId: '68f8d53ce4d1a8b2c7096e35',
        transmissionHistory: [
          { id: 'api-t-10', date: 'Mar 10, 2026', time: '8:45 AM', status: 'Failed', error: 'OAuth2 token expired', eventType: 'New Enrollment', assignedTo: 'Karina Polo' },
        ],
      },
      {
        id: 'api-emp-6', employeeName: 'Michael Torres', roleId: '6912de4f5a6b7c8d', employeeSsn: '***-**-3344',
        memberName: 'Michael Torres', memberSsn: '***-**-3344', memberRelationship: 'Self',
        eventType: 'Termination', failedAt: 'Mar 12, 2026 1:30 PM', error: 'OAuth2 token expired', errorDetail: 'MetLife API HTTP 401.',
        errors: empErrors('AUTH_EXPIRED', '6912de4f5a6b7c8d', 'Authentication token expired. Carrier API returned unauthorized.'),
        recurrence: 2, status: 'Open', statusDetail: 'Awaiting engineering fix', rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo',
        groupId: 'GRP-8812', groupCid: 'MET-CIR-8812', carrier: 'MetLife', client: 'Circuit Holdings', flowId: 'flow_90b1c2d3e4f5a6b7',
        censusEntityId: '68f8d64af5e2b9c3d80a7f46',
        transmissionHistory: [
          { id: 'api-t-11', date: 'Mar 12, 2026', time: '1:30 PM', status: 'Failed', error: 'OAuth2 token expired', eventType: 'Termination', assignedTo: 'Karina Polo' },
        ],
      },
      {
        id: 'api-emp-7', employeeName: 'Amanda Chen', roleId: '6923ef5a6b7c8d9e', employeeSsn: '***-**-5566',
        memberName: 'Amanda Chen', memberSsn: '***-**-5566', memberRelationship: 'Self',
        eventType: 'OE Election', failedAt: 'Mar 14, 2026 11:00 AM', error: 'OAuth2 token expired', errorDetail: 'MetLife API HTTP 401.',
        errors: empErrors('AUTH_EXPIRED', '6923ef5a6b7c8d9e', 'Authentication token expired. Carrier API returned unauthorized.'),
        recurrence: 1, status: 'Open', statusDetail: 'Awaiting engineering fix', rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo',
        groupId: 'GRP-8812', groupCid: 'MET-CIR-8812', carrier: 'MetLife', client: 'Circuit Holdings', flowId: 'flow_12c3d4e5f6a7b8c9',
        censusEntityId: '68f8d75b06f3cad4e91b8057',
        transmissionHistory: [
          { id: 'api-t-12', date: 'Mar 14, 2026', time: '11:00 AM', status: 'Failed', error: 'OAuth2 token expired', eventType: 'OE Election', assignedTo: 'Karina Polo' },
        ],
      },
      {
        id: 'api-emp-8', employeeName: 'James Wilson', roleId: '6934fa6b7c8d9e0f', employeeSsn: '***-**-7788',
        memberName: 'Olivia Wilson', memberSsn: '***-**-9955', memberRelationship: 'Spouse',
        eventType: 'Dependent Remove', failedAt: 'Mar 16, 2026 4:00 PM', error: 'OAuth2 token expired', errorDetail: 'MetLife API HTTP 401.',
        errors: empErrors('AUTH_EXPIRED', '6934fa6b7c8d9e0f', 'Authentication token expired. Carrier API returned unauthorized.'),
        recurrence: 1, status: 'Open', statusDetail: 'Awaiting engineering fix', rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo',
        groupId: 'GRP-8812', groupCid: 'MET-CIR-8812', carrier: 'MetLife', client: 'Circuit Holdings', flowId: 'flow_34d5e6f7a8b9c0d1',
        censusEntityId: '68f8d86c17a4dbe5fa2c9168',
        transmissionHistory: [
          { id: 'api-t-13', date: 'Mar 16, 2026', time: '4:00 PM', status: 'Failed', error: 'OAuth2 token expired', eventType: 'Dependent Remove', assignedTo: 'Karina Polo' },
        ],
      },
      {
        id: 'api-emp-9', employeeName: 'Emily Davis', roleId: '6945ab7c8d9e0f1a', employeeSsn: '***-**-9900',
        memberName: 'Emily Davis', memberSsn: '***-**-9900', memberRelationship: 'Self',
        eventType: 'Address Change', failedAt: 'Mar 18, 2026 10:15 AM', error: 'OAuth2 token expired', errorDetail: 'MetLife API HTTP 401.',
        errors: empErrors('AUTH_EXPIRED', '6945ab7c8d9e0f1a', 'Authentication token expired. Carrier API returned unauthorized.'),
        recurrence: 1, status: 'Open', statusDetail: 'Awaiting engineering fix', rootCause: 'Auth Token Expired', assignedTo: 'Karina Polo',
        groupId: 'GRP-8812', groupCid: 'MET-CIR-8812', carrier: 'MetLife', client: 'Circuit Holdings', flowId: 'flow_56e7f8a9b0c1d2e3',
        censusEntityId: '68f8d97d28b5ecf60b3da279',
        transmissionHistory: [
          { id: 'api-t-14', date: 'Mar 18, 2026', time: '10:15 AM', status: 'Failed', error: 'OAuth2 token expired', eventType: 'Address Change', assignedTo: 'Karina Polo' },
        ],
      },
    ],
  },
  {
    id: 'api-grp-4', client: 'Hummingbird Inc', carrier: 'Unum', groupId: 'GRP-2239', groupCid: 'UNM-HMB-2239',
    activeErrors: 2, oldestError: '4 days ago', oldestErrorDays: 4,
    rootCause: 'Missing Data', assignedTo: 'Agni Prashun', status: 'Open', statusDetail: 'Pending data from admin',
    jiraCaseId: '', latestComment: 'Reached out to admin for missing address data', flowId: 'flow_78f9a0b1c2d3e4f5', skipTransmission: false, environment: 'Test',
    censusEntityId: '68f8da8e39c6fd071c4eb38a',
    employees: [
      {
        id: 'api-emp-10', employeeName: 'Kevin Lee', roleId: '6956bc8d9e0f1a2b', employeeSsn: '***-**-2211',
        memberName: 'Kevin Lee', memberSsn: '***-**-2211', memberRelationship: 'Self',
        eventType: 'New Enrollment', failedAt: 'Mar 16, 2026 9:00 AM', error: 'Required field missing: postal_code',
        errorDetail: 'Unum API HTTP 422: postal_code is required.',
        errors: empErrors('FIELD_MISSING', '6956bc8d9e0f1a2b', 'Required field missing in employee data. Carrier rejected enrollment.'),
        recurrence: 2, status: 'Open', statusDetail: 'Pending data from admin', rootCause: 'Missing Data', assignedTo: 'Agni Prashun',
        groupId: 'GRP-2239', groupCid: 'UNM-HMB-2239', carrier: 'Unum', client: 'Hummingbird Inc', flowId: 'flow_78f9a0b1c2d3e4f5',
        censusEntityId: '68f8da8e39c6fd071c4eb38a',
        transmissionHistory: [
          { id: 'api-t-15', date: 'Mar 16, 2026', time: '9:00 AM', status: 'Failed', error: 'Missing ZIP code', eventType: 'New Enrollment', assignedTo: 'Agni Prashun' },
          { id: 'api-t-16', date: 'Mar 16, 2026', time: '10:30 AM', status: 'Failed', error: 'Missing ZIP code', eventType: 'New Enrollment (Retry 1)', assignedTo: 'Agni Prashun' },
        ],
      },
      {
        id: 'api-emp-11', employeeName: 'Lisa Wang', roleId: '6967cd9e0f1a2b3c', employeeSsn: '***-**-4433',
        memberName: 'Noah Wang', memberSsn: '***-**-7766', memberRelationship: 'Child',
        eventType: 'QLE - New Child', failedAt: 'Mar 18, 2026 1:45 PM', error: 'Required field missing: dependent.date_of_birth',
        errorDetail: 'Unum API HTTP 422: dependent.date_of_birth required.',
        errors: empErrors('FIELD_MISSING', '6967cd9e0f1a2b3c', 'Required field missing in dependent data. Carrier rejected enrollment.'),
        recurrence: 1, status: 'Open', statusDetail: 'Pending data from admin', rootCause: 'Missing Data', assignedTo: 'Agni Prashun',
        groupId: 'GRP-2239', groupCid: 'UNM-HMB-2239', carrier: 'Unum', client: 'Hummingbird Inc', flowId: 'flow_90a1b2c3d4e5f6a7',
        censusEntityId: '68f8db9f4ad70e182d5fc49b',
        transmissionHistory: [
          { id: 'api-t-17', date: 'Mar 18, 2026', time: '1:45 PM', status: 'Failed', error: 'Missing dependent DOB', eventType: 'QLE - New Child', assignedTo: 'Agni Prashun' },
        ],
      },
    ],
  },
];

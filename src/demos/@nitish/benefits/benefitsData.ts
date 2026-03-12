export type TransmissionMode = 'edi' | 'api' | 'forms-email' | 'forms-fax' | 'manual' | 'not-configured';
export type SetupStatus = 'active' | 'in-progress' | 'paused' | 'not-started';
export type CarrierState = 'needs-setup' | 'rippling-managed' | 'self-managed';
export type EdiAvailability = 'available' | 'not-available';
export type BenefitType = 'Medical' | 'Dental' | 'Vision' | 'Life' | 'Disability';

export interface CarrierIntegration {
  id: string;
  carrierName: string;
  carrierState: string;
  carrierLogoColor: string;
  benefitType: BenefitType;
  effectiveStart: string;
  effectiveEnd: string;

  configState: CarrierState;

  transmissionMode: TransmissionMode;
  setupStatus: SetupStatus;
  ediAvailability: EdiAvailability;
  acceptsForms: boolean;

  ediProgressStep?: number;
  ediProgressTotal?: number;
  ediProgressLabel?: string;

  groupId: string | null;
  sendingContactEmail: string | null;

  carrierDoesNotAcceptForms?: boolean;
  cobraNote?: string;
  dualCommsActive?: boolean;
  lastTransmissionDate?: string;

  attested: boolean;
  attestedBy?: string;
  attestedAt?: string;
}

export const CARRIERS: CarrierIntegration[] = [
  {
    id: 'guardian-ca-dental',
    carrierName: 'Guardian',
    carrierState: 'California',
    carrierLogoColor: '#1565C0',
    benefitType: 'Dental',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'available',
    acceptsForms: true,
    groupId: null,
    sendingContactEmail: 'newbusiness@guardianlife.com',
    attested: false,
  },
  {
    id: 'guardian-ca-vision',
    carrierName: 'Guardian',
    carrierState: 'California',
    carrierLogoColor: '#1565C0',
    benefitType: 'Vision',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'available',
    acceptsForms: true,
    groupId: null,
    sendingContactEmail: 'newbusiness@guardianlife.com',
    attested: false,
  },
  {
    id: 'anthem-il-medical',
    carrierName: 'Anthem',
    carrierState: 'Illinois',
    carrierLogoColor: '#0D47A1',
    benefitType: 'Medical',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'available',
    acceptsForms: true,
    groupId: '332211',
    sendingContactEmail: null,
    attested: false,
  },
  {
    id: 'nyl-il-disability',
    carrierName: 'New York Life',
    carrierState: 'Illinois',
    carrierLogoColor: '#004990',
    benefitType: 'Disability',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'not-available',
    acceptsForms: false,
    groupId: null,
    sendingContactEmail: null,
    attested: false,
  },
  {
    id: 'principal-il-life',
    carrierName: 'Principal',
    carrierState: 'Illinois',
    carrierLogoColor: '#6A1B9A',
    benefitType: 'Life',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'available',
    acceptsForms: false,
    carrierDoesNotAcceptForms: true,
    groupId: '88421',
    sendingContactEmail: null,
    attested: false,
  },
  {
    id: 'cigna-il-medical',
    carrierName: 'Cigna',
    carrierState: 'Illinois',
    carrierLogoColor: '#0072BC',
    benefitType: 'Medical',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'needs-setup',
    transmissionMode: 'not-configured',
    setupStatus: 'not-started',
    ediAvailability: 'available',
    acceptsForms: true,
    groupId: '125636',
    sendingContactEmail: 'newbusiness@cigna.com',
    attested: false,
  },
  {
    id: 'bcbs-il-medical',
    carrierName: 'Blue Cross',
    carrierState: 'Illinois',
    carrierLogoColor: '#003DA5',
    benefitType: 'Medical',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'rippling-managed',
    transmissionMode: 'edi',
    setupStatus: 'in-progress',
    ediAvailability: 'available',
    acceptsForms: true,
    ediProgressStep: 2,
    ediProgressTotal: 5,
    ediProgressLabel: 'Validation',
    groupId: '45146',
    sendingContactEmail: 'enrollments@bcbsil.com',
    dualCommsActive: true,
    lastTransmissionDate: 'Mar 5, 2026',
    attested: true,
    attestedBy: 'Sarah Chen',
    attestedAt: '2026-02-18T09:30:00Z',
  },
  {
    id: 'calchoice-ca-medical',
    carrierName: 'CalChoice',
    carrierState: 'California',
    carrierLogoColor: '#2E7D32',
    benefitType: 'Medical',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'rippling-managed',
    transmissionMode: 'forms-email',
    setupStatus: 'active',
    ediAvailability: 'not-available',
    acceptsForms: true,
    groupId: '263637',
    sendingContactEmail: 'group.enrollments@calchoice.com',
    lastTransmissionDate: 'Mar 8, 2026',
    attested: true,
    attestedBy: 'Sarah Chen',
    attestedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'kaiser-ca-medical',
    carrierName: 'Kaiser',
    carrierState: 'California',
    carrierLogoColor: '#D32F2F',
    benefitType: 'Medical',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'rippling-managed',
    transmissionMode: 'api',
    setupStatus: 'active',
    ediAvailability: 'available',
    acceptsForms: true,
    groupId: '449812',
    sendingContactEmail: null,
    cobraNote: 'COBRA enrollments sent via forms',
    lastTransmissionDate: 'Mar 10, 2026',
    attested: true,
    attestedBy: 'Sarah Chen',
    attestedAt: '2026-01-20T14:00:00Z',
  },
  {
    id: 'metlife-ny-life',
    carrierName: 'MetLife',
    carrierState: 'New York',
    carrierLogoColor: '#00695C',
    benefitType: 'Life',
    effectiveStart: 'March 01, 2026',
    effectiveEnd: 'February 28, 2027',
    configState: 'self-managed',
    transmissionMode: 'manual',
    setupStatus: 'active',
    ediAvailability: 'not-available',
    acceptsForms: false,
    groupId: '77234',
    sendingContactEmail: null,
    attested: true,
    attestedBy: 'Sarah Chen',
    attestedAt: '2026-02-10T11:00:00Z',
  },
];

export function getNeedsSetup(carriers: CarrierIntegration[]): CarrierIntegration[] {
  return carriers.filter(c => c.configState === 'needs-setup');
}

export function getRipplingManaged(carriers: CarrierIntegration[]): CarrierIntegration[] {
  return carriers.filter(c => c.configState === 'rippling-managed');
}

export function getSelfManaged(carriers: CarrierIntegration[]): CarrierIntegration[] {
  return carriers.filter(c => c.configState === 'self-managed');
}

export function getConfiguredCount(carriers: CarrierIntegration[]): number {
  return carriers.filter(c => c.configState !== 'needs-setup').length;
}

export function getCoverageLabel(c: CarrierIntegration): string {
  return `${c.benefitType} · ${c.carrierState.substring(0, 2).toUpperCase()}`;
}

export function getTransmissionBadgeLabel(mode: TransmissionMode): string {
  switch (mode) {
    case 'edi': return 'EDI';
    case 'api': return 'API';
    case 'forms-email': return 'Forms (Email)';
    case 'forms-fax': return 'Forms (Fax)';
    case 'manual': return 'Manual';
    case 'not-configured': return 'Not configured';
  }
}

export function getStatusLabel(status: SetupStatus): string {
  switch (status) {
    case 'active': return 'Active';
    case 'in-progress': return 'In Progress';
    case 'paused': return 'Paused';
    case 'not-started': return 'Not Started';
  }
}

export function getEdiAvailabilityLabel(c: CarrierIntegration): string {
  if (c.ediAvailability === 'available') return 'EDI / API available';
  if (c.acceptsForms) return 'Forms only';
  return 'No electronic option';
}

export type TransmissionEventType = 'enrollment' | 'termination' | 'change' | 'cobra' | 'edi-status';
export type TransmissionEventStatus = 'sent' | 'confirmed' | 'failed' | 'pending';

export interface TransmissionEvent {
  date: string;
  eventType: TransmissionEventType;
  description: string;
  status: TransmissionEventStatus;
  employeeCount?: number;
}

export const TRANSMISSION_HISTORY: Record<string, TransmissionEvent[]> = {
  'bcbs-il-medical': [
    { date: 'Mar 5, 2026',  eventType: 'enrollment',   description: 'New hire enrollment — 3 employees', status: 'sent',      employeeCount: 3  },
    { date: 'Mar 3, 2026',  eventType: 'edi-status',   description: 'EDI validation completed by carrier', status: 'confirmed'  },
    { date: 'Feb 28, 2026', eventType: 'change',       description: 'Dependent add — 1 employee',         status: 'sent',      employeeCount: 1  },
    { date: 'Feb 20, 2026', eventType: 'enrollment',   description: 'New hire enrollment — 5 employees',  status: 'confirmed', employeeCount: 5  },
    { date: 'Feb 18, 2026', eventType: 'edi-status',   description: 'EDI connection initiated',            status: 'confirmed'  },
  ],
  'calchoice-ca-medical': [
    { date: 'Mar 8, 2026',  eventType: 'enrollment',   description: 'New hire enrollment — 2 employees',  status: 'sent',      employeeCount: 2  },
    { date: 'Mar 1, 2026',  eventType: 'termination',  description: 'Termination — 1 employee',           status: 'confirmed', employeeCount: 1  },
    { date: 'Feb 22, 2026', eventType: 'change',       description: 'Address update — 4 employees',       status: 'confirmed', employeeCount: 4  },
    { date: 'Feb 15, 2026', eventType: 'enrollment',   description: 'Open enrollment — 18 employees',     status: 'confirmed', employeeCount: 18 },
    { date: 'Feb 10, 2026', eventType: 'enrollment',   description: 'New hire enrollment — 1 employee',   status: 'failed',    employeeCount: 1  },
  ],
  'kaiser-ca-medical': [
    { date: 'Mar 10, 2026', eventType: 'enrollment',   description: 'New hire enrollment — 4 employees',  status: 'confirmed', employeeCount: 4  },
    { date: 'Mar 5, 2026',  eventType: 'cobra',        description: 'COBRA continuation — 1 employee',    status: 'sent',      employeeCount: 1  },
    { date: 'Feb 27, 2026', eventType: 'termination',  description: 'Termination — 2 employees',          status: 'confirmed', employeeCount: 2  },
    { date: 'Feb 20, 2026', eventType: 'change',       description: 'Plan change — 6 employees',          status: 'confirmed', employeeCount: 6  },
    { date: 'Feb 15, 2026', eventType: 'enrollment',   description: 'Open enrollment — 24 employees',     status: 'confirmed', employeeCount: 24 },
  ],
};

export type DrawerFlowType = 'full-3-options' | 'edi-and-manual' | 'forms-and-manual' | 'manual-only';

export function getDrawerFlowType(c: CarrierIntegration): DrawerFlowType {
  if (c.ediAvailability === 'available' && c.acceptsForms) return 'full-3-options';
  if (c.ediAvailability === 'available' && !c.acceptsForms) return 'edi-and-manual';
  if (c.ediAvailability === 'not-available' && c.acceptsForms) return 'forms-and-manual';
  return 'manual-only';
}

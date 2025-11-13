/**
 * Mock data for Employee Profile
 */

import { Employee, ProfileLayout, LayoutSection } from './types';

/**
 * Sample employees
 */
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Darshil Vora',
    title: 'Tester',
    department: 'Engineering',
    manager: 'Peter Cannon',
    email: 'darshil.vora@rippling.com',
    phone: '+1 (555) 123-4567',
    startDate: '05/20/2024',
    location: 'San Francisco',
    address: '26 Guerrero Street, San Francisco, CA 94110',
    state: 'California',
    linkedinProfile: 'https://www.linkedin.com/in/darshilvora',
    legalEntity: 'Walker, Hernandez and Schmidt',
    level: 'Director',
    teams: ['team_1', 'team_2'],
    jobFamily: 'Adminstrative',
    duties: 'Answering telephone inquiries, welcome and direct visitors, perform word processing tasks, compile spreadsheet and presentations, and maintain organized file systems.',
    willGetWorkEmail: false,
    status: 'active',
    localeRegion: 'en_US',
    eeocEthnicity: '-',
  },
  {
    id: 'emp-2',
    name: 'Sarah Chen',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    manager: 'Michael Johnson',
    email: 'sarah.chen@rippling.com',
    phone: '+1 (555) 234-5678',
    startDate: '03/15/2023',
    location: 'New York',
    address: '123 Broadway, New York, NY 10001',
    state: 'New York',
    linkedinProfile: 'https://www.linkedin.com/in/sarahchen',
    legalEntity: 'Rippling Inc.',
    level: 'Senior',
    teams: ['team_1', 'backend'],
    jobFamily: 'Engineering',
    duties: 'Design and develop scalable backend systems, mentor junior engineers, participate in code reviews.',
    willGetWorkEmail: true,
    status: 'active',
    localeRegion: 'en_US',
    eeocEthnicity: 'Asian',
  },
  {
    id: 'emp-3',
    name: 'David Miller',
    title: 'Product Manager',
    department: 'Product',
    manager: 'Emily Rodriguez',
    email: 'david.miller@rippling.com',
    phone: '+1 (555) 345-6789',
    startDate: '01/10/2024',
    location: 'Austin',
    address: '456 Main St, Austin, TX 78701',
    state: 'Texas',
    linkedinProfile: 'https://www.linkedin.com/in/davidmiller',
    legalEntity: 'Rippling Inc.',
    level: 'Manager',
    teams: ['product', 'platform'],
    jobFamily: 'Product Management',
    duties: 'Define product roadmap, work with engineering teams, gather customer feedback.',
    willGetWorkEmail: true,
    status: 'active',
    localeRegion: 'en_US',
    eeocEthnicity: 'White',
  },
  {
    id: 'emp-4',
    name: 'Jessica Lee',
    title: 'UX Designer',
    department: 'Design',
    manager: 'Alex Thompson',
    email: 'jessica.lee@rippling.com',
    phone: '+1 (555) 456-7890',
    startDate: '06/01/2023',
    location: 'San Francisco',
    address: '789 Market St, San Francisco, CA 94102',
    state: 'California',
    linkedinProfile: 'https://www.linkedin.com/in/jessicalee',
    legalEntity: 'Rippling Inc.',
    level: 'Senior',
    teams: ['design', 'product'],
    jobFamily: 'Design',
    duties: 'Create user flows, design interfaces, conduct user research, collaborate with product and engineering.',
    willGetWorkEmail: true,
    status: 'active',
    localeRegion: 'en_US',
    eeocEthnicity: 'Asian',
  },
];

/**
 * Default layout sections
 */
const DEFAULT_SECTIONS: LayoutSection[] = [
  {
    id: 'role-information',
    label: 'Role information',
    compositionInstances: [],
  },
  {
    id: 'personal-information',
    label: 'Personal information',
    compositionInstances: [],
  },
  {
    id: 'additional-information',
    label: 'Additional information',
    compositionInstances: [],
  },
  {
    id: 'review-cycles',
    label: 'Review Cycles',
    compositionInstances: [],
  },
  {
    id: 'recruiting',
    label: 'Recruiting',
    compositionInstances: [],
  },
  {
    id: 'business-partners',
    label: 'Business partners',
    compositionInstances: [],
  },
  {
    id: 'direct-reports',
    label: 'Direct reports',
    compositionInstances: [],
  },
  {
    id: 'documents',
    label: 'Documents',
    compositionInstances: [],
  },
  {
    id: 'my-pay',
    label: 'My pay',
    compositionInstances: [],
  },
  {
    id: 'expenses',
    label: 'Expenses',
    compositionInstances: [],
  },
  {
    id: 'apps',
    label: 'Apps',
    compositionInstances: [],
  },
  {
    id: 'devices',
    label: 'Devices',
    compositionInstances: [],
  },
  {
    id: 'two-factor-devices',
    label: 'Two-factor devices',
    compositionInstances: [],
  },
  {
    id: 'authentication',
    label: 'Authentication',
    compositionInstances: [],
  },
  {
    id: 'compensation-information',
    label: 'Compensation information',
    compositionInstances: [],
  },
  {
    id: 'app-usernames',
    label: 'App usernames',
    compositionInstances: [],
  },
];

/**
 * Mock profile layouts
 */
export const MOCK_LAYOUTS: ProfileLayout[] = [
  {
    id: 'layout-1',
    name: 'Default',
    lastModified: '2024-11-15T10:30:00Z',
    lastModifiedBy: 'Michael Botzos',
    sections: DEFAULT_SECTIONS,
  },
  {
    id: 'layout-2',
    name: 'Profile admin view',
    lastModified: '2024-11-14T14:20:00Z',
    lastModifiedBy: 'Michael Botzos',
    sections: DEFAULT_SECTIONS,
  },
  {
    id: 'layout-3',
    name: 'Profile non-admin view',
    lastModified: '2024-11-13T09:15:00Z',
    lastModifiedBy: 'Michael Botzos',
    sections: DEFAULT_SECTIONS,
  },
  {
    id: 'layout-4',
    name: 'Profile self view',
    lastModified: '2024-11-12T16:45:00Z',
    lastModifiedBy: 'Michael Botzos',
    sections: DEFAULT_SECTIONS,
  },
];


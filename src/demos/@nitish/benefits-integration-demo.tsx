import React from 'react';
import { BenefitsShell, BenefitsView } from './benefits/BenefitsShell';

interface BenefitsIntegrationDemoProps {
  initialView?: BenefitsView;
}

const BenefitsIntegrationDemo: React.FC<BenefitsIntegrationDemoProps> = ({ initialView }) => (
  <BenefitsShell initialView={initialView} />
);

export default BenefitsIntegrationDemo;

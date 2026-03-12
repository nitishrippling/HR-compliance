import React, { useState } from 'react';
import { ComplianceHub, HubModuleId } from './ComplianceHub';
import { WorkforceModulePage } from './WorkforceModulePage';
import { FilingsModulePage } from './FilingsModulePage';
import { ComplianceHubContent } from './ComplianceHubContent';

type AppView = 'hub' | HubModuleId;

export const Compliance360Page: React.FC = () => {
  const [view, setView] = useState<AppView>('hub');
  const [entityTab, setEntityTab] = useState(0);

  function navigateTo(module: HubModuleId) {
    setView(module);
  }

  function goBack() {
    setView('hub');
  }

  if (view === 'hub') {
    return <ComplianceHub onNavigate={navigateTo} />;
  }

  if (view === 'workforce') {
    return <WorkforceModulePage onBack={goBack} />;
  }

  if (view === 'entity') {
    return (
      <ComplianceHubContent
        activeTab={entityTab}
        onTabChange={setEntityTab}
        onBack={goBack}
      />
    );
  }

  if (view === 'filing') {
    return <FilingsModulePage onBack={goBack} />;
  }

  return <ComplianceHub onNavigate={navigateTo} />;
};

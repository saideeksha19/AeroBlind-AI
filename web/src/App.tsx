/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AtmosphericIntelligence } from './components/AtmosphericIntelligence';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeroSection } from './components/HeroSection';
import { ModelPerformance } from './components/ModelPerformance';
import { Navbar } from './components/Navbar';
import { PipelineArchitecture } from './components/PipelineArchitecture';
import { ResearchFooter } from './components/ResearchFooter';
import { ResearchLaboratory } from './components/ResearchLaboratory';
import { ResearchOverview } from './components/ResearchOverview';
import { TargetsSection } from './components/TargetsSection';
import { TargetId } from './types/aeroblind';

export default function App() {
  const [activeTarget, setActiveTarget] = useState<TargetId>('CH4');

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F7F3] text-[#101D2B]">
      <Navbar />
      <ErrorBoundary>
        <main>
          <HeroSection
            activeTarget={activeTarget}
            onSelectTarget={setActiveTarget}
          />
          <ResearchOverview />
          <AtmosphericIntelligence
            activeTarget={activeTarget}
            onSelectTarget={setActiveTarget}
          />
          <TargetsSection
            activeTarget={activeTarget}
            onSelectTarget={setActiveTarget}
          />
          <ModelPerformance />
          <ResearchLaboratory />
          <PipelineArchitecture />
        </main>
      </ErrorBoundary>
      <ResearchFooter />
    </div>
  );
}


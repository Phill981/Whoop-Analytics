import { useState, useCallback, useMemo, useRef } from 'react';
import { useWhoopData } from './hooks/useWhoopData';
import { buildAnalytics } from './lib/analytics';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ScoresTab } from './components/tabs/ScoresTab';
import { InsightsTab } from './components/tabs/InsightsTab';
import { TrendsTab } from './components/tabs/TrendsTab';
import { HeartTab } from './components/tabs/HeartTab';
import { CorrelationsTab } from './components/tabs/CorrelationsTab';
import { OutliersTab } from './components/tabs/OutliersTab';
import { SleepTab } from './components/tabs/SleepTab';
import { WorkoutsTab } from './components/tabs/WorkoutsTab';

export default function WhoopDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const folderRef = useRef(null);

  const {
    physiological, workoutData, journalData,
    dataSource, handleFiles, resetToDemo,
  } = useWhoopData();

  const analytics = useMemo(
    () => buildAnalytics(physiological, workoutData, journalData),
    [physiological, workoutData, journalData],
  );

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  if (!analytics) {
    return (
      <div className="bg-void min-h-screen flex items-center justify-center">
        <span className="text-muted font-body">Loading...</span>
      </div>
    );
  }

  const sidebarWidth = sidebarExpanded ? 220 : 64;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="bg-void min-h-screen text-primary font-body flex"
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 bg-accent/5 backdrop-blur-sm flex items-center justify-center z-[1000] border-2 border-dashed border-accent/25 rounded-2xl m-4">
          <div className="text-center">
            <div className="text-xl font-semibold text-accent font-heading">
              Drop CSV files to load
            </div>
            <div className="text-[13px] text-secondary mt-1.5">
              Physiological Cycles, Sleep, Workouts, Journal
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        ref={folderRef}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        dataSource={dataSource}
        onUpload={handleFiles}
        onReset={resetToDemo}
      />

      {/* Main content */}
      <div
        className="flex-1 py-8 px-10 max-w-[1360px] transition-[margin-left] duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        {dataSource === 'demo' && (
          <DemoBanner onUpload={() => folderRef.current?.click()} />
        )}

        {activeTab === 'overview' && <OverviewTab analytics={analytics} physiological={physiological} />}
        {activeTab === 'scores' && <ScoresTab analytics={analytics} />}
        {activeTab === 'recommendations' && <InsightsTab analytics={analytics} />}
        {activeTab === 'trends' && <TrendsTab analytics={analytics} />}
        {activeTab === 'heart' && <HeartTab analytics={analytics} />}
        {activeTab === 'correlations' && <CorrelationsTab analytics={analytics} physiological={physiological} />}
        {activeTab === 'outliers' && <OutliersTab analytics={analytics} />}
        {activeTab === 'sleep' && <SleepTab analytics={analytics} />}
        {activeTab === 'workouts' && <WorkoutsTab analytics={analytics} />}
      </div>
    </div>
  );
}

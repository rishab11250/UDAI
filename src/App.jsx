import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { KPICards } from './components/Dashboard/KPICards';
import { EnrolmentTrendChart } from './components/Dashboard/EnrolmentTrendChart';
import { BiometricHealthChart } from './components/Dashboard/BiometricHealthChart';
import { MigrationChart } from './components/Dashboard/MigrationChart';
import { DigitalReadinessChart } from './components/Dashboard/DigitalReadinessChart';
import { FilterBar } from './components/UI/FilterBar';
import { fetchRealData, aggregateData } from './data/api';
import { Loader2, AlertCircle } from 'lucide-react';

// Create a Context for Data
export const DataContext = React.createContext({
  data: [],
  aggregatedData: [],
  isLoading: true
});

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Data State - Default to empty
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-load real data on mount
    const loadData = async () => {
      setIsLoading(true);
      try {
        const realData = await fetchRealData();
        if (realData && realData.length > 0) {
          setData(realData);
        } else {
          setError("No data available. Please verify 'public/data.json' exists.");
        }
      } catch (e) {
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Data Logic
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      const yearMatch = selectedYear ? item.year === parseInt(selectedYear) : true;
      const stateMatch = selectedState ? item.state === selectedState : true;
      return yearMatch && stateMatch;
    });
  }, [data, selectedYear, selectedState]);

  const aggregatedData = aggregateData(filteredData);
  const contextValue = { data: filteredData, aggregatedData, isLoading };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-teal-600" />
          <p className="text-lg font-medium">Loading Aadhaar Lifecycle Data...</p>
          <p className="text-sm text-slate-400 mt-2">Processing Data.gov.in records</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">{error}</p>
          <p className="text-sm text-slate-500 mt-2">Make sure to run: node scripts/fetchData.js</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <KPICards />
            <EnrolmentTrendChart />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <MigrationChart />
              <DigitalReadinessChart />
            </div>
            <BiometricHealthChart />
          </>
        );
      case 'demographic':
      case 'migration':
        return (
          <div className="space-y-8">
            <KPICards />
            <MigrationChart />
            <EnrolmentTrendChart />
          </div>
        );
      case 'biometric':
        return (
          <div className="space-y-8">
            <KPICards />
            <BiometricHealthChart />
          </div>
        );
      default:
        return <KPICards />;
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'demographic' && 'Demographic Insights'}
            {activeTab === 'biometric' && 'Biometric Health'}
            {activeTab === 'migration' && 'Migration Map'}
          </h2>
          <p className="text-slate-500">
            Real-time insight from Government Open Data APIs
          </p>
        </div>

        <FilterBar
          onYearChange={setSelectedYear}
          onStateChange={setSelectedState}
        />

        <div className="animate-in fade-in duration-500 min-h-[500px]">
          {renderContent()}
        </div>
      </DashboardLayout>
    </DataContext.Provider>
  );
}

export default App;

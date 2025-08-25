import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="lg" className="mx-auto" />
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin border-t-slate-600 mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-slate-600">Loading dashboard data...</p>
        <p className="text-sm text-slate-400">Connecting to smart warehouse systems</p>
      </div>
    </div>
  );
};

export default DashboardLoading;

import React from 'react';
import { LoadingState } from './loading-state';
import { useLoading } from '../../contexts/LoadingContext';

export const GlobalLoadingOverlay: React.FC = () => {
  const { globalLoading, operations } = useLoading();

  if (!globalLoading) {
    return null;
  }

  // Get the current global operation
  const globalOperation = operations.find(op => op.type === 'global');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
        <LoadingState
          isLoading={true}
          loadingState="loading"
          loadingMessage={globalOperation?.message || 'Loading...'}
          variant="inline"
          size="lg"
          showProgress={!!globalOperation?.progress}
          progress={globalOperation?.progress}
        />
      </div>
    </div>
  );
};
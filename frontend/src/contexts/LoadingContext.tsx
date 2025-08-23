import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface LoadingOperation {
  id: string;
  message?: string;
  progress?: number;
  type?: 'global' | 'page' | 'component';
}

interface LoadingContextType {
  operations: LoadingOperation[];
  isLoading: boolean;
  globalLoading: boolean;
  pageLoading: boolean;
  startOperation: (id: string, message?: string, type?: 'global' | 'page' | 'component') => void;
  updateOperation: (id: string, updates: Partial<LoadingOperation>) => void;
  completeOperation: (id: string) => void;
  clearAllOperations: () => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setPageLoading: (loading: boolean, message?: string) => void;
  getOperation: (id: string) => LoadingOperation | undefined;
  hasOperation: (id: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [operations, setOperations] = useState<LoadingOperation[]>([]);

  const isLoading = operations.length > 0;
  const globalLoading = operations.some(op => op.type === 'global');
  const pageLoading = operations.some(op => op.type === 'page');

  const startOperation = useCallback((
    id: string,
    message?: string,
    type: 'global' | 'page' | 'component' = 'component'
  ) => {
    setOperations(prev => {
      // Remove existing operation with same id
      const filtered = prev.filter(op => op.id !== id);
      return [...filtered, { id, message, type }];
    });
  }, []);

  const updateOperation = useCallback((id: string, updates: Partial<LoadingOperation>) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === id ? { ...op, ...updates } : op
      )
    );
  }, []);

  const completeOperation = useCallback((id: string) => {
    setOperations(prev => prev.filter(op => op.id !== id));
  }, []);

  const clearAllOperations = useCallback(() => {
    setOperations([]);
  }, []);

  const setGlobalLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      startOperation('global', message, 'global');
    } else {
      completeOperation('global');
    }
  }, [startOperation, completeOperation]);

  const setPageLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      startOperation('page', message, 'page');
    } else {
      completeOperation('page');
    }
  }, [startOperation, completeOperation]);

  const getOperation = useCallback((id: string) => {
    return operations.find(op => op.id === id);
  }, [operations]);

  const hasOperation = useCallback((id: string) => {
    return operations.some(op => op.id === id);
  }, [operations]);

  const value: LoadingContextType = {
    operations,
    isLoading,
    globalLoading,
    pageLoading,
    startOperation,
    updateOperation,
    completeOperation,
    clearAllOperations,
    setGlobalLoading,
    setPageLoading,
    getOperation,
    hasOperation,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
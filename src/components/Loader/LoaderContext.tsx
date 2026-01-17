import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loaderService } from './loaderService';

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loaderService.subscribe((loading) => {
      setIsLoading(loading);
    });

    setIsLoading(loaderService.isLoading());

    return unsubscribe;
  }, []);

  const showLoader = () => {
    loaderService.show();
  };

  const hideLoader = () => {
    loaderService.hide();
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

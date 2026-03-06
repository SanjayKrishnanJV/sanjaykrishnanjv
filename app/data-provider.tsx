'use client';

import { createContext, useContext, ReactNode } from 'react';

interface PortfolioData {
  personal: any;
  github: any;
  certifications: any;
}

const DataContext = createContext<PortfolioData>({
  personal: {},
  github: {},
  certifications: [],
});

export function DataProvider({ children, data }: { children: ReactNode; data: PortfolioData }) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function usePortfolioData() {
  return useContext(DataContext);
}

// Helper hooks for backward compatibility
export function usePersonalData() {
  const context = useContext(DataContext);
  return context.personal;
}

export function useGitHubData() {
  const context = useContext(DataContext);
  return context.github;
}

export function useCertifications() {
  const context = useContext(DataContext);
  return context.certifications;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shareholder {
  name: string;
  nationality: string;
  passportNumber: string;
  equity: number;
}

export interface ApplicationData {
  structure: string;
  jurisdiction: string;
  freeZone?: string;
  activities: string[];
  tradeNames: { ar: string, en: string }[];
  shareholders: Shareholder[];
  capital: number;
  documents: { type: string, url: string, status: string }[];
  step: number;
}

interface WizardState {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  reset: () => void;
}

const initialData: ApplicationData = {
  structure: '',
  jurisdiction: 'mainland',
  activities: [],
  tradeNames: [{ ar: '', en: '' }],
  shareholders: [],
  capital: 0,
  documents: [],
  step: 1
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      data: initialData,
      updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
      reset: () => set({ data: initialData }),
    }),
    {
      name: 'TohidBusinessGate_wizard_storage',
    }
  )
);

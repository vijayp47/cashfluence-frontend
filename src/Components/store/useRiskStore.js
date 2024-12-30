// useRiskStore.js
import {create} from 'zustand';

const useRiskStore = create((set) => ({
  averageRiskLevel: null,
  averageRiskScore: null,
  setRiskData: (averageRiskLevel, averageRiskScore) => set({ averageRiskLevel, averageRiskScore }),
}));

export default useRiskStore;

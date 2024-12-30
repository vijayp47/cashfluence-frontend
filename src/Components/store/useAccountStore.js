// src/store/useAccountStore.js
import {create} from 'zustand';
import { getAccountData } from '../../API/apiServices'; 

const userId = localStorage.getItem("user_id");

const useAccountStore = create((set) => ({
    
  accountData: null, // Initial state for accountData
  setAccountData: (data) => set({ accountData: data }), // Action to update accountData

  fetchAccountData: async () => {
    try {
      const response = await getAccountData(userId);
      set({ accountData: response });
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  },
}));

export default useAccountStore;
// src/store/useAccountStore.js
import { create } from 'zustand';
import { getAccountData } from '../../API/apiServices';

const userId = localStorage.getItem("user_id");

const useAccountStore = create((set, get) => ({
  accountData: null,
  setAccountData: (data) => set({ accountData: data }),

  fetchAccountData: async () => {
    try {
      const response = await getAccountData(userId);
      if (JSON.stringify(get().accountData) !== JSON.stringify(response)) {
        set({ accountData: response });
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    }
  },

  removeDeletedBank: (institutionId) => {
    set((state) => ({
      accountData: state.accountData
        ? state.accountData.filter(bank => bank.institution_id !== institutionId)
        : [],
    }));
  },

  removeDeletedAccount: (accountId) => {
    set((state) => ({
      accountData: state.accountData
        ? state.accountData.map(bank => ({
            ...bank,
            accounts: bank.accounts.filter(account => account.accountId !== accountId),
          }))
        : [],
    }));
  }
}));

export default useAccountStore;

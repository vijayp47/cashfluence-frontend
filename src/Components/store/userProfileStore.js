import {create} from "zustand";
import { getUserProfile } from "../../API/apiServices";

const useStore = create((set) => ({
  profileData: null,
  setProfileData: (data) => set({ profileData: data }),

  fetchProfileData: async () => {
    try {
      const response = await getUserProfile();
      set({ profileData: response.data });
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  },
}));

export default useStore;

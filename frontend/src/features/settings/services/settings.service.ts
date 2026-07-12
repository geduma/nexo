import { apiClient } from "../../../services/api/client";
import type { Settings } from "../../../types";

export const settingsService = {
  get: async (): Promise<{ data: Settings }> => {
    const response = await apiClient.get("/settings");
    return response.data;
  },

  update: async (data: Partial<Settings>) => {
    const response = await apiClient.put("/settings", data);
    return response.data;
  },
};

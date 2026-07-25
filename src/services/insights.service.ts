import { apiClient } from "./api-client";
import { ApiResponse, FinancialHealthData, AlertItem, SubscriptionItem } from "@/types/api";

export const insightsService = {
  async getFinancialHealth(): Promise<FinancialHealthData> {
    const res = await apiClient<ApiResponse<FinancialHealthData>>("/insights/health", {
      method: "GET",
    });
    return res.data;
  },

  async getAlerts(): Promise<AlertItem[]> {
    const res = await apiClient<ApiResponse<AlertItem[]>>("/insights/alerts", {
      method: "GET",
    });
    return res.data;
  },

  async getSubscriptions(): Promise<SubscriptionItem[]> {
    const res = await apiClient<ApiResponse<SubscriptionItem[]>>("/insights/subscriptions", {
      method: "GET",
    });
    return res.data;
  },
};

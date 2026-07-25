import { useQuery } from "@tanstack/react-query";
import { insightsService } from "@/services/insights.service";
import { FinancialHealthData, AlertItem, SubscriptionItem } from "@/types/api";

export function useFinancialHealth() {
  return useQuery<FinancialHealthData | null>({
    queryKey: ["insights", "health"],
    queryFn: async () => {
      try {
        return await insightsService.getFinancialHealth();
      } catch (err) {
        console.warn("Backend insights/health query failed, returning null:", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAlerts() {
  return useQuery<AlertItem[]>({
    queryKey: ["insights", "alerts"],
    queryFn: async () => {
      try {
        return await insightsService.getAlerts();
      } catch (err) {
        console.warn("Backend insights/alerts query failed, returning empty list:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubscriptions() {
  return useQuery<SubscriptionItem[]>({
    queryKey: ["insights", "subscriptions"],
    queryFn: async () => {
      try {
        return await insightsService.getSubscriptions();
      } catch (err) {
        console.warn("Backend insights/subscriptions query failed, returning empty list:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

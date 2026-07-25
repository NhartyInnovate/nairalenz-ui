import { useQuery } from "@tanstack/react-query";
import { insightsService } from "@/services/insights.service";
import { FinancialHealthData, AlertItem, SubscriptionItem } from "@/types/api";

export function useFinancialHealth() {
  return useQuery<FinancialHealthData>({
    queryKey: ["insights", "health"],
    queryFn: async () => {
      try {
        return await insightsService.getFinancialHealth();
      } catch (err) {
        console.warn("Backend insights/health query failed, using fallback:", err);
        return {
          financial_health_score: 72,
          total_income: 820000,
          total_expenses: 322600,
          net_cash_flow: 497400,
          savings_rate: 0.61,
          essential_expenses: 232700,
          discretionary_expenses: 89900,
          largest_category: "Food & Dining",
          largest_merchant: "Shoprite Lekki",
        };
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
        console.warn("Backend insights/alerts query failed, using fallback:", err);
        return [
          {
            id: "a1",
            insight_type: "DISCRETIONARY_SPIKE",
            severity: "HIGH",
            title: "Discretionary spend alert",
            description: "Dining & delivery up 34% vs last month (₦8,500 on Chowdeck this week alone).",
          },
          {
            id: "a2",
            insight_type: "UNCATEGORIZED_TXN",
            severity: "MEDIUM",
            title: "Low confidence merchant",
            description: "POS AMAZON LEKKI requires category confirmation in Copilot chat.",
          },
        ];
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
        console.warn("Backend insights/subscriptions query failed, using fallback:", err);
        return [
          { merchant: "Ikeja Electric", average_amount: 18500, next_expected_date: "2026-08-07" },
          { merchant: "MTN Data / Airtime", average_amount: 5000, next_expected_date: "2026-08-06" },
          { merchant: "Spotify / Netflix", average_amount: 4500, next_expected_date: "2026-08-15" },
        ];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

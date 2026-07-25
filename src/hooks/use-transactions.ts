import { useQuery } from "@tanstack/react-query";
import { transactionsService, TransactionParams } from "@/services/transactions.service";
import { PaginatedTransactions } from "@/types/api";
import { getTransactions } from "@/lib/store";

export function useTransactions(params: TransactionParams = {}) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["transactions", params],
    queryFn: async () => {
      try {
        const res = await transactionsService.getTransactions(params);
        if (res && res.items) {
          return res;
        }
      } catch (err) {
        console.warn("Backend transactions query failed, falling back to local store:", err);
      }

      // Local fallback adapter
      const rawStoreTxns = getTransactions();
      const filtered = rawStoreTxns.filter((t) => {
        if (params.category && params.category !== "All") {
          return t.cat.toLowerCase() === params.category.toLowerCase();
        }
        return true;
      });

      const page = params.page || 1;
      const size = params.size || 20;
      const total = filtered.length;
      const pages = Math.ceil(total / size) || 1;
      const paginatedItems = filtered.slice((page - 1) * size, page * size);

      return {
        items: paginatedItems.map((t) => ({
          id: t.id,
          transaction_date: t.date,
          description: t.name,
          amount: Math.abs(t.amount),
          transaction_type: t.amount >= 0 ? "CREDIT" : "DEBIT",
          currency: "NGN",
          category_name: t.cat,
          merchant_name: t.merchant,
          confidence: 0.95,
        })),
        total,
        page,
        size,
        pages,
      };
    },
    staleTime: 0, // Fresh queries for instant refetch on statement parse / clarification
  });
}

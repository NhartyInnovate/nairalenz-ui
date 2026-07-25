import { apiClient } from "./api-client";
import { ApiResponse, PaginatedTransactions } from "@/types/api";

export interface TransactionParams {
  page?: number;
  size?: number;
  category?: string;
  start_date?: string;
  end_date?: string;
}

export const transactionsService = {
  async getTransactions(params: TransactionParams = {}): Promise<PaginatedTransactions> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.size) query.append("size", params.size.toString());
    if (params.category) query.append("category", params.category);
    if (params.start_date) query.append("start_date", params.start_date);
    if (params.end_date) query.append("end_date", params.end_date);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient<ApiResponse<PaginatedTransactions>>(`/transactions${queryString}`, {
      method: "GET",
    });

    return res.data;
  },
};

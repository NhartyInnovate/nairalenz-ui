import { apiClient } from "./api-client";
import { ApiResponse, StatementUploadData } from "@/types/api";

export const statementsService = {
  async uploadStatement(file: File): Promise<StatementUploadData> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient<ApiResponse<StatementUploadData>>("/statements/upload", {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    return res.data;
  },

  async getStatementStatus(id: string): Promise<StatementUploadData> {
    const res = await apiClient<ApiResponse<StatementUploadData>>(`/statements/${id}`, {
      method: "GET",
    });

    return res.data;
  },

  async getStatements(): Promise<StatementUploadData[]> {
    const res = await apiClient<ApiResponse<StatementUploadData[]>>("/statements", {
      method: "GET",
    });

    return res.data;
  },
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { statementsService } from "@/services/statements.service";
import { StatementUploadData } from "@/types/api";

export function useUploadStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => statementsService.uploadStatement(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statements"] });
    },
  });
}

export function useStatementStatus(id: string | null) {
  const queryClient = useQueryClient();

  return useQuery<StatementUploadData | null>({
    queryKey: ["statement", id],
    queryFn: async () => {
      if (!id) return null;
      return await statementsService.getStatementStatus(id);
    },
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 1500;
      if (data.upload_status === "COMPLETED" || data.upload_status === "FAILED") {
        // Automatically stop polling and invalidate related data
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["insights"] });
        return false;
      }
      return 1500;
    },
  });
}

export function useStatements() {
  return useQuery<StatementUploadData[]>({
    queryKey: ["statements"],
    queryFn: async () => {
      try {
        return await statementsService.getStatements();
      } catch (err) {
        console.warn("Backend statements query failed, returning empty list fallback:", err);
        return [];
      }
    },
    staleTime: 0,
  });
}

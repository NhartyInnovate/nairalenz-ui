import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import { ConversationItem, ChatResponseData } from "@/types/api";

export function useConversations() {
  return useQuery<ConversationItem[]>({
    queryKey: ["chat", "conversations"],
    queryFn: async () => {
      try {
        return await chatService.getConversations();
      } catch (err) {
        console.warn("Backend chat conversations query failed, using empty list fallback:", err);
        return [];
      }
    },
    staleTime: 0,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, conversation_id }: { content: string; conversation_id?: string }) =>
      chatService.sendMessage(content, conversation_id),
    onSuccess: (data: ChatResponseData) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
      // Invalidate transactions and insights in case transaction updates or pattern learning occurred
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

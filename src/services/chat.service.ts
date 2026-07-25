import { apiClient } from "./api-client";
import { ApiResponse, ChatResponseData, ConversationItem } from "@/types/api";

export const chatService = {
  async sendMessage(content: string, conversation_id?: string): Promise<ChatResponseData> {
    const body: { content: string; conversation_id?: string } = { content };
    if (conversation_id) {
      body.conversation_id = conversation_id;
    }

    const res = await apiClient<ApiResponse<ChatResponseData>>("/chat/chat", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return res.data;
  },

  async getConversations(): Promise<ConversationItem[]> {
    const res = await apiClient<ApiResponse<ConversationItem[]>>("/chat/conversations", {
      method: "GET",
    });

    return res.data;
  },
};

import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Paperclip, Mic, Plus, MessageSquare, Loader2, HelpCircle, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSendMessage, useConversations } from "@/hooks/use-chat";
import { chatWithCopilot } from "@/lib/copilot-server";
import { useFinanceStore } from "@/lib/store";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_app/copilot")({
  head: () => ({ meta: [{ title: "AI Financial Copilot — NairaLens AI" }] }),
  component: Copilot,
});

const SUGGESTIONS = [
  "What did I spend on food this month?",
  "Analyze my subscriptions & save money",
  "If I save ₦150k/month, when can I afford a MacBook?",
  "Show my top 5 merchants",
  "Am I overspending on transport?",
];

interface ChatMessageItem {
  role: "user" | "assistant";
  content: string;
  clarification?: {
    txnId: string;
    description: string;
    amount: number;
    options: string[];
  };
}

interface ChatSession {
  id: string;
  title: string;
  when: string;
  messages: ChatMessageItem[];
}

function Copilot() {
  const { user } = useAuth();
  const { transactions, profile } = useFinanceStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { data: remoteConversations } = useConversations();
  const sendMessageMutation = useSendMessage();

  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      title: "July spending review",
      when: "Today",
      messages: [
        {
          role: "assistant",
          content: `Hi ${
            user?.full_name ? user.full_name.split(" ")[0] : "Adaeze"
          } — I'm your NairaLens AI financial copilot. I've analyzed your bank statements. Ask me anything about your cashflow, budgets, savings rate, or custom financial goals!`,
        },
      ],
    },
    {
      id: "chat-2",
      title: "Unclassified charges",
      when: "Yesterday",
      messages: [
        {
          role: "assistant",
          content:
            "I found 1 transaction requiring your clarification to improve your financial health report accuracy:",
          clarification: {
            txnId: "txn-clarify-101",
            description: "POS / TRSF / 00921283 / POS PURCH",
            amount: 14500,
            options: ["Business Supplies", "Dining / Eating Out", "Personal Care"],
          },
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = chatSessions.find((s) => s.id === activeChatId) || chatSessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessageItem = { role: "user", content: text };
    const updatedMessages = [...activeChat.messages, userMsg];

    setChatSessions((prev) =>
      prev.map((s) => (s.id === activeChatId ? { ...s, messages: updatedMessages } : s))
    );
    setInput("");
    setIsTyping(true);

    try {
      // 1. Try sending via backend Chat API endpoint
      const response = await sendMessageMutation.mutateAsync({
        message: text,
        conversation_id: activeChatId.startsWith("chat-") ? undefined : activeChatId,
      });

      const assistantMsg: ChatMessageItem = {
        role: "assistant",
        content: response.reply || response.response || "No response received.",
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === activeChatId
            ? {
                ...s,
                messages: [...updatedMessages, assistantMsg],
                title:
                  s.title === "New Chat" || s.title === "July spending review"
                    ? text.length > 24
                      ? text.substring(0, 24) + "..."
                      : text
                    : s.title,
              }
            : s
        )
      );
    } catch (err) {
      console.warn("Backend chat endpoint fallback to local AI engine:", err);
      // 2. Fallback to Copilot Server
      try {
        const localResult = await chatWithCopilot({
          messages: updatedMessages,
          transactions,
          profile,
        });
        const assistantMsg: ChatMessageItem = {
          role: "assistant",
          content: localResult.response,
        };
        setChatSessions((prev) =>
          prev.map((s) =>
            s.id === activeChatId
              ? {
                  ...s,
                  messages: [...updatedMessages, assistantMsg],
                }
              : s
          )
        );
      } catch (localErr) {
        toast.error("Failed to connect to Copilot.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleClarifyOption = (txnId: string, category: string) => {
    toast.success(`Transaction categorized as "${category}"!`);
    const confirmMsg: ChatMessageItem = {
      role: "assistant",
      content: `Thank you! Transaction \`${txnId}\` has been updated to **${category}**. Your financial summary reflects this update.`,
    };
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === activeChatId ? { ...s, messages: [...s.messages, confirmMsg] } : s
      )
    );
  };

  const startNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      when: "Just now",
      messages: [
        {
          role: "assistant",
          content: `Hello! I'm ready to analyze your financial ledger. Send a message to start our conversation.`,
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
    toast.success("New chat started!");
  };

  return (
    <PageContainer className="max-w-none px-0 md:px-0">
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Chat rail */}
        <aside className="hidden border-r border-border bg-sidebar/60 p-4 lg:block">
          <Button variant="hero" size="sm" className="w-full" onClick={startNewChat}>
            <Plus className="h-3.5 w-3.5" /> New chat
          </Button>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Recent chats
          </p>
          <ul className="mt-2 space-y-0.5">
            {chatSessions.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveChatId(c.id)}
                  className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition cursor-pointer hover:bg-accent ${
                    activeChatId === c.id ? "bg-accent text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground">{c.when}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat area */}
        <div className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold">NairaLens Copilot</p>
                <p className="text-[10px] text-muted-foreground">
                  Connected to backend intelligence & bank-grade encryption
                </p>
              </div>
            </div>
            <Badge variant="gold">Pro Mode</Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-8">
            {activeChat.messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
                  {!isUser && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary">
                      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                    </span>
                  )}
                  <div className="space-y-3 max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground"
                      }`}
                    >
                      <div className="markdown-body select-text prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Clarification Workflow Card */}
                    {m.clarification && (
                      <div className="rounded-xl border border-primary/30 bg-primary-soft/20 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                          <HelpCircle className="h-4 w-4" /> Clarification Required
                        </div>
                        <div className="text-xs text-foreground font-mono">
                          {m.clarification.description} — ₦{m.clarification.amount.toLocaleString()}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.clarification.options.map((opt) => (
                            <Button
                              key={opt}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleClarifyOption(m.clarification!.txnId, opt)}
                            >
                              <Check className="h-3 w-3 mr-1" /> {opt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-primary">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="border-t border-border px-6 py-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Try asking
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="border-t border-border p-4"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2">
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition cursor-pointer"
                onClick={() => toast.info("Attachments are parsed via the Statement Upload tab!")}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances…"
                className="flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                disabled={isTyping}
              />
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition cursor-pointer"
                onClick={() => toast.info("Voice-to-text is disabled in browser sandbox.")}
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button type="submit" variant="hero" size="sm" disabled={!input.trim() || isTyping}>
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Copilot uses only your uploaded statements. Never shared, never trained on.
            </p>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

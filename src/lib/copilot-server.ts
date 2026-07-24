import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";
import { Transaction, FinancialProfile } from "./store";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const chatWithCopilot = createServerFn(
  "POST",
  async (payload: {
    messages: ChatMessage[];
    transactions: Transaction[];
    profile: FinancialProfile;
  }) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return {
          error: "API_KEY_MISSING",
          response:
            "Hi! I see you are trying to use NairaLens AI Copilot. To unlock Gemini-powered conversational ledger analysis, please add your `GEMINI_API_KEY` in the Google AI Studio Settings menu. In the meantime, I am running in local simulation mode to help you explore the app!",
        };
      }

      const ai = getAIClient();

      const systemInstruction = `
You are the NairaLens AI Financial Copilot, an elite personal finance analyst tailored for Nigerians.
You help users make sense of their bank statement transactions, budget better, increase savings rates, and build robust wealth.
You speak in a warm, expert, friendly tone. Use Nigerian financial context naturally (mentioning Naira ₦, services like Chowdeck, Bolt, Shoprite, MTN, OPay, Kuda, bank transfers, Lekki, Lagos, etc.).

Ground every response on the user's real transactions and profile provided below. If they ask about their transactions, perform calculations on the data dynamically.
Current Financial Profile:
- Name: ${payload.profile.fullName || "User"}
- Monthly Income: ₦${payload.profile.monthlyIncome?.toLocaleString() || "Not set"}
- Primary Goal: ${payload.profile.primaryGoal || "Not set"}
- Risk Tolerance: ${payload.profile.riskTolerance || "Moderate"}

Active Transaction Ledger (showing ${payload.transactions.length} rows):
${JSON.stringify(payload.transactions, null, 2)}

Instructions:
1. Always format currency as ₦X,XXX.
2. Be concise, highly professional, and actionable. Avoid generic fluff.
3. If they ask for breakdown, tables, or comparison, format using Markdown tables or bullet lists.
4. Keep the response highly structured and readable.
      `;

      // Structure chat messages for @google/genai SDK
      // Format history
      const contents = payload.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return {
        response: response.text || "I was unable to analyze that right now. Please try again.",
      };
    } catch (err) {
      console.error("Error in chatWithCopilot:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      return {
        error: "SERVER_ERROR",
        response: `Oops, something went wrong while communicating with Gemini: ${errorMessage}. Please make sure your GEMINI_API_KEY is configured correctly.`,
      };
    }
  },
);

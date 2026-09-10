/**
 * @file src/utils/chat.ts
 * @description Client-side API fetch utility for communicating with the Vercel-deployed chatbot backend.
 * Handles HTTP requests, conversation history formatting, dynamic environment base URL selection,
 * and robust network error boundaries.
 * Fits into the system as the shared data access layer called by the Chatbot UI component.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  model: string;
}

import { DEV_BACKEND_URL, PROD_BACKEND_URL } from "./constants";

// DEV tries localhost:3000 first (vercel dev), but auto-falls back to prod if not running — prevents ERR_CONNECTION_REFUSED in Astro dev.
const PRIMARY_BACKEND_URL = import.meta.env.DEV ? DEV_BACKEND_URL : PROD_BACKEND_URL;
const FALLBACK_BACKEND_URL = import.meta.env.DEV ? PROD_BACKEND_URL : "";


/**
 * Sends a chat message along with session conversation history to the Vercel serverless chatbot API.
 * Sanitizes input arguments, handles network response status checks, parses returned JSON payloads,
 * and handles failures with clean, readable error logs.
 *
 * @param {string} message - The latest prompt text entered by the portfolio website visitor.
 * @param {ChatMessage[]} [history=[]] - An optional array containing previous chat turns in this session.
 * @returns {Promise<ChatResponse>} A promise that resolves to the structured reply payload from the model.
 * @throws {Error} Throws an error containing user-friendly details if the network fails or returning HTTP status is invalid.
 */
async function doFetch(endpoint: string, message: string, history: ChatMessage[]) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message.trim(),
      history: history.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!response.ok) {
    const errPayload = await response.json().catch(() => ({}));
    const msg = errPayload?.error ?? errPayload?.details ?? `Server ${response.status}`;
    // Friendly mapping for common Vercel cold issues
    if (response.status === 504) throw new Error("Chat service is warming up — please try again in a few seconds.");
    throw new Error(msg);
  }
  const data: ChatResponse = await response.json();
  return data;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!message || message.trim() === "") {
    throw new Error("Message cannot be empty.");
  }

  const endpoints = [PRIMARY_BACKEND_URL, FALLBACK_BACKEND_URL].filter(Boolean).map(u => `${u}/api/chat`);

  let lastError: any = null;
  for (const endpoint of endpoints) {
    try {
      return await doFetch(endpoint, message, history);
    } catch (error: any) {
      lastError = error;
      const isNetworkError = error instanceof TypeError && /fetch/i.test(error.message);
      const isConnRefused = /ERR_CONNECTION_REFUSED|Failed to fetch|NetworkError/i.test(error.message);
      const shouldFallback = endpoints.length > 1 && (isNetworkError || isConnRefused);
      console.warn(`[Chat] ${endpoint} failed:`, error.message);
      if (!shouldFallback) throw error;
      // otherwise try next endpoint (prod fallback)
    }
  }
  console.error("[Chat Utility] sendChatMessage failed:", lastError);
  throw new Error(lastError?.message ?? "Failed to connect to the portfolio chatbot service. Please try again later.");
}

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

// Automatically selects localhost during Astro dev, and Vercel in production builds.
const BACKEND_URL = import.meta.env.DEV ? DEV_BACKEND_URL : PROD_BACKEND_URL;


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
export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!message || message.trim() === "") {
    throw new Error("Message cannot be empty.");
  }

  const endpoint = `${BACKEND_URL}/api/chat`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        history: history.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload?.error ?? `Server returned an error status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("[Chat Utility] sendChatMessage failed:", error);
    throw new Error(error?.message ?? "Failed to connect to the portfolio chatbot service. Please try again later.");
  }
}

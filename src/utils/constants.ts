/**
 * Global Constants
 * Purpose: Centralizes shared strings, configuration values, and repeated logic across the application.
 * Contains: Deployment notes (e.g., Render cold-start warning) and other static content.
 * System Role: Ensures consistency and reduces duplication throughout the Astro pages and components.
 */

/**
 * NOTE: The live Vercel production deployment URL for the portfolio chatbot backend.
 */
export const PROD_BACKEND_URL = "https://chatbot-for-portfolio.vercel.app";

/**
 * NOTE: The local development URL for the chatbot backend.
 * Runs the backend locally with `vercel dev` (defaults to port 3000).
 * If localhost:3000 is not running, the chat utility auto-falls back to PROD.
 * To always use prod locally, set this to PROD_BACKEND_URL.
 */
export const DEV_BACKEND_URL = "http://localhost:3000";



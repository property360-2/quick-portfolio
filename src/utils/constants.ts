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
 * Runs the backend locally with `vercel dev` (defaults to port 3000), or point this
 * back at your live Vercel URL if you prefer to test against production.
 */
export const DEV_BACKEND_URL = "http://localhost:3000";



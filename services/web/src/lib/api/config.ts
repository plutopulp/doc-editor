/**
 * Backend API configuration
 */

/**
 * Base URL for the FastAPI backend.
 * Uses Docker network hostname in production, localhost in development.
 */
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5005";

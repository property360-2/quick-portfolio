/**
 * Firebase client configuration for the quick portfolio.
 * This file centralizes the public Firebase web app config and admin access constants used by browser-only pages.
 * It supports Firebase Auth and Firestore integrations without storing passwords or private service credentials.
 */
import { CONTACT_EMAIL } from "./contact";

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBSYzDOKMkVPYq8zC_AkKgGg_UpfVbEUpY",
  authDomain: "quick-portfolio-ce7e0.firebaseapp.com",
  projectId: "quick-portfolio-ce7e0",
  storageBucket: "quick-portfolio-ce7e0.firebasestorage.app",
  messagingSenderId: "417677673450",
  appId: "1:417677673450:web:6c8ca2361d8e0cad93e893",
  measurementId: "G-RVT3NFCNJT",
};

export const FIREBASE_ADMIN_EMAILS = [CONTACT_EMAIL.toLowerCase()];
export const LEAD_NOTES_COLLECTION = "leadNotes";

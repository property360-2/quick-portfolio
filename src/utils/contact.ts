/**
 * Contact utilities for portfolio inquiry flows.
 * This file centralizes the public contact destination, validates project idea submissions,
 * sanitizes visitor-provided text before it is used, and builds static-friendly mailto links.
 * It supports Astro pages that need a backend-free path from visitor intent to a manually sent email.
 */

export const CONTACT_EMAIL = "junalvior21@gmail.com";

export type ProjectIdeaInput = {
  name: string;
  email: string;
  idea: string;
  budget?: string;
  timeline?: string;
};

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

/**
 * Removes control characters and trims a short contact field value.
 * It accepts a raw string from an input field and returns sanitized plain text safe for display or email composition.
 */
export function sanitizeContactField(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Removes unsafe control characters while preserving readable line breaks in a longer message.
 * It accepts a raw textarea value and returns sanitized plain text for local storage or email composition.
 */
export function sanitizeContactMessage(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .trim();
}

/**
 * Checks whether a visitor-provided email address has the minimum shape needed for a reply.
 * It accepts a sanitized email string and returns true when the address looks usable.
 */
export function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the required project idea fields before a mailto link is opened.
 * It accepts raw form values and returns a validation result with a clean user-facing message.
 */
export function validateProjectIdeaInput(input: ProjectIdeaInput): ValidationResult {
  const name = sanitizeContactField(input.name);
  const email = sanitizeContactField(input.email);
  const idea = sanitizeContactMessage(input.idea);

  if (!name) {
    return { isValid: false, message: "Please add your name before sending." };
  }

  if (!email || !isValidEmailAddress(email)) {
    return { isValid: false, message: "Please add a valid reply email." };
  }

  if (!idea) {
    return { isValid: false, message: "Please describe your project idea." };
  }

  return { isValid: true, message: "" };
}

/**
 * Builds the body text used by the project idea email flow.
 * It accepts sanitized or raw project idea fields and returns a plain-text summary for the visitor's email app.
 */
export function buildProjectIdeaEmailBody(input: ProjectIdeaInput): string {
  const name = sanitizeContactField(input.name);
  const email = sanitizeContactField(input.email);
  const idea = sanitizeContactMessage(input.idea);
  const budget = sanitizeContactField(input.budget ?? "");
  const timeline = sanitizeContactField(input.timeline ?? "");
  const lines = [
    "Hi Jun,",
    "",
    "I want to discuss a project idea.",
    "",
    `Name: ${name}`,
    `Reply email: ${email}`,
    budget ? `Budget: ${budget}` : "",
    timeline ? `Timeline: ${timeline}` : "",
    "",
    "Project idea:",
    idea,
    "",
    "Source: Rate page",
  ];

  return lines.filter((line) => line !== "").join("\n");
}

/**
 * Creates the encoded mailto URL used by the static project idea form.
 * It accepts project idea fields and returns a complete mailto href for the configured contact email.
 */
export function createProjectIdeaMailto(input: ProjectIdeaInput): string {
  const subject = `Project idea from ${sanitizeContactField(input.name)}`;
  const body = buildProjectIdeaEmailBody(input);

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

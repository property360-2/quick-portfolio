function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

document.addEventListener("DOMContentLoaded", () => {
  const triggerBtn = document.getElementById("toggle-contact-form");
  const formCard = document.getElementById("contact-form-card");

  if (triggerBtn && formCard) {
    triggerBtn.addEventListener("click", () => {
      formCard.classList.remove("hidden");

      setTimeout(() => {
        formCard.classList.remove("opacity-0", "translate-y-4");
      }, 50);

      setTimeout(() => {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

      const triggerContainer = document.getElementById("form-trigger-container");
      if (triggerContainer) {
        triggerContainer.classList.add("hidden");
      }
    });
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const typeInput = document.getElementById("contact-type");

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjectVal = subjectInput.value.trim();
    const messageVal = messageInput.value.trim();
    const typeVal = typeInput ? typeInput.value : "";

    const errorIds = ["name-error", "email-error", "subject-error", "message-error"];
    errorIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.removeAttribute("aria-invalid");
    });

    let hasErrors = false;

    if (nameVal.length < 2) {
      const err = document.getElementById("name-error");
      if (err) {
        err.textContent = "Please enter your full name (minimum 2 characters).";
        err.classList.remove("hidden");
        err.setAttribute("role", "alert");
      }
      if (nameInput) nameInput.setAttribute("aria-invalid", "true");
      hasErrors = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      const err = document.getElementById("email-error");
      if (err) {
        err.textContent = "Please enter a valid email address.";
        err.classList.remove("hidden");
        err.setAttribute("role", "alert");
      }
      if (emailInput) emailInput.setAttribute("aria-invalid", "true");
      hasErrors = true;
    }

    if (subjectVal.length < 3) {
      const err = document.getElementById("subject-error");
      if (err) {
        err.textContent = "Please enter a subject (minimum 3 characters).";
        err.classList.remove("hidden");
        err.setAttribute("role", "alert");
      }
      if (subjectInput) subjectInput.setAttribute("aria-invalid", "true");
      hasErrors = true;
    }

    if (messageVal.length < 10) {
      const err = document.getElementById("message-error");
      if (err) {
        err.textContent = "Please write a brief description or message (minimum 10 characters).";
        err.classList.remove("hidden");
        err.setAttribute("role", "alert");
      }
      if (messageInput) messageInput.setAttribute("aria-invalid", "true");
      hasErrors = true;
    }

    if (hasErrors) return;

    const safeName = sanitizeInput(nameVal);
    const safeEmail = sanitizeInput(emailVal);
    const safeSubject = sanitizeInput(subjectVal);
    const safeMessage = sanitizeInput(messageVal);
    const safeType = sanitizeInput(typeVal);

    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${safeSubject}`);
    const mailtoBody = encodeURIComponent(`Name: ${safeName}\nEmail: ${safeEmail}\nInquiry type: ${safeType}\n\nMessage:\n${safeMessage}`);

    const targetEmail = "junalvior.dev@gmail.com";
    const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    const toast = document.getElementById("contact-success-toast");
    if (toast) toast.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 500);
  });
});

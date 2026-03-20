// =============================================
// Quote Maker Logic
// =============================================
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("quote-form");
  const startBtn = document.getElementById("start-quote-btn");
  const modal = document.getElementById("quote-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalContainer = document.getElementById("modal-container");
  const closeModalBtn = document.getElementById("close-modal-btn");

  const nextBtn = document.getElementById("next-step-btn");
  const prevBtn = document.getElementById("prev-step-btn");
  const stepIndicator = document.getElementById("step-indicator");
  const steps = document.querySelectorAll(".form-step");

  const checkboxes = document.querySelectorAll(".quote-item");
  const selects = document.querySelectorAll(".quote-select");
  const onetimeTotalEl = document.getElementById("onetime-total");
  const monthlyTotalEl = document.getElementById("monthly-total");
  const currencyToggle = document.getElementById("currency-toggle");
  const toggleDot = currencyToggle?.querySelector("span");
  const labelUSDT = document.getElementById("currency-label-USDT");
  const labelPhp = document.getElementById("currency-label-php");
  const currencyCode = document.getElementById("currency-code");
  const priceCells = document.querySelectorAll(".price-cell");
  const rateInfo = document.getElementById("exchange-rate-info");

  const submitBtn = document.getElementById("submit-quote-btn");
  const btnText = document.getElementById("btn-text");
  const btnSpinner = document.getElementById("btn-spinner");
  const feedbackEl = document.getElementById("quote-feedback");

  let currentStep = 1;
  const totalSteps = steps.length;
  let conversionRate = 56; // Default fallback
  let isPhp = true; // Default to PHP

  // Fetch real-time rate
  fetch("https://api.exchangerate-api.com/v4/latest/USDT")
    .then((response) => response.json())
    .then((data) => {
      conversionRate = data.rates.PHP;
      console.log("Current USDT to PHP rate:", conversionRate);
      calculateTotals(); // Refresh with new rate
    })
    .catch((error) => {
      console.error("Error fetching exchange rate:", error);
      if (rateInfo) rateInfo.innerHTML += " (Using fallback rate)";
    });

  // --- Modal Logic ---
  const openModal = () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      modalBackdrop.classList.remove("opacity-0");
      modalContainer.classList.remove("scale-95", "opacity-0");
    }, 10);
  };

  const closeModal = () => {
    modalBackdrop.classList.add("opacity-0");
    modalContainer.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }, 300);
  };

  startBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  // --- Multi-Step UI ---
  const updateStepsUI = () => {
    steps.forEach((step) => {
      const stepNum = parseInt(step.dataset.step);
      if (stepNum === currentStep) {
        step.classList.remove("hidden");
        setTimeout(() => step.classList.add("animate-fade-in-up"), 10);
      } else {
        step.classList.add("hidden");
        step.classList.remove("animate-fade-in-up");
      }
    });

    if (stepIndicator)
      stepIndicator.innerText = `Step ${currentStep} of ${totalSteps}`;

    if (prevBtn) {
      if (currentStep === 1) prevBtn.classList.add("hidden");
      else prevBtn.classList.remove("hidden");
    }

    if (nextBtn) {
      if (currentStep === totalSteps && totalSteps === 7) {
        nextBtn.classList.add("hidden");
      } else if (currentStep === totalSteps && totalSteps === 6) {
        nextBtn.classList.remove("hidden");
        nextBtn.innerHTML =
          'Review info below <svg class="ml-2 animate-bounce" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>';
      } else {
        nextBtn.classList.remove("hidden");
        nextBtn.innerHTML =
          'Next <svg class="ml-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
      }

      if (currentStep === 7) {
        nextBtn.classList.add("hidden");
      } else {
        nextBtn.classList.remove("hidden");
      }
    }
    modal.scrollTo({ top: 0, behavior: "smooth" });
  };

  nextBtn?.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepsUI();
      saveState();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepsUI();
      saveState();
    }
  });

  // --- Quantity Logic ---
  const setupQtyLogic = () => {
    document.querySelectorAll(".qty-minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const input = e.target.nextElementSibling;
        const card = e.target.closest(".qty-card");
        let val = parseInt(input.value) || 0;
        if (val > 0) {
          input.value = val - 1;
          if (input.value == 0) {
            card.classList.remove(
              "border-wood-accent",
              "ring-1",
              "ring-wood-accent",
              "bg-wood-accent/5",
              "dark:bg-wood-accent/10",
            );
            card
              .querySelector(".card-icon")
              .classList.remove("text-wood-accent");
          }
          calculateTotals();
          saveState();
        }
      });
    });

    document.querySelectorAll(".qty-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const input = e.target.previousElementSibling;
        const card = e.target.closest(".qty-card");
        let val = parseInt(input.value) || 0;
        input.value = val + 1;
        card.classList.add(
          "border-wood-accent",
          "ring-1",
          "ring-wood-accent",
          "bg-wood-accent/5",
          "dark:bg-wood-accent/10",
        );
        card.querySelector(".card-icon").classList.add("text-wood-accent");
        calculateTotals();
        saveState();
      });
    });
  };
  setupQtyLogic();

  // --- Calculations ---
  const formatPrice = (amount, isPhp) => {
    if (isPhp) {
      return "₱" + Math.round(amount).toLocaleString("en-US");
    } else {
      return "$" + amount.toLocaleString("en-US");
    }
  };

  const updateMainTablePrices = (isPhp) => {
    priceCells.forEach((cell) => {
      const min = parseFloat(cell.dataset.min) || 0;
      const max = parseFloat(cell.dataset.max) || 0;
      const hasPlus = cell.dataset.plus === "true";

      if (isPhp) {
        const minPhp = min * conversionRate;
        const maxPhp = max * conversionRate;
        cell.innerText = `${formatPrice(minPhp, true)} – ${formatPrice(maxPhp, true)}${hasPlus ? "+" : ""}`;
      } else {
        cell.innerText = `${formatPrice(min, false)} – ${formatPrice(max, false)}${hasPlus ? "+" : ""}`;
      }
    });

    if (currencyCode) currencyCode.innerText = isPhp ? "(PHP)" : "(USDT)";

    // Update Labels
    if (isPhp) {
      labelPhp?.classList.remove("text-gray-500");
      labelPhp?.classList.add("text-gray-900", "dark:text-white", "font-bold");
      labelUSDT?.classList.add("text-gray-500");
      labelUSDT?.classList.remove(
        "text-gray-900",
        "dark:text-white",
        "font-bold",
      );
    } else {
      labelUSDT?.classList.remove("text-gray-500");
      labelUSDT?.classList.add("text-gray-900", "dark:text-white", "font-bold");
      labelPhp?.classList.add("text-gray-500");
      labelPhp?.classList.remove(
        "text-gray-900",
        "dark:text-white",
        "font-bold",
      );
    }
  };

  const calculateTotals = () => {
    isPhp = currencyToggle?.classList.contains("bg-wood-accent") ?? true;
    let otPhp = 0,
      otUSDT = 0,
      mPhp = 0,
      mUSDT = 0;

    const currentCheckboxes = document.querySelectorAll(".quote-item");
    currentCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const pPhp = parseFloat(cb.dataset.pricePhp) || 0;
        const pUSDT = parseFloat(cb.dataset.priceUsdt) || 0;
        if (cb.dataset.type === "onetime") {
          otPhp += pPhp;
          otUSDT += pUSDT;
        } else {
          mPhp += pPhp;
          mUSDT += pUSDT;
        }
      }
    });

    document.querySelectorAll(".quote-qty-input").forEach((input) => {
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        otPhp += (parseFloat(input.dataset.pricePhp) || 0) * qty;
        otUSDT += (parseFloat(input.dataset.priceUsdt) || 0) * qty;
      }
    });

    const currentSelects = document.querySelectorAll(".quote-select");
    currentSelects.forEach((select) => {
      const opt = select.options[select.selectedIndex];
      if (opt) {
        mPhp += parseFloat(opt.value) || 0;
        mUSDT += parseFloat(opt.dataset.usdt) || 0;
      }
    });

    if (onetimeTotalEl)
      onetimeTotalEl.innerText = formatPrice(isPhp ? otPhp : otUSDT, isPhp);
    if (monthlyTotalEl)
      monthlyTotalEl.innerHTML =
        formatPrice(isPhp ? mPhp : mUSDT, isPhp) +
        '<span class="text-xs text-white/70">/mo</span>';

    document.querySelectorAll(".price-display").forEach((display) => {
      const php = parseFloat(display.dataset.basePhp) || 0;
      const usdt = parseFloat(display.dataset.baseUsdt) || 0;
      const isM =
        (display.dataset.basePhp &&
          display.closest(".qty-card")?.querySelector(".quote-select")) ||
        display.innerText.includes("/mo");
      display.innerText =
        formatPrice(isPhp ? php : usdt, isPhp) + (isM ? "/mo" : "");
    });

    updateMainTablePrices(isPhp);
  };

  const syncModalCurrencyUI = (isPhp) => {
    const modalCurrencyBtns = document.querySelectorAll(".modal-currency-btn");
    modalCurrencyBtns.forEach((btn) => {
      if (
        (btn.dataset.currency === "PHP" && isPhp) ||
        (btn.dataset.currency === "USDT" && !isPhp)
      ) {
        btn.classList.add("bg-wood-accent", "text-white");
        btn.classList.remove(
          "text-gray-500",
          "hover:text-gray-700",
          "dark:hover:text-gray-300",
        );
      } else {
        btn.classList.remove("bg-wood-accent", "text-white");
        btn.classList.add(
          "text-gray-500",
          "hover:text-gray-700",
          "dark:hover:text-gray-300",
        );
      }
    });
  };

  // --- State Persistence ---
  const saveState = () => {
    const currentCheckboxes = document.querySelectorAll(".quote-item");
    const currentSelects = document.querySelectorAll(".quote-select");
    const state = {
      currentStep,
      name: document.getElementById("client-name").value,
      email: document.getElementById("client-email").value,
      details: document.getElementById("client-details").value,
      checkboxes: Array.from(currentCheckboxes).map((cb) => cb.checked),
      selects: Array.from(currentSelects).map((s) => s.selectedIndex),
      qtys: Array.from(document.querySelectorAll(".quote-qty-input")).map(
        (i) => parseInt(i.value) || 0,
      ),
    };
    localStorage.setItem("quoteMakerProgress", JSON.stringify(state));
  };

  const loadState = () => {
    try {
      const saved = localStorage.getItem("quoteMakerProgress");
      if (!saved) return;
      const state = JSON.parse(saved);
      currentStep = state.currentStep || 1;
      if (state.name) document.getElementById("client-name").value = state.name;
      if (state.email)
        document.getElementById("client-email").value = state.email;
      if (state.details)
        document.getElementById("client-details").value = state.details;

      const currentCheckboxes = document.querySelectorAll(".quote-item");
      state.checkboxes?.forEach((c, i) => {
        if (currentCheckboxes[i]) currentCheckboxes[i].checked = c;
      });

      const currentSelects = document.querySelectorAll(".quote-select");
      state.selects?.forEach((s, i) => {
        if (currentSelects[i]) currentSelects[i].selectedIndex = s;
      });

      const currentQtys = document.querySelectorAll(".quote-qty-input");
      state.qtys?.forEach((q, i) => {
        const input = currentQtys[i];
        if (input) {
          input.value = q;
          if (q > 0) {
            const card = input.closest(".qty-card");
            card.classList.add(
              "border-wood-accent",
              "ring-1",
              "ring-wood-accent",
              "bg-wood-accent/5",
              "dark:bg-wood-accent/10",
            );
            card.querySelector(".card-icon").classList.add("text-wood-accent");
          }
        }
      });
      updateStepsUI();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Event Listeners ---
  document.querySelectorAll(".quote-item").forEach((cb) =>
    cb.addEventListener("change", () => {
      calculateTotals();
      saveState();
    }),
  );
  document.querySelectorAll(".quote-select").forEach((s) =>
    s.addEventListener("change", () => {
      calculateTotals();
      saveState();
    }),
  );
  ["client-name", "client-email", "client-details"].forEach((id) =>
    document.getElementById(id)?.addEventListener("input", saveState),
  );

  currencyToggle?.addEventListener("click", () => {
    // Simple toggle state change
    if (currencyToggle.classList.contains("bg-wood-accent")) {
      currencyToggle.classList.remove("bg-wood-accent");
      currencyToggle.classList.add("bg-gray-200", "dark:bg-gray-700");
      toggleDot?.classList.remove("translate-x-5");
    } else {
      currencyToggle.classList.add("bg-wood-accent");
      currencyToggle.classList.remove("bg-gray-200", "dark:bg-gray-700");
      toggleDot?.classList.add("translate-x-5");
    }

    isPhp = currencyToggle.classList.contains("bg-wood-accent");
    syncModalCurrencyUI(isPhp);
    calculateTotals();
  });

  const modalCurrencyBtns = document.querySelectorAll(".modal-currency-btn");
  modalCurrencyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPhp = btn.dataset.currency === "PHP";
      const currentPhp = currencyToggle.classList.contains("bg-wood-accent");

      if (targetPhp !== currentPhp) {
        currencyToggle.click();
      }
    });
  });

  // --- Firebase Integration ---
  const firebaseConfig = {
    apiKey: "AIzaSyBSYzDOKMkVPYq8zC_AkKgGg_UpfVbEUpY",
    authDomain: "quick-portfolio-ce7e0.firebaseapp.com",
    projectId: "quick-portfolio-ce7e0",
    storageBucket: "quick-portfolio-ce7e0.firebasestorage.app",
    messagingSenderId: "417677673450",
    appId: "1:417677673450:web:6c8ca2361d8e0cad93e893",
    measurementId: "G-RVT3NFCNJT",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btnText.classList.add("opacity-0");
    btnSpinner.classList.remove("hidden");
    submitBtn.disabled = true;
    feedbackEl.classList.add("hidden");

    const isPhp = currencyToggle.classList.contains("bg-wood-accent");
    const selectedItems = [];

    document.querySelectorAll(".quote-item").forEach((cb) => {
      if (cb.checked) {
        const label = cb
          .closest("label")
          .querySelector(".item-label").innerText;
        selectedItems.push({
          item: label,
          price: parseFloat(cb.dataset.pricePhp),
        });
      }
    });

    document.querySelectorAll(".quote-qty-input").forEach((inp) => {
      const qty = parseInt(inp.value) || 0;
      if (qty > 0) {
        const label = inp
          .closest(".qty-card")
          .querySelector(".item-label").innerText;
        const price = parseFloat(inp.dataset.pricePhp);
        selectedItems.push({
          item: `${label} (x${qty})`,
          price: price * qty,
          qty,
        });
      }
    });

    document.querySelectorAll(".quote-select").forEach((s) => {
      const opt = s.options[s.selectedIndex];
      if (s.selectedIndex > 0) {
        selectedItems.push({
          item: opt.innerText.split("(")[0].trim(),
          price: parseFloat(opt.value),
          type: "monthly",
        });
      }
    });

    try {
      await addDoc(collection(db, "quotes"), {
        clientName: document.getElementById("client-name").value,
        clientEmail: document.getElementById("client-email").value,
        projectDetails: document.getElementById("client-details").value,
        currency: "PHP",
        items: selectedItems,
        timestamp: serverTimestamp(),
      });
      feedbackEl.innerText = "Quote submitted successfully!";
      feedbackEl.className =
        "mt-3 text-sm text-center font-bold text-green-400 p-3";
      feedbackEl.classList.remove("hidden");
      form.reset();
      localStorage.removeItem("quoteMakerProgress");
      calculateTotals();
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error(error);
      feedbackEl.innerText = "Error submitting quote. Please try again.";
      feedbackEl.className =
        "mt-3 text-sm text-center font-bold text-red-400 p-3";
      feedbackEl.classList.remove("hidden");
    } finally {
      btnText.classList.remove("opacity-0");
      btnSpinner.classList.add("hidden");
      submitBtn.disabled = false;
    }
  });

  // Init
  isPhp = currencyToggle?.classList.contains("bg-wood-accent") ?? true;
  syncModalCurrencyUI(isPhp);
  loadState();
  calculateTotals();
  updateStepsUI();
});

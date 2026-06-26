import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);

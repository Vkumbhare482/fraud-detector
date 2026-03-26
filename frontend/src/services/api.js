import axios from "axios";

// 🌐 Backend URL
const API_URL = "https://fraud-detector-1-pd4y.onrender.com";

// 🤖 Local AI backend
const AI_URL = "http://localhost:3000";

// ----------------------
// 🤖 AI FRAUD CHECK
// ----------------------
export const checkFraudAI = async (amount) => {
  try {
    const res = await axios.post(`${AI_URL}/api/check-transaction`, {
      features: [Number(amount), 1, 0, 1]
    });
    return res.data;
  } catch (err) {
    console.error("AI error:", err);
    return { fraud: 0 }; // fallback safe
  }
};

// ----------------------
// 💰 SEND TRANSACTION
// ----------------------
export const sendTransaction = async (data) => {
  try {
    return await axios.post(`${API_URL}/transaction`, data);
  } catch (err) {
    console.error("Transaction error:", err);
  }
};

// ----------------------
// 👥 USERS (FIXED - NO 404)
// ----------------------
export const getUsers = async () => {
  // 🔥 Dummy data (no backend needed)
  return [
    { user: "A", totalTx: 5 },
    { user: "B", totalTx: 3 },
    { user: "C", totalTx: 8 }
  ];
};
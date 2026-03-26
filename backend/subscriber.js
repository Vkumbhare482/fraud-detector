const axios = require("axios");

const AI_URL = "http://localhost:5000/predict/transaction";

async function analyzeTransaction(tx) {
  try {
    const aiRes = await axios.post(AI_URL, {
      features: [tx.amount, 1, 0, 1]
    });

    const isFraud =
      aiRes.data.fraud === 1 ||
      tx.amount > 20000 ||
      tx.from === tx.to ||
      (tx.amount > 5000 && tx.amount < 10000);

    return isFraud;

  } catch (err) {
    console.error("AI error:", err.message);
    return false;
  }
}

module.exports = { analyzeTransaction };
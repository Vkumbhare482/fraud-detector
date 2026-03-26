const axios = require("axios");

const users = ["A", "B", "C", "D"];

setInterval(async () => {
  const tx = {
    from: users[Math.floor(Math.random() * users.length)],
    to: users[Math.floor(Math.random() * users.length)],
    amount: Math.floor(Math.random() * 30000)
  };

  try {
    await axios.post("http://localhost:3000/transaction", tx);
    console.log("Generated:", tx);
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}, 2000);
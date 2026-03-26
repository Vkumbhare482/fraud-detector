const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

app.post("/transaction", (req, res) => {
  const { from, to, amount } = req.body;

  // 🔥 SIMPLE TEST FRAUD (no confusion)
  const fraud = amount > 20000;

  const tx = { from, to, amount, fraud };

  console.log("🔥 EMITTING:", tx);

  io.emit("newTransaction", tx);

  res.json({ success: true });
});

server.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
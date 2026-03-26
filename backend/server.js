const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ✅ socket setup (FIXED)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// ✅ Debug socket connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Fraud Detection Backend is Running!");
});

// ✅ TRANSACTION API
app.post("/transaction", (req, res) => {
  const { from, to, amount } = req.body;

  const fraud = amount > 20000;

  const tx = { from, to, amount, fraud };

  console.log("🔥 EMITTING:", tx);

  io.emit("newTransaction", tx);

  res.json({ success: true });
});

// ✅ PORT FIX
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
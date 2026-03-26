import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ForceGraph2D from "react-force-graph-2d";

const socket = io("http://localhost:3000");

function App() {
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: []
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    fraud: 0,
    safe: 0
  });

  // 🔥 SOCKET LISTENER (ONLY ONCE)
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to backend");
    });

    socket.on("newTransaction", (data) => {
      console.log("🔥 RECEIVED:", data);

      // stats update
      setStats((prev) => ({
        total: prev.total + 1,
        fraud: data.fraud ? prev.fraud + 1 : prev.fraud,
        safe: !data.fraud ? prev.safe + 1 : prev.safe
      }));

      // graph update
      setGraphData((prev) => {
        const nodes = [...prev.nodes];
        const links = [...prev.links];

        if (!nodes.some(n => n.id === data.from)) {
          nodes.push({ id: data.from });
        }

        if (!nodes.some(n => n.id === data.to)) {
          nodes.push({ id: data.to });
        }

        links.push({
          source: data.from,
          target: data.to,
          color: data.fraud ? "red" : "green"
        });

        return { nodes, links };
      });

      setStatus(data.fraud ? "🚨 Fraud Detected" : "✅ Safe");
    });

    return () => socket.off("newTransaction"); // 🔥 important fix
  }, []);

  // 🚀 manual transaction
  const handleSubmit = async () => {
    await fetch("http://localhost:3000/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        amount: Number(amount)
      })
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT PANEL */}
      <div style={{
        width: "300px",   // 🔥 fixed width
        padding: "20px",
        background: "#0f172a",
        color: "white"
      }}>
        <h2>💰 Fraud Detection</h2>

        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={buttonStyle}>
          🚀 Send Transaction
        </button>

        <h3>Status:</h3>
        <p style={{
          color: status.includes("Fraud") ? "red" : "lightgreen"
        }}>
          {status}
        </p>

        <h3>📊 Stats</h3>
        <p>Total: {stats.total}</p>
        <p>Fraud: {stats.fraud}</p>
        <p>Safe: {stats.safe}</p>
      </div>

      {/* GRAPH */}
      <div style={{ flex: 1 }}>
        <ForceGraph2D
          graphData={graphData}
          backgroundColor="#020617"
          linkColor={(link) => link.color || "gray"}

          nodeCanvasObject={(node, ctx, scale) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "#22c55e";
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.font = `${12 / scale}px Sans-Serif`;
            ctx.fillText(node.id, node.x + 8, node.y + 8);
          }}
        />
      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default App;
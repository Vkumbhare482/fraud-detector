import React, { useState, useEffect } from "react";
import axios from "axios";
import ForceGraph2D from "react-force-graph-2d";
import { RadialBarChart, RadialBar } from "recharts";
import { io } from "socket.io-client";

// 🔥 IMPORTANT: Replace with your Render backend URL
const API_URL = "https://fraud-detector-1-pd4y.onrender.com";

const socket = io(API_URL);

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [riskScore, setRiskScore] = useState(0);
  const [users, setUsers] = useState([]);

  const [graphData, setGraphData] = useState({
    nodes: [],
    links: []
  });

  // 🔴 Live transaction updates
  useEffect(() => {
    socket.on("newTransaction", (data) => {
      setGraphData((prev) => {
        const nodes = [...prev.nodes];
        const links = [...prev.links];

        // Avoid duplicate nodes
        if (!nodes.find(n => n.id === data.from)) {
          nodes.push({ id: data.from });
        }
        if (!nodes.find(n => n.id === data.to)) {
          nodes.push({ id: data.to });
        }

        links.push({ source: data.from, target: data.to });

        return { nodes, links };
      });
    });

    return () => socket.disconnect();
  }, []);

  // 👥 Dashboard users
  useEffect(() => {
    axios.get(`${API_URL}/dashboard`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🚀 Send transaction
  const handleSubmit = async () => {
    try {
      setStatus("Processing...");

      const res = await axios.post(`${API_URL}/transaction`, {
        from,
        to,
        amount: Number(amount)
      });

      setStatus(res.data.status);
      setRiskScore(res.data.riskScore);

    } catch (err) {
      console.error(err);
      setStatus("Error ❌");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT PANEL */}
      <div style={{
        width: "30%",
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

        {/* STATUS */}
        <h3>Status:</h3>
        <p style={{
          color: riskScore > 70 ? "red" : "lightgreen",
          fontWeight: "bold"
        }}>
          {status}
        </p>

        {/* RISK */}
        <h3>Risk Score:</h3>
        <RadialBarChart
          width={200}
          height={200}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          data={[{ value: riskScore }]}
        >
          <RadialBar dataKey="value" />
        </RadialBarChart>

        <p>{riskScore}/100</p>

        {/* USERS */}
        <h3>👥 Users</h3>
        {users.map((u, i) => (
          <div key={i}>
            👤 {u.user} - {u.totalTx}
          </div>
        ))}
      </div>

      {/* GRAPH */}
      <div style={{ flex: 1 }}>
        <ForceGraph2D
          graphData={graphData}
          backgroundColor="#020617"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;

            ctx.fillStyle = riskScore > 70 ? "red" : "#22c55e";
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.fillText(label, node.x + 8, node.y + 8);
          }}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
        />
      </div>

    </div>
  );
}

// 🎨 Styles
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
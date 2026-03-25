import React, { useState } from "react";
import axios from "axios";
import ForceGraph2D from "react-force-graph-2d";
import { RadialBarChart, RadialBar } from "recharts";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [riskScore, setRiskScore] = useState(0);

  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus("Processing...");

      const res = await axios.post(
        "http://127.0.0.1:3000/transaction",
        {
          from,
          to,
          amount: Number(amount),
        }
      );

      setStatus(res.data.status);
      setRiskScore(res.data.riskScore);

      setGraphData((prev) => ({
        nodes: [
          ...prev.nodes,
          { id: from },
          { id: to },
        ],
        links: [
          ...prev.links,
          { source: from, target: to },
        ],
      }));

    } catch (err) {
      console.error(err);
      setStatus("Error ❌");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAVBAR */}
      <div style={{
        background: "#020617",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2>🛡 Fraud Detection System</h2>
        <div>🔔 👤</div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* SIDEBAR */}
        <div style={{
          width: "200px",
          background: "#0f172a",
          color: "white",
          padding: "20px"
        }}>
          <p>📊 Dashboard</p>
          <p>🔁 Transactions</p>
          <p>⚠ Alerts</p>
          <p>⚙ Settings</p>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", background: "#020617" }}>

          {/* FORM */}
          <div style={{ width: "30%", padding: "20px", color: "white" }}>
            <h3>💰 New Transaction</h3>

            <form onSubmit={handleSubmit}>
              <input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle}/>
              <input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle}/>
              <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={inputStyle}/>

              <button type="submit" style={buttonStyle}>🚀 Send</button>
            </form>

            <h4>Status:</h4>
            <p style={{
              color: riskScore === 100 ? "red" : "lightgreen",
              fontWeight: "bold"
            }}>
              {status}
            </p>

            {/* Risk Chart */}
            <h4>Risk Score:</h4>

            <RadialBarChart
              width={200}
              height={200}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              data={[{ name: "risk", value: riskScore }]}
            >
              <RadialBar dataKey="value" />
            </RadialBarChart>

            <p style={{ color: riskScore > 70 ? "red" : "lightgreen" }}>
              {riskScore} / 100
            </p>
          </div>

          {/* GRAPH */}
          <div style={{ flex: 1 }}>
            <ForceGraph2D
              graphData={graphData}
              backgroundColor="#020617"
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;

                ctx.fillStyle = riskScore === 100 ? "red" : "#22c55e";
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
      </div>

      {/* FOOTER */}
      <div style={{
        background: "#020617",
        color: "gray",
        textAlign: "center",
        padding: "10px"
      }}>
        © 2026 Fraud Detector 💀
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
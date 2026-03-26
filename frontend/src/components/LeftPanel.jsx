import React from "react";

function LeftPanel({
  from,
  to,
  amount,
  setFrom,
  setTo,
  setAmount,
  handleSubmit,
  status,
  users
}) {
  return (
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

      <h3>Status:</h3>
      <p>{status}</p>

      {/* ✅ SAFE USERS MAP */}
      <h3>Users</h3>
      {(users || []).map((u, i) => (
        <div key={i}>
          👤 {u.user} - {u.totalTx}
        </div>
      ))}
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

export default LeftPanel;
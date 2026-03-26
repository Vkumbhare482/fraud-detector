import React, { useState } from "react";

function FraudChecker() {
  const [result, setResult] = useState(null);

  const checkTransaction = async () => {
    const res = await fetch("http://localhost:3000/api/check-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features: [5000, 1, 0, 1], // example
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fraud Detection System 🚀</h2>

      <button onClick={checkTransaction}>
        Check Transaction
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          {result.fraud === 1 ? (
            <h3 style={{ color: "red" }}>🚨 Fraud Detected</h3>
          ) : (
            <h3 style={{ color: "green" }}>✅ Safe Transaction</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default FraudChecker;
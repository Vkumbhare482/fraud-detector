const express = require("express");
const neo4j = require("neo4j-driver");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD
  )
);

app.post("/transaction", async (req, res) => {
  const { from, to, amount } = req.body;

  const session = driver.session();

  try {
    // Insert transaction
    await session.run(
      `
      MERGE (a:Account {name: $from})
      MERGE (b:Account {name: $to})
      CREATE (a)-[:TRANSFER {amount: $amount}]->(b)
      `,
      { from, to, amount }
    );

    // 🔹 Chain Fraud Detection
    const chainResult = await session.run(`
      MATCH path = (a:Account)-[:TRANSFER*3..5]->(b:Account)
      RETURN path LIMIT 1
    `);

    // 🔹 Circular Fraud Detection
    const circularResult = await session.run(`
      MATCH path = (a:Account)-[:TRANSFER*2..6]->(a)
      RETURN path LIMIT 1
    `);

    // 🔹 Risk Logic
    let riskScore = 20;
    let status = "Transaction Safe ✅";

    if (chainResult.records.length > 0) {
      riskScore = 60;
      status = "Layering Fraud 🚨";
    }

    if (circularResult.records.length > 0) {
      riskScore = 100;
      status = "Circular Fraud 🚨🔄";
    }

    res.json({ status, riskScore });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error ❌" });
  } finally {
    await session.close();
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});
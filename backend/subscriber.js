const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD
  )
);

const session = driver.session();

async function addTransaction(from, to, amount) {
  await session.run(`
    MERGE (a:Account {name: $from})
    MERGE (b:Account {name: $to})
    CREATE (a)-[:TRANSFER {amount: $amount}]->(b)
  `, { from, to, amount });

  console.log("✅ Transaction added");

  await detectFraud();
}

async function detectFraud() {
  const result = await session.run(`
    MATCH path = (a:Account)-[:TRANSFER*3..5]->(b:Account)
    RETURN path
  `);

  if (result.records.length > 0) {
    console.log("🚨 Fraud detected!");
  } else {
    console.log("✅ No fraud");
  }
}

// test call
addTransaction("A", "B", 500);
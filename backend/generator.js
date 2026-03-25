const { PubSub } = require('@google-cloud/pubsub');

// PubSub client
const pubsub = new PubSub({
  projectId: "fraud-detector-491306"
});

const topic = pubsub.topic('transactions-topic');

// Fake users
const users = ["A", "B", "C", "D", "E", "F"];

// Generate transaction
function generateTransaction() {
  return {
    sender: users[Math.floor(Math.random() * users.length)],
    receiver: users[Math.floor(Math.random() * users.length)],
    amount: Math.floor(Math.random() * 10000),
    time: new Date().toISOString()
  };
}

// Send transaction
async function sendTransaction() {
  const data = generateTransaction();
  const buffer = Buffer.from(JSON.stringify(data));

  try {
    await topic.publish(buffer);
    console.log("📤 Sent:", data);
  } catch (error) {
    console.error("❌ Publish Error:", error);
  }
}

// Send every 2 sec
setInterval(sendTransaction, 2000);
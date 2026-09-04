import { processDrop } from "./agent";
import { DropEvent } from "./types";
import failures from "./transaction.json";

async function run() {
  console.log("Starting Recovery Sequencer Batch Run...\n");

  const results = await Promise.all(
    (failures as DropEvent[]).map(item => processDrop(item))
  );

  results.forEach(result => {
    console.log(`[${result.action}] Transaction: ${result.transactionId}`);
    console.log(`Audit: ${JSON.stringify(result, null, 2)}\n`);
  });
}

run();
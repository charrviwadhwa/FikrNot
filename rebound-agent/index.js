"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
const transaction_json_1 = __importDefault(require("./transaction.json"));
async function run() {
    console.log("Starting Recovery Sequencer Batch Run...\n");
    for (const item of transaction_json_1.default) {
        const result = await (0, agent_1.processDrop)(item);
        console.log(`[${result.action}] Transaction: ${item.transactionId}`);
        console.log(`Audit: ${JSON.stringify(result, null, 2)}\n`);
    }
}
run();

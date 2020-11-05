const fs = require("fs");

/**
 * Read finanical list from data.json
 */
const data = fs.readFileSync("data.json", "utf-8");
const dataObj = JSON.parse(data);
const financialList = dataObj && dataObj.data;

/**
 * Check if finanical list exist and print results
 */
if (financialList) {
} else {
  console.error("Finanical list not found.");
}

const fs = require("fs");
const sumBy = require("lodash/sumBy");

/**
 * Function to calculate sum of total_value in the list,
 * and filter by category if exist
 * @param {Array} list
 * @param {String} category
 */
const calcTotalValue = (list, category = "") => {
  const calcList = category
    ? list.filter((el) => el.account_category === category)
    : list;

  return sumBy(calcList, "total_value");
};

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
  // Print Revenue
  console.log(`Revenue: $${calcTotalValue(financialList, "revenue")}`);
  // Print Expenses
  console.log(`Expenses: $${calcTotalValue(financialList, "expense")}`);
} else {
  console.error("Finanical list not found.");
}

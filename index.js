const fs = require("fs");
const sumBy = require("lodash/sumBy");

/**
 * Format number to percentage with 1 decimal
 * @param {Number} num
 */
const formatPercentage = (num) => `${(num * 100).toFixed(1)}%`;

/**
 * Function to calculate sum of total_value in the list,
 * and filter by category if exist
 * @param {Array} list
 * @param {String} category
 */
const getTotalValueByCategory = (list, category = "") => {
  const calcList = category
    ? list.filter((el) => el.account_category === category)
    : list;

  return sumBy(calcList, "total_value");
};

/**
 * Function to calculate gorss profit margin according to
 * finanical list and total revenue
 * @param {Array} list
 * @param {Number} revenue
 */
const calcGrossProfitMargin = (list, revenue) => {
  const salesDebitList = list.filter(
    (el) => el.account_type === "sales" && el.value_type === "debit"
  );
  const salesDebitAmount = getTotalValueByCategory(salesDebitList);

  return salesDebitAmount / revenue;
};

/**
 * Function to calculate net profit margin by expenses and revenue
 * @param {Number} expenses
 * @param {Number} revenue
 */
const calcNetProfitMargin = (expenses, revenue) => {
  return (revenue - expenses) / revenue;
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
  const revenueTotal = getTotalValueByCategory(financialList, "revenue");
  const expenseTotal = getTotalValueByCategory(financialList, "expense");
  const grossProfitMargin = calcGrossProfitMargin(financialList, revenueTotal);
  const netProfitMargin = calcNetProfitMargin(expenseTotal, revenueTotal);

  // Print Revenue
  console.log(`Revenue: $${revenueTotal}`);
  // Print Expenses
  console.log(`Expenses: $${expenseTotal}`);
  // Print Gross Profit Margin
  console.log(`Gross Profit Margin: ${formatPercentage(grossProfitMargin)}`);
  // Print Net Profit Margin
  console.log(`Net Profit Margin: ${formatPercentage(netProfitMargin)}`);
} else {
  console.error("Finanical list not found.");
}

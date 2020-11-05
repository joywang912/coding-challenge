const fs = require("fs");
const sumBy = require("lodash/sumBy");
const isArray = require("lodash/isArray");

/**
 * Function to format number to percentage with 1 decimal
 * @param {Number} num
 */
const formatPercentage = (num) => `${(num * 100).toFixed(1)}%`;

/**
 * Funcion to format dollar value with comma, and remove cents
 * @param {Number} num
 */
const dollarFormat = (num) => {
  const parts = num.toString().split(".");
  let result = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${result}`;
};

/**
 * Function to get sum of total_value in the list,
 * which filter by category, valueType, accountType if exist
 * @param {Array} list
 * @param {String} category
 * @param {String} valueType
 * @param {String | Array<String>} accountType
 */
const getTotalValue = (
  list,
  category = "",
  valueType = "",
  accountType = ""
) => {
  let calcList = category
    ? list.filter((el) => el.account_category === category)
    : list;

  if (valueType) {
    calcList = calcList.filter((el) => el.value_type === valueType);
  }

  if (accountType && accountType.length) {
    calcList = calcList.filter((el) => {
      return isArray(accountType)
        ? accountType.indexOf(el.account_type) > -1
        : el.account_type === accountType;
    });
  }

  return sumBy(calcList, "total_value");
};

/**
 * Function to calculate pecentage of gorss profit margin according to
 * finanical list and total revenue
 * @param {Array} list
 * @param {Number} revenue
 */
const getGrossProfitMarginPct = (list, revenue) => {
  const salesDebitAmount = getTotalValue(list, null, "debit", "sales");
  const grossProfitMargin = salesDebitAmount / revenue;
  return formatPercentage(grossProfitMargin);
};

/**
 * Function to calculate pecentage of net profit margin by expenses and revenue
 * @param {Number} expenses
 * @param {Number} revenue
 */
const getNetProfitMarginPct = (expenses, revenue) => {
  const netProfitMargin = (revenue - expenses) / revenue;
  return formatPercentage(netProfitMargin);
};

/**
 * Function to calculate pecentage of working Capital by finanical list
 * @param {Array} list
 */
const getWorkingCapitalRatioPct = (list) => {
  const assetsAccoutTypes = ["current", "bank", "current_accounts_receivable"];
  const liabilityAccountTypes = ["current", "current_accounts_payable"];
  const assetsDebit = getTotalValue(list, "assets", "debit", assetsAccoutTypes);
  const assetsCredit = getTotalValue(
    list,
    "assets",
    "credit",
    assetsAccoutTypes
  );
  const liabilityDebit = getTotalValue(
    list,
    "liability",
    "debit",
    liabilityAccountTypes
  );
  const liabilityCredit = getTotalValue(
    list,
    "liability",
    "credit",
    liabilityAccountTypes
  );
  const workingCapitRatio =
    (assetsDebit - assetsCredit) / (liabilityCredit - liabilityDebit);
  return formatPercentage(workingCapitRatio);
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
  const revenueTotal = getTotalValue(financialList, "revenue");
  const expenseTotal = getTotalValue(financialList, "expense");

  // Print Revenue
  console.log(`Revenue: ${dollarFormat(revenueTotal)}`);

  // Print Expenses
  console.log(`Expenses: ${dollarFormat(expenseTotal)}`);

  // Print Gross Profit Margin
  console.log(
    `Gross Profit Margin: ${getGrossProfitMarginPct(
      financialList,
      revenueTotal
    )}`
  );

  // Print Net Profit Margin
  console.log(
    `Net Profit Margin: ${getNetProfitMarginPct(expenseTotal, revenueTotal)}`
  );

  // Print Working Capital Ratio
  console.log(
    `Working Capital Ratio: ${getWorkingCapitalRatioPct(financialList)}`
  );
} else {
  console.error("Finanical list not found.");
}

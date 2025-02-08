import BalanceSheet from "../models/BalanceSheet";

export async function getBalanceSheets(userId) {
  try {
    const res = await BalanceSheet.find({ user: userId }).lean();
    return res;
  } catch (error) {
    console.log(error.message);
  }
}

export async function insertBalanceSheet(balanceSheetData) {
  try {
    const newEntry = new BalanceSheet(balanceSheetData);
    const savedEntry = await newEntry.save();
    console.log("Balance Sheet successfully inserted!");
    return savedEntry;
  } catch (error) {
    console.log("Error inserting Balance Sheet:", error);
    throw error;
  }
}

import BalanceSheet from "../models/BalanceSheet";


export async function insertBalanceSheet(balanceSheetData) {
    try {
      const newEntry = new BalanceSheet(balanceSheetData);
      const savedEntry = await newEntry.save();
      console.log("Balance Sheet successfully inserted!");
      return savedEntry;
    } catch (error) {
      console.error("Error inserting Balance Sheet:", error);
      throw error;
    }
}

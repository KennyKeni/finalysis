
import { insertBalanceSheet } from "@/db/actions/json";
import { connectToDatabase } from "@/db/dbClient";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  const session = await getSession(req, res);
  console.log("Session:", session);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.sub;

  const balanceSheetData = {
    user: userId,
    companyName: "WORKDAY, INC.",
    tickerSymbol: "WDAY",
    companyType: "public",
    filingType: "10-Q",
    filingDate: "2024-10-31",
    fiscalYearStart: "2024-02-01",
    period: "Q3",
    currency: "USD",
    assets: {
      totalAssets: 16424000000.0,
      currentAssets: {
        cashAndEquivalents: 1311000000.0,
        accountsReceivable: 1404000000.0,
        inventory: null,
        otherCurrentAssets: 273000000.0,
        totalCurrentAssets: 9078000000.0
      },
      nonCurrentAssets: {
        propertyPlantEquipment: 1263000000.0,
        goodwill: 3479000000.0,
        intangibleAssets: 383000000.0,
        longTermInvestments: null,
        otherNonCurrentAssets: 365000000.0,
        totalNonCurrentAssets: 7989000000.0
      }
    },
    liabilities: {
      totalLiabilities: 7800000000.0,
      currentLiabilities: {
        accountsPayable: 74000000.0,
        shortTermDebt: null,
        accruedExpenses: 323000000.0,
        otherCurrentLiabilities: 3551000000.0,
        totalCurrentLiabilities: 4422000000.0
      },
      nonCurrentLiabilities: {
        longTermDebt: 2983000000.0,
        pensionLiabilities: null,
        deferredRevenue: 64000000.0,
        otherNonCurrentLiabilities: 331000000.0,
        totalNonCurrentLiabilities: 3378000000.0
      }
    },
    equity: {
      totalEquity: 8624000000.0,
      commonStock: 0.0,
      retainedEarnings: -1299000000.0,
      additionalPaidInCapital: 11115000000.0,
      treasuryStock: -1208000000.0,
      otherEquity: 16000000.0
    },
    metadata: {
      source: "SEC 10-Q/K or Private Filing",
      extractedAt: new Date(),
    }
  };

  try {
    await connectToDatabase();

    insertBalanceSheet(balanceSheetData)
  } catch (error) {
    console.log("mannnn")
  }

}

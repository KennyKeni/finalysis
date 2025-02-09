import DataCard from "@/components/DataCard";
import DataChart from "@/components/DataChart";

export default function Dashboard() {

  const balanceSheetData = {
    user: "name",
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
      extractedAt: "2025-02-08T09:16:22Z"
    }
  };

  const currAsset = balanceSheetData.assets.currentAssets.totalCurrentAssets

  return (
    <div className="flex flex-col w-full h-full rounded-md bg-white overflow-hidden">
      <div className="flex flex-row w-full h-[5rem] justify-between items-center px-4">
        <div className="w-full">
          Total Balance
          <br/>
          <p className="font-bold">${currAsset}</p>
        </div>
        <div>
          <button className="w-[5rem] h-[2.3rem] rounded-md border-2 bg-white hover:bg-shell">
            Export
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full items-center sm:px-2 sm:h-full">
        <div className="flex flex-row w-full h-[15rem] justify-between items-center flex-wrap sm:flex-nowrap sm:w-full sm:h-[6rem] ">
          <DataCard text={"Total Liabilities"} number={balanceSheetData.liabilities.totalLiabilities}></DataCard>
          <DataCard text={"Total Equity"} number={balanceSheetData.equity.totalEquity}></DataCard>
          <DataCard text={"Retained Earnings"} number={balanceSheetData.equity.retainedEarnings}></DataCard>
        </div>
        <div className="flex flex-row justify-center items-center w-[15rem] h-[15rem] mt-4 sm:w-full">
          <DataChart></DataChart>
        </div>
      </div>
    </div>
  );
}
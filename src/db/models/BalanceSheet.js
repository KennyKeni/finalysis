import mongoose from "mongoose";

const BalanceSheetSchema = new mongoose.Schema({
  user: { type: String, required: true, index: true },
  companyName: { type: String, required: true, index: true }, // Company name
  tickerSymbol: { type: String, default: null }, // Stock ticker (null for private companies)
  companyType: { type: String, enum: ["public", "private"], required: false }, // Public or Private company
  filingType: { type: String, enum: ["10-Q", "10-K", "Private"], required: false }, // Filing type (SEC or private)
  filingDate: { type: Date, required: false }, // Full date of filing (includes year)
	fiscalYearStart: {type: Date, required: false},

  period: { 
	periodType: { type: String, enum: ["Q1", "Q2", "Q3", "Q4", "FY", "Monthly", "Biannual", "Custom"], required: false }, 
	periodStart: { type: Date },
	periodEnd: { type: Date },
  }, 

  currency: { type: String, default: "USD" }, 

	assets: {
		totalAssets: { type: Number, required: false },
		currentAssets: {
			cashAndEquivalents: { type: Number, default: null },
			accountsReceivable: { type: Number, default: null },
			inventory: { type: Number, default: null },
			otherCurrentAssets: { type: Number, default: null },
			totalCurrentAssets: { type: Number, required: true },
		},
		nonCurrentAssets: {
			propertyPlantEquipment: { type: Number, default: null },
			goodwill: { type: Number, default: null },
			intangibleAssets: { type: Number, default: null },
			longTermInvestments: { type: Number, default: null },
			otherNonCurrentAssets: { type: Number, default: null },
			totalNonCurrentAssets: { type: Number, required: false },
		},
	},

	liabilities: {
		totalLiabilities: { type: Number, required: true },
		currentLiabilities: {
			accountsPayable: { type: Number, default: null },
			shortTermDebt: { type: Number, default: null },
			accruedExpenses: { type: Number, default: null },
			otherCurrentLiabilities: { type: Number, default: null },
			totalCurrentLiabilities: { type: Number, required: false },
		},
		nonCurrentLiabilities: {
			longTermDebt: { type: Number, default: null },
			pensionLiabilities: { type: Number, default: null },
			deferredRevenue: { type: Number, default: null },
			otherNonCurrentLiabilities: { type: Number, default: null },
			totalNonCurrentLiabilities: { type: Number, required: false },
		},
	},

	equity: {
		totalEquity: { type: Number, required: true },
		commonStock: { type: Number, default: null },
		retainedEarnings: { type: Number, default: null },
		additionalPaidInCapital: { type: Number, default: null },
		treasuryStock: { type: Number, default: null },
		otherEquity: { type: Number, default: null },
	},

  metadata: {
    source: { type: String, default: "SEC 10-Q/K or Private Filing" },
    extractedAt: { type: Date, default: Date.now },
  },
});

const BalanceSheet = mongoose.models.BalanceSheet || mongoose.model("BalanceSheet", BalanceSheetSchema);

export default BalanceSheet;

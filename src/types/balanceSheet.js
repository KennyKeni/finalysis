// File: FinancialStatementSchema.js
import { SchemaType } from "@google/generative-ai";

// Updated FinancialStatementSchema with enhanced descriptions for 10-Q and 10-K filings

const FinancialStatementSchema = {
  type: SchemaType.OBJECT,
  description: "Comprehensive financial statement data structure for balance sheet and company information",
  properties: {
    companyName: { 
      type: SchemaType.STRING, 
      description: "Full legal name of the company as shown in the document header" 
    },
    tickerSymbol: { 
      type: SchemaType.STRING, 
      description: "Stock market ticker symbol for publicly traded companies (e.g., AAPL for Apple Inc.)" 
    },
    companyType: { 
      type: SchemaType.STRING, 
      enum: ["public", "private"],
      description: "Whether the company is publicly traded or privately held" 
    },
    filingType: { 
      type: SchemaType.STRING, 
      enum: ["10-Q", "10-K", "Private"],
      description: "Type of financial statement filing - 10-Q for quarterly, 10-K for annual reports" 
    },
    filingDate: { 
      type: SchemaType.STRING, 
      description: "Date when the financial statement was filed, in YYYY-MM-DD format" 
    },
    fiscalYearStart: { 
      type: SchemaType.STRING, 
      description: "Start date of the company's fiscal year, in YYYY-MM-DD format" 
    },
    period: {
      type: SchemaType.OBJECT,
      description: "Information about the reporting period covered by the financial statement",
      properties: {
        type: { 
          type: SchemaType.STRING, 
          enum: ["Q1", "Q2", "Q3", "Q4", "FY", "Monthly", "Biannual", "Custom", "null"],
          description: "Type of reporting period (Q1-Q4 for quarters, FY for full year)" 
        },
        periodStart: { 
          type: SchemaType.STRING, 
          description: "Start date of the reporting period in YYYY-MM-DD format" 
        },
        periodEnd: { 
          type: SchemaType.STRING, 
          description: "End date of the reporting period in YYYY-MM-DD format" 
        }
      }
    },
    currency: { 
      type: SchemaType.STRING,
      description: "Currency used in the financial statements (e.g., USD, EUR). $ would be USD" 
    },
    assets: {
      type: SchemaType.OBJECT,
      description: "Complete breakdown of company assets, both current and non-current",
      properties: {
        totalAssets: { 
          type: SchemaType.NUMBER,
          description: "Total value of all assets (must equal total of current + non-current assets)" 
        },
        currentAssets: {
          type: SchemaType.OBJECT,
          description: "Assets expected to be converted to cash within one year",
          properties: {
            cashAndEquivalents: { 
              type: SchemaType.NUMBER,
              description: "Cash and highly liquid investments, including money market funds and short-term government securities" 
            },
            accountsReceivable: { 
              type: SchemaType.NUMBER,
              description: "Money owed to company by customers for goods or services delivered" 
            },
            inventory: { 
              type: SchemaType.NUMBER,
              description: "Value of goods available for sale or raw materials" 
            },
            otherCurrentAssets: { 
              type: SchemaType.NUMBER,
              description: "Any other current assets not categorized above" 
            },
            totalCurrentAssets: { 
              type: SchemaType.NUMBER,
              description: "Sum of all current assets listed above" 
            }
          }
        },
        nonCurrentAssets: {
          type: SchemaType.OBJECT,
          description: "Long-term assets not expected to be converted to cash within a year",
          properties: {
            propertyPlantEquipment: { 
              type: SchemaType.NUMBER,
              description: "Value of physical assets like buildings, machinery, and equipment (net of depreciation)" 
            },
            goodwill: { 
              type: SchemaType.NUMBER,
              description: "Intangible value from acquisitions above book value" 
            },
            intangibleAssets: { 
              type: SchemaType.NUMBER,
              description: "Value of non-physical assets like patents, trademarks, and licenses" 
            },
            longTermInvestments: { 
              type: SchemaType.NUMBER,
              description: "Investments intended to be held for more than one year" 
            },
            otherNonCurrentAssets: { 
              type: SchemaType.NUMBER,
              description: "Any other long-term assets not categorized above" 
            },
            totalNonCurrentAssets: { 
              type: SchemaType.NUMBER,
              description: "Sum of all non-current assets listed above" 
            }
          }
        }
      }
    },
    liabilities: {
      type: SchemaType.OBJECT,
      description: "Complete breakdown of company liabilities, both current and non-current",
      properties: {
        totalLiabilities: { 
          type: SchemaType.NUMBER,
          description: "Total value of all liabilities (must equal total of current + non-current liabilities)" 
        },
        currentLiabilities: {
          type: SchemaType.OBJECT,
          description: "Obligations due within one year",
          properties: {
            accountsPayable: { 
              type: SchemaType.NUMBER,
              description: "Money owed to suppliers for goods or services received" 
            },
            shortTermDebt: { 
              type: SchemaType.NUMBER,
              description: "Debt obligations due within one year, including current portion of long-term debt" 
            },
            accruedExpenses: { 
              type: SchemaType.NUMBER,
              description: "Expenses recognized but not yet paid" 
            },
            otherCurrentLiabilities: { 
              type: SchemaType.NUMBER,
              description: "Any other current liabilities not categorized above" 
            },
            totalCurrentLiabilities: { 
              type: SchemaType.NUMBER,
              description: "Sum of all current liabilities listed above" 
            }
          }
        },
        nonCurrentLiabilities: {
          type: SchemaType.OBJECT,
          description: "Long-term obligations not due within one year",
          properties: {
            longTermDebt: { 
              type: SchemaType.NUMBER,
              description: "Long-term borrowings and bonds payable beyond one year" 
            },
            pensionLiabilities: { 
              type: SchemaType.NUMBER,
              description: "Future pension obligations to employees" 
            },
            deferredRevenue: { 
              type: SchemaType.NUMBER,
              description: "Payments received for goods/services to be delivered in future" 
            },
            otherNonCurrentLiabilities: { 
              type: SchemaType.NUMBER,
              description: "Any other long-term liabilities not categorized above" 
            },
            totalNonCurrentLiabilities: { 
              type: SchemaType.NUMBER,
              description: "Sum of all non-current liabilities listed above" 
            }
          }
        }
      }
    },
    equity: {
      type: SchemaType.OBJECT,
      description: "Shareholders' equity section showing ownership interests",
      properties: {
        totalEquity: { 
          type: SchemaType.NUMBER,
          description: "Total shareholders' equity (must equal total assets minus total liabilities)" 
        },
        commonStock: { 
          type: SchemaType.NUMBER,
          description: "Par value of issued common stock" 
        },
        retainedEarnings: { 
          type: SchemaType.NUMBER,
          description: "Accumulated profits not paid out as dividends" 
        },
        additionalPaidInCapital: { 
          type: SchemaType.NUMBER,
          description: "Amount paid by shareholders in excess of par value" 
        },
        treasuryStock: { 
          type: SchemaType.NUMBER,
          description: "Cost of shares repurchased by the company (negative number)" 
        },
        otherEquity: { 
          type: SchemaType.NUMBER,
          description: "Other equity items including accumulated other comprehensive income/loss" 
        }
      }
    }
  }
};

export default FinancialStatementSchema;

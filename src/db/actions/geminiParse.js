import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const FinancialStatementSchema = {
  type: SchemaType.OBJECT,
  description:
    "A comprehensive financial statement data structure derived from SEC 10-Q (quarterly) and 10-K (annual) filings. " +
    "This schema captures key information about the company, reporting period, assets, liabilities, and equity. " +
    "It also includes alternative terms or synonyms (e.g., 'legal name' for companyName, 'stock symbol' for tickerSymbol) " +
    "to accommodate the variations in terminology that may appear in the filings.",
  properties: {
    companyName: {
      type: SchemaType.STRING,
      description:
        "The full legal name of the company as shown on the filing header. " +
        "Also known as the 'official name' or 'legal entity name'. " +
        "This should match the name registered with the SEC.",
    },
    tickerSymbol: {
      type: SchemaType.STRING,
      description:
        "The stock market ticker symbol for publicly traded companies. " +
        "Also referred to as 'stock symbol', 'ticker', or 'trading symbol'. " +
        "For example, AAPL for Apple Inc.",
    },
    companyType: {
      type: SchemaType.STRING,
      enum: ["public", "private"],
      description:
        "Indicates whether the company is publicly traded or privately held. " +
        "For SEC filings (10-Q and 10-K), this is typically 'public'. " +
        "Alternative terms include 'listed' or 'non-private'.",
    },
    filingType: {
      type: SchemaType.STRING,
      enum: ["10-Q", "10-K", "Private"],
      description:
        "Specifies the type of SEC filing: '10-Q' for quarterly reports, '10-K' for annual reports, " +
        "or 'Private' if not applicable to SEC filings. " +
        "This may also be called the report type, filing form, or statement type.",
    },
    filingDate: {
      type: SchemaType.STRING,
      description:
        "The date when the financial statement was filed with the SEC, in YYYY-MM-DD format. " +
        "This date is critical for period comparison and trend analysis. " +
        "Also referred to as 'date of filing' or 'submission date'.",
    },
    fiscalYearStart: {
      type: SchemaType.STRING,
      description:
        "The start date of the company's fiscal year (YYYY-MM-DD format). " +
        "This sets the context for the reporting period and may also be referred to as 'fiscal start date' or 'beginning of fiscal year'.",
    },
    period: {
      type: SchemaType.OBJECT,
      description:
        "Information about the reporting period covered by the filing, which may be a quarter, full year, or another defined period. " +
        "Also known as the 'reporting period' or 'period covered'.",
      properties: {
        type: {
          type: SchemaType.STRING,
          enum: ["Q1", "Q2", "Q3", "Q4", "FY", "Monthly", "Biannual", "Custom"],
          description:
            "The specific reporting period for the filing. For 10-Q filings, expect Q1 to Q4; " +
            "for 10-K filings, this is typically 'FY' (full year). " +
            "May also be referenced as 'quarter' or 'report period type'.",
        },
        periodStart: {
          type: SchemaType.STRING,
          description:
            "The start date of the reporting period (YYYY-MM-DD format), marking the beginning of the period covered. " +
            "Also known as 'period start date' or 'from date'.",
        },
        periodEnd: {
          type: SchemaType.STRING,
          description:
            "The end date of the reporting period (YYYY-MM-DD format), indicating the last day of the reported period. " +
            "Also referred to as 'period end date' or 'to date'.",
        },
      },
    },
    currency: {
      type: SchemaType.STRING,
      description:
        "The currency used in the financial statements, typically represented by a three-letter code (e.g., USD, EUR). " +
        "A '$' symbol usually denotes USD. " +
        "Alternative descriptions include 'monetary unit' or 'currency code'.",
    },
    assets: {
      type: SchemaType.OBJECT,
      description:
        "A detailed breakdown of the company's assets as reported in the filing, separated into current and non-current categories. " +
        "Assets may also be called 'resources' or 'property holdings'.",
      properties: {
        totalAssets: {
          type: SchemaType.NUMBER,
          description:
            "The total value of all assets, which should equal the sum of current and non-current assets. " +
            "Also known as 'aggregate assets' or 'total resource value'.",
        },
        currentAssets: {
          type: SchemaType.OBJECT,
          description:
            "Assets expected to be converted to cash or used up within one year. " +
            "Also known as 'short-term assets'.",
          properties: {
            cashAndEquivalents: {
              type: SchemaType.NUMBER,
              description:
                "Cash and liquid investments, such as money market funds and short-term government securities. " +
                "May also be called 'liquidity' or 'cash resources'.",
            },
            accountsReceivable: {
              type: SchemaType.NUMBER,
              description:
                "Amounts due from customers for goods or services provided on credit. " +
                "Also referred to as 'receivables' or 'outstanding customer balances'.",
            },
            inventory: {
              type: SchemaType.NUMBER,
              description:
                "The value of goods available for sale or raw materials, including work in progress. " +
                "Also known as 'stock' or 'inventories'.",
            },
            otherCurrentAssets: {
              type: SchemaType.NUMBER,
              description:
                "Any additional current assets not included above, such as prepaid expenses or short-term receivables. " +
                "May be called 'miscellaneous current assets'.",
            },
            totalCurrentAssets: {
              type: SchemaType.NUMBER,
              description:
                "The sum of all current assets. This total should match the sum of cash, receivables, inventory, and other current asset items. " +
                "Also known as 'total short-term assets'.",
            },
          },
        },
        nonCurrentAssets: {
          type: SchemaType.OBJECT,
          description:
            "Long-term assets that are not expected to be liquidated within one year. " +
            "These may include tangible and intangible assets and are sometimes called 'fixed assets' or 'long-term resources'.",
          properties: {
            propertyPlantEquipment: {
              type: SchemaType.NUMBER,
              description:
                "The net value of physical assets like buildings, machinery, and equipment after depreciation. " +
                "May also be referenced as 'PPE' or 'fixed property'.",
            },
            goodwill: {
              type: SchemaType.NUMBER,
              description:
                "The intangible premium paid during acquisitions, representing the excess of the purchase price over the fair value of identifiable net assets. " +
                "Also known as 'acquisition premium' or simply 'goodwill'.",
            },
            intangibleAssets: {
              type: SchemaType.NUMBER,
              description:
                "The value of non-physical assets such as patents, trademarks, copyrights, and licenses. " +
                "May also be called 'intangible property'.",
            },
            longTermInvestments: {
              type: SchemaType.NUMBER,
              description:
                "Investments held for more than one year, which may include stakes in other companies or bonds. " +
                "Also known as 'long-term securities'.",
            },
            otherNonCurrentAssets: {
              type: SchemaType.NUMBER,
              description:
                "Any additional long-term assets not categorized above, such as long-term receivables or deferred charges. " +
                "May also be referred to as 'other fixed assets'.",
            },
            totalNonCurrentAssets: {
              type: SchemaType.NUMBER,
              description:
                "The total of all non-current assets. This should equal the sum of all long-term asset components. " +
                "Also known as 'aggregate long-term assets'.",
            },
          },
        },
      },
    },
    liabilities: {
      type: SchemaType.OBJECT,
      description:
        "A detailed breakdown of the company's liabilities as reported in the filing, divided into current (short-term) and non-current (long-term) obligations. " +
        "Liabilities may also be called 'debts' or 'obligations'.",
      properties: {
        totalLiabilities: {
          type: SchemaType.NUMBER,
          description:
            "The total amount of liabilities, which should equal the sum of current and non-current liabilities. " +
            "Also known as 'aggregate liabilities' or 'total debt'.",
        },
        currentLiabilities: {
          type: SchemaType.OBJECT,
          description:
            "Obligations due within one year, such as accounts payable, short-term debt, and accrued expenses. " +
            "Also known as 'short-term liabilities'.",
          properties: {
            accountsPayable: {
              type: SchemaType.NUMBER,
              description:
                "Amounts owed to suppliers for goods or services received on credit. " +
                "May also be referred to as 'payables' or 'vendor obligations'.",
            },
            shortTermDebt: {
              type: SchemaType.NUMBER,
              description:
                "Debt obligations due within one year, including the current portion of long-term debt. " +
                "Also known as 'current debt' or 'short-term borrowings'.",
            },
            accruedExpenses: {
              type: SchemaType.NUMBER,
              description:
                "Expenses incurred but not yet paid, such as wages, utilities, and interest. " +
                "May also be referred to as 'accruals' or 'pending expenses'.",
            },
            otherCurrentLiabilities: {
              type: SchemaType.NUMBER,
              description:
                "Other short-term liabilities not categorized above, such as current tax liabilities or deferred revenue for short-term services. " +
                "May also be called 'miscellaneous current liabilities'.",
            },
            totalCurrentLiabilities: {
              type: SchemaType.NUMBER,
              description:
                "The sum of all current liabilities. This total should match the sum of accounts payable, short-term debt, accrued expenses, and other current liabilities. " +
                "Also known as 'aggregate short-term liabilities'.",
            },
          },
        },
        nonCurrentLiabilities: {
          type: SchemaType.OBJECT,
          description:
            "Obligations that extend beyond one year, including long-term debt and deferred liabilities. " +
            "These may also be called 'long-term obligations' or 'non-current debts'.",
          properties: {
            longTermDebt: {
              type: SchemaType.NUMBER,
              description:
                "Long-term borrowings and bonds payable that are due after one year. " +
                "May also be referred to as 'non-current debt'.",
            },
            pensionLiabilities: {
              type: SchemaType.NUMBER,
              description:
                "Future obligations related to employee pension benefits. " +
                "Also known as 'pension obligations'.",
            },
            deferredRevenue: {
              type: SchemaType.NUMBER,
              description:
                "Revenue received in advance for goods or services to be delivered later. " +
                "May also be called 'unearned revenue' or 'deferred income'.",
            },
            otherNonCurrentLiabilities: {
              type: SchemaType.NUMBER,
              description:
                "Other long-term liabilities not captured above, such as deferred tax liabilities or long-term lease obligations. " +
                "Also known as 'miscellaneous long-term liabilities'.",
            },
            totalNonCurrentLiabilities: {
              type: SchemaType.NUMBER,
              description:
                "The total of all non-current liabilities, which should equal the sum of all long-term liability components. " +
                "Also referred to as 'aggregate long-term liabilities'.",
            },
          },
        },
      },
    },
    equity: {
      type: SchemaType.OBJECT,
      description:
        "The shareholders' equity section representing the residual interest in the company’s assets after deducting liabilities. " +
        "This section is also referred to as 'net worth' or 'owners' equity' and includes common stock, retained earnings, and additional equity adjustments.",
      properties: {
        totalEquity: {
          type: SchemaType.NUMBER,
          description:
            "The total shareholders' equity, calculated as total assets minus total liabilities. " +
            "Also known as 'net assets' or 'book value'.",
        },
        commonStock: {
          type: SchemaType.NUMBER,
          description:
            "The par value of issued common stock. This may also be called 'capital stock' or 'issued stock value'.",
        },
        retainedEarnings: {
          type: SchemaType.NUMBER,
          description:
            "The cumulative net income retained in the company after dividends. " +
            "Also known as 'accumulated earnings' or 'retained profits'.",
        },
        additionalPaidInCapital: {
          type: SchemaType.NUMBER,
          description:
            "Funds received from shareholders in excess of the par value of the stock. " +
            "This is sometimes called 'paid-in surplus' or 'capital surplus'.",
        },
        treasuryStock: {
          type: SchemaType.NUMBER,
          description:
            "The cost of shares repurchased by the company, usually reported as a negative value. " +
            "May also be referred to as 'repurchased stock' or 'treasury shares'.",
        },
        otherEquity: {
          type: SchemaType.NUMBER,
          description:
            "Other equity components such as accumulated other comprehensive income or losses, including unrealized gains or losses on securities. " +
            "May also be referred to as 'other comprehensive income' or 'OCI'.",
        },
      },
    },
  },
};

import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function geminiParse(buffer) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Google API key is not set");
    }
    
    // Create a temporary file from the buffer
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `temp-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempFile, buffer);

    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);

    // Upload file to Gemini
    const uploadResult = await fileManager.uploadFile(tempFile, {
      mimeType: "application/pdf",
      displayName: "financial_statement.pdf"
    });
    const file = uploadResult.file;

    // Wait for file processing
    let activeFile = await fileManager.getFile(file.name);
    while (activeFile.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      activeFile = await fileManager.getFile(file.name);
    }
    if (activeFile.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }


    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 1,
        responseMimeType: "application/json",
        responseSchema: FinancialStatementSchema,
      }
    });

    // Log file details after ensuring the file is ACTIVE


    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: file.mimeType,
                fileUri: file.uri,
              },
            },
            {
            // File: improvedPrompt.js (excerpt)
            text: `You are a highly experienced professional accountant with decades of expertise in parsing and analyzing balance sheets from SEC filings. Your task is to carefully analyze the provided financial statement and extract all relevant information exactly as specified by the following schema. Please adhere to these guidelines:

            - **Monetary Values:** Report all monetary amounts in their base units (do not scale to thousands or millions).
            - **UNITS**: If presented with numbers in 'millions' like 1000, multiply by 1000000, iff in 'thousands' multiply to 1000000. CONVERSION MUST BE DONE DO NOT DISCARD VALUES.
            - **JSON Output:** Return the data in valid JSON format.
            - **Data Completeness:** For any field where the required data is not found after a thorough review, set its value to null. Do not guess or fabricate any data.
            - **Strict Schema Adherence:** Follow the schema exactly without any deviations.
            - Proceed with the analysis and output your response strictly in the required JSON format.
            - For null values DO NOT PUT QUOTES AROUND null.
            - It may not be obvious where each text fits in the field, make your best predictions BUT AVOID MAKING UP NUMBERS AT ALL COST.
            - DATE PARAMETS REQUIRE A DATE DO NOT PUT ANYTHING OTHER THAN DATES OR NULL`
            
            }
          ],
        }
      ],
    });


  // Updated snippet in geminiParse.js
    const result = await chatSession.sendMessage("Extract all financial data according to the schema");
    const response = await result.response.text();
  

    // Clean up temp file
    await fs.promises.unlink(tempFile);


    console.log("RESPONSE: ", response)
    try {
      const parsedData = JSON.parse(response.replace(/"\s*null\s*"/g, "null"));
      console.log(parsedData)
      return parsedData; // Since the response is an array with one object
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Invalid JSON returned from Gemini: ${parseError.message}`);
    }

  } catch (error) {
    console.error("Error in parsePDF:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

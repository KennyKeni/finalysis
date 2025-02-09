'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// 
const userId = "12345"; // or get it from your authentication/session logic


// sample balance sheet date 
// we need to make this dynamic later with the json file later 
const initialBalanceSheetData = { 
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

// SAMPLE DATA ABOVE 



function shuffleArray(array) {
  const newArray = [...array]; // Create a shallow copy of the array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // chooses random index from 0 to i inclusive 
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // swaps the elements at indices i and j 
  }
  return newArray;
}


function flattenObject(obj, parentKey = '', result = []) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    // Build the current path string.
    const currentKey = parentKey ? `${parentKey} > ${key}` : key;
    if (typeof value === 'number') {
      result.push({ path: currentKey, value }); //pushes current key / value if number 
    } else if (value !== null && typeof value === 'object') {
      // Skip Date objects.
      if (value instanceof Date) return; // skips date objects 
      flattenObject(value, currentKey, result); // recurses into nested objects
    }
  });
  return result;
}

function formatAnswer(num) {
  // returns number without decimals if integer
  if (Number.isInteger(num)) {
    return num.toFixed(0);
  }
  // Otherwise, return number with 2 decimals
  return num.toFixed(2);
}

/**
 * Generates dynamic questions based on the balance sheet data.
 * It extracts entries from the assets, liabilities, and equity categories,
 * randomizes their order, slices a subset, and then prepares a trivia question for each.
 *
 * @param {Object} data - The balance sheet data.
 * @param {number} count - The number of questions to generate.
 * @returns {Array} - An array of question objects.
 */
function generateDynamicQuestions(data, count = 5) {
  let entries = [];
  const categories = ['assets', 'liabilities', 'equity'];
  categories.forEach((cat) => {
    if (data[cat]) {
      const flattened = flattenObject(data[cat], cat);
      entries.push(...flattened);
    }
  });

  const shuffledEntries = shuffleArray(entries);
  const selectedEntries = shuffledEntries.slice(0, Math.min(count, entries.length));

  const questions = selectedEntries.map(({ path, value }) => {
    // Extract only the final destination from the path.
    const finalKey = path.split(' > ').pop();
    // Formulate the question using the final key.
    const questionText = `What is the value of '${finalKey}'?`;

    let options = [{ text: formatAnswer(value), correct: true }];
    const wrongOption1 = formatAnswer(value * 1.1);
    const wrongOption2 = formatAnswer(value * 0.9);
    options.push({ text: wrongOption1, correct: false });
    options.push({ text: wrongOption2, correct: false });

    return { question: questionText, options };
  });

  return questions;
}

// Mini trivia game component that uses dynamically generated questions.
// After an answer is selected, the user sees a review indicating whether the answer was correct or incorrect,
// along with the correct answer. A "Next Question" button is then provided.
function MiniTrivia() {
  const [questions, setQuestions] = useState([]);

  async function fetchGeminiQuestions() {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balanceSheetData: initialBalanceSheetData,
          count: 5,
        }),
      });
      console.log("Response from Gemini API:", response);
      if (!response.ok) {
        throw new Error("Failed to fetch from Gemini API");
      }
      const data = await response.json();
      console.log("Gemini API questions:", data.questions);
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error with Gemini API, fallback to local generation:", error);
      // Fallback using your local question generation logic
      setQuestions(generateDynamicQuestions(initialBalanceSheetData, 5));
    }
  }

  useEffect(() => {
    fetchGeminiQuestions();
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  // Handle when an answer option is clicked.
  const handleOptionClick = (index) => {
    if (selectedOptionIndex !== null) return; // Do nothing if already answered.
    setSelectedOptionIndex(index);
    if (questions[currentQuestion].options[index].correct) {
      setScore(score + 1);
    }
  };

  // Proceed to the next question (or show the score if finished)
  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptionIndex(null);
    } else {
      setShowScore(true);
    }
  };

  // Reset the game
  const handlePlayAgain = () => {
    fetchGeminiQuestions(); // Call Gemini API again instead of local generation
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOptionIndex(null);
  };


  if (questions.length === 0 || !questions[currentQuestion]) {
    return <div>Loading questions...</div>;
  }

  if (showScore) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md w-full max-w-md text-center">
        <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
        <p className="mb-4">
          You scored {score} out of {questions.length}.
        </p>
        <button
          onClick={handlePlayAgain}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md">
      <div className="mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <h3 className="text-xl font-semibold mt-2">
          {questions[currentQuestion].question}
        </h3>
      </div>
      <div className="grid gap-2">
        {questions[currentQuestion].options.map((option, index) => {
          // Determine button styling based on selection state for review.
          let buttonStyle =
            "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 px-4 rounded";
          if (selectedOptionIndex !== null) {
            if (option.correct) {
              // Highlight the correct answer in green.
              buttonStyle = "bg-green-400 text-white py-2 px-4 rounded";
            } else if (index === selectedOptionIndex && !option.correct) {
              // Highlight the chosen wrong answer in red.
              buttonStyle = "bg-red-400 text-white py-2 px-4 rounded";
            }
          }
          return (
            <button
              key={index}
              disabled={selectedOptionIndex !== null}
              onClick={() => handleOptionClick(index)}
              className={buttonStyle}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {selectedOptionIndex !== null && (
        <div className="mt-4">
          {questions[currentQuestion].options[selectedOptionIndex].correct ? (
            <p className="text-green-600 font-bold">Correct!</p>
          ) : (
            <p className="text-red-600 font-bold">
              Incorrect! The correct answer is:{" "}
              {questions[currentQuestion].options.find((opt) => opt.correct).text}
            </p>
          )}
          <button
            onClick={handleNextQuestion}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentQuestion + 1 === questions.length
              ? "Finish"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 items-center sm:items-start">
        {/* Mini Trivia Game Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Mini Trivia Game</h2>
          <MiniTrivia />
        </section>
      </main>
    </div>
  );
}

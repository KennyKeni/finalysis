import DataCard from "@/components/DataCard";
import DataChart from "@/components/DataChart";
import { useState, useEffect } from "react";
import { fetchPDF } from "@/http/pdfService";
import { sampleBalanceSheetData } from "@/types/sampleBalanceSheet";

export default function Dashboard() {
  const [jsonArr, setJsonArr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (jsonArr === null) {
      handleFetchPDF();
    }
  }, [jsonArr]);

  const handleFetchPDF = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetchPDF();
      setJsonArr(res.data);
    } catch (error) {
      console.log(error.message);
      setIsError(true);
      // Use sample data as fallback
      setJsonArr([sampleBalanceSheetData]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show nothing or loading message if data isn't loaded yet
  if (!jsonArr || !jsonArr[0]) {
    return <div>Loading data...</div>;
  }

  const data = jsonArr[0];
  const currAsset = data.assets.currentAssets.totalCurrentAssets;

  return (
    <div className="flex flex-col w-full h-full rounded-md bg-white overflow-hidden">
      {isError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          Unable to fetch real data. Displaying sample data.
        </div>
      )}
      
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
          <DataCard 
            text={"Total Liabilities"} 
            number={data.liabilities.totalLiabilities}
          />
          <DataCard 
            text={"Total Equity"} 
            number={data.equity.totalEquity}
          />
          <DataCard 
            text={"Retained Earnings"} 
            number={data.equity.retainedEarnings}
          />
        </div>
        <div className="flex flex-row justify-center items-center w-[15rem] h-[15rem] mt-4 sm:w-full">
          <DataChart data={jsonArr}/>
        </div>
      </div>
    </div>
  );
}

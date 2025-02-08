import DataCard from "@/components/DataCard";
import DataChart from "@/components/DataChart";

export default function Dashboard() {

  return (
    <div className="flex flex-col w-full h-full rounded-md bg-white overflow-hidden">
      <div className="flex flex-row w-full h-[5rem] justify-between items-center px-4">
        <div className="w-full">
          Total Balance
          <br/>
          <p className="font-bold">$1000202020</p>
        </div>
        <div>
          <button className="w-[5rem] h-[2.3rem] rounded-md border-2 bg-white hover:bg-shell">
            Export
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full items-center sm:px-2 sm:h-full">
        <div className="flex flex-row w-full h-[15rem] justify-between items-center flex-wrap sm:flex-nowrap sm:w-full sm:h-[6rem] ">
          <DataCard text={"Total Income"} number={111111}></DataCard>
          <DataCard text={"Total Income"} number={111111}></DataCard>
          <DataCard text={"Total Income"} number={111111}></DataCard>
        </div>
        <div className="flex flex-row justify-center items-center w-[15rem] h-[15rem] mt-4 sm:w-full">
          <DataChart></DataChart>
        </div>
      </div>
    </div>
  );
}
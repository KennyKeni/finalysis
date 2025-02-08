

export default function TopBar() {
  

  return (
    <div className="flex flex-row justify-start items-center w-full h-16 border-b-2 border-aluminum bg-slate">
      <div className="flex flex-row justify-start items-center w-[6.5rem] h-16 pl-4 font-bold border-b-1 border-r-2 border-aluminum sm:w-[17%]">
        Finalysis
      </div>
      <div className="flex flex-row justify-between items-center h-full">
        <div className="relative flex flex-row justify-start items-center w-[12rem] text-xs h-[2rem] mx-2 rounded-md sm:text-base sm:w-[16.5rem] ">
          <button className="w-1/3 h-[2rem] rounded-l-md hover:bg-shell">
            Overview
          </button>
          <button className="w-1/3 h-[2rem] hover:bg-shell">
            Integrations
          </button>
          <button className="w-1/3 h-[2rem] rounded-r-md hover:bg-shell">
            Reports
          </button>
        </div>
        <div className="absolute right-4 flex flex-row w-8 h-8 bg-red-300">
          
        </div>
      </div>
    </div>
  )
}
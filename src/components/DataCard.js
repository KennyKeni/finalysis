


export default function DataCard( {text, number} ) {


  return (
    <button className="flex flex-col justify-start items-center w-[43%] h-[6rem] rounded-md border-2 mx-2 mt-2 bg-slate sm:mt-0 sm:w-full">
      <div className="w-full h-full rounded-md bg-white"></div>
      <div className="flex flex-col justify-start text-sm text-left w-full rounded-md border-b-2 px-3 pb-2 drop-shadow-sm bg-white sm:text-base">
        {text}
        <br/>
        <p className="font-bold">${number}</p>
      </div>
      <div className="w-full h-full">
        
      </div>
    </button>
  )
}
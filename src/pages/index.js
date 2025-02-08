
export default function Home() {

  return (
    <div className="flex flex-row justify-center items-center w-full h-screen">
      <div className="flex flex-col justify-center items-center w-3/4 h-3/4 bg-red-200">
        <div className="font-extrabold text-[3rem] sm:text-[10rem]">
          Finalysis
        </div>
        <button className="font-medium text-[0.8rem] bg-white rounded-3xl border-4 border-slate hover:bg-slate p-4 mt-5 sm:text-[1.5rem]">
          Click Me!
        </button>
      </div>
    </div>
  );
}

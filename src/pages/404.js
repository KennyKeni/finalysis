

export default function Error404screen() {

  return (
    <div className="flex flex-row justify-center items-center w-full h-screen">
      <div className="flex flex-col justify-center items-center w-3/4 h-3/4 bg-red-200">
        <div className="font-extrabold text-[3rem] sm:text-[10rem]">
          404
        </div>
        <div className="font-medium text-[0.8rem] bg-white rounded-md p-4 mt-5 sm:text-[1.5rem]">
          Sorry you went to the wrong page!
        </div>
      </div>
    </div>
  )
}
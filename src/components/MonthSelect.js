

export default function MonthSelect( {text, monthData, monthRange, setMonth} ) {

  return (
    <div className="flex flex-row h-full w-[5.5rem] sm:w-full">
      <p className="text-xs pt-[0.15rem] sm:p-0 sm:text-base">{text} </p>
      <select
        className="w-[1rem] border rounded ml-1 sm:w-[7rem]"
        value={monthData}
        onChange={(e) => {
          setMonth(e.target.value)
        }}
      >
        {monthRange.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
    
  )
}
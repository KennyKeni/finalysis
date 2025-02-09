"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import { useState, useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import MonthSelect from "./MonthSelect"


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Helper function to convert month names to numbers
const monthToNumber = (month) => {
  return months.indexOf(month)
}

const chartData = []

// Function to add or update total assets for the corresponding month
function updateChartDataWithAssets(chartData, balanceSheetDataArray) {
    // Loop through the balance sheet data
    balanceSheetDataArray.forEach(balanceSheet => {
    // Extract the month from the filing date
    const month = new Date(balanceSheet.filingDate).toLocaleString('default', { month: 'long' });

    // Find if the month already exists in the chartData array
    const monthData = chartData.find(item => item.month === month);

    if (monthData) {
      // If the month exists, update the totalAssets field
      monthData.totalAssets = balanceSheet.totalAssets;
    } else {
      // If the month doesn't exist, create a new entry for that month
      chartData.push({
        month: month,
        totalAssets: balanceSheet.totalAssets,
      });
    }
  });

  setChartData(updatedChartData)
}

export default function DataChart( {balanceSheetDataArray} ) {
  
  const [startMonth, setStartMonth] = useState("January")
  const [endMonth, setEndMonth] = useState("December")
  const [chartData, setChartData] = useState([])

  // Function to update the chart data with balance sheet assets
  const updateChartDataWithAssets = (balanceSheetDataArray) => {
    const updatedChartData = []

    balanceSheetDataArray.forEach(balanceSheet => {
      const month = new Date(balanceSheet.filingDate).toLocaleString('default', { month: 'long' })
      const existingData = updatedChartData.find(item => item.month === month)

      if (existingData) {
        existingData.totalAssets = balanceSheet.totalAssets
      } else {
        updatedChartData.push({
          month: month,
          totalAssets: balanceSheet.totalAssets,
        })
      }
    })

    setChartData(updatedChartData)
  }

  useEffect(() => {
    updateChartDataWithAssets(balanceSheetDataArray)
  }, [balanceSheetDataArray])

  const availableStartMonths = months.filter((month) => monthToNumber(month) < monthToNumber(endMonth))
  const availableEndMonths = months.filter((month) => monthToNumber(month) > monthToNumber(startMonth))

  // Filter data based on start and end month
  const filteredData = chartData.filter((e) => {
    const startMonthIndex = monthToNumber(startMonth)
    const endMonthIndex = monthToNumber(endMonth)
    const dataMonthIndex = monthToNumber(e.month)

    return dataMonthIndex >= startMonthIndex && dataMonthIndex <= endMonthIndex
  })

  return (
    <div className="w-full mx-2">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <div className="flex flex-row w-full h-full justify-end items-center">
            <div className="flex flex-row w-[27.7rem]">
              <MonthSelect text={"Start Month: "} monthData={startMonth} monthRange={availableStartMonths} setMonth={setStartMonth}></MonthSelect>
              <MonthSelect text={"End Month: "} monthData={endMonth} monthRange={availableEndMonths} setMonth={setEndMonth}></MonthSelect>
            </div>
          </div>
          
        </CardHeader>
        <CardContent className="w-full h-[12rem] pr-4 sm:pr-8">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <LineChart
              accessibilityLayer
              data={filteredData}
              className="w-full h-full"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

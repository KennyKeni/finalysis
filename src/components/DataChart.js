"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import { useState } from "react"

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
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 214, mobile: 140 },
  { month: "August", desktop: 214, mobile: 140 },
  { month: "September", desktop: 214, mobile: 140 },
  { month: "October", desktop: 214, mobile: 140 },
  { month: "November", desktop: 214, mobile: 140 },
  { month: "December", desktop: 214, mobile: 140 },
]

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

export default function DataChart() {
  
  const [startMonth, setStartMonth] = useState("January")
  const [endMonth, setEndMonth] = useState("December")

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

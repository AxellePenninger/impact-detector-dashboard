"use client"

import { useState } from "react"
import Image from "next/image"
import { LineChartIcon as ChartLineUp, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RacerAccelerationChart } from "@/components/racer-acceleration-chart"
import type { CrashData } from "@/lib/dummy-data"

interface RacerMetricsProps {
  crashes: CrashData[]
}

export function RacerMetrics({ crashes }: RacerMetricsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Group crashes by cyclist
  const racerCrashes = crashes.reduce(
    (acc, crash) => {
      const cyclistId = crash.cyclist.id
      if (!acc[cyclistId]) {
        acc[cyclistId] = {
          cyclist: crash.cyclist,
          team: crash.team,
          crashes: [],
          maxHic: 0,
          maxBric: 0,
          maxAcceleration: 0,
          totalCrashes: 0,
        }
      }

      acc[cyclistId].crashes.push(crash)
      acc[cyclistId].maxHic = Math.max(acc[cyclistId].maxHic, crash.hic)
      acc[cyclistId].maxBric = Math.max(acc[cyclistId].maxBric, crash.bric)
      acc[cyclistId].maxAcceleration = Math.max(acc[cyclistId].maxAcceleration, crash.acceleration)
      acc[cyclistId].totalCrashes += 1

      return acc
    },
    {} as Record<
      string,
      {
        cyclist: CrashData["cyclist"]
        team: string
        crashes: CrashData[]
        maxHic: number
        maxBric: number
        maxAcceleration: number
        totalCrashes: number
      }
    >,
  )

  // Filter racers based on search query
  const filteredRacers = Object.values(racerCrashes).filter(
    (racer) =>
      racer.cyclist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      racer.team.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort racers by max HIC (most severe first)
  const sortedRacers = filteredRacers.sort((a, b) => b.maxHic - a.maxHic)

  const getSeverityColor = (hic: number) => {
    if (hic > 800) return "bg-red-500"
    if (hic > 500) return "bg-amber-500"
    if (hic > 200) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getSeverityTextColor = (hic: number) => {
    if (hic > 800) return "text-red-500"
    if (hic > 500) return "text-amber-500"
    if (hic > 200) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Racer Impact Metrics</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search racers..."
            className="w-[200px] pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedRacers.map((racer) => (
          <Card key={racer.cyclist.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={`/placeholder.svg?height=40&width=40`}
                    width={40}
                    height={40}
                    alt={racer.cyclist.name}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{racer.cyclist.name}</CardTitle>
                    <CardDescription>
                      #{racer.cyclist.number} • <Badge variant="outline">{racer.team}</Badge>
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getSeverityColor(racer.maxHic) + " text-white"}>
                  {racer.totalCrashes} {racer.totalCrashes === 1 ? "crash" : "crashes"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="crashes">Crashes</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max HIC</span>
                      <span className={`font-medium ${getSeverityTextColor(racer.maxHic)}`}>{racer.maxHic}</span>
                    </div>
                    <Progress
                      value={Math.min((racer.maxHic / 1200) * 100, 100)}
                      className="h-2"
                      indicatorClassName={getSeverityColor(racer.maxHic)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max BRIC</span>
                      <span className="font-medium">{racer.maxBric}</span>
                    </div>
                    <Progress value={Math.min((racer.maxBric / 500) * 100, 100)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Acceleration</span>
                      <span className="font-medium">{racer.maxAcceleration.toFixed(1)}g</span>
                    </div>
                    <Progress value={Math.min((racer.maxAcceleration / 120) * 100, 100)} className="h-2" />
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <ChartLineUp className="mr-2 h-4 w-4" />
                        View Acceleration Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Acceleration Data: {racer.cyclist.name}</DialogTitle>
                        <DialogDescription>Showing data from most severe crash (HIC: {racer.maxHic})</DialogDescription>
                      </DialogHeader>
                      <div className="h-[300px] mt-4">
                        <RacerAccelerationChart
                          data={racer.crashes.sort((a, b) => b.hic - a.hic)[0].accelerationData}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsContent>
                <TabsContent value="crashes" className="pt-4">
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {racer.crashes
                      .sort((a, b) => b.hic - a.hic)
                      .map((crash) => (
                        <div key={crash.id} className="flex items-center justify-between text-sm border-b pb-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getSeverityColor(crash.hic)}`} />
                            <div>
                              <div className="font-medium">{crash.race}</div>
                              <div className="text-xs text-muted-foreground">
                                {crash.location}, KM {crash.km.toFixed(1)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">HIC: {crash.hic}</div>
                            <div className="text-xs text-muted-foreground">{crash.acceleration.toFixed(1)}g</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

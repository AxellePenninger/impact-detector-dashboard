"use client"

import { ArrowUpDown, LineChartIcon as ChartLineUp, ExternalLink, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { RacerAccelerationChart } from "@/components/racer-acceleration-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CrashData } from "@/lib/dummy-data"

// Create a separate CrashDialog component that accepts crash data as props
const CrashDialog = ({ crash }: { crash: CrashData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ChartLineUp className="mr-2 h-4 w-4" />
          View Acceleration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Acceleration Data: {crash.cyclist.name}</DialogTitle>
          <DialogDescription>
            Crash at {crash.location}, KM {crash.km.toFixed(1)} during {crash.race}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[300px] mt-4">
          <RacerAccelerationChart data={crash.accelerationData} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CrashListProps {
  crashes: CrashData[]
  selectedRace?: string
}

export function CrashList({ crashes, selectedRace }: CrashListProps) {
  const [sortField, setSortField] = useState<keyof CrashData>("hic")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof CrashData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedCrashes = [...crashes].sort((a, b) => {
    if (sortField === "cyclist") {
      return sortDirection === "asc"
        ? a.cyclist.name.localeCompare(b.cyclist.name)
        : b.cyclist.name.localeCompare(a.cyclist.name)
    }

    if (sortField === "location") {
      return sortDirection === "asc" ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location)
    }

    if (sortField === "km") {
      return sortDirection === "asc" ? a.km - b.km : b.km - a.km
    }

    return sortDirection === "asc"
      ? (a[sortField] as number) - (b[sortField] as number)
      : (b[sortField] as number) - (a[sortField] as number)
  })

  const getSeverityColor = (hic: number) => {
    if (hic > 800) return "bg-red-500"
    if (hic > 500) return "bg-amber-500"
    if (hic > 200) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedRace || "All Races"}</CardTitle>
        <CardDescription>Crashes during this race</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Severity</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("cyclist")}>
                  Cyclist
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("team")}>
                  Team
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("hic")}>
                  HIC
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("bric")}>
                  BRIC
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("acceleration")}>
                  Accel. (g)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("location")}>
                  Street
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold" onClick={() => handleSort("km")}>
                  KM
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCrashes.map((crash) => (
              <TableRow key={crash.id}>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`h-3 w-3 rounded-full ${getSeverityColor(crash.hic)}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        {crash.hic > 800
                          ? "Critical"
                          : crash.hic > 500
                            ? "High Risk"
                            : crash.hic > 200
                              ? "Moderate"
                              : "Low Risk"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/placeholder.svg?height=32&width=32`}
                      width={32}
                      height={32}
                      alt={crash.cyclist.name}
                      className="rounded-full"
                    />
                    <div>
                      <div>{crash.cyclist.name}</div>
                      <div className="text-xs text-muted-foreground">#{crash.cyclist.number}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{crash.team}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{crash.hic}</div>
                </TableCell>
                <TableCell>{crash.bric}</TableCell>
                <TableCell>{crash.acceleration.toFixed(1)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{crash.location}</span>
                  </div>
                </TableCell>
                <TableCell>{crash.km.toFixed(1)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Use the dedicated CrashDialog component for each crash */}
                    <CrashDialog crash={crash} />
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/crash/${crash.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedCrashes.length}</strong> crashes
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

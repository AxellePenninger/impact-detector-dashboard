"use client"

import { AlertTriangle, Calendar, ChevronDown, Download, Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { CrashList } from "@/components/crash-list"
import { TeamSummary } from "@/components/team-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStableData } from "@/lib/dummy-data"

export function CrashDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRace, setSelectedRace] = useState<string>("")
  const { crashes, teams } = getStableData()

  useEffect(() => {
    // Set the first race as default when data loads
    if (crashes.length > 0 && !selectedRace) {
      const races = Array.from(new Set(crashes.map((crash) => crash.race)))
      setSelectedRace(races[0])
    }
  }, [crashes, selectedRace])

  const filteredCrashes = crashes.filter(
    (crash) =>
      (selectedRace ? crash.race === selectedRace : true) &&
      (searchQuery
        ? crash.cyclist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crash.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crash.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crash.race.toLowerCase().includes(searchQuery.toLowerCase())
        : true),
  )

  const criticalCrashes = filteredCrashes.filter((crash) => crash.hic > 800).length
  const highRiskCrashes = filteredCrashes.filter((crash) => crash.hic > 500 && crash.hic <= 800).length
  const moderateCrashes = filteredCrashes.filter((crash) => crash.hic > 200 && crash.hic <= 500).length

  return (
    <div className="w-full max-w-[1200px] mx-auto py-6 space-y-8 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crash Impact Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze cyclist crash impacts in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 days
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Race Details</h2>
        <Select value={selectedRace} onValueChange={setSelectedRace}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a race" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(crashes.map((crash) => crash.race))).map((race) => (
              <SelectItem key={race} value={race}>
                {race}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crashes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCrashes.length}</div>
            <p className="text-xs text-muted-foreground">in {selectedRace}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Impacts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalCrashes}</div>
            <p className="text-xs text-muted-foreground">HIC &gt; 800</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskCrashes}</div>
            <p className="text-xs text-muted-foreground">HIC 500-800</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderateCrashes}</div>
            <p className="text-xs text-muted-foreground">HIC 200-500</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="crashes" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="crashes">Crash List</TabsTrigger>
            <TabsTrigger value="teams">Team Summary</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search crashes..."
                className="w-[200px] pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sort by HIC (Highest)</DropdownMenuItem>
                <DropdownMenuItem>Sort by Team</DropdownMenuItem>
                <DropdownMenuItem>Filter by Team</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="crashes" className="space-y-4">
          <CrashList crashes={filteredCrashes} selectedRace={selectedRace} />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamSummary teams={teams} crashes={filteredCrashes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

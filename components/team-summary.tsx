"use client"

import { useState } from "react"
import { ChevronDown, Download, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CrashData, TeamData } from "@/lib/dummy-data"

interface TeamSummaryProps {
  teams: TeamData[]
  crashes: CrashData[]
}

export function TeamSummary({ teams, crashes }: TeamSummaryProps) {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const exportTeamReport = (team: (typeof teamStats)[0]) => {
    // Create CSV header
    let csvContent = "Cyclist,Team,HIC,BRIC,Acceleration,Location,KM,Date\n"

    // Add data rows
    team.crashes.forEach((crash) => {
      const row = [
        `"${crash.cyclist.name}"`,
        `"${crash.team}"`,
        crash.hic,
        crash.bric,
        crash.acceleration.toFixed(1),
        `"${crash.location}"`,
        crash.km.toFixed(1),
        `"${new Date(crash.date).toLocaleDateString()}"`,
      ]
      csvContent += row.join(",") + "\n"
    })

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${team.name}_crash_report.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate team statistics
  const teamStats = teams
    .map((team) => {
      const teamCrashes = crashes.filter((crash) => crash.team === team.name)
      const avgHIC =
        teamCrashes.length > 0 ? teamCrashes.reduce((sum, crash) => sum + crash.hic, 0) / teamCrashes.length : 0
      const maxHIC = teamCrashes.length > 0 ? Math.max(...teamCrashes.map((crash) => crash.hic)) : 0
      const criticalCrashes = teamCrashes.filter((crash) => crash.hic > 800).length

      return {
        ...team,
        crashCount: teamCrashes.length,
        avgHIC,
        maxHIC,
        criticalCrashes,
        crashes: teamCrashes,
      }
    })
    .sort((a, b) => b.crashCount - a.crashCount)

  const toggleTeam = (teamName: string) => {
    if (expandedTeam === teamName) {
      setExpandedTeam(null)
    } else {
      setExpandedTeam(teamName)
    }
  }

  const getSeverityColor = (hic: number) => {
    if (hic > 800) return "bg-red-500"
    if (hic > 500) return "bg-amber-500"
    if (hic > 200) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRecoveryTime = (hic: number) => {
    if (hic > 800) return "4-6 weeks"
    if (hic > 500) return "2-3 weeks"
    if (hic > 200) return "1-2 weeks"
    return "3-5 days"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamStats.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">{team.name}</CardTitle>
                <Badge variant={team.crashCount > 0 ? "destructive" : "outline"}>{team.crashCount} crashes</Badge>
              </div>
              <CardDescription>
                {team.country} • {team.cyclists.length} cyclists
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average HIC</span>
                  <span className="font-medium">{team.avgHIC.toFixed(1)}</span>
                </div>
                <Progress value={Math.min((team.avgHIC / 1000) * 100, 100)} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max HIC</span>
                  <span className="font-medium">{team.maxHIC}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Critical Crashes</span>
                  <span className="font-medium">{team.criticalCrashes}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => toggleTeam(team.name)}
              >
                {expandedTeam === team.name ? "Hide Details" : "Show Details"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expandedTeam === team.name ? "rotate-180" : ""}`}
                />
              </Button>
            </CardFooter>

            {expandedTeam === team.name && (
              <div className="border-t px-6 py-4 bg-muted/30">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Crash Report
                </h4>
                {team.crashes.length > 0 ? (
                  <div className="space-y-3">
                    {team.crashes.map((crash) => (
                      <div key={crash.id} className="flex items-center justify-between text-sm border-b pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getSeverityColor(crash.hic)}`} />
                          <div>
                            <div className="font-medium">{crash.cyclist.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {crash.location}, KM {crash.km.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">HIC: {crash.hic}</div>
                          <div className="text-xs text-muted-foreground">Recovery: {getRecoveryTime(crash.hic)}</div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => exportTeamReport(team)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Team Report
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No crashes recorded for this team.</div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

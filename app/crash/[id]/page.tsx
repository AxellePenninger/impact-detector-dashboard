"use client"

import { ArrowLeft, Calendar, Download, MapPin, Share2, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type CrashData, getStableData } from "@/lib/dummy-data"

export default function CrashDetailPage({ params }: { params: { id: string } }) {
  // Use React.use() to properly unwrap params first
  const unwrappedParams = React.use(params as any); // using 'as any' to bypass TypeScript errors
  const crashId = unwrappedParams.id;
  const [crash, setCrash] = useState<CrashData | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const { crashes } = getStableData() 
    const foundCrash = crashes.find((c) => c.id === crashId) || crashes[0]
    setCrash(foundCrash)
  }, [crashId]) 

  if (!crash) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading crash data...</h2>
            <p className="text-muted-foreground">Please wait while we retrieve the crash details.</p>
          </div>
        </div>
      </div>
    )
  }

  const getSeverityLevel = (hic: number) => {
    if (hic > 800) return { label: "Critical", color: "bg-red-500", textColor: "text-red-500" }
    if (hic > 500) return { label: "High Risk", color: "bg-amber-500", textColor: "text-amber-500" }
    if (hic > 200) return { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-500" }
    return { label: "Low Risk", color: "bg-green-500", textColor: "text-green-500" }
  }

  const getRecoveryTime = (hic: number) => {
    if (hic > 800) return "4-6 weeks"
    if (hic > 500) return "2-3 weeks"
    if (hic > 200) return "1-2 weeks"
    return "3-5 days"
  }

  const severity = getSeverityLevel(crash.hic)

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Crash Report #{crash.id.split("-")[1]}</CardTitle>
                  <CardDescription>Detailed analysis of crash impact and recovery projection</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cyclist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/placeholder.svg?height=48&width=48`}
                      width={48}
                      height={48}
                      alt={crash.cyclist.name}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-bold text-lg">{crash.cyclist.name}</div>
                      <div className="text-sm text-muted-foreground">
                        #{crash.cyclist.number} • <Badge variant="outline">{crash.team}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Crash Details</span>
                  </div>
                  <div>
                    <div className="text-lg">
                      {new Date(crash.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{crash.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">HIC (Head Injury Criterion)</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-3xl font-bold">{crash.hic}</div>
                      <div className={`text-sm ${severity.textColor} font-medium`}>{severity.label}</div>
                      <Progress value={Math.min((crash.hic / 1200) * 100, 100)} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">BRIC (Brain Injury Criterion)</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-3xl font-bold">{crash.bric}</div>
                      <div className="text-sm text-muted-foreground">
                        {crash.bric > 300 ? "High" : crash.bric > 150 ? "Medium" : "Low"} risk
                      </div>
                      <Progress value={Math.min((crash.bric / 500) * 100, 100)} className="h-2 mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Acceleration (g)</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-3xl font-bold">{crash.acceleration.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        {crash.acceleration > 80 ? "Severe" : crash.acceleration > 50 ? "Moderate" : "Light"} impact
                      </div>
                      <Progress value={Math.min((crash.acceleration / 120) * 100, 100)} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="analysis">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
                    <TabsTrigger value="recovery">Recovery Projection</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Impact Analysis</h3>
                      <p>
                        The crash recorded a Head Injury Criterion (HIC) value of <strong>{crash.hic}</strong>, which is
                        classified as <span className={severity.textColor}>{severity.label}</span>. This level of impact
                        indicates
                        {crash.hic > 800
                          ? " a significant risk of traumatic brain injury."
                          : crash.hic > 500
                            ? " a moderate risk of concussion or mild traumatic brain injury."
                            : " a low to moderate risk of minor concussion."}
                      </p>

                      <p>
                        The Brain Rotation Injury Criterion (BRIC) value of <strong>{crash.bric}</strong> suggests
                        {crash.bric > 300
                          ? " a high level of rotational acceleration, which can cause diffuse axonal injury."
                          : crash.bric > 150
                            ? " a moderate level of rotational forces applied to the brain."
                            : " a relatively low level of rotational forces."}
                      </p>

                      <p>
                        The peak linear acceleration of <strong>{crash.acceleration.toFixed(1)}g</strong> is
                        {crash.acceleration > 80
                          ? " significantly above the threshold for potential injury."
                          : crash.acceleration > 50
                            ? " above the average threshold for mild concussion."
                            : " below typical injury thresholds, but still warrants monitoring."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="recovery" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Recovery Projection</h3>
                      <p>
                        Based on the recorded impact metrics, the estimated recovery time is{" "}
                        <strong>{getRecoveryTime(crash.hic)}</strong>. This projection assumes standard concussion
                        protocols are followed and no complications arise.
                      </p>

                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium">Recommended Recovery Timeline:</h4>
                          <ul className="mt-2 space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>
                                <strong>Phase 1 (Rest):</strong> {crash.hic > 500 ? "3-5 days" : "1-2 days"} of complete
                                physical and cognitive rest
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>
                                <strong>Phase 2 (Light Activity):</strong> {crash.hic > 500 ? "3-7 days" : "2-3 days"}{" "}
                                of light, non-impact activities
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span>
                                <strong>Phase 3 (Moderate Training):</strong>{" "}
                                {crash.hic > 500 ? "7-14 days" : "3-7 days"} of progressive training
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>
                                <strong>Phase 4 (Return to Competition):</strong> After medical clearance
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Medical Recommendations</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                          <span>
                            <strong>Immediate Action:</strong>{" "}
                            {crash.hic > 800
                              ? "Urgent neurological assessment required. CT scan recommended to rule out intracranial bleeding."
                              : crash.hic > 500
                                ? "Neurological assessment within 24 hours. Monitor for worsening symptoms."
                                : "Standard concussion protocol assessment. Monitor for 24-48 hours."}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mt-2"></div>
                          <span>
                            <strong>Follow-up:</strong>{" "}
                            {crash.hic > 500
                              ? "Weekly neurological assessments until symptoms resolve. Cognitive testing before return to training."
                              : "Follow-up assessment after 3-5 days. Gradual return to activity if asymptomatic."}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                          <span>
                            <strong>Return to Competition:</strong> Only after complete resolution of symptoms and
                            medical clearance. Gradual return-to-play protocol must be completed without symptom
                            recurrence.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Estimated Recovery Time</div>
                  <div className="text-2xl font-bold">{getRecoveryTime(crash.hic)}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">Current Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-3 w-3 rounded-full ${severity.color}`}></div>
                    <span className="font-medium">{severity.label}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-2">Recovery Progress</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phase 1: Rest</span>
                      <span>Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Phase 2: Light Activity</span>
                      <span>In Progress</span>
                    </div>
                    <Progress value={60} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Phase 3: Training</span>
                      <span>Not Started</span>
                    </div>
                    <Progress value={0} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Phase 4: Return to Competition</span>
                      <span>Not Started</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Incidents</CardTitle>
              <CardDescription>Crashes with similar impact profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        i === 1 ? "bg-red-500" : i === 2 ? "bg-amber-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {["Michael Johnson", "Sarah Williams", "Robert Davis"][i - 1]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HIC: {crash.hic - i * 50} • {["Paris-Roubaix", "Tour de France", "Giro d'Italia"][i - 1]}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/crash/crash-${i + 10}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

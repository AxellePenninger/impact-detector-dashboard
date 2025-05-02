"use client"

import { useEffect, useRef } from "react"
import type { CrashData } from "@/lib/dummy-data"

interface CrashMetricsChartProps {
  crashes: CrashData[]
}

export function CrashMetricsChart({ crashes }: CrashMetricsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sort crashes by HIC for better visualization
    const sortedCrashes = [...crashes].sort((a, b) => b.hic - a.hic)

    // Canvas setup
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = 400

    // Chart dimensions
    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    ctx.stroke()

    // Y-axis label
    ctx.save()
    ctx.translate(20, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "14px sans-serif"
    ctx.fillText("Impact Value", 0, 0)
    ctx.restore()

    // X-axis label
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "14px sans-serif"
    ctx.fillText("Crash Incidents", canvas.width / 2, canvas.height - 15)

    // Find max values for scaling
    const maxHIC = Math.max(...crashes.map((c) => c.hic))
    const maxBRIC = Math.max(...crashes.map((c) => c.bric))
    const maxAccel = Math.max(...crashes.map((c) => c.acceleration))

    // Scale to fit chart
    const scaleY = (value: number, max: number) => {
      return canvas.height - padding - (value / max) * chartHeight
    }

    // Draw HIC line
    ctx.beginPath()
    sortedCrashes.forEach((crash, i) => {
      const x = padding + (i / (sortedCrashes.length - 1)) * chartWidth
      const y = scaleY(crash.hic, maxHIC * 1.1)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw BRIC line
    ctx.beginPath()
    sortedCrashes.forEach((crash, i) => {
      const x = padding + (i / (sortedCrashes.length - 1)) * chartWidth
      const y = scaleY(crash.bric, maxBRIC * 1.1)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw Acceleration line
    ctx.beginPath()
    sortedCrashes.forEach((crash, i) => {
      const x = padding + (i / (sortedCrashes.length - 1)) * chartWidth
      const y = scaleY(crash.acceleration, maxAccel * 1.1)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw legend
    const legendX = canvas.width - padding - 150
    const legendY = padding + 20

    // HIC
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = "#000"
    ctx.textAlign = "left"
    ctx.fillText("HIC", legendX + 40, legendY + 5)

    // BRIC
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 25)
    ctx.lineTo(legendX + 30, legendY + 25)
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillText("BRIC", legendX + 40, legendY + 30)

    // Acceleration
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 50)
    ctx.lineTo(legendX + 30, legendY + 50)
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillText("Acceleration (g)", legendX + 40, legendY + 55)

    // Draw Y-axis ticks and values
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const y = padding + (chartHeight / yTicks) * i
      const value = Math.round(maxHIC * (1 - i / yTicks))

      ctx.beginPath()
      ctx.moveTo(padding - 5, y)
      ctx.lineTo(padding, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#64748b"
      ctx.textAlign = "right"
      ctx.fillText(value.toString(), padding - 10, y + 5)
    }

    // Draw X-axis ticks
    const xTicks = Math.min(10, sortedCrashes.length)
    for (let i = 0; i <= xTicks; i++) {
      const x = padding + (chartWidth / xTicks) * i

      ctx.beginPath()
      ctx.moveTo(x, canvas.height - padding)
      ctx.lineTo(x, canvas.height - padding + 5)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 2
      ctx.stroke()

      if (i % 2 === 0 || xTicks <= 5) {
        ctx.fillStyle = "#64748b"
        ctx.textAlign = "center"
        ctx.fillText(i.toString(), x, canvas.height - padding + 20)
      }
    }

    // Draw threshold lines
    // Critical HIC threshold (800)
    const criticalY = scaleY(800, maxHIC * 1.1)
    ctx.beginPath()
    ctx.moveTo(padding, criticalY)
    ctx.lineTo(canvas.width - padding, criticalY)
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#ef4444"
    ctx.textAlign = "left"
    ctx.fillText("Critical (HIC 800)", padding + 10, criticalY - 5)

    // High risk HIC threshold (500)
    const highRiskY = scaleY(500, maxHIC * 1.1)
    ctx.beginPath()
    ctx.moveTo(padding, highRiskY)
    ctx.lineTo(canvas.width - padding, highRiskY)
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#f59e0b"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#f59e0b"
    ctx.textAlign = "left"
    ctx.fillText("High Risk (HIC 500)", padding + 10, highRiskY - 5)
  }, [crashes])

  return (
    <div className="w-full h-[400px]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

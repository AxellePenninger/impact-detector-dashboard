"use client"

import { useEffect, useRef } from "react"

interface AccelerationDataPoint {
  time: number
  value: number
}

interface RacerAccelerationChartProps {
  data: AccelerationDataPoint[]
}

export function RacerAccelerationChart({ data }: RacerAccelerationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Canvas setup
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Find max values for scaling
    const maxTime = Math.max(...data.map((d) => d.time))
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1 // Add 10% margin

    // Scale functions
    const scaleX = (time: number) => padding + (time / maxTime) * chartWidth
    const scaleY = (value: number) => canvas.height - padding - (value / maxValue) * chartHeight

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
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.fillText("Acceleration (g)", 0, 0)
    ctx.restore()

    // X-axis label
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.fillText("Time (ms)", canvas.width / 2, canvas.height - 5)

    // Draw acceleration line
    ctx.beginPath()
    data.forEach((point, i) => {
      const x = scaleX(point.time)
      const y = scaleY(point.value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.stroke()

    // Add gradient fill under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.5)")
    gradient.addColorStop(1, "rgba(239, 68, 68, 0)")

    ctx.beginPath()
    data.forEach((point, i) => {
      const x = scaleX(point.time)
      const y = scaleY(point.value)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(scaleX(data[data.length - 1].time), canvas.height - padding)
    ctx.lineTo(scaleX(data[0].time), canvas.height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw Y-axis ticks and values
    const yTicks = 5
    for (let i = 0; i <= yTicks; i++) {
      const y = padding + (chartHeight / yTicks) * i
      const value = Math.round(maxValue * (1 - i / yTicks))

      ctx.beginPath()
      ctx.moveTo(padding - 5, y)
      ctx.lineTo(padding, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#64748b"
      ctx.textAlign = "right"
      ctx.font = "10px sans-serif"
      ctx.fillText(value.toString(), padding - 8, y + 3)
    }

    // Draw X-axis ticks
    const xTicks = 5
    for (let i = 0; i <= xTicks; i++) {
      const x = padding + (chartWidth / xTicks) * i
      const time = Math.round((maxTime / xTicks) * i)

      ctx.beginPath()
      ctx.moveTo(x, canvas.height - padding)
      ctx.lineTo(x, canvas.height - padding + 5)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#64748b"
      ctx.textAlign = "center"
      ctx.font = "10px sans-serif"
      ctx.fillText(time.toString(), x, canvas.height - padding + 15)
    }

    // Mark the peak acceleration
    const peakPoint = data.reduce((max, point) => (point.value > max.value ? point : max), data[0])
    const peakX = scaleX(peakPoint.time)
    const peakY = scaleY(peakPoint.value)

    ctx.beginPath()
    ctx.arc(peakX, peakY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444"
    ctx.fill()

    ctx.fillStyle = "#ef4444"
    ctx.textAlign = "left"
    ctx.font = "bold 12px sans-serif"
    ctx.fillText(`Peak: ${peakPoint.value.toFixed(1)}g`, peakX + 10, peakY - 10)
  }, [data])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

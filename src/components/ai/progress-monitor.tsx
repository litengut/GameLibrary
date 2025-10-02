import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Activity, AlertTriangle, CheckCircle2, Clock, HardDrive, TrendingUp, Wifi, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ProgressData {
  timestamp: string
  downloadSpeed: number
  totalProgress: number
  activeDownloads: number
  completedFiles: number
  networkUsage: number
}

interface ProgressMonitorProps {
  games: Array<any>
  className?: string
}

export function ProgressMonitor({ games, className }: ProgressMonitorProps) {
  const [progressHistory, setProgressHistory] = useState<Array<ProgressData>>([])
  const [currentStats, setCurrentStats] = useState({
    totalDownloadSpeed: 0,
    averageSpeed: 0,
    peakSpeed: 0,
    estimatedTimeRemaining: "0m",
    networkEfficiency: 95,
    activeConnections: 0,
  })

  // Simulate real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString()

      // Calculate current stats from games
      const activeDownloads = games.filter((g) => g.status === "downloading")
      const downloadingFiles = activeDownloads.flatMap((g) => g.files.filter((f) => f.status === "downloading"))

      const totalSpeed = downloadingFiles.reduce((sum, file) => {
        const speed = file.speed ? Number.parseFloat(file.speed.replace(" MB/s", "")) : 0
        return sum + speed
      }, 0)

      const completedFiles = games.flatMap((g) => g.files).filter((f) => f.status === "completed").length
      const totalFiles = games.flatMap((g) => g.files).length
      const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0

      const newDataPoint: ProgressData = {
        timestamp: timeString,
        downloadSpeed: totalSpeed,
        totalProgress: overallProgress,
        activeDownloads: activeDownloads.length,
        completedFiles,
        networkUsage: Math.min(100, (totalSpeed / 50) * 100), // Assuming 50 MB/s max bandwidth
      }

      setProgressHistory((prev) => {
        const updated = [...prev, newDataPoint].slice(-20) // Keep last 20 data points
        return updated
      })

      // Update current stats
      setCurrentStats((prev) => ({
        totalDownloadSpeed: totalSpeed,
        averageSpeed:
          progressHistory.length > 0
            ? progressHistory.reduce((sum, p) => sum + p.downloadSpeed, 0) / progressHistory.length
            : totalSpeed,
        peakSpeed: Math.max(prev.peakSpeed, totalSpeed),
        estimatedTimeRemaining: calculateETA(downloadingFiles),
        networkEfficiency: Math.max(85, Math.min(100, 95 + Math.random() * 10 - 5)),
        activeConnections: downloadingFiles.length,
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [games, progressHistory])

  const calculateETA = (downloadingFiles: Array<any>) => {
    if (downloadingFiles.length === 0) return "0m"

    const totalRemaining = downloadingFiles.reduce((sum, file) => {
      const remaining = file.sizeBytes - file.downloadedBytes
      const speed = file.speed ? Number.parseFloat(file.speed.replace(" MB/s", "")) * 1024 * 1024 : 0
      return sum + (speed > 0 ? remaining / speed : 0)
    }, 0)

    const minutes = Math.ceil(totalRemaining / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} MB/s`
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-400"
    if (efficiency >= 85) return "text-yellow-400"
    return "text-red-400"
  }

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 95) return <CheckCircle2 className="h-4 w-4 text-green-400" />
    if (efficiency >= 85) return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    return <AlertTriangle className="h-4 w-4 text-red-400" />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Current Speed</p>
                <p className="text-lg font-bold">{formatSpeed(currentStats.totalDownloadSpeed)}</p>
                <p className="text-xs text-muted-foreground">Avg: {formatSpeed(currentStats.averageSpeed)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Peak Speed</p>
                <p className="text-lg font-bold">{formatSpeed(currentStats.peakSpeed)}</p>
                <p className="text-xs text-muted-foreground">This session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="text-lg font-bold">{currentStats.estimatedTimeRemaining}</p>
                <p className="text-xs text-muted-foreground">{currentStats.activeConnections} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {getEfficiencyIcon(currentStats.networkEfficiency)}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Network Efficiency</p>
                <p className={`text-lg font-bold ${getEfficiencyColor(currentStats.networkEfficiency)}`}>
                  {currentStats.networkEfficiency.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Connection quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Download Speed History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: "MB/s", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="downloadSpeed"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Network Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="networkUsage"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Download Progress Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {games
            .filter((g) => g.status !== "completed")
            .map((game) => {
              const completedFiles = game.files.filter((f: any) => f.status === "completed").length
              const totalFiles = game.files.length
              const downloadingFiles = game.files.filter((f: any) => f.status === "downloading")
              const currentSpeed = downloadingFiles.reduce((sum: number, file: any) => {
                const speed = file.speed ? Number.parseFloat(file.speed.replace(" MB/s", "")) : 0
                return sum + speed
              }, 0)

              return (
                <div key={game.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        className="w-8 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{game.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {completedFiles}/{totalFiles} files • {game.totalSize}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {currentSpeed > 0 && (
                        <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                          {formatSpeed(currentSpeed)}
                        </Badge>
                      )}
                      <span className="text-sm font-mono">{game.overallProgress}%</span>
                    </div>
                  </div>
                  <Progress value={game.overallProgress} className="h-2" />

                  {downloadingFiles.length > 0 && (
                    <div className="ml-11 space-y-1">
                      {downloadingFiles.slice(0, 2).map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{file.name}</span>
                          <div className="flex items-center gap-2">
                            {file.speed && <span className="text-blue-400">{file.speed}</span>}
                            <span>{file.progress}%</span>
                          </div>
                        </div>
                      ))}
                      {downloadingFiles.length > 2 && (
                        <p className="text-xs text-muted-foreground ml-0">
                          +{downloadingFiles.length - 2} more files downloading...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Clock,
  Download,
  Globe,
  HardDrive,
  Pause,
  Play,
  RotateCcw,
  Server,
  Settings,
  Shield,
  Square,
  Upload,
  Wifi,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DownloadControlsProps {
  games: Array<any>
  onGlobalAction: (action: "pauseAll" | "resumeAll" | "stopAll") => void
  onBandwidthChange: (maxDownload: number, maxUpload: number) => void
  onSettingsChange: (settings: any) => void
  className?: string
}

export function DownloadControls({
  games,
  onGlobalAction,
  onBandwidthChange,
  onSettingsChange,
  className,
}: DownloadControlsProps) {
  const [maxDownloadSpeed, setMaxDownloadSpeed] = useState([50]) // MB/s
  const [maxUploadSpeed, setMaxUploadSpeed] = useState([10]) // MB/s
  const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState([3])
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true)
  const [autoRetryAttempts, setAutoRetryAttempts] = useState("3")
  const [downloadScheduleEnabled, setDownloadScheduleEnabled] = useState(false)
  const [scheduleStartTime, setScheduleStartTime] = useState("22:00")
  const [scheduleEndTime, setScheduleEndTime] = useState("08:00")
  const [priorityMode, setPriorityMode] = useState("balanced")
  const [networkInterface, setNetworkInterface] = useState("auto")
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [verificationEnabled, setVerificationEnabled] = useState(true)

  const activeDownloads = games.filter((g) => g.status === "downloading").length
  const pausedDownloads = games.filter((g) => g.status === "paused").length
  const totalDownloads = games.filter((g) => g.status !== "completed").length

  const handleBandwidthChange = () => {
    onBandwidthChange(maxDownloadSpeed[0], maxUploadSpeed[0])
  }

  const handleSettingsChange = () => {
    onSettingsChange({
      maxConcurrentDownloads: maxConcurrentDownloads[0],
      autoRetryEnabled,
      autoRetryAttempts: Number.parseInt(autoRetryAttempts),
      downloadScheduleEnabled,
      scheduleStartTime,
      scheduleEndTime,
      priorityMode,
      networkInterface,
      compressionEnabled,
      verificationEnabled,
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Global Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Download Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => onGlobalAction("resumeAll")}
              disabled={activeDownloads === totalDownloads}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Resume All ({pausedDownloads})
            </Button>
            <Button
              variant="outline"
              onClick={() => onGlobalAction("pauseAll")}
              disabled={activeDownloads === 0}
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause All ({activeDownloads})
            </Button>
            <Button
              variant="outline"
              onClick={() => onGlobalAction("stopAll")}
              disabled={totalDownloads === 0}
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <Square className="h-4 w-4" />
              Stop All
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Retry Failed
            </Button>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="font-semibold">{activeDownloads}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Paused</p>
                <p className="font-semibold">{pausedDownloads}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Queued</p>
                <p className="font-semibold">{totalDownloads - activeDownloads}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">{totalDownloads}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bandwidth Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Bandwidth Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-500" />
                  Max Download Speed
                </Label>
                <Badge variant="outline">{maxDownloadSpeed[0]} MB/s</Badge>
              </div>
              <Slider
                value={maxDownloadSpeed}
                onValueChange={setMaxDownloadSpeed}
                onValueCommit={handleBandwidthChange}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 MB/s</span>
                <span>100 MB/s</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-green-500" />
                  Max Upload Speed
                </Label>
                <Badge variant="outline">{maxUploadSpeed[0]} MB/s</Badge>
              </div>
              <Slider
                value={maxUploadSpeed}
                onValueChange={setMaxUploadSpeed}
                onValueCommit={handleBandwidthChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 MB/s</span>
                <span>50 MB/s</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                Max Concurrent Downloads
              </Label>
              <Badge variant="outline">{maxConcurrentDownloads[0]} files</Badge>
            </div>
            <Slider
              value={maxConcurrentDownloads}
              onValueChange={setMaxConcurrentDownloads}
              onValueCommit={handleSettingsChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 file</span>
              <span>10 files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Download Priority */}
          <div className="space-y-3">
            <Label>Download Priority Mode</Label>
            <Select value={priorityMode} onValueChange={setPriorityMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced - Equal priority for all downloads</SelectItem>
                <SelectItem value="sequential">Sequential - One game at a time</SelectItem>
                <SelectItem value="size">Size Priority - Smaller games first</SelectItem>
                <SelectItem value="manual">Manual - User-defined priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Network Interface */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Network Interface
            </Label>
            <Select value={networkInterface} onValueChange={setNetworkInterface}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto - Best available connection</SelectItem>
                <SelectItem value="ethernet">Ethernet - Wired connection only</SelectItem>
                <SelectItem value="wifi">WiFi - Wireless connection only</SelectItem>
                <SelectItem value="cellular">Cellular - Mobile data (if available)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Auto Retry Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto Retry Failed Downloads</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically retry failed downloads after network errors
                </p>
              </div>
              <Switch checked={autoRetryEnabled} onCheckedChange={setAutoRetryEnabled} />
            </div>

            {autoRetryEnabled && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="retry-attempts">Max Retry Attempts</Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  value={autoRetryAttempts}
                  onChange={(e) => setAutoRetryAttempts(e.target.value)}
                  min="1"
                  max="10"
                  className="w-20"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Download Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Scheduled Downloads</Label>
                <p className="text-sm text-muted-foreground">Only download during specific hours to save bandwidth</p>
              </div>
              <Switch checked={downloadScheduleEnabled} onCheckedChange={setDownloadScheduleEnabled} />
            </div>

            {downloadScheduleEnabled && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={scheduleStartTime}
                    onChange={(e) => setScheduleStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={scheduleEndTime}
                    onChange={(e) => setScheduleEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Compression</Label>
                <p className="text-sm text-muted-foreground">
                  Compress downloads to save bandwidth (may increase CPU usage)
                </p>
              </div>
              <Switch checked={compressionEnabled} onCheckedChange={setCompressionEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>File Verification</Label>
                <p className="text-sm text-muted-foreground">Verify file integrity after download completion</p>
              </div>
              <Switch checked={verificationEnabled} onCheckedChange={setVerificationEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">Primary Server</p>
                <p className="text-sm text-muted-foreground">cdn1.gameserver.com</p>
                <p className="text-xs text-green-400">Online • 15ms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">Mirror Server</p>
                <p className="text-sm text-muted-foreground">cdn2.gameserver.com</p>
                <p className="text-xs text-green-400">Online • 23ms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Backup Server</p>
                <p className="text-sm text-muted-foreground">cdn3.gameserver.com</p>
                <p className="text-xs text-yellow-400">Slow • 156ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

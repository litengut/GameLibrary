import { useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  HardDrive,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface GameFile {
  id: string
  name: string
  size: string
  sizeBytes: number
  progress: number
  status: "downloading" | "completed" | "paused" | "error" | "pending"
  speed?: string
  timeRemaining?: string
  downloadedBytes: number
}

interface FileChunkTrackerProps {
  gameId: string
  gameTitle: string
  files: Array<GameFile>
  onFileAction: (fileId: string, action: "pause" | "resume" | "retry" | "delete") => void
}

export function FileChunkTracker({ gameId, gameTitle, files, onFileAction }: FileChunkTrackerProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  const toggleFileExpansion = (fileId: string) => {
    const newExpanded = new Set(expandedFiles)
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId)
    } else {
      newExpanded.add(fileId)
    }
    setExpandedFiles(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "downloading":
        return <Download className="h-4 w-4 text-blue-500 animate-pulse" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      downloading: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      error: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-muted/20 text-muted-foreground border-muted/30",
    }

    return <Badge className={`${variants[status as keyof typeof variants]} capitalize text-xs`}>{status}</Badge>
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const completedFiles = files.filter((f) => f.status === "completed").length
  const totalFiles = files.length
  const totalDownloadedBytes = files.reduce((sum, file) => sum + file.downloadedBytes, 0)
  const totalSizeBytes = files.reduce((sum, file) => sum + file.sizeBytes, 0)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">File Chunks - {gameTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {completedFiles}/{totalFiles} files completed • {formatBytes(totalDownloadedBytes)} /{" "}
                {formatBytes(totalSizeBytes)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {((totalDownloadedBytes / totalSizeBytes) * 100).toFixed(1)}% Complete
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid gap-2 max-h-96 overflow-y-auto pr-2">
          {files.map((file, index) => (
            <div key={file.id} className="group">
              <div
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => toggleFileExpansion(file.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        Part {index + 1}: {file.name}
                      </p>
                      {getStatusBadge(file.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                      {file.speed && <p className="text-xs text-blue-400 font-medium">{file.speed}</p>}
                      {file.timeRemaining && <p className="text-xs text-muted-foreground">ETA: {file.timeRemaining}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress
                      value={file.progress}
                      className="h-2"
                      style={{
                        background: file.status === "error" ? "rgb(239 68 68 / 0.2)" : undefined,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right font-mono">{file.progress}%</span>

                  {/* Action buttons - only show on hover or for active files */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.status === "downloading" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileAction(file.id, "pause")
                        }}
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}
                    {(file.status === "paused" || file.status === "pending") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileAction(file.id, "resume")
                        }}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    {file.status === "error" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileAction(file.id, "retry")
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileAction(file.id, "delete")
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded file details */}
              {expandedFiles.has(file.id) && (
                <div className="mt-2 ml-7 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Downloaded</p>
                      <p className="font-mono">{formatBytes(file.downloadedBytes)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-mono">{formatBytes(file.sizeBytes - file.downloadedBytes)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Path</p>
                      <p
                        className="font-mono truncate"
                        title={`/downloads/${gameTitle.toLowerCase().replace(/\s+/g, "_")}/${file.name}`}
                      >
                        /downloads/.../
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Chunk Size</p>
                      <p className="font-mono">5.0 GB</p>
                    </div>
                  </div>

                  {file.status === "error" && (
                    <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
                      <p className="text-red-400 font-medium">Error Details:</p>
                      <p className="text-red-300">Connection timeout - Click retry to resume download</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

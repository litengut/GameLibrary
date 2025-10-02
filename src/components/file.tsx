import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'

export function File() {
  const [toggle, setToggle] = useState(false)
  const toggleFileExpansion = (fileId: string) => {
    // const newExpanded = new Set(expandedFiles);
    // if (newExpanded.has(fileId)) {
    //   newExpanded.delete(fileId);
    // } else {
    //   newExpanded.add(fileId);
    // }
    // setExpandedFiles(newExpanded);
  }
  const onFileAction = (
    fileId: string,
    action: 'pause' | 'resume' | 'retry' | 'delete',
  ) => {}

  const file: GameFile = {
    id: 'file-1',
    name: 'GameInstaller.part1.rar',
    size: '1.5 GB',
    sizeBytes: 1.5 * 1024 * 1024 * 1024,
    downloadedBytes: (1.5 * 1024 * 1024 * 1024 * 42) / 100,
    status: 'downloading',
    progress: 42,
    speed: '3.2 MB/s',
    timeRemaining: '12m 30s',
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      downloading: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      pending: 'bg-muted/20 text-muted-foreground border-muted/30',
    }

    return (
      <Badge
        className={`${variants[status as keyof typeof variants]} capitalize text-xs`}
      >
        {status}
      </Badge>
    )
  }
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    )
  }

  return (
    <div key={file.id} className="group">
      <div
        className="flex @container items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => setToggle(!toggle)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getStatusIcon(file.status)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                Part {1 + 1}: {file.name}
              </p>
              {getStatusBadge(file.status)}
            </div>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-xs text-muted-foreground">{file.size}</p>
              {file.speed && (
                <p className="text-xs text-blue-400 font-medium">
                  {file.speed}
                </p>
              )}
              {file.timeRemaining && (
                <p className="text-xs text-muted-foreground">
                  ETA: {file.timeRemaining}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 @md:bg-green-600 ">
          <div className="w-24">
            <Progress
              value={file.progress}
              className="h-2"
              style={{
                background:
                  file.status === 'error' ? 'rgb(239 68 68 / 0.2)' : undefined,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-12 text-right font-mono">
            {file.progress}%
          </span>

          {/* Action buttons - only show on hover or for active files */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {file.status === 'downloading' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileAction(file.id, 'pause')
                }}
              >
                <Pause className="h-3 w-3" />
              </Button>
            )}
            {(file.status === 'paused' || file.status === 'pending') && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileAction(file.id, 'resume')
                }}
              >
                <Play className="h-3 w-3" />
              </Button>
            )}
            {file.status === 'error' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileAction(file.id, 'retry')
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
                onFileAction(file.id, 'delete')
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      {toggle && (
        <div className="mt-2 ml-7 p-3 bg-muted/30 rounded-lg border-l-2 border-primary/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Downloaded</p>
              <p className="font-mono">{formatBytes(file.downloadedBytes)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-mono">
                {formatBytes(file.sizeBytes - file.downloadedBytes)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">File Path</p>
              {/* <p
                className="font-mono truncate"
                title={`/downloads/${gameTitle.toLowerCase().replace(/\s+/g, "_")}/${file.name}`}
              >
                /downloads/.../
              </p> */}
            </div>
            <div>
              <p className="text-muted-foreground">Chunk Size</p>
              <p className="font-mono">5.0 GB</p>
            </div>
          </div>

          {file.status === 'error' && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
              <p className="text-red-400 font-medium">Error Details:</p>
              <p className="text-red-300">
                Connection timeout - Click retry to resume download
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

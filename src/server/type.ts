import type { Readable } from 'node:stream'

export type Game = {
  id: string
  title: string
  totalSize: string
  files: Array<GameFile>
  overallProgress: number
  status: 'downloading' | 'completed' | 'paused' | 'error'
  image: string
  genre: string
  releaseDate: string
  lastPlayed?: string
  playTime?: string
  rating?: number
  installPath?: string
  version?: string
}

export type GameFile = {
  id: string
  name: string
  url: string
  sizeBytes: number
  status: 'downloading' | 'completed' | 'paused' | 'error' | 'pending'
}

export type DownloadingFile = {
  id: string
  name: string
  url: string
  downloadedBytes: number
  sizeBytes: number
  startTime: number
  stream: Readable

  status: 'downloading' | 'completed' | 'paused' | 'error' | 'pending'
}

export type DownloadingFileStatus = {
  id: string
  percent: number
  elapsed: number
  speed: number
  downloadedBytes: number
  totalBytes: number
}

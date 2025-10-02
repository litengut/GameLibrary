type Game = {
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

type GameFile = {
  id: string
  name: string
  size: string
  sizeBytes: number
  progress: number
  status: 'downloading' | 'completed' | 'paused' | 'error' | 'pending'
  speed?: string
  timeRemaining?: string
  downloadedBytes: number
}

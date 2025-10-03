import { File } from './file'
import { Queue } from './queue'
import type { DownloadingFileStatus, GameFile } from '@/server/type'

const file: GameFile = {
  id: 'file-1',
  name: 'GameInstaller.part1.rar',
  url: 'https://example.com/gameinstaller.part1.rar',
  sizeBytes: 100 * 1024 * 1024,
  status: 'downloading',
}

const fileStatus: DownloadingFileStatus = {
  id: 'file-1',
  percent: 45,
  elapsed: 120,
  speed: 5.2,
  downloadedBytes: 50 * 1014 * 1024,
  totalBytes: 100 * 1024 * 1024,
}

export function Dashboard() {
  return (
    <>
      <Queue />
    </>
  )
}

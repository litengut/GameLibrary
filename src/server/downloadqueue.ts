import bytes from 'bytes'
import { downloadFile } from './downloadfile'
import { files } from './files'
import type { GameFile } from './type'

const queue: Array<GameFile> = []

export function getQueueIDs() {
  return queue.map((f) => f.id)
}

export function addToQueue() {
  const file: GameFile = {
    id: 'example-file-' + crypto.randomUUID(),
    name: 'file-' + crypto.randomUUID(),
    url: 'https://nbg1-speed.hetzner.com/100MB.bin',
    sizeBytes: bytes('100MB')!,
    status: 'pending',
  }
  queue.push(file)
  files.set(file.id, file)
}

export function startQueue() {
  const file = queue.shift()
  if (!file) return
  downloadFile(file, './test/bin')
}

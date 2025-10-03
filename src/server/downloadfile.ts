import * as fs from 'node:fs'

import axios from 'axios'

import bytes from 'bytes'

import type { DownloadingFile, DownloadingFileStatus, GameFile } from './type'
import type { Readable } from 'node:stream'
import type { AxiosResponse } from 'axios'

const downloading = new Map<string, DownloadingFile>()
const PromisesWaitingForNextFileChunk: Array<{ (value: void): void }> = []

function fireWaitingPromises() {
  PromisesWaitingForNextFileChunk.map((f) => {
    f()
  })
  PromisesWaitingForNextFileChunk.length = 0
}

export async function downloadFile(
  gameFile: GameFile,
  outputLocationPath: string,
) {
  const writer = fs.createWriteStream(outputLocationPath)
  const response: AxiosResponse<Readable> = await axios.get<Readable>(
    gameFile.url,
    {
      responseType: 'stream',
    },
  )

  const sizeBytes = parseInt(response.headers['content-length'], 10)

  response.data.pipe(writer)

  const file: DownloadingFile = {
    id: gameFile.id,
    name: gameFile.name,
    url: gameFile.url,
    stream: response.data,
    downloadedBytes: 0,
    sizeBytes,
    startTime: Date.now(),
    status: 'downloading',
  }
  downloading.set(file.id, file)

  let downloaded = 0
  response.data.on('data', (chunk: Buffer) => {
    downloaded += chunk.length
    const file = downloading.get(gameFile.id)
    if (!file) return
    file.downloadedBytes = downloaded
    downloading.set(gameFile.id, file)
    fireWaitingPromises()
  })

  downloading.set(gameFile.id, file)
  writer.on('finish', () => {
    console.log('\nDownload completed!')
    fireWaitingPromises()
    downloading.delete(gameFile.id)
    fireWaitingPromises()
    console.log(Array.from(downloading.values()))
  })
}

export function getDownloadingFiles(): Array<GameFile> {
  return [...downloading.values()].map((f) => ({
    id: f.id,
    name: f.name,
    url: f.url,
    sizeBytes: f.sizeBytes,
    status: f.status,
  }))
}

export async function* getDownloadingFileProgress(filename: string) {
  const file = downloading.get(filename)
  if (!file) return
  for await (const chunk of file.stream) {
    const file = downloading.get(filename)
    if (!file) return

    const percent = (file.downloadedBytes / file.sizeBytes) * 100

    const elapsed = (Date.now() - file.startTime) / 1000 // seconds
    const speed = file.downloadedBytes / 1024 / 1024 / elapsed // MB/s
    const downloadedBytes = file.downloadedBytes
    const totalBytes = file.sizeBytes
    const report: DownloadingFileStatus = {
      id: file.id,
      percent,
      elapsed,
      speed,
      downloadedBytes,
      totalBytes,
    }
    console.log(report)
    yield report
  }
}

export async function* getDownloadingFilesProgress() {
  while (true) {
    yield new Promise(
      (resolve: (value: Array<DownloadingFileStatus>) => void) => {
        PromisesWaitingForNextFileChunk.push(() =>
          resolve(
            Array.from(downloading.values()).map((f) => {
              const percent = (f.downloadedBytes / f.sizeBytes) * 100
              const elapsed = (Date.now() - f.startTime) / 1000 // seconds
              const speed = f.downloadedBytes / 1024 / 1024 / elapsed
              const downloadedBytes = f.downloadedBytes
              const totalBytes = f.sizeBytes

              const report = {
                id: f.id,
                percent,
                elapsed,
                speed,
                downloadedBytes,
                totalBytes,
              }
              return report
            }),
          ),
        )
      },
    )
  }
}

export async function downloadFilegpt(
  fileUrl: string,
  outputLocationPath: string,
): Promise<void> {
  console.log('Lol')

  const writer = fs.createWriteStream(outputLocationPath)

  const response = await axios.get(fileUrl, {
    responseType: 'stream',
  })

  const totalLength = parseInt(response.headers['content-length'], 10)

  console.log(`Starting download of ${totalLength / (1024 * 1024)} MB...\n`)

  let downloaded = 0
  const startTime = Date.now()

  response.data.on('data', (chunk: Buffer) => {
    downloaded += chunk.length

    const percent = ((downloaded / totalLength) * 100).toFixed(2)

    const elapsed = (Date.now() - startTime) / 1000 // seconds
    const speed = (downloaded / 1024 / 1024 / elapsed).toFixed(2) // MB/s
    const downloadedMB = (downloaded / 1024 / 1024).toFixed(2)
    const totalMB = (totalLength / 1024 / 1024).toFixed(2)

    process.stdout.write(
      `Downloaded: ${downloadedMB}/${totalMB} MB (${percent}%) | Speed: ${speed} MB/s\r`,
    )
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('\nDownload completed!')
      resolve()
    })

    writer.on('error', reject)
  })
}

// // Example usage
// (async () => {
//   const url = "https://speed.hetzner.de/100MB.bin"; // example test file
//   const output = path.resolve(__dirname, "downloaded_file.bin");

//   await downloadFile(url, output);
// })();

import * as fs from 'node:fs'
import axios from 'axios'

import type { Readable } from 'node:stream'
import type { AxiosResponse } from 'axios'

type DownloadingFile = {
  name: string
  downloaded: number
  totalLength: number
  startTime: number
  stream: Readable
}

const downloading = new Map<string, DownloadingFile>()
const PromisesWaitingForNextFile: Array<{ (value: void): void }> = []

export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string,
) {
  const writer = fs.createWriteStream(outputLocationPath)
  const response: AxiosResponse<Readable> = await axios.get<Readable>(fileUrl, {
    responseType: 'stream',
  })

  const totalLength = parseInt(response.headers['content-length'], 10)

  response.data.pipe(writer)

  const file: DownloadingFile = {
    name: fileUrl,
    stream: response.data,
    downloaded: 0,
    totalLength,
    startTime: Date.now(),
  }
  downloading.set(fileUrl, file)

  let downloaded = 0
  response.data.on('data', (chunk: Buffer) => {
    downloaded += chunk.length
    const file = downloading.get(fileUrl)
    if (!file) return
    file.downloaded = downloaded
    downloading.set(fileUrl, file)
    PromisesWaitingForNextFile.map((f) => {
      f()
    })
  })

  downloading.set(fileUrl, file)
  writer.on('finish', () => {
    console.log('\nDownload completed!')
    PromisesWaitingForNextFile.map((f) => {
      f()
    })
    downloading.delete(fileUrl)
    console.log(Array.from(downloading.values()))
  })
}

export function getDownloadingFileNames() {
  return downloading.keys()
}

export async function* getDownloadingFileProgress(filename: string) {
  const file = downloading.get(filename)
  if (!file) return
  for await (const chunk of file.stream) {
    const file = downloading.get(filename)
    if (!file) return

    const percent = ((file.downloaded / file.totalLength) * 100).toFixed(2)

    const elapsed = (Date.now() - file.startTime) / 1000 // seconds
    const speed = (file.downloaded / 1024 / 1024 / elapsed).toFixed(2) // MB/s
    const downloadedMB = (file.downloaded / 1024 / 1024).toFixed(2)
    const totalMB = (file.totalLength / 1024 / 1024).toFixed(2)
    const report = {
      percent,
      elapsed,
      speed,
      downloadedMB,
      totalMB,
    }
    console.log(report)
    yield report
  }
}

export async function* getDownloadingFilesProgress() {
  while (true) {
    yield new Promise((resolve) => {
      PromisesWaitingForNextFile.push(() =>
        resolve(
          Array.from(downloading.values()).map((f) => {
            const percent = ((f.downloaded / f.totalLength) * 100).toFixed(2)
            const elapsed = (Date.now() - f.startTime) / 1000 // seconds
            const speed = (f.downloaded / 1024 / 1024 / elapsed).toFixed(2) // MB/s
            const downloadedMB = (f.downloaded / 1024 / 1024).toFixed(2)
            const totalMB = (f.totalLength / 1024 / 1024).toFixed(2)
            const report = {
              percent,
              elapsed,
              speed,
              downloadedMB,
              totalMB,
            }
            return report
          }),
        ),
      )
    })
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

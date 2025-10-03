import * as path from 'node:path'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init'
import {
  downloadFile,
  getDownloadingFileProgress,
  getDownloadingFiles,
  getDownloadingFilesProgress,
} from './downloadfile'
import { addToQueue, getQueueIDs, startQueue } from './downloadqueue'
import { files } from './files'

export const appRouter = {
  hello: publicProcedure.query(() => 'Hello world!'),

  // file: publicProcedure.input(z.string()).mutation(async () => {
  //   const url = 'https://nbg1-speed.hetzner.com/100MB.bin' // example test file
  //   const output = path.resolve('./test', 'downloaded_file.bin')
  //   console.log(output)

  //   const out = await downloadFile(url, output)
  //   console.log(out)
  //   return url
  // }),
  file: publicProcedure.input(z.string()).query((opts) => {
    const id = opts.input // file id
    const file = files.get(id)
    return file
  }),

  speed: publicProcedure.input(z.string()).subscription(async function* (opts) {
    const gen = getDownloadingFileProgress(opts.input)
    for await (const chunk of gen) {
      yield chunk
    }
  }),
  allSpeed: publicProcedure.subscription(async function* () {
    const gen = getDownloadingFilesProgress()
    for await (const chunk of gen) {
      yield chunk
    }
  }),
  getQueue: publicProcedure.query(() => {
    return getQueueIDs()
  }),
  getDownloading: publicProcedure.subscription(async function* () {
    const gen = getDownloadingFiles()
    for await (const chunk of gen) {
      yield chunk
    }
  }),
  addToQueue: publicProcedure.mutation(() => {
    return addToQueue()
  }),
  startQueue: publicProcedure.mutation(() => {
    return startQueue()
  }),
  getCompletedFiles: publicProcedure.query(() => {
    return Array.from(files.values()).filter((f) => f.status === 'completed')
  }),
}

export const trpcRouter = createTRPCRouter({
  ...appRouter,
})
export type TRPCRouter = typeof trpcRouter

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import { File } from './file'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { useTRPC } from '@/server/react'

export function Queue() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data: queue, isLoading } = useQuery(trpc.getQueue.queryOptions())
  const { data: downloading = [] } = useSubscription(
    trpc.allSpeed.subscriptionOptions(undefined, {
      onData: (d) => {
        console.log(d)
      },
    }),
  )
  const { data: completedFiles } = useQuery(
    trpc.getCompletedFiles.queryOptions(),
  )
  const addToQueue = useMutation(
    trpc.addToQueue.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getQueue.queryKey() })
      },
    }),
  )
  const startQueue = useMutation(
    trpc.startQueue.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getQueue.queryKey() })
      },
    }),
  )
  if (isLoading && !queue && !downloading) return <div>Loading...</div>
  const downloadSorted = [...downloading].sort((a, b) => a.elapsed - b.elapsed)
  return (
    <>
      <ScrollArea className="h-[500px] rounded-md border">
        <div className="flex flex-col gap-4 p-4 pt-4">
          {completedFiles?.map((file) => (
            <File key={file.id} fileid={file.id} />
          ))}
          {downloadSorted?.map((file) => (
            <File key={file.id} fileid={file.id} fileStatus={file} />
          ))}
          {queue?.map((file) => (
            <File key={file} fileid={file} />
          ))}
        </div>
      </ScrollArea>

      <p>Contorts</p>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            addToQueue.mutate()
          }}
        >
          Add To Queue
        </Button>
        <Button
          onClick={() => {
            startQueue.mutate()
          }}
        >
          Start
        </Button>
        <Button
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: trpc.getCompletedFiles.queryKey(),
            })
          }}
        >
          Invalidate
        </Button>
      </div>
    </>
  )
}

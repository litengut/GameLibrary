import { useMutation, useQuery } from '@tanstack/react-query'
import { useSubscription } from '@trpc/tanstack-react-query'
import { useState } from 'react'
import { Button } from './ui/button'

import { useTRPC } from '@/server/react'

export function TestButton() {
  const trpc = useTRPC()
  const mutate = useMutation(trpc.file.mutationOptions())

  const sub = useSubscription(
    trpc.allSpeed.subscriptionOptions(undefined, {
      onData: (d) => {
        console.log(d)
      },
    }),
  )
  console.log(JSON.stringify(sub.data))

  function onClick() {
    mutate.mutate('test')

    console.log(JSON.stringify(sub.data))
  }
  return (
    <>
      <Button onClick={onClick}>test</Button>
    </>
  )
}

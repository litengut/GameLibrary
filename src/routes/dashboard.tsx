import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <SidebarProvider>
        <Outlet />
      </SidebarProvider>
      {/* </Suspense> */}
    </>
  )
}

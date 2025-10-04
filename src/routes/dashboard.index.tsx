import * as React from 'react'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from '@/components/ai/app-sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { GameDownloadDashboard } from '@/components/ai/game-download-dashboard'
import { Dashboard } from '@/components/dashboard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <>
      <Dashboard />
    </>
  )
}

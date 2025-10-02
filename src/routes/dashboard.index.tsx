import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexComponent,
})

function DashboardIndexComponent() {
  return (
    <div className="p-2">
      <div className="p-2">Welcome to the dashboard! You have </div>
    </div>
  )
}

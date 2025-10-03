import {
  BarChart3,
  ChevronUp,
  Download,
  GamepadIcon,
  Home,
  Library,
  Monitor,
  Settings,
  Sliders,
  User2,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Menu items.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Downloads',
      url: '#downloads',
      icon: Download,
    },
    {
      title: 'Monitor',
      url: '#monitor',
      icon: BarChart3,
    },
    {
      title: 'Controls',
      url: '#controls',
      icon: Sliders,
    },
    {
      title: 'Library',
      url: '#library',
      icon: Library,
    },
  ],
  navSecondary: [
    {
      title: 'System',
      url: '#',
      icon: Monitor,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
  ],
}

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const handleNavClick = (url: string) => {
    if (url.startsWith('#')) {
      const tab = url.substring(1)
      if (
        tab === 'downloads' ||
        tab === 'monitor' ||
        tab === 'controls' ||
        tab === 'library'
      ) {
        onTabChange(tab)
      } else {
        onTabChange('downloads') // Default to downloads for dashboard
      }
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GamepadIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Game Manager</span>

                <span className="truncate text-xs text-sidebar-foreground/70">
                  Download Hub
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleNavClick(item.url)}
                    isActive={
                      (item.title === 'Dashboard' &&
                        activeTab === 'downloads') ||
                      (item.title === 'Downloads' &&
                        activeTab === 'downloads') ||
                      (item.title === 'Monitor' && activeTab === 'monitor') ||
                      (item.title === 'Controls' && activeTab === 'controls') ||
                      (item.title === 'Library' && activeTab === 'library')
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} size="sm">
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                    <AvatarFallback className="rounded-lg">GM</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Game Master</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      gamer@example.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User2 />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

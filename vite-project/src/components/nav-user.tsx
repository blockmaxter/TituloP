import {
  BellIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
  SettingsIcon,
} from "lucide-react"
import { getAuth, signOut } from "firebase/auth"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserProfileDialog } from "@/components/UserProfileDialog"
import { SettingsDialog } from "@/components/SettingsDialog"
import { NotificationsDialog } from "@/components/NotificationsDialog"
import app from "@/lib/firebase"

export function NavUser({
  user,
  isAuthenticated = false,
  onLoginRequest,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  isAuthenticated?: boolean
  onLoginRequest?: () => void
}) {
  const { isMobile } = useSidebar()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {isAuthenticated ? user.name : "Visitante"}
                </span>
                {isAuthenticated && (
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                )}
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {isAuthenticated ? user.name : "Visitante"}
                  </span>
                  {isAuthenticated && (
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isAuthenticated ? (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    if (onLoginRequest) {
                      onLoginRequest();
                    } else {
                      window.location.href = "/login";
                    }
                  }}
                >
                  <UserCircleIcon />
                  Iniciar sesión
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                    <UserCircleIcon />
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <SettingsIcon />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNotificationsDialog(true)}>
                    <BellIcon />
                    Notificaciones
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut(getAuth(app))
                    localStorage.removeItem("firebaseUser")
                    window.location.href = "/"
                  }}
                >
                  <LogOutIcon />
                  Cerrar sesión
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Diálogo de perfil de usuario */}
        <UserProfileDialog 
          open={showProfileDialog} 
          onOpenChange={setShowProfileDialog} 
        />
        
        {/* Diálogo de configuración */}
        <SettingsDialog 
          open={showSettingsDialog} 
          onOpenChange={setShowSettingsDialog} 
        />
        
        {/* Diálogo de notificaciones */}
        <NotificationsDialog 
          open={showNotificationsDialog} 
          onOpenChange={setShowNotificationsDialog} 
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

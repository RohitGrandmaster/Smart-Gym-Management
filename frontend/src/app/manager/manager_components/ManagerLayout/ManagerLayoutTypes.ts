// RESPONSIBILITY: Defines all TypeScript prop interfaces for MANAGER layout shell components (Header, Sidebar). Single source of truth for layout prop contracts.

export interface ManagerSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export interface ManagerHeaderProps {
  title: string;
  subtitle?: string;
}

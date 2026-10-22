// RESPONSIBILITY: Defines all TypeScript prop interfaces for ADMIN layout shell components (Header, Sidebar). Single source of truth for layout prop contracts.

export interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

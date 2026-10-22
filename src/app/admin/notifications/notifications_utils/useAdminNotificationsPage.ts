// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export type NotificationItem = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
};

// Dummy data mirroring the header notifications
const initialNotifications: NotificationItem[] = [
  { id: '1', text: 'New member registration: John Doe', time: '5 minutes ago', unread: true },
  { id: '2', text: 'Payment received for Invoice #1245', time: '1 hour ago', unread: true },
  { id: '3', text: 'System backup completed successfully', time: '3 hours ago', unread: false },
  { id: '4', text: 'Trainer Mark requested schedule change', time: 'Yesterday', unread: false },
];

export const useAdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    toast.success('All notifications cleared');
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification removed');
  }, []);

  return {
    notifications,
    markAllAsRead,
    clearAll,
    markAsRead,
    deleteNotification,
  };
};


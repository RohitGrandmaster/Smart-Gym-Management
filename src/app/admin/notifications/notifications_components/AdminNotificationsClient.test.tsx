// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminNotificationsClient from './AdminNotificationsClient';

vi.mock('@/app/admin/notifications/notifications_utils/useAdminNotificationsPage', () => ({
  useAdminNotificationsPage: () => ({
    notifications: [
      { id: '1', text: 'Test notification one', time: '5m ago', unread: true },
      { id: '2', text: 'Test notification two', time: '1h ago', unread: false },
    ],
    markAllAsRead: vi.fn(),
    clearAll: vi.fn(),
    markAsRead: vi.fn(),
    deleteNotification: vi.fn(),
  }),
}));

vi.mock('@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider', () => ({
  useAdminConfirm: () => ({ confirm: vi.fn().mockResolvedValue(true) }),
}));

vi.mock('@/app/admin/notifications/notifications_components/AdminNotificationsList/AdminNotificationsList', () => ({
  default: ({ notifications }: { notifications: unknown[] }) => (
    <div data-testid="notifications-list">{notifications.length} items</div>
  ),
}));

describe('AdminNotificationsClient', () => {
  it('renders the All Notifications heading', () => {
    render(<AdminNotificationsClient />);
    expect(screen.getByText('All Notifications')).toBeInTheDocument();
  });

  it('shows unread count badge when there are unread notifications', () => {
    render(<AdminNotificationsClient />);
    expect(screen.getByText('1 New')).toBeInTheDocument();
  });

  it('renders Mark all read button', () => {
    render(<AdminNotificationsClient />);
    expect(screen.getByText(/Mark all read/i)).toBeInTheDocument();
  });

  it('renders Clear all button', () => {
    render(<AdminNotificationsClient />);
    expect(screen.getByText(/Clear all/i)).toBeInTheDocument();
  });

  it('renders the notifications list', () => {
    render(<AdminNotificationsClient />);
    expect(screen.getByTestId('notifications-list')).toBeInTheDocument();
  });

  it('Mark all read button is disabled when no unread notifications', () => {
    vi.doMock('@/app/admin/notifications/notifications_utils/useAdminNotificationsPage', () => ({
      useAdminNotificationsPage: () => ({
        notifications: [{ id: '1', text: 'Read notification', time: '1h ago', unread: false }],
        markAllAsRead: vi.fn(),
        clearAll: vi.fn(),
        markAsRead: vi.fn(),
        deleteNotification: vi.fn(),
      }),
    }));
    render(<AdminNotificationsClient />);
    const markAllBtn = screen.getByText(/Mark all read/i).closest('button');
    expect(markAllBtn).toBeDisabled();
  });
});

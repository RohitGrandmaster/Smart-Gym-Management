// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminNotificationsList from './AdminNotificationsList';
import type { NotificationItem } from '@/app/admin/notifications/notifications_utils/useAdminNotificationsPage';

vi.mock('@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider', () => ({
  useAdminConfirm: () => ({ confirm: vi.fn().mockResolvedValue(true) }),
}));

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', text: 'New member registration: John Doe', time: '5 minutes ago', unread: true },
  { id: '2', text: 'Payment received for Invoice #1245', time: '1 hour ago', unread: false },
];

describe('AdminNotificationsList', () => {
  it('renders empty state when no notifications', () => {
    render(<AdminNotificationsList notifications={[]} onMarkAsRead={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
  });

  it('renders all notification items', () => {
    render(<AdminNotificationsList notifications={MOCK_NOTIFICATIONS} onMarkAsRead={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('New member registration: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Payment received for Invoice #1245')).toBeInTheDocument();
  });

  it('renders timestamps for each notification', () => {
    render(<AdminNotificationsList notifications={MOCK_NOTIFICATIONS} onMarkAsRead={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });

  it('calls onMarkAsRead when hovering over unread notification', () => {
    const onMarkAsRead = vi.fn();
    render(<AdminNotificationsList notifications={MOCK_NOTIFICATIONS} onMarkAsRead={onMarkAsRead} onDelete={vi.fn()} />);
    const unreadItem = screen.getByText('New member registration: John Doe').closest('div[class*="group"]');
    if (unreadItem) fireEvent.mouseEnter(unreadItem);
    expect(onMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('does not call onMarkAsRead when hovering over already-read notification', () => {
    const onMarkAsRead = vi.fn();
    render(<AdminNotificationsList notifications={MOCK_NOTIFICATIONS} onMarkAsRead={onMarkAsRead} onDelete={vi.fn()} />);
    const readItem = screen.getByText('Payment received for Invoice #1245').closest('div[class*="group"]');
    if (readItem) fireEvent.mouseEnter(readItem);
    expect(onMarkAsRead).not.toHaveBeenCalled();
  });

  it('renders delete buttons for each notification', () => {
    render(<AdminNotificationsList notifications={MOCK_NOTIFICATIONS} onMarkAsRead={vi.fn()} onDelete={vi.fn()} />);
    const deleteButtons = screen.getAllByLabelText('Delete notification');
    expect(deleteButtons).toHaveLength(2);
  });
});

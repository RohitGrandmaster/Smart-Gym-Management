// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminNotificationsPage } from './useAdminNotificationsPage';

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useAdminNotificationsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('initializes with 4 notifications', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    expect(result.current.notifications).toHaveLength(4);
  });

  it('has 2 unread notifications initially', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    const unread = result.current.notifications.filter(n => n.unread);
    expect(unread).toHaveLength(2);
  });

  it('markAllAsRead sets all notifications to unread=false', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    act(() => { result.current.markAllAsRead(); });
    expect(result.current.notifications.every(n => !n.unread)).toBe(true);
  });

  it('clearAll removes all notifications', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    act(() => { result.current.clearAll(); });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('markAsRead marks a single notification as read', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    const unreadId = result.current.notifications.find(n => n.unread)!.id;
    act(() => { result.current.markAsRead(unreadId); });
    const updated = result.current.notifications.find(n => n.id === unreadId);
    expect(updated?.unread).toBe(false);
  });

  it('markAsRead does not affect other notifications', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    const unreadIds = result.current.notifications.filter(n => n.unread).map(n => n.id);
    act(() => { result.current.markAsRead(unreadIds[0]!); });
    const stillUnread = result.current.notifications.filter(n => n.unread);
    expect(stillUnread).toHaveLength(unreadIds.length - 1);
  });

  it('deleteNotification removes the notification by id', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    const idToDelete = result.current.notifications[0]!.id;
    act(() => { result.current.deleteNotification(idToDelete); });
    expect(result.current.notifications.find(n => n.id === idToDelete)).toBeUndefined();
    expect(result.current.notifications).toHaveLength(3);
  });

  it('deleteNotification does not remove other notifications', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    const idToDelete = result.current.notifications[0]!.id;
    const remainingIds = result.current.notifications.slice(1).map(n => n.id);
    act(() => { result.current.deleteNotification(idToDelete); });
    remainingIds.forEach(id => {
      expect(result.current.notifications.find(n => n.id === id)).toBeDefined();
    });
  });

  it('notifications have required fields', () => {
    const { result } = renderHook(() => useAdminNotificationsPage());
    result.current.notifications.forEach(n => {
      expect(n).toHaveProperty('id');
      expect(n).toHaveProperty('text');
      expect(n).toHaveProperty('time');
      expect(n).toHaveProperty('unread');
    });
  });
});

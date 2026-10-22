'use client';
// RESPONSIBILITY: Per-tenant direct messaging, email/SMS composer, and in-app notification center.
// All data is static/hardcoded. Fully functional UI with compose, send, and notification read state.
// DATA FLOW: INITIAL_MESSAGES / INITIAL_NOTIFICATIONS / MESSAGING_TENANTS → SuperadminMessagingClient → tabs + compose modal

import { useState, useRef, useEffect } from 'react';
import {
  Mail, MessageSquare, Bell, Send, Plus, CheckCheck,
  AlertTriangle, Info, X, Search, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type {
  TenantMessage,
  SuperadminNotification,
  MessageChannel,
  NotificationType,
  MessagingTab,
} from '@/app/superadmin/messaging/messaging_types/messaging_types';
import {
  CHANNEL_STYLES,
  MESSAGE_STATUS_STYLES,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  MESSAGING_TENANTS,
} from '@/app/superadmin/messaging/messaging_types/messaging_constants';

// Isolated notification icon component — avoids inline JSX in const objects (Rule 38)
function NotifIcon({ type }: { type: NotificationType }) {
  if (type === 'INFO') return <Info size={18} strokeWidth={2} className="text-info shrink-0" />;
  if (type === 'WARNING') return <AlertTriangle size={18} strokeWidth={2} className="text-warning shrink-0" />;
  return <AlertTriangle size={18} strokeWidth={2} className="text-danger shrink-0" />;
}

// Rule 20: Custom searchable tenant dropdown — never use native <select> for large datasets
function TenantSearchDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = MESSAGING_TENANTS.find((t) => t.id === value);
  const filtered = MESSAGING_TENANTS.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside
  // Dependency: [] — only registers once; ref is stable
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(id: string) {
    onChange(id);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors"
      >
        <span className={selected ? 'text-foreground' : 'text-secondary'}>
          {selected ? `${selected.name} — ${selected.plan}` : 'Select tenant...'}
        </span>
        <ChevronDown size={18} strokeWidth={2} className="text-secondary shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-popover border border-border rounded-lg shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
              <input
                type="text"
                autoFocus
                placeholder="Search tenants..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
          <ul role="listbox" className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-secondary">No tenants found.</li>
            )}
            {filtered.map((t) => (
              <li
                key={t.id}
                role="option"
                aria-selected={t.id === value}
                onClick={() => handleSelect(t.id)}
                className={`px-3 py-2 text-sm cursor-pointer motion-safe:transition-colors ${
                  t.id === value
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-input'
                }`}
              >
                {t.name} — {t.plan}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SuperadminMessagingClient() {
  const [tab, setTab] = useState<MessagingTab>('messages');
  const [messages, setMessages] = useState<TenantMessage[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<SuperadminNotification[]>(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<MessageChannel | 'ALL'>('ALL');
  const [composeOpen, setComposeOpen] = useState(false);

  const [composeTenantId, setComposeTenantId] = useState('');
  const [composeChannel, setComposeChannel] = useState<MessageChannel>('EMAIL');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const filteredMessages = messages.filter((m) => {
    const matchSearch =
      m.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'ALL' || m.channel === channelFilter;
    return matchSearch && matchChannel;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleSend() {
    if (!composeTenantId || !composeSubject.trim() || !composeBody.trim()) {
      toast.error('Please fill all fields.');
      return;
    }
    const tenant = MESSAGING_TENANTS.find((g) => g.id === composeTenantId);
    const newMsg: TenantMessage = {
      id: `msg-${Date.now()}`,
      tenantId: composeTenantId,
      tenantName: tenant?.name ?? 'Unknown',
      channel: composeChannel,
      subject: composeSubject,
      body: composeBody,
      status: 'SENT',
      sentAt: new Date().toISOString(),
      scheduledAt: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [newMsg, ...prev]);
    toast.success('Message sent successfully.');
    setComposeOpen(false);
    setComposeTenantId('');
    setComposeSubject('');
    setComposeBody('');
    setComposeChannel('EMAIL');
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tenant Messaging</h1>
          <p className="text-secondary mt-1 text-sm">
            Direct email/SMS to tenants and in-app notification center.
          </p>
        </div>
        {tab === 'messages' && (
          <button
            onClick={() => setComposeOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-semibold px-4 py-2 rounded-lg text-sm shadow-lg shadow-primary/20 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus size={18} strokeWidth={2} /> Compose Message
          </button>
        )}
        {tab === 'notifications' && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-input border border-border text-secondary hover:text-foreground px-4 py-2 rounded-lg text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CheckCheck size={18} strokeWidth={2} /> Mark All Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-input border border-border rounded-xl p-1 w-fit">
        {([
          { key: 'messages' as const, label: 'Messages', icon: Mail },
          { key: 'notifications' as const, label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: Bell },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-secondary hover:text-foreground'
            }`}
          >
            <Icon size={18} strokeWidth={2} /> {label}
          </button>
        ))}
      </div>

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Search tenant or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['ALL', 'EMAIL', 'SMS', 'IN_APP'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    channelFilter === ch
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-input text-secondary border-border hover:text-foreground'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-input/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Tenant</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Channel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-input/30 motion-safe:transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{msg.tenantName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${CHANNEL_STYLES[msg.channel]}`}>
                          {msg.channel === 'EMAIL' && <Mail size={11} />}
                          {msg.channel === 'SMS' && <MessageSquare size={11} />}
                          {msg.channel === 'IN_APP' && <Bell size={11} />}
                          {msg.channel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-secondary max-w-xs truncate">{msg.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${MESSAGE_STATUS_STYLES[msg.status]}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-secondary text-xs">
                        {msg.sentAt ? new Date(msg.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredMessages.length === 0 && (
              <div className="py-16 text-center text-secondary">No messages found.</div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-4 rounded-xl border motion-safe:transition-colors ${
                notif.read ? 'bg-card border-border opacity-60' : 'bg-card border-border shadow-sm'
              }`}
            >
              <div className="mt-0.5">
                <NotifIcon type={notif.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${notif.read ? 'text-secondary' : 'text-foreground'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-secondary mt-0.5">{notif.body}</p>
                <p className="text-xs text-disabled mt-1">
                  {new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  aria-label="Mark as read"
                  title="Mark as read"
                  className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="py-16 text-center text-secondary">No notifications.</div>
          )}
        </div>
      )}

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-overlay border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Compose Message</h2>
              <button
                onClick={() => setComposeOpen(false)}
                aria-label="Close compose modal"
                className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-input motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider block mb-1">Tenant</label>
                {/* Rule 20: Custom searchable dropdown — no native <select> for large datasets */}
                <TenantSearchDropdown value={composeTenantId} onChange={setComposeTenantId} />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider block mb-1">Channel</label>
                <div className="flex gap-2">
                  {(['EMAIL', 'SMS', 'IN_APP'] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setComposeChannel(ch)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        composeChannel === ch
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-input text-secondary border-border hover:text-foreground'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider block mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Message subject..."
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-secondary uppercase tracking-wider block mb-1">Body</label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setComposeOpen(false)}
                className="px-4 py-2 rounded-lg bg-input text-secondary hover:text-foreground text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-black font-semibold text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Send size={18} strokeWidth={2} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

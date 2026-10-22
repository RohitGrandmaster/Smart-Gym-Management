// RESPONSIBILITY: API client for the Bulk Communications module.
import type { Broadcast, BroadcastFormValues, BulkCommsKPIData } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';
import { MOCK_BROADCASTS, MOCK_BULK_COMMS_KPI } from '@/app/admin/bulk-communications/bulk_communications_utils/AdminBulkCommunicationsSharedConstants';

let mockBroadcasts = [...MOCK_BROADCASTS];

export const bulkCommsApi = {
  fetchBroadcasts: async (): Promise<Broadcast[]> => mockBroadcasts,
  fetchKPIs: async (): Promise<BulkCommsKPIData> => MOCK_BULK_COMMS_KPI,
  sendBroadcast: async (payload: BroadcastFormValues): Promise<Broadcast> => {
    const broadcast: Broadcast = {
      id: `bc${Date.now()}`,
      title: payload.title,
      message: payload.message,
      channel: payload.channel,
      recipientFilter: { gymIds: payload.gymIds, planIds: [], memberStatus: payload.memberStatus },
      recipientCount: Math.floor(Math.random() * 500) + 100,
      status: payload.scheduledAt ? 'scheduled' : 'sent',
      scheduledAt: payload.scheduledAt || undefined,
      sentAt: payload.scheduledAt ? undefined : new Date().toISOString(),
      createdBy: 'Admin',
      createdAt: new Date().toISOString().slice(0, 10),
      deliveredCount: payload.scheduledAt ? undefined : Math.floor(Math.random() * 490) + 95,
    };
    mockBroadcasts = [broadcast, ...mockBroadcasts];
    return broadcast;
  },
  deleteBroadcast: async (id: string): Promise<void> => {
    mockBroadcasts = mockBroadcasts.filter(b => b.id !== id);
  },
};

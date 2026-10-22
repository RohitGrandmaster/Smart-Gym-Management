// RESPONSIBILITY: API client for the Announcements module.
import type { Announcement, AnnouncementFormValues, AnnouncementKPIData } from '@/app/admin/announcements/announcements_types/announcements_types';
import { MOCK_ANNOUNCEMENTS, MOCK_ANNOUNCEMENT_KPI, ANNOUNCEMENT_GYM_OPTIONS } from '@/app/admin/announcements/announcements_utils/AdminAnnouncementsSharedConstants';

let mockList = [...MOCK_ANNOUNCEMENTS];

function resolveGymNames(gymIds: string[]): string[] {
  if (gymIds.includes('all')) return ['All Gyms'];
  return gymIds.map(id => ANNOUNCEMENT_GYM_OPTIONS.find(g => g.value === id)?.label ?? id);
}

function deriveStatus(publishedAt: string, expiresAt: string): Announcement['status'] {
  const now = new Date();
  const pub = new Date(publishedAt);
  const exp = new Date(expiresAt);
  if (now < pub) return 'scheduled';
  if (now > exp) return 'expired';
  return 'active';
}

export const announcementsApi = {
  fetchAnnouncements: async (): Promise<Announcement[]> => {
    await new Promise(r => setTimeout(r, 350));
    return mockList;
  },
  fetchKPIs: async (): Promise<AnnouncementKPIData> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_ANNOUNCEMENT_KPI;
  },
  createAnnouncement: async (payload: AnnouncementFormValues): Promise<Announcement> => {
    await new Promise(r => setTimeout(r, 600));
    const entry: Announcement = {
      ...payload,
      id: `ann${Date.now()}`,
      gymNames: resolveGymNames(payload.gymIds),
      status: deriveStatus(payload.publishedAt, payload.expiresAt),
      createdBy: 'Super Admin',
      createdAt: new Date().toISOString(),
      viewCount: 0,
    };
    mockList = [entry, ...mockList];
    return entry;
  },
  updateAnnouncement: async (id: string, payload: AnnouncementFormValues): Promise<Announcement> => {
    await new Promise(r => setTimeout(r, 600));
    mockList = mockList.map(a =>
      a.id === id
        ? { ...a, ...payload, gymNames: resolveGymNames(payload.gymIds), status: deriveStatus(payload.publishedAt, payload.expiresAt) }
        : a
    );
    return mockList.find(a => a.id === id)!;
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
    mockList = mockList.filter(a => a.id !== id);
  },
  togglePin: async (id: string): Promise<Announcement> => {
    await new Promise(r => setTimeout(r, 300));
    mockList = mockList.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a);
    return mockList.find(a => a.id === id)!;
  },
};

'use client';
// RESPONSIBILITY: Renders a global alert banner if the gym tenant is nearing or has reached their subscription usage limits.

import { useState, useEffect } from 'react';
import { adminUsageApi } from '@/app/admin/admin_api/admin_usage_api';
import type { AdminUsageData } from '@/app/admin/admin_api/admin_usage_api';
import { AlertTriangle, X } from 'lucide-react';

export default function AdminUsageAlert() {
  const [usageData, setUsageData] = useState<AdminUsageData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await adminUsageApi.fetchMyUsage();
        if (res.success && res.data) {
          setUsageData(res.data);
        }
      } catch (err) {
        // Ignore errors for this non-blocking background check
      }
    }
    fetchUsage();
  }, []);

  if (!usageData || !isVisible) return null;

  const getUsagePercent = (used: number, limit: number) => limit > 0 ? (used / limit) * 100 : 0;
  
  const smsPercent = getUsagePercent(usageData.smsSent, usageData.smsLimit);
  const storagePercent = getUsagePercent(usageData.databaseGb + usageData.mediaGb, usageData.storageLimitGb);
  const membersPercent = getUsagePercent(usageData.activeMembers, usageData.memberLimit);
  const staffPercent = getUsagePercent(usageData.staffCount, usageData.staffLimit);
  
  const maxPercent = Math.max(smsPercent, storagePercent, membersPercent, staffPercent);
  
  // Only show alert if usage is > 90%
  if (maxPercent <= 90) return null;

  const isLimitReached = maxPercent >= 100;
  const bgColor = isLimitReached ? 'bg-[var(--danger)]/10 border-[var(--danger)]' : 'bg-[var(--warning)]/10 border-[var(--warning)]';
  const textColor = isLimitReached ? 'text-danger' : 'text-warning';
  const borderColor = isLimitReached ? 'border-danger' : 'border-warning';

  return (
    <div className={`flex items-center justify-between p-3 border-b ${bgColor} ${borderColor} px-6 motion-safe:transition-all motion-safe:duration-300`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className={textColor} size={20} />
        <span className="text-sm font-medium text-foreground">
          {isLimitReached 
            ? 'Action Required: You have reached one or more limits of your subscription plan. Please upgrade to avoid service interruption.' 
            : 'Warning: You are near to end this subscription limit. Please review your usage meters.'}
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 rounded-md hover:bg-black/10 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Dismiss alert"
      >
        <X size={18} className="text-secondary hover:text-foreground" />
      </button>
    </div>
  );
}

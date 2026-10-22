'use client';
// RESPONSIBILITY: Renders a single row in the Affiliates data table. Handles row-level action buttons with stopPropagation. Purely presentational.
import { Pencil, Trash2, Power, Check } from 'lucide-react';
import { useSuperadminConfirm } from '@/app/superadmin/superadmin_components/SuperadminFeedback/SuperadminConfirmProvider';
import SuperadminAffiliateStatusBadge from '@/app/superadmin/affiliates/affiliates_components/SuperadminAffiliateStatusBadge/SuperadminAffiliateStatusBadge';
import type { Affiliate, AffiliateStatus } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';

interface AffiliatesTableRowProps {
  affiliate: Affiliate;
  onToggleStatus: (id: string, currentStatus: AffiliateStatus) => void;
  onEdit: (affiliate: Affiliate) => void;
  onDelete: (id: string) => void;
}

export default function SuperadminAffiliatesTableRow({ affiliate: aff, onToggleStatus, onEdit, onDelete }: AffiliatesTableRowProps) {
  const { confirm } = useSuperadminConfirm();
  return (
    <tr 
      className="hover:bg-primary/5 motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out group cursor-pointer"
      onClick={() => onEdit(aff)}
    >
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground truncate" title={aff.name}>{aff.name}</span>
          <span className="text-xs text-secondary truncate" title={aff.email}>{aff.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className="px-2 py-1 bg-input rounded text-secondary font-mono">{aff.referralCode}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
        {aff.totalReferred} Gyms
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-success font-medium">
        ₹{aff.commissionEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SuperadminAffiliateStatusBadge status={aff.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus(aff.id, aff.status); }}
            className="p-1.5 text-secondary hover:text-primary motion-safe:transition-colors"
            title={aff.status === 'ACTIVE' ? 'Suspend Affiliate' : 'Activate Affiliate'}
            aria-label={aff.status === 'ACTIVE' ? `Suspend ${aff.name}` : `Activate ${aff.name}`}
          >
            {aff.status === 'ACTIVE' ? <Power className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(aff); }}
            className="p-1.5 text-secondary hover:text-info motion-safe:transition-colors"
            title="Edit Affiliate"
            aria-label={`Edit ${aff.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={async (e) => { 
              e.stopPropagation(); 
              const ok = await confirm({
                title: 'Delete Affiliate',
                message: `Are you sure you want to delete affiliate "${aff.name}"? This action cannot be undone.`,
                type: 'danger',
                confirmText: 'Delete'
              });
              if (ok) {
                onDelete(aff.id); 
              }
            }}
            className="p-1.5 text-secondary hover:text-danger motion-safe:transition-colors"
            title="Delete Affiliate"
            aria-label={`Delete ${aff.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

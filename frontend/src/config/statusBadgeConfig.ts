// RESPONSIBILITY: Centralized status-to-badge-style mapping for the entire frontend (Design System �4).
// All table rows, cards, and list items that render a status badge MUST import from here.
// Zero inline switch/if statements allowed in UI components for status styling.

/** Generic status types shared across modules. */
export type MemberStatus = "active" | "expired" | "pending" | "cancelled";
export type StaffStatus = "active" | "on-leave" | "inactive";
export type InquiryStatus = "new" | "follow_up" | "converted" | "closed";
export type PaymentStatus = "paid" | "pending" | "overdue" | "refunded";
export type HrLeaveStatus = "approved" | "pending" | "rejected";
export type OrderStatus = "completed" | "pending" | "refunded" | "cancelled";
export type GymsStatus = "active" | "suspended" | "trial" | "churned";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type JobStatus = "running" | "completed" | "failed" | "queued" | "cancelled";
export type SystemStatus = "healthy" | "degraded" | "down" | "maintenance";

/** The shape of a badge style object returned by the config. */
export interface BadgeStyle {
  /** Tailwind classes for the badge container. */
  className: string;
  /** Human-readable label to display. */
  label: string;
}

// --- Member Status -------------------------------------------------------------
export const MEMBER_STATUS_BADGE: Record<MemberStatus, BadgeStyle> = {
  active:    { className: "bg-success-bg text-success",   label: "Active" },
  expired:   { className: "bg-danger-bg text-danger",     label: "Expired" },
  pending:   { className: "bg-warning-bg text-warning",   label: "Pending" },
  cancelled: { className: "bg-border text-text-secondary", label: "Cancelled" },
};

// --- Staff Status --------------------------------------------------------------
export const STAFF_STATUS_BADGE: Record<StaffStatus, BadgeStyle> = {
  active:    { className: "bg-success-bg text-success",   label: "Active" },
  "on-leave": { className: "bg-warning-bg text-warning",  label: "On Leave" },
  inactive:  { className: "bg-border text-text-secondary", label: "Inactive" },
};

// --- Inquiry Status ------------------------------------------------------------
export const INQUIRY_STATUS_BADGE: Record<InquiryStatus, BadgeStyle> = {
  new:        { className: "bg-info-bg text-info",         label: "New" },
  follow_up:  { className: "bg-warning-bg text-warning",   label: "Follow Up" },
  converted:  { className: "bg-success-bg text-success",   label: "Converted" },
  closed:     { className: "bg-border text-text-secondary", label: "Closed" },
};

// --- Payment Status ------------------------------------------------------------
export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, BadgeStyle> = {
  paid:     { className: "bg-success-bg text-success",   label: "Paid" },
  pending:  { className: "bg-warning-bg text-warning",   label: "Pending" },
  overdue:  { className: "bg-danger-bg text-danger",     label: "Overdue" },
  refunded: { className: "bg-purple-bg text-purple",     label: "Refunded" },
};

// --- Payment Methods -----------------------------------------------------------
export type PaymentMethod = "cash" | "upi" | "card" | "bank" | "online";
export const PAYMENT_METHOD_BADGE: Record<PaymentMethod, BadgeStyle> = {
  cash:   { className: "bg-pay-cash-bg text-pay-cash",   label: "Cash" },
  upi:    { className: "bg-pay-upi-bg text-pay-upi",     label: "UPI" },
  card:   { className: "bg-pay-card-bg text-pay-card",   label: "Card" },
  bank:   { className: "bg-pay-bank-bg text-pay-bank",   label: "Bank Transfer" },
  online: { className: "bg-info-bg text-info",            label: "Online" },
};

// --- HR Leave Status -----------------------------------------------------------
export const HR_LEAVE_STATUS_BADGE: Record<HrLeaveStatus, BadgeStyle> = {
  approved: { className: "bg-success-bg text-success", label: "Approved" },
  pending:  { className: "bg-warning-bg text-warning", label: "Pending" },
  rejected: { className: "bg-danger-bg text-danger",   label: "Rejected" },
};

// --- Order Status --------------------------------------------------------------
export const ORDER_STATUS_BADGE: Record<OrderStatus, BadgeStyle> = {
  completed: { className: "bg-success-bg text-success",   label: "Completed" },
  pending:   { className: "bg-warning-bg text-warning",   label: "Pending" },
  refunded:  { className: "bg-purple-bg text-purple",     label: "Refunded" },
  cancelled: { className: "bg-danger-bg text-danger",     label: "Cancelled" },
};

// --- Gyms (Superadmin) Status --------------------------------------------------
export const GYMS_STATUS_BADGE: Record<GymsStatus, BadgeStyle> = {
  active:    { className: "bg-success-bg text-success",   label: "Active" },
  suspended: { className: "bg-danger-bg text-danger",     label: "Suspended" },
  trial:     { className: "bg-info-bg text-info",         label: "Trial" },
  churned:   { className: "bg-border text-text-secondary", label: "Churned" },
};

// --- Ticket Status (Superadmin) ------------------------------------------------
export const TICKET_STATUS_BADGE: Record<TicketStatus, BadgeStyle> = {
  open:        { className: "bg-danger-bg text-danger",     label: "Open" },
  in_progress: { className: "bg-warning-bg text-warning",   label: "In Progress" },
  resolved:    { className: "bg-success-bg text-success",   label: "Resolved" },
  closed:      { className: "bg-border text-text-secondary", label: "Closed" },
};

// --- Background Job Status (Superadmin) ----------------------------------------
export const JOB_STATUS_BADGE: Record<JobStatus, BadgeStyle> = {
  running:   { className: "bg-info-bg text-info",         label: "Running" },
  completed: { className: "bg-success-bg text-success",   label: "Completed" },
  failed:    { className: "bg-danger-bg text-danger",     label: "Failed" },
  queued:    { className: "bg-warning-bg text-warning",   label: "Queued" },
  cancelled: { className: "bg-border text-text-secondary", label: "Cancelled" },
};

// --- System Health Status (Superadmin) ----------------------------------------
export const SYSTEM_STATUS_BADGE: Record<SystemStatus, BadgeStyle> = {
  healthy:     { className: "bg-success-bg text-success",   label: "Healthy" },
  degraded:    { className: "bg-warning-bg text-warning",   label: "Degraded" },
  down:        { className: "bg-danger-bg text-danger",     label: "Down" },
  maintenance: { className: "bg-purple-bg text-purple",     label: "Maintenance" },
};

/**
 * Generic fallback for unknown status strings.
 * Use this when the status value isn't guaranteed to match a known key.
 */
export function getStatusBadge(status: string): BadgeStyle {
  return {
    className: "bg-border text-text-secondary",
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
  };
}

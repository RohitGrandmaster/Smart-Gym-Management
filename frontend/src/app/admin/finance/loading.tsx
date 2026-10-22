// RESPONSIBILITY: Provides the implementation for loading.tsx functionality within its module.
export default function FinanceLoading() {
 return (
 <div className="min-h-full flex items-center justify-center">
 <div className="text-center">
 <div className="w-12 h-12 border-4 border-t-transparent rounded-full motion-safe:animate-spin mx-auto mb-3" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
 <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading finance module...</p>
 </div>
 </div>
 );
}

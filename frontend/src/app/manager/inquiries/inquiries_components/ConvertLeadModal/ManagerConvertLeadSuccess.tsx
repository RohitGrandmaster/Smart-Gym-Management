// RESPONSIBILITY: Renders the success state after converting a lead.
import React from 'react';

export interface ManagerConvertLeadSuccessProps {
  successData: {
    gymId: string;
    name: string;
    phone: string;
    planName: string;
    joinDate: string;
    expiryDate: string;
    paidAmount: number;
    pendingAmount: number;
    aadhaar?: string;
  };
  closeConvert: () => void;
}

export default function ManagerConvertLeadSuccess({ successData, closeConvert }: ManagerConvertLeadSuccessProps) {
  const handleSendWhatsApp = () => {
    if (!successData || !successData.phone) return;
    const phone = successData.phone.replace(/\D/g, '');
    const aadhaarLine = successData.aadhaar ? `\n• *Aadhaar No:* ${successData.aadhaar}` : '';
    const message = `🎉 *Congratulations ${successData.name}!* 🎉\n\nYour admission at GymSmart is confirmed. Welcome to the fitness family! 💪\n\n*📝 ADMISSION DETAILS*\n• *Gym ID:* ${successData.gymId}\n• *Plan:* ${successData.planName}${aadhaarLine}\n• *Join Date:* ${new Date(successData.joinDate).toLocaleDateString('en-IN')}\n• *Expiry Date:* ${new Date(successData.expiryDate).toLocaleDateString('en-IN')}\n\n*💰 PAYMENT DETAILS*\n• *Paid:* ₹${successData.paidAmount}\n• *Pending:* ₹${successData.pendingAmount}\n\nLet's crush those goals! 🔥`;
    
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden border-2 border-success motion-safe:animate-in motion-safe:zoom-in-95">
        <div className="px-8 py-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-5 border border-success/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">Admission Successful!</h3>
          <p className="text-secondary mb-8 text-sm">
            <span className="font-semibold text-primary">{successData.name}</span> is now a member. Gym ID: <strong className="text-success">{successData.gymId}</strong>
          </p>
          
          <div className="w-full space-y-3 mb-8 text-left">
            <div className="bg-input/50 p-4 rounded-xl border border-border">
              <p className="text-sm font-semibold text-foreground mb-3 text-center">Share admission details with member</p>
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Send Welcome WhatsApp
              </button>
            </div>
          </div>

          <button
            onClick={closeConvert}
            className="px-8 py-2.5 text-sm font-bold rounded-xl border border-border text-secondary hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
}

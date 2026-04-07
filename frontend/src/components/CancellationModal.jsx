import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function CancellationModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Ordered wrong one",
    "Price is not manageable",
    "Address is incorrect",
    "It takes too much time",
    "Selected wrong payment method",
    "Others"
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    const finalReason = reason === "Others" ? `Others: ${otherReason}` : reason;
    onConfirm(orderId, finalReason);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transform animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold uppercase tracking-widest text-black">Cancel Order</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Order Ref: #{orderId.slice(-8).toUpperCase()}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-300 hover:text-black transition-colors rounded-full hover:bg-gray-50">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm font-medium text-gray-600 mb-4">Why are you canceling this order? Your feedback helps us improve.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {reasons.map((r, i) => (
                <label 
                  key={i} 
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${reason === r ? 'bg-black border-black text-white' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300'}`}
                >
                  <input 
                    type="radio" 
                    name="reason" 
                    value={r} 
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${reason === r ? 'border-white' : 'border-gray-300'}`}>
                    {reason === r && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{r}</span>
                </label>
              ))}
            </div>

            {reason === "Others" && (
              <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-300">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Please explain briefly</label>
                <textarea 
                  required
                  placeholder="Tell us more..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black min-h-[100px] transition-all"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              >
                Go Back
              </button>
              <button 
                type="submit"
                className="flex-1 bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-gray-900 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Confirm Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

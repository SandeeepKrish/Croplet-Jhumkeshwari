import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Smartphone, CheckCircle, ChevronRight, Mail, User } from "lucide-react";
import { toggleAuthModal, login } from "../redux/authSlice";
import { sendOTP, verifyOTP, updateProfile } from "../services/api";
import toast from "react-hot-toast";

export default function AuthModal() {
  const { isAuthModalOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: ProfileInfo
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const toastStyle = { borderRadius: '0px', background: '#333', color: '#fff', fontWeight: 'bold' };

  const handleSendOTP = async () => {
    if (email.includes("@")) {
      setLoading(true);
      try {
        const response = await sendOTP(email);
        setStep(2);
        toast.success("OTP sent successfully!", { 
            style: toastStyle
        });
      } catch (error) {
        console.error("OTP send error:", error);
        toast.error(error.response?.data?.message || "Failed to send OTP", { style: toastStyle });
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a valid email address.", { style: toastStyle });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      setLoading(true);
      try {
        const response = await verifyOTP(email, otp);
        
        if (response.data.user.name) {
          dispatch(login(response.data.user));
          toast.success(`Welcome back, ${response.data.user.name}!`, { style: toastStyle });
        } else {
          setStep(3);
          toast.success("OTP Verified! Tell us about yourself.", { style: toastStyle });
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        toast.error(error.response?.data?.message || "Invalid OTP", { style: toastStyle });
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a 6-digit OTP.", { style: toastStyle });
    }
  };

  const handleCompleteProfile = async () => {
    if (userInfo.name && userInfo.phone) {
      setLoading(true);
      try {
        const response = await updateProfile(email, userInfo.name, userInfo.phone);
        
        dispatch(login(response.data.user));
        toast.success(`Welcome to Jhumkeshwari, ${userInfo.name}!`, { 
            style: toastStyle,
            icon: '👋'
        });
      } catch (error) {
        console.error("Profile complete error:", error);
        toast.error("Failed to save profile.", { style: toastStyle });
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please provide your name and phone number.", { style: toastStyle });
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => dispatch(toggleAuthModal())}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white shadow-2xl overflow-hidden rounded-sm animate-fade-in-up">
        <button 
          onClick={() => dispatch(toggleAuthModal())}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-10">
          {/* Logo / Title Area */}
          <div className="text-center mb-10">
            <h1 className="text-xl font-normal tracking-[0.2em] mb-2 uppercase">JHUMKESHWARI</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Premium Ethnic Jewelry</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-wide text-black mb-2 uppercase">Login / Signup</h3>
                <p className="text-xs text-gray-500 font-medium">Please enter your email address to get an OTP.</p>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center pr-2 border-r group-focus-within:text-black">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50 border focus:border-black outline-none font-bold tracking-wider text-sm transition-all"
                />
              </div>
              <button 
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-black text-white py-4 font-bold tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 uppercase text-sm"
              >
                {loading ? "SENDING..." : "Send OTP"} <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-wide text-black mb-2 uppercase">Verify OTP</h3>
                <p className="text-xs text-gray-500 font-medium whitespace-pre-wrap flex flex-col">
                  <span>OTP has been sent to</span>
                  <span className="text-black font-bold mt-1 lowercase truncate w-full">{email}</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                 <input 
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border text-center focus:border-black outline-none font-bold tracking-[0.5em] text-lg transition-all"
                  maxLength={6}
                />
              </div>
              <button 
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-black text-white py-4 font-bold tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 uppercase text-sm"
              >
                {loading ? "VERIFYING..." : "Verify & Continue"} <ChevronRight size={18} />
              </button>
              <p className="text-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-[10px] font-bold tracking-wider uppercase text-gray-400 hover:text-black border-b border-transparent hover:border-black pb-0.5"
                >
                  Change Email
                </button>
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold tracking-wide text-black mb-2 uppercase">Almost There!</h3>
                <p className="text-xs text-gray-500 font-medium">Let us know you better.</p>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" />
                  <input 
                    type="text"
                    placeholder="Your Full Name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border focus:border-black outline-none font-bold tracking-wider text-sm transition-all"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-2 pr-2 border-r group-focus-within:text-black">
                    <Smartphone size={18} />
                    <span className="text-xs font-bold">+91</span>
                  </div>
                  <input 
                    type="tel"
                    placeholder="Mobile Number"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="w-full pl-20 pr-4 py-4 bg-gray-50 border focus:border-black outline-none font-bold tracking-wider text-sm transition-all"
                    maxLength={10}
                  />
                </div>
              </div>
              <button 
                onClick={handleCompleteProfile}
                disabled={loading}
                className="w-full bg-black text-white py-4 font-bold tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 uppercase text-sm"
              >
                 {loading ? "SAVING..." : "START SHOPPING"} <CheckCircle size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

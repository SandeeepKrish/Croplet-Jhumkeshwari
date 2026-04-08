import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Truck, ChevronLeft, CheckCircle, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { placeOrder, fetchUserOrders } from "../services/api";
import ScannerImg from "../assets/Scanner.jpeg";

export default function Checkout() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: localStorage.getItem("deliveryPincode") || ""
  });
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showQR, setShowQR] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0); // Percentage
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const toastStyle = { borderRadius: '0px', background: '#333', color: '#fff', fontWeight: 'bold' };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const calculateTotalNumeric = () => {
    const subtotal = items.reduce((total, item) => {
      const numericPrice = typeof item.price === "string"
        ? parseFloat(item.price.replace(/,/g, ""))
        : parseFloat(item.price);
      return total + (isNaN(numericPrice) ? 0 : numericPrice) * item.quantity;
    }, 0);
    
    return subtotal - (subtotal * (discount / 100));
  };

  const handleApplyCoupon = async () => {
    if (couponInput.toUpperCase() !== "NEWCOMER") {
      toast.error("Invalid coupon code.", { style: toastStyle });
      return;
    }

    try {
      const orders = await fetchUserOrders(user.id || user._id);
      if (orders && orders.length > 0) {
        toast.error("This coupon is only for first-time orders.", { style: toastStyle });
        return;
      }
      
      setDiscount(10);
      setIsCouponApplied(true);
      toast.success("NEWCOMER coupon applied! 10% OFF", { icon: '🎉', style: toastStyle });
    } catch (error) {
       toast.error("Failed to verify coupon eligibility.");
    }
  };

  const calculateTotal = () => {
    return calculateTotalNumeric().toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
  };

  const handlePlaceOrder = async () => {
    const fullAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`;
    if (shippingAddress.street.length < 5 || !shippingAddress.pincode) {
      toast.error("Please provide a complete shipping address.", { style: toastStyle });
      return;
    }

    if (paymentMethod === "online" && !showQR) {
      toast.error("Please generate and scan the QR code first.", { style: toastStyle });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.id || user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: fullAddress,
        totalAmount: calculateTotalNumeric(),
        products: items.map(item => ({
            productId: item.id,
            name: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        }))
      };

      await placeOrder(orderData);

      setPlaced(true);
      toast.success("Order Placed Successfully!", {
        style: toastStyle,
        duration: 5000,
        icon: '🎉'
      });
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("Failed to place order. Please try again.", { style: toastStyle });
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-bold tracking-widest uppercase">Thank You!</h1>
        <p className="text-xl text-gray-600 font-medium">Your order has been placed successfully.</p>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Order ID: #{Math.floor(Math.random() * 9999) + 1000}</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-10 px-10 py-4 bg-black text-white font-bold tracking-[0.2em] hover:bg-gray-800 transition-all uppercase"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-16 min-h-screen text-[#232323] font-sans">
      
      {/* Checkout Forms (Left) */}
      <div className="w-full lg:w-2/3 space-y-12">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
             <ChevronLeft size={24} />
           </button>
           <h1 className="text-4xl font-bold tracking-widest uppercase">Checkout</h1>
        </div>

        {/* 1. Contact Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
             <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
             <h2 className="text-xl font-bold uppercase tracking-widest">Your Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
               <input type="text" value={user?.name || ""} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none font-bold text-sm" />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</label>
               <input type="text" value={user?.phone ? `+91 ${user.phone}` : ""} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none font-bold text-sm" />
            </div>
            <div className="md:col-span-2 space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
               <input type="text" value={user?.email || ""} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none font-bold text-sm" />
            </div>
          </div>
        </section>

        {/* 2. Shipping Address */}
        <section className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 border-b pb-4">
             <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
             <h2 className="text-xl font-bold uppercase tracking-widest">Shipping Address</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Street Address</label>
                <textarea 
                  required
                  placeholder="House No., Street Area..."
                  rows={2}
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-black outline-none font-medium text-sm transition-all resize-none"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                <input 
                  required
                  type="text" 
                  placeholder="Delhi"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-black outline-none font-medium text-sm transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                <input 
                  required
                  type="text" 
                  placeholder="New Delhi"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 focus:border-black outline-none font-medium text-sm transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-1 relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                <input 
                  required
                  type="text" 
                  placeholder="110001"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                  className={`w-full px-4 py-3 bg-white border border-gray-300 focus:border-black outline-none font-bold text-sm transition-all ${shippingAddress.pincode && 'bg-yellow-50/20'}`}
                />
                {localStorage.getItem("deliveryPincode") && (
                  <span className="absolute right-4 bottom-3 text-[9px] font-black text-pink-500 uppercase tracking-widest pointer-events-none">Saved Location</span>
                )}
              </div>
          </div>
        </section>

        {/* 3. Payment Selection */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
             <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
             <h2 className="text-xl font-bold uppercase tracking-widest">Payment Method</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
             <div 
               className={`p-6 border-2 rounded-sm flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-black bg-gray-50/50" : "border-gray-100 hover:border-gray-200"}`}
               onClick={() => { setPaymentMethod("cod"); setShowQR(false); }}
             >
                <div className={`w-5 h-5 border-4 rounded-full ${paymentMethod === "cod" ? "border-black" : "border-gray-300"}`}></div>
                <div>
                   <h4 className="font-bold text-sm uppercase">Cash on Delivery</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Pay when you receive</p>
                </div>
                <Truck size={24} className={paymentMethod === "cod" ? "text-black" : "text-gray-300"} />
             </div>
             <div 
               className={`p-6 border-2 rounded-sm flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === "online" ? "border-black bg-gray-50/50" : "border-gray-100 hover:border-gray-200"}`}
               onClick={() => setPaymentMethod("online")}
             >
                <div className={`w-5 h-5 border-4 rounded-full ${paymentMethod === "online" ? "border-black" : "border-gray-300"}`}></div>
                <div>
                   <h4 className="font-bold text-sm uppercase">Online Payment</h4>
                   <p className="text-[10px] text-[#a87449] font-bold uppercase tracking-widest">QR CODE SCANNER</p>
                </div>
                <CreditCard size={24} className={paymentMethod === "online" ? "text-black" : "text-gray-300"} />
             </div>
          </div>

          {/* QR Code Generating Section */}
          {paymentMethod === "online" && (
            <div className="bg-gray-50 p-8 border border-gray-100 rounded-sm space-y-6 animate-fade-in text-center">
              {!showQR ? (
                <div className="py-10">
                  <h4 className="text-lg font-bold uppercase tracking-widest mb-4">Pay Online via Gpay/PhonePe</h4>
                  <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">Click below to generate the custom QR code for your transaction. Scan and pay from any UPI app.</p>
                  <button 
                    onClick={() => setShowQR(true)}
                    className="px-8 py-3 bg-[#a87449] text-white font-bold tracking-[0.2em] text-xs hover:bg-[#8e623a] transition-all uppercase shadow-lg"
                  >
                    Generate Payment QR
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="p-4 bg-white shadow-xl border border-gray-200 rounded-sm">
                    <img 
                      src={ScannerImg} 
                      alt="Payment QR" 
                      className="w-64 h-auto max-w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                      <CheckCircle size={14} /> Scan and Pay ₹{calculateTotal()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Please keep the payment confirmation screenshot ready.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full text-white py-5 font-bold tracking-[0.3em] text-lg transition-all uppercase shadow-xl ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
        >
          {loading ? "PLACING YOUR ORDER..." : "PLACE YOUR ORDER"}
        </button>
      </div>

      {/* Summary (Right) */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-10 border border-gray-200 p-8 space-y-8 bg-gray-50/30">
          <h3 className="text-xl font-bold tracking-widest uppercase border-b pb-4">Order Summary</h3>
          
          {/* Coupon Input */}
          {!isCouponApplied ? (
            <div className="space-y-3 pb-6 border-b">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Apply Coupon</label>
              <div className="flex gap-2">
                <input 
                   placeholder="NEWCOMER" 
                   value={couponInput}
                   onChange={(e) => setCouponInput(e.target.value)}
                   className="flex-1 px-4 py-2 bg-white border border-gray-200 outline-none font-bold text-xs uppercase"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-medium italic">New users get 10% off with code NEWCOMER</p>
            </div>
          ) : (
            <div className="pb-6 border-b flex justify-between items-center animate-fade-in">
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-pink-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">NEWCOMER APPLIED</span>
              </div>
              <button 
                onClick={() => { setDiscount(0); setIsCouponApplied(false); setCouponInput(""); }}
                className="text-[9px] font-bold underline uppercase text-gray-400 hover:text-black"
              >
                Remove
              </button>
            </div>
          )}
          
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                 <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <h5 className="text-xs font-bold uppercase mb-1">{item.title}</h5>
                    <p className="text-xs text-gray-500 font-bold uppercase">Qty: {item.quantity}</p>
                 </div>
                 <span className="text-sm font-bold">₹ {item.price}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between text-sm font-medium">
               <span className="text-gray-500 font-bold tracking-widest uppercase text-xs">Subtotal</span>
               <span className="font-bold">₹ {(calculateTotalNumeric() / (1 - (discount/100))).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            {isCouponApplied && (
               <div className="flex justify-between text-sm font-medium animate-fade-in">
                 <span className="text-pink-500 font-bold tracking-widest uppercase text-xs">Discount (10%)</span>
                 <span className="text-pink-500 font-bold">- ₹ {(calculateTotalNumeric() * (discount/100) / (1 - (discount/100))).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
               </div>
            )}
            <div className="flex justify-between text-sm font-medium border-b pb-4">
               <span className="text-gray-500 font-bold tracking-widest uppercase text-xs">Shipping</span>
               <span className="text-green-600 font-bold text-xs uppercase">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2">
               <span className="text-lg font-bold uppercase tracking-widest">Total</span>
               <span className="text-2xl font-bold">₹ {calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

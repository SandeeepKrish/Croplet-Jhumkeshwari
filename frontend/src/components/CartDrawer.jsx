import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { toggleCart, incrementQuantity, decrementQuantity, removeFromCart } from "../redux/cartSlice";
import { toggleAuthModal } from "../redux/authSlice";

export default function CartDrawer() {
  const { items, isOpen } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      // price may be a number (from DB) or a string — handle both safely
      const numericPrice = typeof item.price === "string"
        ? parseFloat(item.price.replace(/,/g, ""))
        : parseFloat(item.price);
      return total + (isNaN(numericPrice) ? 0 : numericPrice) * item.quantity;
    }, 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
  };

  const handleCheckout = () => {
    dispatch(toggleCart()); // Close drawer
    if (!isLoggedIn) {
      dispatch(toggleAuthModal()); // Ask for login
    } else {
      navigate("/checkout"); // Go to checkout page
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* ... previous code ... */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={() => dispatch(toggleCart())}
      ></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* ... previous content ... */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold tracking-widest uppercase">Your Cart ({items.length})</h2>
          <button 
            onClick={() => dispatch(toggleCart())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ... items map ... */}
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <span className="text-6xl">🛍️</span>
              <p className="text-lg font-medium">Your cart is empty.</p>
              <button 
                onClick={() => dispatch(toggleCart())}
                className="text-black font-bold border-b border-black pb-1 hover:text-gray-600 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6">
                <div className="w-24 h-32 bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-black uppercase">{item.title}</h4>
                      <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-black mt-1">₹ {item.price}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300">
                      <button 
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        className="p-2 hover:bg-gray-100 transition-colors border-r"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        className="p-2 hover:bg-gray-100 transition-colors border-l"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-600 uppercase tracking-widest">Total</span>
              <span className="text-xl font-bold">₹ {calculateTotal()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 font-bold tracking-[0.2em] hover:bg-gray-800 transition-colors uppercase"
            >
              PROCEED TO CHECKOUT
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

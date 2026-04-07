import React from "react";
import { X, Heart, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist, getImageUrl } from "../services/api";
import { addToWishlistLocal, removeFromWishlistLocal } from "../redux/wishlistSlice";
import toast from "react-hot-toast";

export default function ProductModal({ product, onClose }) {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isSaved = wishlistItems.some(item => item._id === product._id);

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }
    try {
      if (isSaved) {
        dispatch(removeFromWishlistLocal(product._id));
        if (user?.id) await removeFromWishlist(user.id, product._id);
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlistLocal(product));
        if (user?.id) await addToWishlist(user.id, product._id);
        toast.success("Saved to wishlist", { icon: '❤️' });
      }
    } catch (e) {
      toast.error("Sync failed");
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      image: getImageUrl(product.image)
    }));
    toast.success(`${product.name} added to bag!`, { icon: '🛍️' });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300 rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-[#faf9f6] flex items-center justify-center p-6">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="w-full h-auto max-h-[600px] object-contain shadow-xl"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#a87449] uppercase">Handcrafted Collection</span>
              <h2 className="text-3xl font-light tracking-[0.1em] text-black uppercase leading-tight">{product.name}</h2>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-2xl font-bold text-black tracking-tight">₹{product.price}</span>
                <span className="text-sm text-gray-400 line-through tracking-wider">₹{Math.round(product.price * 1.5)}</span>
                <span className="bg-[#e8d5cc] text-[#6d5145] text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">33% OFF</span>
              </div>
            </div>

            <div className="w-12 h-0.5 bg-[#a87449]"></div>

            <div className="space-y-4 text-gray-500 text-sm leading-relaxed tracking-wide">
              <p>Experience the timeless elegance of {product.name}, a masterpiece of traditional craftsmanship blended with modern design. Each piece is meticulously curated to bring out the heritage of Indian jewelry.</p>
              <ul className="grid grid-cols-2 gap-4 text-[11px] font-bold text-gray-700 uppercase tracking-[0.1em]">
                <li>✨ Premium Finish</li>
                <li>💎 Artisan Crafted</li>
                <li>📦 Safe Shipping</li>
                <li>🛡️ Quality Guaranteed</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 font-bold tracking-[0.2em] hover:bg-gray-800 transition-all uppercase flex items-center justify-center gap-3 shadow-lg"
              >
                <ShoppingBag size={18} />
                Add to Bag
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`w-14 h-14 border flex items-center justify-center transition-all ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-black'}`}
              >
                <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center uppercase tracking-[0.2em] pt-4 font-medium italic">
              Estimated Delivery: 3-5 Business Days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

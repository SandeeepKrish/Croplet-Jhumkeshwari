import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { toggleWishlist, removeFromWishlistLocal } from "../redux/wishlistSlice";
import { addToCart, toggleCart } from "../redux/cartSlice";
import { removeFromWishlist, getImageUrl } from "../services/api";
import toast from "react-hot-toast";

export default function WishlistDrawer({ onProductClick }) {
  const { items, isOpen } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleRemove = async (productId) => {
    dispatch(removeFromWishlistLocal(productId));
    if (user?.id) {
      try {
        await removeFromWishlist(user.id, productId);
        toast.success("Removed from wishlist");
      } catch (e) {
        console.error("Failed to sync wishlist removal");
      }
    }
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      image: getImageUrl(product.image)
    }));
    toast.success("Added to bag!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleWishlist())}
      ></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase">My Wishlist ({items.length})</h2>
          <button 
            onClick={() => dispatch(toggleWishlist())}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <span className="text-6xl italic font-serif">❤️</span>
              <p className="text-sm font-bold tracking-widest uppercase opacity-60">Your wishlist is empty</p>
              <button 
                onClick={() => dispatch(toggleWishlist())}
                className="text-black font-bold border-b-2 border-black pb-1 hover:text-gray-600 transition-colors tracking-widest text-xs"
              >
                DISCOVER OUR COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-4 border-b border-gray-50 pb-6 group">
                <div 
                  className="w-24 h-32 bg-gray-50 overflow-hidden cursor-pointer"
                  onClick={() => onProductClick(item)}
                >
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 
                        className="text-[11px] font-bold text-black uppercase tracking-widest cursor-pointer hover:text-[#a87449]"
                        onClick={() => onProductClick(item)}
                      >
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#a87449] mt-2">₹ {item.price}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center justify-center gap-2 w-full bg-black text-white text-[10px] font-bold tracking-[0.2em] py-2.5 hover:bg-gray-800 transition-colors uppercase"
                  >
                    <ShoppingBag size={12} />
                    Add to Bag
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toggleAuthModal } from "../redux/authSlice";
import { addToWishlistLocal, removeFromWishlistLocal } from "../redux/wishlistSlice";
import { fetchProducts, getImageUrl, addToWishlist, removeFromWishlist } from "../services/api";

import toast from "react-hot-toast";

export default function NewArrivals() {
  const [viewCols, setViewCols] = useState(3);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Sample data simulating the Tarohi Jewels New Arrivals page
  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        const arrivals = data.filter(p => p.createdAt && new Date(p.createdAt) >= fiveDaysAgo);
        setProducts(arrivals);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login first to shop!", {
        style: { borderRadius: '0px', background: '#333', color: '#fff', fontWeight: 'bold' }
      });
      setTimeout(() => {
        dispatch(toggleAuthModal());
      }, 700);
      return;
    }
    dispatch(addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      image: getImageUrl(product.image)
    }));
    toast.success(`${product.name} added to bag!`, {
        style: { borderRadius: '0px', background: '#333', color: '#fff', fontWeight: 'bold' },
        icon: '🛍️'
    });
  };

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation(); // prevent parent click
    if (!isLoggedIn) {
      toast.error("Please login to save this!", {
        style: { borderRadius: '0px', background: '#333', color: '#fff', fontWeight: 'bold' }
      });
      setTimeout(() => dispatch(toggleAuthModal()), 700);
      return;
    }
    
    const isSaved = wishlistItems.some(item => item._id === product._id);
    try {
        if (isSaved) {
            dispatch(removeFromWishlistLocal(product._id));
            if(user?.id) await removeFromWishlist(user.id, product._id);
            toast.success("Removed from wishlist", { style: { borderRadius: '0px', background: '#333', color: '#fff' }});
        } else {
            dispatch(addToWishlistLocal(product));
            if(user?.id) await addToWishlist(user.id, product._id);
            toast.success("Saved to wishlist", { icon: '❤️', style: { borderRadius: '0px', background: '#333', color: '#fff' }});
        }
    } catch (e) {
        toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10 min-h-screen text-[#232323] font-sans">
      <aside className="w-full lg:w-1/4 space-y-8 pr-4">
        <div className="mb-6 border-b pb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium tracking-wider uppercase">
            <Link to="/" className="hover:text-black">Home</Link> <span className="mx-1">/</span> New Arrivals
          </div>
          <h1 className="text-3xl font-bold tracking-wide">New Arrivals</h1>
        </div>

        <div className="border-b pb-6">
          <ul className="space-y-3 text-sm tracking-wide">
            <li className="font-bold flex justify-between items-center cursor-pointer">
              CATEGORIES <ChevronDown size={16} />
            </li>
            <li className="text-gray-600 hover:text-black hover:font-medium cursor-pointer transition-colors pl-1">Necklaces</li>
            <li className="text-black font-semibold cursor-pointer pl-1">Earrings / Jhumkas</li>
            <li className="text-gray-600 hover:text-black hover:font-medium cursor-pointer transition-colors pl-1">Rings</li>
            <li className="text-gray-600 hover:text-black hover:font-medium cursor-pointer transition-colors pl-1">Bracelets</li>
          </ul>
        </div>

        <div className="border-b pb-6">
          <h3 className="font-bold text-sm tracking-wide mb-4 flex justify-between items-center cursor-pointer">
            AVAILABILITY <ChevronDown size={16} />
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-700 hover:text-black">
              <input type="checkbox" className="w-4 h-4 accent-black" />
              In stock ({products.length})
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer text-gray-700 hover:text-black">
              <input type="checkbox" className="w-4 h-4 accent-black" />
              Out of stock (0)
            </label>
          </div>
        </div>

        <div className="pb-6">
          <h3 className="font-bold text-sm tracking-wide mb-4 flex justify-between items-center cursor-pointer">
            PRICE <ChevronDown size={16} />
          </h3>
          <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
            <span>₹0.00</span>
            <span>₹10,000.00</span>
          </div>
          <input type="range" className="w-full accent-black cursor-pointer" />
        </div>
      </aside>

      <main className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-8">
          <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-gray-500 mb-4 sm:mb-0">
            <span className="text-black font-bold border-b border-black pb-0.5">VIEW AS</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewCols(2)} className={`w-4 h-4 rounded-sm border flex items-center justify-center p-0.5 ${viewCols === 2 ? 'border-black bg-gray-100' : 'border-gray-300'}`}>
                <div className="w-full h-full flex gap-px"><div className="bg-current w-1/2 h-full"></div><div className="bg-current w-1/2 h-full"></div></div>
              </button>
              <button onClick={() => setViewCols(3)} className={`w-5 h-4 rounded-sm border flex items-center justify-center p-0.5 ${viewCols === 3 ? 'border-black bg-gray-100' : 'border-gray-300'}`}>
                <div className="w-full h-full flex gap-px"><div className="bg-current w-1/3 h-full"></div><div className="bg-current w-1/3 h-full"></div><div className="bg-current w-1/3 h-full"></div></div>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold tracking-wider text-black">
            <span className="text-gray-500 font-medium">{products.length} PRODUCTS</span>
            <div className="flex items-center border p-2 cursor-pointer hover:border-gray-400 transition-colors">
              SORT BY: FEATURED <ChevronDown size={14} className="ml-2" />
            </div>
          </div>
        </div>

        <div className={`grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${viewCols}`}>
          {products.map((prod) => (
            <div key={prod._id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-[#fdfdfd] overflow-hidden mb-5 flex items-center justify-center border border-gray-100 rounded-sm shadow-sm">
                <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[10px] font-bold tracking-widest text-[#232323] z-20 shadow-sm border border-gray-100 uppercase">
                  New
                </div>
                
                <img 
                  src={getImageUrl(prod.image)} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />

                <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <button 
                    onClick={(e) => handleToggleWishlist(e, prod)}
                    className="w-9 h-9 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors"
                  >
                    <Heart size={16} fill={wishlistItems.some(i => i._id === prod._id) ? "currentColor" : "none"} />
                  </button>
                  <button className="w-9 h-9 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors">
                    <Eye size={16} />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <button 
                    onClick={() => handleAddToCart(prod)}
                    className="w-full bg-[#232323] text-white py-3.5 text-[11px] font-bold tracking-[0.2em] hover:bg-black transition-colors"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-[15px] font-normal capitalize text-[#232323] mb-2 hover:text-gray-500 transition-colors line-clamp-1">{prod.name}</h4>
                <div className="text-[15px] font-bold text-[#232323]">
                  Rs. {prod.price}
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">
            Curating new arrivals for you...
          </div>
        )}
      </main>
    </div>
  );
}

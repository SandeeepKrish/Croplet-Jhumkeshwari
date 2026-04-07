import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Search, MapPin, Heart, ShoppingBag, User, Zap } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "./redux/cartSlice";

import Home from "./pages/Home";
import NewArrivals from "./pages/NewArrivals";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import { toggleAuthModal, logout } from "./redux/authSlice";
import { setWishlist, toggleWishlist } from "./redux/wishlistSlice";
import { fetchWishlist, searchProducts, getImageUrl } from "./services/api";
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import WishlistDrawer from "./components/WishlistDrawer";
import ProductModal from "./components/ProductModal";
import ChatBot from "./components/ChatBot";

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const data = await searchProducts(searchQuery);
          setSearchResults(data);
        } catch (e) {
          console.error("Search failed");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      const loadWishlist = async () => {
        try {
          const data = await fetchWishlist(user.id);
          dispatch(setWishlist(data));
        } catch (e) {
          console.error("Failed to load wishlist");
        }
      };
      loadWishlist();
    }
  }, [isLoggedIn, user?.id, dispatch]);

  const [deliveryPincode, setDeliveryPincode] = React.useState(localStorage.getItem("deliveryPincode") || "");
  const [showPincodeModal, setShowPincodeModal] = React.useState(false);
  const [tempPin, setTempPin] = React.useState(deliveryPincode);

  const handleUpdatePincode = () => {
    setTempPin(deliveryPincode);
    setShowPincodeModal(true);
  };

  const savePincode = () => {
    setDeliveryPincode(tempPin);
    localStorage.setItem("deliveryPincode", tempPin);
    setShowPincodeModal(false);
    if (tempPin) toast.success(`Delivery pincode set to ${tempPin}`);
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-white font-sans text-gray-900 flex flex-col relative px-4 md:px-8 max-w-[1600px] mx-auto shadow-2xl shadow-gray-200/50`}>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Custom Pincode Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold tracking-[0.2em] uppercase mb-8 border-b pb-4 text-center">Set Delivery Location</h3>
            <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-6 text-center italic">Enter your pincode for accurate delivery timing</p>
            <div className="space-y-6">
              <input 
                type="text" 
                placeholder="6 Digit Pincode"
                value={tempPin}
                onChange={(e) => setTempPin(e.target.value)}
                autoFocus
                className="w-full text-center text-2xl font-bold tracking-[0.3em] py-4 bg-gray-50 border-b-2 border-gray-100 focus:border-black outline-none transition-colors"
                maxLength={6}
              />
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowPincodeModal(false)}
                  className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={savePincode}
                  className="flex-1 py-4 text-[10px] font-bold tracking-widest uppercase bg-black text-white hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isAdminPath && (
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/">
                <h1 className="text-2xl font-normal tracking-[0.2em] hover:text-gray-700 cursor-pointer uppercase">JHUMKESHWARI</h1>
              </Link>
              <div 
                onClick={handleUpdatePincode}
                className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-black transition-colors"
              >
                <MapPin size={16} className="text-pink-500" />
                <span>{deliveryPincode ? `Deliver to ${deliveryPincode}` : 'Update Delivery Pincode'}</span>
                <span className="text-xs">▼</span>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-8 relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Jhumkas, Combo Sets..."
                className="w-full bg-[#f5f3ef] rounded-full py-2.5 pl-6 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-[#a87449] transition-all"
              />
              <Search className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-[#a87449] animate-pulse' : 'text-gray-500'}`} size={18} />
              
              {/* Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md shadow-2xl z-[1000] border border-gray-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2">
                    {searchResults.map((prod) => (
                      <div 
                        key={prod._id}
                        onClick={() => {
                          setSelectedProduct(prod);
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-[#faf9f6] cursor-pointer group transition-colors rounded-xl"
                      >
                        <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={getImageUrl(prod.image)} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-black truncate">{prod.name}</h4>
                          <p className="text-[10px] text-[#a87449] font-bold mt-1 tracking-tight">₹{prod.price}</p>
                          {prod.category && <span className="text-[8px] text-gray-400 uppercase tracking-widest">{prod.category}</span>}
                        </div>
                        <Zap size={14} className="text-gray-200 group-hover:text-yellow-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#faf9f6] p-3 text-center border-t border-gray-50">
                    <button className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                      View all {searchResults.length} matching items
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                   <Link to="/profile" className="flex items-center gap-2 hover:text-[#a87449] transition-colors group">
                      <div className="relative">
                        <User size={24} />
                        <Zap size={12} className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                   </Link>
                </div>
              ) : (
                <button 
                  onClick={() => dispatch(toggleAuthModal())}
                  className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black pb-0.5 hover:text-gray-500 transition-colors"
                >
                  LOGIN
                </button>
              )}

              <div 
                className="relative cursor-pointer hover:text-[#a87449] transition-colors"
                onClick={() => dispatch(toggleWishlist())}
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                   <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                     {wishlistCount}
                   </div>
                )}
              </div>
              <div 
                className="relative cursor-pointer"
                onClick={() => dispatch(toggleCart())}
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="container mx-auto px-4 py-4 pb-5">
            <ul className="flex items-center justify-center gap-10 text-[16px] font-semibold tracking-wide text-[#2c3e50]">
              <li>
                <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
              </li>
              <li>
                <Link to="/" className="nav-link">Best Seller</Link>
              </li>
              <li>
                 <Link to="/" className="nav-link">Fine Silver</Link>
              </li>
              <li>
                 <Link to="/" className="nav-link">Gifting</Link>
              </li>
              <li>
                 <Link to="/about-us" className="nav-link">About Us</Link>
              </li>
              <li>
                 <Link to="/contact-us" className="nav-link">Contact Us</Link>
              </li>
            </ul>
          </nav>
        </header>
      )}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>

      {!isAdminPath && <Footer />}

      {!isAdminPath && (
        <>
          <CartDrawer />
          <WishlistDrawer onProductClick={setSelectedProduct} />
          {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
          <AuthModal />
          <ChatBot />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

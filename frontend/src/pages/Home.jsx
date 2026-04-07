import React from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, toggleCart } from "../redux/cartSlice";
import { toggleAuthModal } from "../redux/authSlice";
import { addToWishlistLocal, removeFromWishlistLocal } from "../redux/wishlistSlice";
import { fetchProducts, getImageUrl, addToWishlist, removeFromWishlist } from "../services/api";
import toast from "react-hot-toast";

// Hero Images
import jhumka1 from "../assets/jhumka1.png";
import jhumka2 from "../assets/jhumka2.png";
import jhumka3 from "../assets/jhumka3.png";
import jhumka4 from "../assets/jhumka4.png";
import jhumka5 from "../assets/jhumka5.png";

import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

export default function Home() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [products, setProducts] = React.useState([]);
  const [demifine, setDemifine] = React.useState([]);
  const [newArrivals, setNewArrivals] = React.useState([]);

  // Hero Slider State
  const heroImages = [jhumka1, jhumka2, jhumka3, jhumka4, jhumka5];
  const [heroIndex, setHeroIndex] = React.useState(0);

  const nextHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Auto-slide every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(nextHero, 5000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        
        // Dynamic Filtering logic (5-day threshold)
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        // New Arrivals: Products uploaded within the last 5 days
        const arrivals = data.filter(p => {
          if (!p.createdAt) return false;
          const createdDate = new Date(p.createdAt);
          return createdDate >= fiveDaysAgo;
        });
        
        // Everyday Demifine: Products older than 5 days
        const daily = data.filter(p => !p.createdAt || new Date(p.createdAt) < fiveDaysAgo);

        setNewArrivals(arrivals);
        setDemifine(daily.length > 0 ? daily : data.slice(0, 8));
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
    e.stopPropagation();
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
    <>
      <section className="relative w-full h-[600px] bg-[#a87449] overflow-hidden group">
        {/* Slider Images */}
        <div className="absolute inset-0 w-full h-full">
            {heroImages.map((img, index) => (
                <img 
                    key={index}
                    src={img} 
                    alt={`Slide ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-1000 ease-in-out ${index === heroIndex ? "opacity-100 scale-105" : "opacity-0"}`}
                />
            ))}
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        </div>
        
        {/* Navigation Arrows */}
        <button 
           onClick={(e) => { e.stopPropagation(); prevHero(); }}
           className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
           onClick={(e) => { e.stopPropagation(); nextHero(); }}
           className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroImages.map((_, i) => (
                <div 
                    key={i} 
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${i === heroIndex ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/60"}`}
                ></div>
            ))}
        </div>
        
        {/* Content Overlay */}
        <div className="absolute right-0 top-0 h-full w-full md:w-1/2 flex flex-col justify-center items-center text-white p-6 md:p-12 text-center z-10">
          <h2 className="text-5xl md:text-7xl font-extralight tracking-[0.3em] mb-6 animate-fade-in-up uppercase drop-shadow-2xl">FLASH <span className="font-bold">SALE</span></h2>
          <div className="w-16 h-0.5 bg-white/60 mb-10"></div>
          
          <button 
            onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 border border-white text-[10px] tracking-[0.4em] font-bold hover:bg-white hover:text-[#a87449] transition-all duration-300 uppercase group flex items-center gap-3 shadow-lg"
          >
            SHOP NOW
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Everyday Demifine Section */}
      <section id="products-section" className="py-16 bg-[#faf9f6]">
        <div className="container mx-auto px-4">
            <h3 className="text-center text-sm font-bold tracking-[0.3em] text-[#a87449] mb-12 uppercase">EVERYDAY DEMIFINE JEWELLERY</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {demifine.map((prod) => (
                <div key={prod._id} className="group cursor-pointer">
                   <div className="relative aspect-[4/5] bg-white overflow-hidden mb-3 shadow-sm border border-gray-100 rounded-sm">
                      <img 
                        src={getImageUrl(prod.image)} 
                        alt={prod.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={(e) => handleToggleWishlist(e, prod)}
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-colors"
                        >
                          <Heart size={14} fill={wishlistItems.some(i => i._id === prod._id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleAddToCart(prod)}
                        className="absolute bottom-2 left-2 right-2 bg-black/90 text-white text-[9px] font-bold tracking-[0.2em] py-2.5 rounded-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 uppercase"
                      >
                        Add to Bag
                      </button>
                   </div>
                   <div className="text-center space-y-1">
                      <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-800 line-clamp-1">{prod.name}</h4>
                      <p className="text-[#a87449] font-bold text-xs tracking-wide">₹{prod.price}</p>
                   </div>
                </div>
              ))}
            </div>
            
            {demifine.length === 0 && (
                <p className="text-center text-gray-400 italic text-sm tracking-widest py-10">Curating our timeless collection...</p>
            )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center mb-12">
            <h3 className="text-sm font-bold tracking-[0.3em] text-gray-400 mb-2 uppercase">Freshly Crafted</h3>
            <h2 className="text-3xl font-light tracking-[0.1em] text-black uppercase">NEW ARRIVALS</h2>
            <div className="w-12 h-0.5 bg-[#a87449] mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2">
          {(newArrivals.length > 0 ? newArrivals : products).map((prod) => (
            <div key={prod._id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-[#fdfdfd] overflow-hidden mb-4 rounded-xl shadow-sm border border-gray-100">
                <img 
                  src={getImageUrl(prod.image)} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="absolute top-0 left-0 bg-[#e8d5cc] text-[#6d5145] text-[10px] tracking-wide px-3 py-1 font-medium z-10">
                  New Collection
                  <div className="absolute top-0 -right-2 w-0 h-0 border-y-[12px] border-y-transparent border-l-[8px] border-l-[#e8d5cc]"></div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <button 
                    onClick={(e) => handleToggleWishlist(e, prod)}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-colors"
                  >
                    <Heart size={14} fill={wishlistItems.some(i => i._id === prod._id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <button 
                  onClick={() => handleAddToCart(prod)}
                  className="absolute bottom-4 left-4 right-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] py-3 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 uppercase"
                >
                  Add to Bag
                </button>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 line-clamp-1">{prod.name}</h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#a87449] font-bold tracking-tight">₹{prod.price}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{Math.round(prod.price * 1.5)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(newArrivals.length === 0 && products.length === 0) && (
          <div className="text-center py-20 text-gray-400">
            <p className="tracking-widest uppercase text-xs font-semibold">Our Collection is loading...</p>
          </div>
        )}
      </section>

      <AboutUs />
      <ContactUs />
    </>
  );
}

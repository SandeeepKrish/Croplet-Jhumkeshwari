import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { Package, User, MapPin, LogOut, ChevronRight, Plus, Trash2 } from "lucide-react";
import { fetchAddresses, addAddress, deleteAddress, fetchUserOrders, deleteOrder as apiDeleteOrder, getImageUrl, sendMessage as apiSendMessage } from "../services/api";
import { toast } from "react-hot-toast";
import CancellationModal from "../components/CancellationModal";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('orders'); // orders | addresses
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  
  // Cancellation Modal State
  const [cancellationModal, setCancellationModal] = useState({ isOpen: false, orderId: null });

  useEffect(() => {
    if (showAddressForm) {
      const savedPin = localStorage.getItem("deliveryPincode");
      if (savedPin) {
        setNewAddress(prev => ({ ...prev, pincode: savedPin }));
      }
    }
  }, [showAddressForm]);

  useEffect(() => {
    if (user?.id) {
       if (activeTab === 'addresses') {
          fetchAddresses(user.id)
            .then(setAddresses)
            .catch(() => toast.error("Failed to load addresses"));
       } else if (activeTab === 'orders') {
          fetchUserOrders(user.id)
            .then(setOrders)
            .catch(() => toast.error("Failed to load your orders"));
       }
    }
  }, [activeTab, user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      // 1. Delete the order
      await apiDeleteOrder(orderId);
      
      // 2. Send message to admin about the cancellation reason
      const cancelMessage = {
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A",
          comment: `ORDER CANCELLED (Ref: #${orderId.slice(-8).toUpperCase()}) - Reason: ${reason}`
      };
      await apiSendMessage(cancelMessage);

      // 3. Update UI
      setOrders(orders.filter(o => o._id !== orderId));
      setCancellationModal({ isOpen: false, orderId: null });
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const handleDeleteOrder = (orderId) => {
    setCancellationModal({ isOpen: true, orderId });
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await addAddress(user.id, newAddress);
      setAddresses(updated);
      setShowAddressForm(false);
      setNewAddress({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
      toast.success("Address saved successfully");
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const updated = await deleteAddress(user.id, id);
      setAddresses(updated);
      toast.success("Address removed");
    } catch (error) {
      toast.error("Failed to remove address");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 min-h-[80vh] font-sans text-[#232323]">
      
      {/* Profile Sidebar */}
      <aside className="w-full lg:w-1/4 space-y-8 border-r lg:pr-12">
        <div className="flex items-center gap-4 border-b pb-8">
          <div className="w-16 h-16 bg-[#f5f3ef] rounded-full flex items-center justify-center text-gray-400">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide">{user?.name || "User Name"}</h2>
            <p className="text-xs text-gray-500 font-medium">{user?.email || "youraccount@gmail.com"}</p>
          </div>
        </div>

        <nav className="space-y-4">
          <button 
             onClick={() => setActiveTab('orders')}
             className={`w-full flex items-center justify-between p-4 rounded-sm transition-shadow ${activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <Package size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">My Orders</span>
            </div>
            <ChevronRight size={18} />
          </button>
          
          <button 
             onClick={() => setActiveTab('addresses')}
             className={`w-full flex items-center justify-between p-4 rounded-sm transition-colors ${activeTab === 'addresses' ? 'bg-black text-white shadow-md' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <MapPin size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">Addresses</span>
            </div>
            <ChevronRight size={18} />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-gray-600 rounded-sm transition-colors border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-4">
              <User size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">Account Settings</span>
            </div>
            <ChevronRight size={18} />
          </button>

          <div className="pt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-sm transition-colors font-bold tracking-widest text-sm uppercase"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Profile Content */}
      <main className="w-full lg:w-3/4 flex flex-col min-h-0">
        <div className="mb-10 flex justify-between items-end border-b pb-6">
          <h1 className="text-4xl font-bold tracking-widest uppercase">
             {activeTab === 'orders' ? 'My Orders' : 'Addresses'}
          </h1>
          {activeTab === 'orders' ? (
             <p className="text-sm font-medium text-gray-500 uppercase tracking-widest font-black">Showing {orders.length} orders</p>
          ) : (
             <button 
               onClick={() => setShowAddressForm(!showAddressForm)}
               className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-black pb-0.5 hover:text-gray-500 transition-colors"
             >
                {showAddressForm ? "Cancel" : <><Plus size={14}/> Add New Address</>}
             </button>
          )}
        </div>

        <div className="space-y-8">
           {activeTab === 'orders' && orders.length > 0 ? orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-sm overflow-hidden hover:border-gray-300 transition-colors bg-white shadow-sm group">
              {/* Order Header */}
              <div className="bg-[#f9f9f9] p-6 flex flex-wrap justify-between items-center gap-6 border-b">
                <div className="flex flex-wrap gap-10">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Order Placed</p>
                    <p className="text-sm font-bold text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-black">₹ {order.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Status</p>
                    <p className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'delivered' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'}`}>{order.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right flex flex-col items-end border-r pr-6 border-gray-200">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Order Ref</p>
                        <p className="text-sm font-black text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    {/* Delete Order Button */}
                    <button 
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Delete Order"
                    >
                      <Trash2 size={20} />
                    </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 space-y-6">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-[#f5f3ef] flex-shrink-0 rounded shadow-sm overflow-hidden border border-gray-100">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-black mb-1 uppercase tracking-wider">{item.name || "Untitled Piece"}</h4>
                      <div className="flex gap-4 items-center mt-2">
                        <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">Qty: {item.quantity}</span>
                        <span className="text-[11px] font-bold text-[#a87449]">₹ {item.price}</span>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <button className="px-6 py-2.5 bg-white border border-gray-100 text-gray-400 text-[10px] font-bold tracking-widest hover:border-black hover:text-black transition-all uppercase rounded-sm">
                        Product Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50/30 p-4 border-t flex justify-between items-center px-6">
                   <p className="text-[10px] font-bold text-[#a87449] tracking-widest uppercase">Thank you for choosing Jhumkeshwari</p>
                   <button className="text-[10px] font-bold tracking-widest uppercase border-b border-black pb-0.5 hover:text-gray-500 transition-colors">
                     Download Invoice
                   </button>
              </div>
            </div>
           )) : activeTab === 'orders' && (
             <div className="text-center py-32 opacity-30 flex flex-col items-center">
               <Package size={48} className="mb-4" />
               <p className="text-sm font-bold uppercase tracking-[0.3em]">You haven't placed any orders yet</p>
             </div>
           )}

           {activeTab === 'addresses' && showAddressForm && (
             <form onSubmit={handleAddAddressSubmit} className="border border-gray-200 p-8 rounded-sm bg-gray-50/50 space-y-6 mb-8 animate-fade-in-up">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">Add a new address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <input required placeholder="Full Name" className="p-3 border text-sm font-medium focus:outline-black w-full" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                   <input required placeholder="Mobile Number" className="p-3 border text-sm font-medium focus:outline-black w-full" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                   <div className="md:col-span-2">
                     <textarea required placeholder="Street Address" rows={3} className="p-3 border text-sm font-medium focus:outline-black w-full resize-none" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                   </div>
                   <input required placeholder="City" className="p-3 border text-sm font-medium focus:outline-black w-full" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                   <input required placeholder="State" className="p-3 border text-sm font-medium focus:outline-black w-full" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                   <input required placeholder="Pincode" className="p-3 border text-sm font-medium focus:outline-black w-full md:col-span-2" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                </div>
                <button type="submit" className="bg-black text-white px-8 py-3 font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors">
                   Save Address
                </button>
             </form>
           )}

           {activeTab === 'addresses' && addresses.map((addr) => (
             <div key={addr._id} className="border border-gray-200 p-6 rounded-sm hover:border-gray-400 transition-colors flex justify-between items-start">
                <div>
                   <h4 className="text-sm font-bold text-black mb-2 uppercase">{addr.fullName}</h4>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
                     {addr.street}, {addr.city}, {addr.state} - {addr.pincode} <br/>
                     <span className="text-black font-bold mt-1 inline-block">M: {addr.phone}</span>
                   </p>
                </div>
                <button 
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
             </div>
           ))}
           {activeTab === 'addresses' && !showAddressForm && addresses.length === 0 && (
             <div className="text-center py-20 text-gray-400 border border-dashed rounded-sm border-gray-300">
                <p className="tracking-widest uppercase text-xs font-semibold">No addresses saved yet</p>
             </div>
           )}
        </div>
        {/* Cancellation Modal */}
        <CancellationModal 
          isOpen={cancellationModal.isOpen}
          onClose={() => setCancellationModal({ isOpen: false, orderId: null })}
          onConfirm={handleConfirmCancel}
          orderId={cancellationModal.orderId || ""}
        />
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Plus, Trash2, LayoutDashboard, Tag, IndianRupee, Image as ImageIcon, LogOut, CheckCircle2, XCircle, Eye, EyeOff, Users, ShoppingCart, ShoppingBag, Calendar, Mail, Phone, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchProducts as apiFetchProducts, addProduct as apiAddProduct, deleteProduct as apiDeleteProduct, fetchUsers as apiFetchUsers, fetchOrders as apiFetchOrders, adminLogin as apiAdminLogin, updateOrderStatus as apiUpdateOrderStatus, getImageUrl, fetchMessages as apiFetchMessages, deleteMessage as apiDeleteMessage } from "../services/api";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory"); // 'inventory', 'users', 'orders', 'messages'
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      fetchProductsData();
      fetchUsersData();
      fetchOrdersData();
      fetchMessagesData();
    }
  }, []);

  const fetchProductsData = async () => {
    try {
      const data = await apiFetchProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const data = await apiFetchUsers(token);
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        toast.error("Session expired. Please login again.");
      }
    }
  };

  const fetchOrdersData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const data = await apiFetchOrders(token);
      setOrders(data);
    } catch (err) {
       if (err.response?.status === 401) {
          handleLogout();
       }
    }
  };

  const fetchMessagesData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const data = await apiFetchMessages(token);
      setMessages(data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await apiUpdateOrderStatus(orderId, status, token);
      toast.success(`Order marked as ${status}`);
      fetchOrdersData();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiAdminLogin({ username, password });
      localStorage.setItem("adminToken", data.token);
      setIsLoggedIn(true);
      toast.success("Welcome, Admin");
      fetchProductsData();
      fetchUsersData();
      fetchOrdersData();
      fetchMessagesData();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Invalid Admin Credentials";
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("adminToken");
      await apiAddProduct(formData, token);
      toast.success("Product added successfully!");
      setName(""); setPrice(""); setDescription(""); setImage(null);
      fetchProductsData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await apiDeleteProduct(id, token);
      toast.success("Product removed");
      fetchProductsData();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await apiDeleteMessage(id, token);
      toast.success("Message removed");
      fetchMessagesData();
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-2">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Secure Management System</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full bg-[#f5f3ef] rounded-xl py-3 px-5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full bg-[#f5f3ef] rounded-xl py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold tracking-widest text-xs hover:bg-gray-900 transition-all uppercase mt-2">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 space-y-4">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-8 h-fit sticky top-8 text-center md:text-left">
          <div>
            <h1 className="text-xl font-extrabold tracking-[0.2em] uppercase">ADMIN</h1>
            <p className="text-[#a87449] font-medium tracking-widest text-[9px] mt-1 uppercase">Jhumkeshwari Control</p>
          </div>

          <nav className="flex flex-col gap-3">
            <button 
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === "inventory" ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400 hover:text-black'}`}
            >
              <LayoutDashboard size={18} /> Inventory
            </button>

            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === "orders" ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400 hover:text-black'}`}
            >
              <ShoppingBag size={18} /> Orders Placed
            </button>

            <button 
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === "users" ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400 hover:text-black'}`}
            >
              <Users size={18} /> Customers
            </button>

            <button 
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === "messages" ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-50 text-gray-400 hover:text-black'}`}
            >
              <Mail size={18} /> Messages
            </button>
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3.5 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add Product Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-[#a87449]" /> New Arrival
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Product Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#f5f3ef] border-transparent focus:bg-white focus:ring-1 focus:ring-black rounded-xl py-3 px-4 text-sm transition-all"
                      placeholder="E.g. Royal Gold Jhumka"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Price (INR)</label>
                    <div className="relative">
                      <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        className="w-full bg-[#f5f3ef] border-transparent focus:bg-white focus:ring-1 focus:ring-black rounded-xl py-3 pl-10 pr-4 text-sm transition-all"
                        placeholder="999"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Description</label>
                    <textarea
                      className="w-full bg-[#f5f3ef] border-transparent focus:bg-white focus:ring-1 focus:ring-black rounded-xl py-3 px-4 text-sm min-h-[100px] transition-all"
                      placeholder="Handcrafted elegence..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 px-2">Upload Photo</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 bg-[#f5f3ef] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-[#efece6] transition-all">
                      <div className="flex flex-col items-center justify-center py-5">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">{image ? image.name : "Select Image"}</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-widest text-[10px] uppercase hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Uploading..." : "Publish Product"}
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                    <Tag size={20} className="text-[#a87449]" /> Live Inventory
                  </h2>
                  <span className="text-[10px] font-bold px-3 py-1 bg-[#a87449]/10 text-[#a87449] rounded-full uppercase">
                    {products.length} Items Total
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#faf9f6] text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      <tr>
                        <th className="px-8 py-4">Product</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((product) => (
                        <tr key={product._id} className="group hover:bg-[#faf9f6]/50 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-[#f5f3ef] rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                <img 
                                  src={getImageUrl(product.image)} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold uppercase tracking-wider mb-1">{product.name}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-[#a87449] font-medium">₹{product.price}</span>
                                  <span className="text-[10px] text-gray-400 border-l pl-3">ID: ...{product._id.slice(-6)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-green-500 uppercase">
                              <CheckCircle2 size={12} /> Live
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#a87449]" /> Orders Received
              </h2>
              <div className="flex gap-4">
                <span className="text-[10px] font-bold px-3 py-1 bg-[#a87449]/10 text-[#a87449] rounded-full uppercase">
                  {orders.filter(o => o.status === 'pending').length} Pending
                </span>
                <span className="text-[10px] font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full uppercase">
                  {orders.length} Total
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#faf9f6]/80 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <tr>
                    <th className="px-8 py-5">Order ID / Date</th>
                    <th className="px-8 py-5">Customer Details</th>
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#faf9f6]/30 transition-all border-b border-gray-50/50 group">
                      <td className="px-8 py-8 align-top">
                        <div className="space-y-1">
                          <p className="text-xs font-black tracking-tight text-gray-800 uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase transition-colors">
                            <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 align-top">
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-black">{order.userId?.name || "Guest User"}</p>
                          <div className="space-y-1.5 grayscale group-hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                              <Mail size={10} className="text-[#a87449]" /> {order.userId?.email || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                              <Phone size={10} className="text-[#a87449]" /> {order.userId?.phone || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 align-top">
                        <div className="space-y-2 min-w-[280px]">
                           {order.products.map((item, idx) => (
                             <div key={idx} className="flex items-center gap-4 bg-[#f8f8f8] p-2 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                               <div className="w-12 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                                 <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                               </div>
                               <div className="space-y-0.5">
                                 <p className="text-[10px] font-black uppercase tracking-tight text-gray-800">
                                   {item.name || "Untitled Product"}
                                 </p>
                                 <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-bold text-[#a87449]">QTY: {item.quantity}</span>
                                   <span className="text-[9px] text-gray-400 font-bold border-l pl-2">₹{item.price || "N/A"}</span>
                                 </div>
                               </div>
                             </div>
                           ))}
                        </div>
                      </td>
                      <td className="px-8 py-8 align-top">
                        <div className="text-sm font-black text-black tracking-tight">₹{order.totalAmount}</div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Online / COD</p>
                      </td>
                      <td className="px-8 py-8 align-top">
                         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm
                           ${order.status === 'ready for delivery' ? 'bg-green-100 text-green-700 border border-green-200' : 
                             order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                             'bg-orange-50 text-orange-600 border border-orange-100'}`}
                         >
                           {order.status === 'pending' ? <Calendar size={10} /> : <CheckCircle2 size={10} />}
                           {order.status}
                         </div>
                      </td>
                      <td className="px-8 py-8 align-top text-right">
                         <div className="flex flex-col gap-2 items-end">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, 'ready for delivery')}
                                className="bg-black text-white px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-1.5"
                              >
                                <CheckCircle2 size={12} /> Verify Order
                              </button>
                            )}
                            {order.status === 'ready for delivery' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-1.5"
                              >
                                <Package size={12} /> Mark Shipped
                              </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
              {orders.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center opacity-40">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">No orders received yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Details Section */}
        {activeTab === "users" && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                <Users size={20} className="text-[#a87449]" /> Registered Customers
              </h2>
              <span className="text-[10px] font-bold px-3 py-1 bg-[#a87449]/10 text-[#a87449] rounded-full uppercase">
                {users.length} Users
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#faf9f6] text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <tr>
                    <th className="px-8 py-4">Customer Details</th>
                    <th className="px-8 py-4">Orders</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#faf9f6]/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-bold uppercase tracking-wider">{user.name || "Guest"}</p>
                          <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                          <p className="text-[10px] text-[#a87449] font-bold mt-1 tracking-widest">{user.phone || "No Phone"}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-[250px]">
                          {user.orders && user.orders.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {user.orders.map((order, idx) => (
                                <span key={idx} className="bg-gray-100 text-[9px] font-bold px-2 py-0.5 rounded text-gray-600 uppercase tracking-tighter">
                                  {order.products?.map(p => p.name || p.productId?.name).filter(Boolean).join(", ") || "Order #"+(idx+1)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-300 tracking-widest">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full w-fit ${user.orders?.length > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                          {user.orders?.length > 0 ? (
                            <><CheckCircle2 size={10} /> Active Buyer</>
                          ) : (
                            <><XCircle size={10} /> No Purchase</>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-20 text-center">
                  <p className="text-gray-400 text-sm italic">No registered users yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Messages Section */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
                <Mail size={20} className="text-[#a87449]" /> Customer Inquiries
              </h2>
              <span className="text-[10px] font-bold px-3 py-1 bg-[#a87449]/10 text-[#a87449] rounded-full uppercase">
                {messages.length} Messages
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#faf9f6] text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <tr>
                    <th className="px-8 py-4 whitespace-nowrap">Sender</th>
                    <th className="px-8 py-4">Message / Advice</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-[#faf9f6]/50 transition-all">
                      <td className="px-8 py-6 align-top">
                        <div className="space-y-1">
                          <p className="text-sm font-bold uppercase tracking-wider">{msg.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{msg.email}</p>
                          {msg.phone && <p className="text-[10px] text-[#a87449] font-bold tracking-widest">{msg.phone}</p>}
                        </div>
                      </td>
                      <td className="px-8 py-6 align-top">
                        <p className="text-sm text-gray-600 leading-relaxed max-w-md italic">"{msg.comment}"</p>
                      </td>
                      <td className="px-8 py-6 align-top">
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          <Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 align-top text-right">
                        <button 
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {messages.length === 0 && (
                <div className="p-20 text-center opacity-40">
                  <Mail size={48} className="mx-auto mb-4" />
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

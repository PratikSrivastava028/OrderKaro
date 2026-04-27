import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ORDER_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import { TbReceipt2, TbClock, TbCheck, TbTruckDelivery, TbToolsKitchen2 } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

const STATUS_ICONS = {
  pending: <TbClock className="text-amber-500" size={18} />,
  preparing: <TbToolsKitchen2 className="text-blue-500" size={18} />,
  "out of delivery": <TbTruckDelivery className="text-purple-500" size={18} />,
  delivered: <TbCheck className="text-green-500" size={18} />,
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  preparing: "bg-blue-50 text-blue-700 border-blue-100",
  "out of delivery": "bg-purple-50 text-purple-700 border-purple-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
};

const Orders = () => {
  const { userData } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ORDER_ROUTES.GET_ORDERS);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, shopId, newStatus) => {
    try {
      const response = await axiosInstance.patch(
        ORDER_ROUTES.UPDATE_ORDER_STATUS(orderId, shopId),
        { status: newStatus }
      );
      toast.success("Order status updated");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-6 sm:mb-10">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
            <TbReceipt2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>
            <p className="text-sm text-stone-500">
              {userData.role === "owner" ? "Manage orders for your shop" : "Track and manage your recent orders"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-400 font-medium animate-pulse">Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <TbReceipt2 size={40} className="text-stone-200" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">No Orders Yet</h2>
            <p className="text-stone-500 max-w-xs mb-8">
              {userData.role === "owner" 
                ? "Your shop hasn't received any orders yet. Keep up the good work!" 
                : "You haven't placed any orders yet. Time to discover some delicious food!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-stone-50/50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      Order ID: #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Total: ₹{order.totalAmount}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.shopOrders[0]?.status || 'pending']}`}>
                      {order.shopOrders[0]?.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {order.shopOrders.map((shopOrder, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                            {shopOrder.shop?.name || "Store"}
                          </span>
                        </div>
                        {userData.role === "owner" && (
                          <div className="flex items-center gap-2">
                            <select 
                              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-orange-500 cursor-pointer"
                              value={shopOrder.status}
                              onChange={(e) => updateStatus(order._id, shopOrder.shop._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="out of delivery">Out of Delivery</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {shopOrder.shopOrderItems.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-100">
                                <img 
                                  src={item.item?.image || "https://via.placeholder.com/150"} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-stone-800">{item.name}</p>
                                <p className="text-xs text-stone-400">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-stone-800">₹{item.quantity * item.price}</p>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address for Owners */}
                      {userData.role === "owner" && (
                        <div className="mt-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Delivery To</p>
                          <p className="text-xs font-semibold text-stone-700">{order.user?.name}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">{order.deliveryAddress?.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

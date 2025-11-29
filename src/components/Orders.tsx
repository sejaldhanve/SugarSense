import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, Calendar, ArrowLeft } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: Date;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Order[];
      
      // Sort by timestamp in JavaScript instead of Firestore
      ordersData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
      // Set empty orders array on error
      setOrders([]);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-400" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'processing':
        return 'text-blue-400 bg-blue-400/10';
      case 'shipped':
        return 'text-purple-400 bg-purple-400/10';
      case 'delivered':
        return 'text-green-400 bg-green-400/10';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => setSelectedOrder(null)}
            className="inline-flex items-center gap-2 theme-text-secondary hover:theme-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold theme-text-primary mb-2">Order #{selectedOrder.id.slice(-8)}</h1>
              <p className="text-body theme-text-secondary">
                Placed on {selectedOrder.timestamp.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
              {getStatusIcon(selectedOrder.status)}
              <span className="capitalize font-medium">{selectedOrder.status}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-white">Items Ordered</h3>
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.productName}</h4>
                  <p className="text-slate-400">Quantity: {item.quantity}</p>
                </div>
                <p className="text-white font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">Shipping Address</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-medium">{selectedOrder.shippingAddress.name}</p>
              <p className="text-slate-300">{selectedOrder.shippingAddress.address}</p>
              <p className="text-slate-300">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">Total Amount:</span>
              <span className="text-2xl font-bold text-emerald-400">₹{selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold theme-text-primary mb-2">My Orders</h1>
        <p className="text-body-lg theme-text-secondary">Track your order history and current purchases</p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/10 rounded-2xl"
        >
          <Package className="w-24 h-24 text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold theme-text-primary mb-4">No Orders Yet</h2>
          <p className="text-body-lg theme-text-secondary mb-8">
            You haven't placed any orders yet. Browse the store to find diabetic-friendly products.
          </p>
          <button
            onClick={() => navigate('/store')}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Shopping
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedOrder(order)}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-full">
                    <Package className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold theme-text-primary">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <div className="flex items-center gap-2 text-body theme-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {order.timestamp.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize font-medium">{order.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body theme-text-secondary">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm theme-text-muted">
                    {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold theme-text-primary">₹{order.total.toFixed(2)}</p>
                  <p className="text-sm text-emerald-400">View Details →</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
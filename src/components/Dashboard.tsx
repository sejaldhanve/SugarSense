import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  ArrowLeft,
  Star,
  Heart,
  Repeat,
  Phone,
} from "lucide-react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import BloodSugarChart from "./BloodSugarChart";
import QuickActionsCard from "./QuickActionsCard";
import TodaysPlan from "./TodaysPlan";

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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  timestamp: Date;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const Dashboard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [userProfile, setUserProfile] = useState<any>(null); // This is where emergency contact info would be stored/fetched

  // --- EMERGENCY CALL LOGIC (NEW) ---

  const placeCall = (phoneNumber: string) => {
    // Triggers the phone's dialer application using the tel: protocol
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmergencyCall = (number: string) => {
    // Confirmation for 911/emergency services
    const isConfirmed = window.confirm(
      `🚨 WARNING: You are about to call emergency services (${number}). Are you sure you want to proceed?`
    );

    if (isConfirmed) {
      placeCall(number);
    } else {
      console.log("Emergency call cancelled by user.");
    }
  };

  const handleHelplineCall = () => {
    // Placeholder for a local diabetes helpline number (you should update this)
    const helplineNumber = "8369263837";

    const isConfirmed = window.confirm(
      `You are about to call the Diabetes Helpline (${helplineNumber}). Do you want to continue?`
    );

    if (isConfirmed) {
      placeCall(helplineNumber);
    } else {
      console.log("Helpline call cancelled by user.");
    }
  };
  // ---------------------------------

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        })) as Order[];

        // Sort by timestamp in JavaScript instead of Firestore
        ordersData.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
        // Set empty orders array on error
        setOrders([]);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-400" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-400" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "processing":
        return "text-blue-400 bg-blue-400/10";
      case "shipped":
        return "text-purple-400 bg-purple-400/10";
      case "delivered":
        return "text-green-400 bg-green-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => setSelectedOrder(null)}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{selectedOrder.id.slice(-8)}
              </h1>
              <p className="text-slate-400">
                Placed on{" "}
                {selectedOrder.timestamp.toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                selectedOrder.status
              )}`}
            >
              {getStatusIcon(selectedOrder.status)}
              <span className="capitalize font-medium">
                {selectedOrder.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-white">Items Ordered</h3>
            {selectedOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
              >
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
                <p className="text-white font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Shipping Address
            </h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-medium">
                {selectedOrder.shippingAddress.name}
              </p>
              <p className="text-slate-300">
                {selectedOrder.shippingAddress.address}
              </p>
              <p className="text-slate-300">
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.state} -{" "}
                {selectedOrder.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                ₹{selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-title-lg theme-text-primary mb-2">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
              , {user?.displayName || "there"}! 👋
            </h1>
            <p className="text-body-lg theme-text-secondary">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Blood Sugar Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <BloodSugarChart />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActionsCard />
        </div>
      </div>

      {/* Today's Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-bg-card backdrop-blur-lg theme-border border rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo/sugar-sense.png"
              alt="Sugar Sense logo"
              className="w-6 h-6"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
              }}
            />
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-section-title theme-text-primary">
                Today's Plan
              </h3>
              <p className="text-body theme-text-secondary">
                Your personalized health schedule
              </p>
            </div>
          </div>
        </div>

        <TodaysPlan />
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-bg-card backdrop-blur-lg theme-border border rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-section-title theme-text-primary">
              AI Health Insights
            </h3>
          </div>
          <div>
            <p className="text-body theme-text-secondary">
              Personalized recommendations for you
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 font-medium text-sm">
                Blood Sugar Insight
              </span>
            </div>
            <p className="text-body theme-text-secondary">
              Your morning readings have been consistently in the target range.
              Great job maintaining your routine!
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-400 font-medium text-sm">
                Meal Recommendation
              </span>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-sm">
              Consider adding more fiber to your lunch. Try quinoa salad with
              vegetables for better glucose control.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Emergency Call Section - The target of the change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 mb-8"
      >
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-400/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-full animate-pulse">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-400">
              Emergency Support
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you're experiencing a medical emergency or severe symptoms, don't
            hesitate to call for help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => handleEmergencyCall("911")} // <-- ATTACHED HANDLER
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              <Phone className="w-6 h-6" />
              Emergency: 911
            </motion.button>
            <motion.button
              onClick={handleHelplineCall} // <-- ATTACHED HANDLER
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              <Heart className="w-6 h-6" />
              🏥 Diabetes Helpline
            </motion.button>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Emergency Contact:{" "}
              {userProfile?.emergencyContact?.name || "Not set"}
            </p>
            <p>Phone: {userProfile?.emergencyContact?.phone || "Not set"}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

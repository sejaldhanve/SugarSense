import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-slate-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold theme-text-primary mb-4">Your cart is empty</h1>
          <p className="text-body-lg theme-text-secondary mb-8">
            Discover our diabetes-friendly products and start building your healthy lifestyle.
          </p>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
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
        <h1 className="text-3xl font-bold theme-text-primary mb-2">Shopping Cart</h1>
        <p className="text-body-lg theme-text-secondary">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
            >
              <div className="flex gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-slate-400 text-sm">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-slate-400" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-400 text-sm">₹{item.price} each</p>
                      <p className="text-white font-semibold text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Product highlights */}
                  <div className="mt-4 flex gap-4 text-xs">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      GI: {item.glycemicIndex}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      Protein: {item.protein}g
                    </span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      Fiber: {item.fiber}g
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 h-fit"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-300">Subtotal:</span>
              <span className="text-white">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Shipping:</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Tax:</span>
              <span className="text-white">₹{(total * 0.18).toFixed(2)}</span>
            </div>
            <hr className="border-white/20" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-white">Total:</span>
              <span className="text-white">₹{(total * 1.18).toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-400 font-medium text-sm">Free Delivery</span>
            </div>
            <p className="text-slate-300 text-sm">
              Estimated delivery: {deliveryDate.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3 rounded-xl font-medium transition-colors"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/store"
            className="block w-full text-center text-emerald-400 hover:text-emerald-300 py-3 text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
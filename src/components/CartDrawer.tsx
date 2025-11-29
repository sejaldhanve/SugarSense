import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeFromCart, total } = useCart();

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-800 border-l border-white/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Your Cart</h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Your cart is empty</p>
                  <button
                    onClick={toggleCart}
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{item.name}</h3>
                          <p className="text-sm text-slate-400 mb-2">₹{item.price} each</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <Minus className="w-4 h-4 text-slate-400" />
                              </button>
                              <span className="text-white font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <Plus className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-white font-medium">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/20 p-6 space-y-4">
                {/* Delivery Info */}
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">Free Delivery</p>
                    <p className="text-xs text-slate-300">
                      Arrives by {deliveryDate.toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold text-white">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3 rounded-xl font-medium transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
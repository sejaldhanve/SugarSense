import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Store, 
  ShoppingCart, 
  Brain, 
  User, 
  Bell,
  Activity,
  LogOut,
  Package
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Store', href: '/store', icon: Store },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'AI Coach', href: '/coach', icon: Brain },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen theme-bg-main">
      {/* Top Navigation */}
      <nav className="theme-bg-card backdrop-blur-lg theme-border border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <img
                src="/assets/logo/sugar-sense.png"
                alt="Sugar Sense logo"
                className="w-8 h-8"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              />
              <span className="text-xl font-bold theme-text-primary tracking-wide">
                SUGAR SENSE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'theme-text-secondary hover:theme-text-primary theme-bg-card hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button className="p-2 theme-text-secondary hover:theme-text-primary theme-bg-card hover:shadow-md rounded-lg transition-all duration-300">
                <Bell className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 theme-text-secondary hover:theme-text-primary theme-bg-card hover:shadow-md rounded-lg transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 theme-text-secondary hover:theme-text-primary theme-bg-card hover:shadow-md rounded-lg transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 theme-bg-card backdrop-blur-lg theme-border border-t z-40">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-emerald-400'
                    : 'theme-text-muted hover:theme-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default Layout;
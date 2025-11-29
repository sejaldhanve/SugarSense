import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, Heart, Leaf, Award, ChevronDown, Grid, List } from 'lucide-react';
import { useCart, Product } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { userProfile } = useUser();

  // Enhanced diabetic-friendly products
  const products: Product[] = [
    {
      id: '1',
      name: 'Sugar-Free Dark Chocolate Bars',
      price: 25,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400',
      category: 'food-snacks',
      description: '85% Cocoa - Rich, premium dark chocolate sweetened with stevia. Perfect for diabetic-friendly indulgence.',
      glycemicIndex: 25,
      carbs: 8,
      fiber: 5,
      protein: 4,
      allergens: ['nuts'],
      inStock: true,
      rating: 4.8,
      reviews: 128,
      badges: ['85% Cocoa', 'Sugar-Free'],
      nutritionInfo: { carbs: '8g', sugar: '0g', gi: 25 }
    },
    {
      id: '2',
      name: 'Blood Glucose Monitor Kit with...',
      price: 90,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      category: 'monitoring-devices',
      description: 'FDA approved glucose monitoring system with 50 test strips included.',
      glycemicIndex: 0,
      carbs: 0,
      fiber: 0,
      protein: 0,
      allergens: [],
      inStock: true,
      rating: 4.6,
      reviews: 256,
      badges: ['FDA Approved', 'Best Seller'],
      nutritionInfo: null
    },
    {
      id: '3',
      name: 'Keto-Friendly Protein Bars (Box of 12)',
      price: 35,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
      category: 'food-snacks',
      description: 'High-protein, low-carb bars perfect for diabetic meal planning.',
      glycemicIndex: 30,
      carbs: 4,
      fiber: 8,
      protein: 20,
      allergens: ['nuts', 'dairy'],
      inStock: true,
      rating: 4.4,
      reviews: 89,
      badges: ['High Protein', 'Keto-Friendly', 'Low-Carb'],
      nutritionInfo: { carbs: '4g', sugar: '1g', gi: 30 }
    },
    {
      id: '4',
      name: 'Diabetic Multivitamin...',
      price: 20,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400',
      category: 'supplements',
      description: 'Specially formulated multivitamin for diabetic patients.',
      glycemicIndex: 0,
      carbs: 0,
      fiber: 0,
      protein: 0,
      allergens: [],
      inStock: true,
      rating: 4.7,
      reviews: 167,
      badges: ['Diabetic Formula'],
      nutritionInfo: null
    },
    {
      id: '5',
      name: 'Zero Calorie Sparkling Water',
      price: 13,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      category: 'beverages',
      description: 'Refreshing sparkling water with natural flavors.',
      glycemicIndex: 0,
      carbs: 0,
      fiber: 0,
      protein: 0,
      allergens: [],
      inStock: true,
      rating: 4.3,
      reviews: 94,
      badges: ['Zero Calories', 'Natural Flavors'],
      nutritionInfo: { carbs: '0g', sugar: '0g', gi: 0 }
    },
    {
      id: '6',
      name: 'Chef Prepared Low-Carb Meal...',
      price: 50,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      category: 'meal-kits',
      description: 'Nutritionist-approved meal kit with 5 diabetic-friendly recipes.',
      glycemicIndex: 35,
      carbs: 15,
      fiber: 8,
      protein: 25,
      allergens: ['dairy'],
      inStock: true,
      rating: 4.9,
      reviews: 203,
      badges: ['Chef Prepared', 'Nutritionist Approved'],
      nutritionInfo: { carbs: '15g', sugar: '3g', gi: 35 }
    },
    {
      id: '7',
      name: 'Gluten-Free Almond Flour...',
      price: 17,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
      category: 'food-snacks',
      description: 'Premium almond flour pancake mix. Gluten-free, low-carb breakfast option.',
      glycemicIndex: 25,
      carbs: 6,
      fiber: 4,
      protein: 8,
      allergens: ['nuts'],
      inStock: true,
      rating: 4.5,
      reviews: 76,
      badges: ['Gluten-Free', 'Low-Carb'],
      nutritionInfo: { carbs: '6g', sugar: '1g', gi: 25 }
    },
    {
      id: '8',
      name: 'Continuous Glucose Monitor',
      price: 300,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
      category: 'monitoring-devices',
      description: 'Advanced CGM with smartphone connectivity and real-time monitoring.',
      glycemicIndex: 0,
      carbs: 0,
      fiber: 0,
      protein: 0,
      allergens: [],
      inStock: true,
      rating: 4.8,
      reviews: 145,
      badges: ['Latest Technology', 'Smartphone Connected', 'Real-time Monitoring'],
      nutritionInfo: null
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'food-snacks', name: 'Food & Snacks', count: products.filter(p => p.category === 'food-snacks').length },
    { id: 'supplements', name: 'Supplements', count: products.filter(p => p.category === 'supplements').length },
    { id: 'monitoring-devices', name: 'Monitoring Devices', count: products.filter(p => p.category === 'monitoring-devices').length },
    { id: 'beverages', name: 'Beverages', count: products.filter(p => p.category === 'beverages').length },
    { id: 'meal-kits', name: 'Meal Kits', count: products.filter(p => p.category === 'meal-kits').length }
  ];

  const dietaryRestrictions = [
    { id: 'all', name: 'All Products' },
    { id: 'sugar-free', name: 'Sugar-Free' },
    { id: 'keto-friendly', name: 'Keto-Friendly' },
    { id: 'low-carb', name: 'Low-Carb' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'organic', name: 'Organic' }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'under-10', name: 'Under ₹10' },
    { id: '10-25', name: '₹10 - ₹25' },
    { id: '25-50', name: '₹25 - ₹50' },
    { id: '50-100', name: '₹50 - ₹100' },
    { id: 'over-100', name: 'Over ₹100' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      let matchesDietary = true;
      if (selectedDietaryFilter !== 'all') {
        matchesDietary = product.badges?.some(badge => 
          badge.toLowerCase().replace(/[^a-z]/g, '') === selectedDietaryFilter.replace('-', '')
        ) || false;
      }

      let matchesPrice = true;
      if (selectedPriceRange !== 'all') {
        const price = product.price;
        switch (selectedPriceRange) {
          case 'under-10': matchesPrice = price < 10; break;
          case '10-25': matchesPrice = price >= 10 && price <= 25; break;
          case '25-50': matchesPrice = price >= 25 && price <= 50; break;
          case '50-100': matchesPrice = price >= 50 && price <= 100; break;
          case 'over-100': matchesPrice = price > 100; break;
        }
      }

      return matchesSearch && matchesCategory && matchesDietary && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviews - a.reviews;
        default: return 0; // relevance
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedDietaryFilter, selectedPriceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Diabetic-Friendly Products</h1>
        <p className="text-gray-700">
          Discover health-conscious products designed specifically for diabetes management and healthy living.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-80 space-y-4">
          {/* Filters Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button className="text-sm text-blue-500 hover:text-blue-600">Clear All</button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search diabetic-friendly products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Dietary Restrictions</h3>
            <div className="space-y-1">
              {dietaryRestrictions.map(restriction => (
                <label
                  key={restriction.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDietaryFilter === restriction.id}
                    onChange={() => setSelectedDietaryFilter(restriction.id)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{restriction.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-1">
              {priceRanges.map(range => (
                <label
                  key={range.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPriceRange === range.id}
                    onChange={() => setSelectedPriceRange(range.id)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{range.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Showing {filteredProducts.length} products
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm"
              >
                <option value="relevance">Sort by: Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-200"
              >
                {/* Product Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {product.badges?.slice(0, 1).map((badge, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          badge.includes('FDA') || badge.includes('Approved') ? 'bg-green-500 text-white' :
                          badge.includes('Sugar-Free') || badge.includes('Zero') ? 'bg-blue-500 text-white' :
                          badge.includes('Keto') || badge.includes('Low-Carb') ? 'bg-purple-500 text-white' :
                          badge.includes('High Protein') ? 'bg-green-500 text-white' :
                          'bg-orange-500 text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  {/* Wishlist */}
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Nutrition Info */}
                  {product.nutritionInfo && (
                    <div className="grid grid-cols-3 gap-1 mb-3 text-xs">
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="font-medium text-gray-900 text-xs">{product.nutritionInfo.carbs}</p>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">Sugar</p>
                        <p className="font-medium text-gray-900 text-xs">{product.nutritionInfo.sugar}</p>
                      </div>
                      <div className="text-center p-1 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">GI</p>
                        <p className={`font-medium text-xs ${
                          product.nutritionInfo.gi <= 35 ? 'text-green-500' : 
                          product.nutritionInfo.gi <= 55 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {product.nutritionInfo.gi}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-700">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
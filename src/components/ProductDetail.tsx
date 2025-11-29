import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, Shield, Leaf, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Mock product data - in real app, fetch by ID
  const product = {
    id: '1',
    name: 'Almond Flour',
    price: 350,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    category: 'flour',
    description: 'Premium almond flour made from blanched almonds, perfect for low-carb and diabetic-friendly baking. Rich in protein, healthy fats, and essential nutrients.',
    glycemicIndex: 15,
    carbs: 6,
    fiber: 3,
    protein: 21,
    fat: 50,
    calories: 576,
    allergens: ['nuts'],
    inStock: true,
    rating: 4.8,
    reviews: 124,
    benefits: [
      'Low glycemic index helps maintain stable blood sugar',
      'High in protein and healthy monounsaturated fats',
      'Rich in vitamin E and magnesium',
      'Gluten-free and keto-friendly'
    ],
    nutritionPer100g: {
      calories: 576,
      protein: 21,
      carbs: 6,
      fiber: 3,
      fat: 50,
      sugar: 4,
      sodium: 1
    },
    usage: [
      'Replace up to 25% of regular flour in recipes',
      'Perfect for pancakes, muffins, and cookies',
      'Great for coating fish or chicken',
      'Add to smoothies for extra protein'
    ]
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
          />
          {product.glycemicIndex <= 35 && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              Low GI
            </div>
          )}
          <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{product.rating}</span>
                <span className="text-slate-400">({product.reviews} reviews)</span>
              </div>
              <span className="text-emerald-400 text-sm font-medium">In Stock</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-white">₹{product.price}</span>
            <span className="text-slate-400">per 500g</span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-sm">GI Index</p>
              <p className="text-green-400 font-bold text-lg">{product.glycemicIndex}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-sm">Protein</p>
              <p className="text-white font-bold text-lg">{product.protein}g</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-sm">Carbs</p>
              <p className="text-white font-bold text-lg">{product.carbs}g</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-slate-400 text-sm">Fiber</p>
              <p className="text-white font-bold text-lg">{product.fiber}g</p>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.button>

          {/* Allergen Warning */}
          {product.allergens.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Allergen Information</span>
              </div>
              <p className="text-slate-300 text-sm">
                Contains: {product.allergens.join(', ')}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed Information */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Health Benefits</h3>
          </div>
          <ul className="space-y-3">
            {product.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-slate-300 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Nutrition Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Nutrition per 100g</h3>
          <div className="space-y-3">
            {Object.entries(product.nutritionPer100g).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-300 capitalize">{key}:</span>
                <span className="text-white font-medium">
                  {value}{key === 'calories' ? '' : key === 'sodium' ? 'mg' : 'g'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Usage Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">How to Use</h3>
          <ul className="space-y-3">
            {product.usage.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-slate-300 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
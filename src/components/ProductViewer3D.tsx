// import React, { useRef, useState, Suspense } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Box, Sphere, Text, Environment, PerspectiveCamera } from '@react-three/drei';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingCart, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import * as THREE from 'three';

// interface Product3D {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
//   description: string;
//   model?: 'sneaker' | 'chair' | 'laptop' | 'bottle' | 'box';
// }

// interface ProductViewer3DProps {
//   product?: Product3D;
//   className?: string;
// }

// // 3D Models Components
// const SneakerModel = ({ color = '#4F46E5' }: { color?: string }) => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
//     }
//   });

//   return (
//     <group ref={meshRef}>
//       {/* Sole */}
//       <Box args={[2.5, 0.3, 1]} position={[0, -0.8, 0]}>
//         <meshStandardMaterial color="#2D3748" />
//       </Box>
//       {/* Upper */}
//       <Box args={[2.2, 1.2, 0.8]} position={[0, -0.2, 0]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Toe cap */}
//       <Sphere args={[0.6, 16, 8]} position={[0.8, -0.2, 0]} scale={[1, 0.8, 1]}>
//         <meshStandardMaterial color="#1A202C" />
//       </Sphere>
//       {/* Laces */}
//       <Box args={[0.1, 0.8, 0.05]} position={[-0.2, 0.2, 0.4]}>
//         <meshStandardMaterial color="#FFFFFF" />
//       </Box>
//       <Box args={[0.1, 0.8, 0.05]} position={[0.2, 0.2, 0.4]}>
//         <meshStandardMaterial color="#FFFFFF" />
//       </Box>
//     </group>
//   );
// };

// const ChairModel = ({ color = '#8B4513' }: { color?: string }) => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
//     }
//   });

//   return (
//     <group ref={meshRef}>
//       {/* Seat */}
//       <Box args={[1.8, 0.1, 1.6]} position={[0, 0, 0]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Backrest */}
//       <Box args={[1.8, 1.5, 0.1]} position={[0, 0.8, -0.75]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Legs */}
//       {[[-0.8, -0.8, 0.7], [0.8, -0.8, 0.7], [-0.8, -0.8, -0.7], [0.8, -0.8, -0.7]].map((pos, i) => (
//         <Box key={i} args={[0.1, 1.6, 0.1]} position={pos as [number, number, number]}>
//           <meshStandardMaterial color="#2D3748" />
//         </Box>
//       ))}
//     </group>
//   );
// };

// const LaptopModel = ({ color = '#E2E8F0' }: { color?: string }) => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
//     }
//   });

//   return (
//     <group ref={meshRef}>
//       {/* Base */}
//       <Box args={[2.4, 0.15, 1.6]} position={[0, -0.5, 0]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Screen */}
//       <Box args={[2.2, 1.4, 0.1]} position={[0, 0.2, -0.75]} rotation={[-0.1, 0, 0]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Screen bezel */}
//       <Box args={[2.0, 1.2, 0.05]} position={[0, 0.2, -0.7]} rotation={[-0.1, 0, 0]}>
//         <meshStandardMaterial color="#000000" />
//       </Box>
//       {/* Keyboard */}
//       <Box args={[2.0, 0.05, 1.2]} position={[0, -0.42, 0.1]}>
//         <meshStandardMaterial color="#2D3748" />
//       </Box>
//     </group>
//   );
// };

// const BottleModel = ({ color = '#10B981' }: { color?: string }) => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
//     }
//   });

//   return (
//     <group ref={meshRef}>
//       {/* Body */}
//       <Box args={[0.6, 2.5, 0.6]} position={[0, 0, 0]}>
//         <meshStandardMaterial color={color} transparent opacity={0.8} />
//       </Box>
//       {/* Neck */}
//       <Box args={[0.3, 0.5, 0.3]} position={[0, 1.5, 0]}>
//         <meshStandardMaterial color={color} />
//       </Box>
//       {/* Cap */}
//       <Box args={[0.35, 0.2, 0.35]} position={[0, 1.85, 0]}>
//         <meshStandardMaterial color="#2D3748" />
//       </Box>
//       {/* Label */}
//       <Box args={[0.65, 0.8, 0.05]} position={[0, 0, 0.31]}>
//         <meshStandardMaterial color="#FFFFFF" />
//       </Box>
//     </group>
//   );
// };

// const DefaultBoxModel = ({ color = '#6366F1' }: { color?: string }) => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
//       meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
//     }
//   });

//   return (
//     <Box ref={meshRef} args={[2, 2, 2]}>
//       <meshStandardMaterial color={color} />
//     </Box>
//   );
// };

// const Model3D = ({ product }: { product?: Product3D }) => {
//   if (!product) {
//     return <DefaultBoxModel />;
//   }

//   switch (product.model) {
//     case 'sneaker':
//       return <SneakerModel />;
//     case 'chair':
//       return <ChairModel />;
//     case 'laptop':
//       return <LaptopModel />;
//     case 'bottle':
//       return <BottleModel />;
//     default:
//       return <DefaultBoxModel />;
//   }
// };

// const LoadingSpinner = () => {
//   const meshRef = useRef<THREE.Mesh>(null);
  
//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.02;
//     }
//   });

//   return (
//     <group>
//       <Sphere ref={meshRef} args={[0.5, 8, 6]}>
//         <meshStandardMaterial color="#10B981" wireframe />
//       </Sphere>
//       <Text
//         position={[0, -1.5, 0]}
//         fontSize={0.3}
//         color="#64748B"
//         anchorX="center"
//         anchorY="middle"
//       >
//         Loading...
//       </Text>
//     </group>
//   );
// };

// const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ product, className = '' }) => {
//   const { addToCart } = useCart();
//   const [showNotification, setShowNotification] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
//   const controlsRef = useRef<any>(null);

//   // Default product for empty state
//   const defaultProduct: Product3D = {
//     id: 'default-sneaker',
//     name: 'Premium Sneaker',
//     price: 299,
//     image: '',
//     category: 'footwear',
//     description: 'Your next big product goes here',
//     model: 'sneaker'
//   };

//   const currentProduct = product || defaultProduct;

//   const handleAddToCart = () => {
//     if (product) {
//       addToCart({
//         ...product,
//         glycemicIndex: 0,
//         carbs: 0,
//         fiber: 0,
//         protein: 0,
//         allergens: [],
//         inStock: true,
//         rating: 4.5,
//         reviews: 100
//       });
//     }
    
//     setShowNotification(true);
//     setTimeout(() => setShowNotification(false), 3000);
//   };

//   const resetCamera = () => {
//     if (controlsRef.current) {
//       controlsRef.current.reset();
//     }
//   };

//   const zoomIn = () => {
//     setCameraPosition(prev => [prev[0], prev[1], Math.max(prev[2] - 1, 2)]);
//   };

//   const zoomOut = () => {
//     setCameraPosition(prev => [prev[0], prev[1], Math.min(prev[2] + 1, 10)]);
//   };

//   return (
//     <div className={`relative w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
//       {/* 3D Canvas */}
//       <Canvas
//         camera={{ position: cameraPosition, fov: 50 }}
//         className="w-full h-full"
//       >
//         <Suspense fallback={<LoadingSpinner />}>
//           <PerspectiveCamera makeDefault position={cameraPosition} />
//           <OrbitControls
//             ref={controlsRef}
//             enablePan={true}
//             enableZoom={true}
//             enableRotate={true}
//             minDistance={2}
//             maxDistance={10}
//             autoRotate={!product}
//             autoRotateSpeed={0.5}
//           />
          
//           {/* Lighting */}
//           <ambientLight intensity={0.4} />
//           <directionalLight position={[10, 10, 5]} intensity={1} />
//           <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
//           {/* Environment */}
//           <Environment preset="city" />
          
//           {/* 3D Model */}
//           <Model3D product={currentProduct} />
          
//           {/* Product Name Text */}
//           <Text
//             position={[0, -2.5, 0]}
//             fontSize={0.4}
//             color="#E2E8F0"
//             anchorX="center"
//             anchorY="middle"
//             font="/fonts/inter-bold.woff"
//           >
//             {currentProduct.name}
//           </Text>
//         </Suspense>
//       </Canvas>

//       {/* Controls Overlay */}
//       <div className="absolute top-4 right-4 flex flex-col gap-2">
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={resetCamera}
//           className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
//           title="Reset View"
//         >
//           <RotateCcw className="w-4 h-4" />
//         </motion.button>
        
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={zoomIn}
//           className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
//           title="Zoom In"
//         >
//           <ZoomIn className="w-4 h-4" />
//         </motion.button>
        
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={zoomOut}
//           className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
//           title="Zoom Out"
//         >
//           <ZoomOut className="w-4 h-4" />
//         </motion.button>
//       </div>

//       {/* Instructions */}
//       <div className="absolute bottom-4 left-4 text-white/60 text-sm">
//         <div className="flex items-center gap-2 mb-1">
//           <Move3D className="w-4 h-4" />
//           <span>Drag to rotate • Scroll to zoom</span>
//         </div>
//       </div>

//       {/* Product Info Overlay */}
//       <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white">
//         <div className="text-sm font-medium">{currentProduct.name}</div>
//         <div className="text-lg font-bold">₹{currentProduct.price}</div>
//         {!product && (
//           <div className="text-xs text-emerald-400 mt-1">
//             🚀 Add something to bring this alive
//           </div>
//         )}
//       </div>

//       {/* Floating Add to Cart Button */}
//       {product && (
//         <motion.button
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleAddToCart}
//           className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 transition-colors"
//         >
//           <ShoppingCart className="w-5 h-5" />
//           Add to Cart
//         </motion.button>
//       )}

//       {/* Success Notification */}
//       <AnimatePresence>
//         {showNotification && (
//           <motion.div
//             initial={{ opacity: 0, y: -50, scale: 0.8 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -50, scale: 0.8 }}
//             className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-10"
//           >
//             <span className="text-lg">✅</span>
//             <span className="font-medium">Added {currentProduct.name} to cart!</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Empty State Message */}
//       {!product && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white max-w-xs"
//         >
//           <div className="text-lg mb-2">👟 Your next big product goes here</div>
//           <div className="text-sm text-white/70">
//             This 3D viewer will showcase your selected products with interactive controls.
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default ProductViewer3D;
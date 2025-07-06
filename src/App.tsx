import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Star, Plus, Minus, Check, ArrowLeft, Truck, CreditCard, MessageCircle } from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample products data - Images removed, placeholders with dimensions
const products: Product[] = [
  {
    id: 1,
    name: "White Premium",
    price: 89.99,
    image: "public/ChatGPT16.png", // 600x400px recommended
    description: "Premium white powder de qualité supérieure. Effet instantané et puissant pour une expérience unique. Pureté garantie.",
    rating: 4.9,
    reviews: 420,
    category: "Premium",
    inStock: true
  },
  {
    id: 2,
    name: "Keta Special",
    price: 129.99,
    image: "", // 600x400px recommended
    description: "Keta de première qualité pour une expérience transcendante. Effet longue durée et sensation unique.",
    rating: 4.8,
    reviews: 666,
    category: "Psychédélique",
    inStock: true
  },
  {
    id: 3,
    name: "Pillz Energy",
    price: 45.99,
    image: "", // 600x400px recommended
    description: "Pilules colorées pour des nuits inoubliables. Énergie maximale et euphorie garantie.",
    rating: 4.7,
    reviews: 1337,
    category: "Énergie",
    inStock: true
  },
  {
    id: 4,
    name: "Hash Artisanal",
    price: 69.99,
    image: "", // 600x400px recommended
    description: "Hash artisanal de qualité premium. Relaxation profonde et détente absolue.",
    rating: 4.6,
    reviews: 888,
    category: "Relaxant",
    inStock: true
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'cart' | 'checkout'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('chronomedical-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('chronomedical-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const Header = () => (
    <header className="glass-header sticky top-0 z-50 animate-slideInDown">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="logo-container flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-300 rounded-xl p-2"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold text-white">⏰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white text-gradient">ChronoMedical</h1>
              <p className="text-xs text-gray-400 font-medium">Premium Pharmacy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-3 rounded-xl btn-secondary hover-lift"
            >
              <ShoppingCart className="w-6 h-6 text-gray-300" />
              {cart.length > 0 && (
                <span className="cart-badge absolute -top-2 -right-2 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl btn-secondary hover-lift"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-300" /> : <Menu className="w-6 h-6 text-gray-300" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <div 
      className="product-card rounded-2xl cursor-pointer animate-fadeIn hover-lift"
      onClick={() => {
        setSelectedProduct(product);
        setCurrentView('product');
      }}
    >
      <div className="relative">
        {/* Image placeholder with exact dimensions */}
        <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700 rounded-t-2xl">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-2 opacity-30">💊</div>
            <div className="text-sm font-medium mb-1">Product Image</div>
            <div className="text-xs opacity-60">600x400px</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl"></div>
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center space-x-1 shadow-lg">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-white">{product.rating}</span>
        </div>
        <div className="absolute bottom-4 left-4 bg-purple-600/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-glow">
          <span className="text-sm font-bold text-white">{product.category}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-white mb-3 text-lg">{product.name}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient">
            €{product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="btn-primary px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-6 pb-8">
        <div className="text-center py-12 animate-slideInUp">
          <h2 className="text-4xl font-bold text-white mb-4 text-gradient">Premium Collection</h2>
          <p className="text-gray-400 text-lg font-medium">Discover our curated selection</p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="space-y-8 stagger-animation">
          {products.map((product, index) => (
            <div key={product.id} className={`float-animation ${index % 2 === 0 ? '' : 'float-animation'}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 glass-card rounded-2xl animate-fadeIn">
          <div className="text-6xl mb-4 opacity-20">⚕️</div>
          <p className="text-gray-400 text-lg leading-relaxed">
            <span className="font-bold text-white text-gradient">ChronoMedical</span> - Your trusted pharmacy since 2024
          </p>
          <p className="text-gray-500 text-sm mt-2 font-medium">Quality • Security • Reliability</p>
        </div>
      </div>
    </div>
  );

  const ProductPage = () => {
    if (!selectedProduct) return null;

    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-md mx-auto">
          <div className="sticky top-16 bg-black/95 backdrop-blur-sm z-40 px-6 py-3 border-b border-gray-800">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Shop</span>
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="relative mb-6">
              {/* Large image placeholder with exact dimensions */}
              <div className="w-full h-80 bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-medium mb-2">Product Image Placeholder</div>
                  <div className="text-sm">Dimensions: 800x600px</div>
                  <div className="text-sm">Aspect ratio: 4:3</div>
                  <div className="text-sm mt-2">Recommended: High resolution product photo</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl flex items-center justify-center">
                <span className="text-6xl opacity-30">❄️</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h1 className="text-2xl font-bold text-white mb-3">{selectedProduct.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-sm text-gray-400">({selectedProduct.reviews} reviews)</span>
                  <div className="bg-purple-600/20 rounded-lg px-3 py-1">
                    <span className="text-xs font-medium text-purple-300">{selectedProduct.category}</span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-purple-400">
                    €{selectedProduct.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-400 font-medium">✓ In Stock</span>
                </div>
                
                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center space-x-3 shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CartPage = () => (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto">
        <div className="sticky top-16 bg-black/95 backdrop-blur-sm z-40 px-6 py-3 border-b border-gray-800">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="px-6 pb-8">
          <div className="text-center py-12 animate-slideInUp">
            <h2 className="text-4xl font-bold text-white mb-4 text-gradient">Panier d'Achat</h2>
            <p className="text-gray-400 text-lg font-medium">Vérifiez vos articles</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl animate-fadeIn">
              <div className="text-8xl mb-6 opacity-30">🛒</div>
              <h3 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h3>
              <p className="text-gray-400 text-lg font-medium">Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="glass-card rounded-2xl p-6 hover-lift animate-fadeIn">
                  <div className="flex items-center space-x-6">
                    {/* Small image placeholder for cart */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-600 rounded-xl shadow-inner-glow">
                      <div className="text-2xl opacity-50">💊</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">{item.name}</h3>
                      <p className="text-purple-400 font-bold text-lg">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 rounded-xl btn-secondary hover-lift flex items-center justify-center"
                      >
                        <Minus className="w-5 h-5 text-white" />
                      </button>
                      <span className="w-12 text-center font-bold text-white text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 rounded-xl btn-secondary hover-lift flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="glass-card rounded-2xl p-8 mt-8 shadow-glow animate-scaleIn">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-bold text-gradient">
                    €{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CheckoutPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [orderRef, setOrderRef] = useState('');
    const [formData, setFormData] = useState({
      telegram: '',
      phone: '',
      address: '',
      deliveryType: 'home' // 'home' or 'pickup'
    });

    const generateOrderRef = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      return `CM-${timestamp}-${random}`.toUpperCase();
    };

    const sendTelegramNotification = async (orderData: {
      orderRef: string;
      items: CartItem[];
      total: number;
      telegram: string;
      phone: string;
      deliveryType: string;
      address?: string;
    }) => {
      const botToken = '7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA';
      const chatId = '1823225052';
      
      const deliveryEstimate = orderData.deliveryType === 'home' ? '24-48h' : '2-4h';
      const deliveryInfo = orderData.deliveryType === 'home' 
        ? `🏠 Livraison à domicile\n📍 ${orderData.address}`
        : '📍 Retrait sur place (adresse communiquée par MP)';
      
      const itemsList = orderData.items.map(item => 
        `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const message = `🎉 *NOUVELLE COMMANDE REÇUE*
      
⏰ *ChronoMedical* - Commande #${orderData.orderRef}

👤 *Client*
${orderData.telegram}
📱 ${orderData.phone}

🛍️ *Détails de la commande*
${itemsList}

💰 *Total: €${orderData.total.toFixed(2)}*

🚚 *Livraison*
${deliveryInfo}
⏱️ Estimation: ${deliveryEstimate}

✅ *Statut*: En cours de traitement

---
_Commande passée via ChronoMedical_
_${new Date().toLocaleString('fr-FR')}_`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      } catch (error) {
        console.error('Erreur envoi Telegram:', error);
      }
    };

    const sendCustomerConfirmation = async (orderData: {
      orderRef: string;
      items: CartItem[];
      total: number;
      telegram: string;
      phone: string;
      deliveryType: string;
      address?: string;
    }) => {
      const botToken = '7576637364:AAHc904cJr58hHy3neSLimEMLGHtBxQ9JpA';
      const username = orderData.telegram.replace('@', '');
      
      const deliveryEstimate = orderData.deliveryType === 'home' ? '24-48h' : '2-4h';
      const deliveryInfo = orderData.deliveryType === 'home' 
        ? `🏠 Livraison à domicile\n📍 ${orderData.address}`
        : '📍 Retrait sur place\n(L\'adresse vous sera communiquée prochainement)';
      
      const itemsList = orderData.items.map(item => 
        `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const customerMessage = `🎉 *Merci pour votre commande !*

⏰ *ChronoMedical* vous confirme votre commande

📋 *Récapitulatif*
Référence: #${orderData.orderRef}

🛍️ *Vos articles*
${itemsList}

💰 *Total: €${orderData.total.toFixed(2)}*

🚚 *Livraison*
${deliveryInfo}
⏱️ Estimation: ${deliveryEstimate}

✅ *Prochaines étapes*
Notre équipe va traiter votre commande et vous contacter sous peu pour finaliser les détails de livraison.

🙏 *Merci de votre confiance !*
L'équipe ChronoMedical

---
_Commande passée le ${new Date().toLocaleString('fr-FR')}_`;

      try {
        // Get user ID by username
        const userResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: `@${username}`
          })
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.ok) {
            // Send message to customer
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: userData.result.id,
                text: customerMessage,
                parse_mode: 'Markdown'
              })
            });
          }
        }
      } catch (error) {
        console.error('Erreur envoi confirmation client:', error);
      }
    };

    const handleCheckout = async () => {
      if (!formData.telegram || !formData.phone || (formData.deliveryType === 'home' && !formData.address)) {
        return;
      }
      
      setIsProcessing(true);
      const ref = generateOrderRef();
      setOrderRef(ref);
      
      // Prepare order data
      const orderData = {
        orderRef: ref,
        items: cart,
        total: getTotalPrice(),
        telegram: formData.telegram,
        phone: formData.phone,
        deliveryType: formData.deliveryType,
        address: formData.address
      };
      
      // Send notifications
      try {
        await Promise.all([
          sendTelegramNotification(orderData),
          sendCustomerConfirmation(orderData)
        ]);
      } catch (error) {
        console.error('Erreur notifications:', error);
      }
      
      // Simulate order processing
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        setTimeout(() => {
          setIsComplete(false);
          setCurrentView('home');
          setCart([]);
          setFormData({ telegram: '', phone: '', address: '', deliveryType: 'home' });
        }, 8000);
      }, 2000);
    };

    if (isComplete) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="max-w-md mx-auto px-6">
            <div className="text-center py-12 glass-card rounded-3xl shadow-glow animate-scaleIn">
              {/* Animated Success Icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto success-checkmark shadow-glow">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-green-600/20 rounded-full animate-ping mx-auto"></div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 text-gradient">Commande Reçue! 🎉</h2>
              <p className="text-gray-400 mb-8 text-lg font-medium">Votre commande est en cours de traitement par notre équipe.</p>
              
              {/* Order Summary */}
              <div className="glass-card rounded-2xl p-6 mb-6 text-left">
                <h3 className="font-bold text-white mb-4 text-xl">Résumé de commande</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-300 text-lg">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
                      <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-white text-xl">
                      <span>Total</span>
                      <span className="text-gradient">€{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reference Number */}
              <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-glow">
                <p className="text-purple-300 font-medium mb-2">Référence de commande</p>
                <p className="text-white font-mono text-2xl font-bold">{orderRef}</p>
              </div>
              
              {/* Delivery Information */}
              <div className="glass-card rounded-2xl p-6 mb-6 text-left">
                <h3 className="font-bold text-white mb-4 text-xl">Informations de livraison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300 text-lg">
                    <span className="font-medium">Mode:</span>
                    <span className="text-purple-400 font-bold">
                      {formData.deliveryType === 'home' ? 'À Domicile 🏠' : 'Sur Place 📍'}
                    </span>
                  </div>
                  {formData.deliveryType === 'home' && formData.address && (
                    <div className="flex justify-between text-gray-300 text-lg">
                      <span className="font-medium">Adresse:</span>
                      <span className="text-right max-w-48 break-words font-medium">{formData.address}</span>
                    </div>
                  )}
                  {formData.deliveryType === 'pickup' && (
                    <div className="text-gray-400 font-medium">
                      L'adresse sera communiquée par message privé
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-400 text-lg font-medium leading-relaxed">
                Notre équipe vous contactera via Telegram <span className="text-gradient font-bold">{formData.telegram}</span> pour confirmer votre commande et organiser la livraison.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-md mx-auto">
          <div className="sticky top-16 bg-black/95 backdrop-blur-sm z-40 px-6 py-3 border-b border-gray-800">
            <button
              onClick={() => setCurrentView('cart')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </button>
          </div>

          <div className="px-6 pb-8">
                      <div className="text-center py-12 animate-slideInUp">
            <h2 className="text-4xl font-bold text-white mb-4 text-gradient">Finaliser la Commande</h2>
            <p className="text-gray-400 text-lg font-medium">Complétez votre commande</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
            
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6 animate-scaleIn">
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <Truck className="w-6 h-6 mr-3 text-purple-400" />
                  Mode de Livraison
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 p-4 rounded-xl glass-card border-gray-700 cursor-pointer hover-lift transition-all">
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="home"
                      checked={formData.deliveryType === 'home'}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryType: e.target.value }))}
                      className="w-5 h-5 text-purple-600 accent-purple-600" 
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">À Domicile 🏠</p>
                      <p className="text-gray-400 font-medium">Livraison à votre adresse</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-4 p-4 rounded-xl glass-card border-gray-700 cursor-pointer hover-lift transition-all">
                    <input 
                      type="radio" 
                      name="delivery" 
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryType: e.target.value }))}
                      className="w-5 h-5 text-purple-600 accent-purple-600" 
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">Sur Place 📍</p>
                      <p className="text-gray-400 font-medium">Adresse communiquée par message privé</p>
                    </div>
                  </label>
                </div>
                
                {formData.deliveryType === 'home' && (
                  <div className="mt-6 p-4 glass-card rounded-xl animate-slideInUp">
                    <label className="block text-white font-bold mb-3 text-lg">
                      Adresse de livraison *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Entrez votre adresse complète&#10;Rue, Ville, Code postal&#10;Étage, Interphone, etc."
                      className="input-field w-full p-4 rounded-xl text-white placeholder-gray-400 resize-none font-medium"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-6 animate-scaleIn">
                <h3 className="font-bold text-white mb-4 flex items-center text-lg">
                  <MessageCircle className="w-6 h-6 mr-3 text-purple-400" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="@username (Telegram)"
                    value={formData.telegram}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value && !value.startsWith('@')) {
                        value = '@' + value;
                      }
                      setFormData(prev => ({ ...prev, telegram: value }));
                    }}
                    className="input-field w-full p-4 rounded-xl text-white placeholder-gray-400 font-medium text-lg"
                  />
                  <input
                    type="tel"
                    placeholder="+33 1 23 45 67 89 (Phone with country code)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field w-full p-4 rounded-xl text-white placeholder-gray-400 font-medium text-lg"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-900/30 backdrop-blur-md rounded-xl border border-blue-800/30">
                  <p className="text-blue-300 font-medium">
                    📞 Notre équipe vous contactera via Telegram pour confirmer votre commande et organiser la livraison sécurisée.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 animate-scaleIn shadow-glow">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-bold text-gradient">
                    €{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !formData.telegram || !formData.phone || (formData.deliveryType === 'home' && !formData.address)}
                  className="btn-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Submitting Order...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-6 h-6" />
                      <span>Submit Order</span>
                    </>
                  )}
                </button>
                {(!formData.telegram || !formData.phone || (formData.deliveryType === 'home' && !formData.address)) && (
                  <p className="text-red-400 font-medium mt-4 text-center p-3 bg-red-900/20 rounded-xl border border-red-800/30">
                    {formData.deliveryType === 'home' 
                      ? 'Veuillez remplir tous les champs requis (Telegram, téléphone et adresse)'
                      : 'Veuillez remplir votre nom d\'utilisateur Telegram et numéro de téléphone'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="transition-opacity duration-200">
        {currentView === 'home' && <HomePage />}
        {currentView === 'product' && <ProductPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
      </main>
    </div>
  );
}

export default App;
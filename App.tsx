
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StatusView } from './components/StatusView';
import { MarketplaceView } from './components/MarketplaceView';
import { CategoryView } from './components/CategoryView';
import { AuthModal } from './components/AuthModal';
import { MapPin, Crown } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Category } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Logic to show registration screen (simulated for now)
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  
  // State for handling selected category view
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // SIMULATION: If user logs in, we could check Supabase here.
      // For demo purposes, we are not forcing the screen unless you uncomment this:
      // if (currentUser) setNeedsProfileSetup(true); 
    });
    return () => unsubscribe();
  }, []);

  // Simulate Splash Screen logic with 5 seconds duration
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Category Selection
  const handleSelectCategory = (category: Category) => {
      setSelectedCategory(category);
      setActiveTab('category_detail');
  };

  const handleProfileComplete = () => {
      setNeedsProfileSetup(false);
      setActiveTab('home');
  };

  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-gradient-to-br from-primary-500 to-orange-700 flex flex-col items-center justify-center text-white z-50">
              
              {/* Animated Logo Container */}
              <div className="relative flex flex-col items-center justify-center mb-8">
                  {/* Icon Pops In */}
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4 animate-pop-in opacity-0">
                      <MapPin className="w-10 h-10 text-primary-600 fill-primary-600" />
                  </div>

                  {/* Title Slides Up (delayed) */}
                  <div className="text-5xl font-bold font-display animate-slide-up opacity-0 [animation-delay:500ms]">
                    Localizei
                  </div>

                  {/* Subtitle Expands (delayed further) */}
                  <div className="text-sm font-light uppercase mt-2 animate-tracking-expand opacity-0 [animation-delay:1000ms]">
                    Freguesia
                  </div>
              </div>
              
              {/* Sponsor Footer Slides Up at the end */}
              <div className="absolute bottom-12 text-center animate-spin-in opacity-0 [animation-delay:1500ms]">
                  <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Patrocinador Master</p>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4 text-yellow-300 fill-yellow-300 drop-shadow-md" />
                    <p className="font-bold text-lg tracking-wide text-white drop-shadow-sm">Grupo Esquematiza</p>
                  </div>
              </div>
          </div>
      )
  }

  // View: Quick Register (Forces user to complete profile if needed)
  if (user && needsProfileSetup) {
      return (
          {/* QuickRegister temporariamente desativado */}
      );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center transition-colors duration-300 relative">
        
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {/* Only show Header if NOT in specific detail views that have their own headers */}
          {activeTab !== 'category_detail' && (
              <Header 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme}
                onAuthClick={() => setIsAuthOpen(true)}
                user={user}
              />
          )}

          <main className="animate-in fade-in duration-500">
            {activeTab === 'home' && (
                <HomeFeed 
                    onNavigate={setActiveTab} 
                    onSelectCategory={handleSelectCategory} 
                />
            )}
            {activeTab === 'explore' && <ExploreView />}
            {activeTab === 'status' && <StatusView />}
            {activeTab === 'marketplace' && <MarketplaceView onBack={() => setActiveTab('home')} />}
            
            {/* New Category Detail View */}
            {activeTab === 'category_detail' && selectedCategory && (
                <CategoryView 
                    category={selectedCategory} 
                    onBack={() => setActiveTab('home')} 
                />
            )}

            {activeTab === 'menu' && (
                <div className="p-10 flex flex-col items-center justify-center text-center h-[60vh] text-gray-400 dark:text-gray-500">
                    <div className="mb-4 text-6xl">🚧</div>
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Em Construção</h2>
                    <p className="text-sm">Acesse "Explorar" para ver a Área do Profissional ou "Início" para as lojas.</p>
                    <button 
                        onClick={() => setActiveTab('home')}
                        className="mt-6 px-6 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full font-medium text-sm"
                    >
                        Voltar ao Início
                    </button>
                </div>
            )}
          </main>
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            user={user}
          />
        </Layout>
      </div>
    </div>
  );
};

export default App;
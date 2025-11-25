import React, { useState, useEffect } from 'react';
import { CATEGORIES, STORES, SUBCATEGORIES } from '../constants';
import { AdType, Category, Store } from '../types';
import { BadgeCheck, TrendingUp, Star, Search, X, Eye, EyeOff, ChevronRight, Coins, ShoppingBag, Sparkles, Briefcase, Percent } from 'lucide-react';
import { QuoteRequestModal } from './QuoteRequestModal';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick?: (store: Store) => void;
  initialSearch?: string;
}

// Banners from Supabase Storage
const SUPABASE_BANNERS = [
  'https://nyneuuvcdmtqjyaqrztz.supabase.co/storage/v1/object/public/Banners%20Home/Banner%20Casa%20Pedro.jpg',
  'https://nyneuuvcdmtqjyaqrztz.supabase.co/storage/v1/object/public/Banners%20Home/Banner%20Esquematiza.png',
  'https://nyneuuvcdmtqjyaqrztz.supabase.co/storage/v1/object/public/Banners%20Home/drogasmil-freguesia.jpg',
  'https://nyneuuvcdmtqjyaqrztz.supabase.co/storage/v1/object/public/Banners%20Home/Rio%20Phone%20Store%20-%20Novo%20Design.png'
];

export const HomeFeed: React.FC<HomeFeedProps> = ({ onNavigate, onSelectCategory, onStoreClick, initialSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [showBalance, setShowBalance] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
  
  // Carousel State
  const [banners, setBanners] = useState<string[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuoteNiche, setSelectedQuoteNiche] = useState('');
  
  // Initialize and Shuffle Banners on Mount
  useEffect(() => {
    // Shuffle the array to show random order on each load
    const shuffled = [...SUPABASE_BANNERS].sort(() => 0.5 - Math.random());
    setBanners(shuffled);
  }, []);

  // Banner Rotation Timer (4 Seconds)
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);
  
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredStores = STORES.filter((store) => {
    const term = normalizeText(searchTerm);
    const name = normalizeText(store.name);
    const category = normalizeText(store.category);
    const description = normalizeText(store.description);

    return (
      name.includes(term) ||
      category.includes(term) ||
      description.includes(term)
    );
  });

  const sortedStores = filteredStores.sort((a, b) => {
    const priority = { [AdType.PREMIUM]: 3, [AdType.LOCAL]: 2, [AdType.ORGANIC]: 1 };
    return priority[b.adType] - priority[a.adType];
  });

  const visibleStores = React.useMemo(() => {
     if (searchTerm) return sortedStores;
     
     const items = [];
     for (let i = 0; i < displayCount; i++) {
        items.push(sortedStores[i % sortedStores.length]);
     }
     return items;
  }, [sortedStores, displayCount, searchTerm]);

  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (searchTerm) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
             setDisplayCount((prev) => prev + 5);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [searchTerm]);

  const marketplaceStores = STORES.filter(s => s.isMarketplace);
  const cashbackStores = STORES.filter(s => s.cashback && s.cashback > 0);

  const serviceNiches = React.useMemo(() => {
    const list = [
      ...(SUBCATEGORIES['Serviços'] || []),
      ...(SUBCATEGORIES['Profissionais'] || []),
      ...(SUBCATEGORIES['Assistências'] || []),
      ...(SUBCATEGORIES['Casa'] || []),
    ];
    return Array.from(new Map(list.map(item => [item.name, item])).values());
  }, []);

  const handleOpenQuote = (nicheName: string) => {
    setSelectedQuoteNiche(nicheName);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 pt-4">
      
      {/* Search Bar */}
      <div className="px-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lojas, categorias..."
            className="block w-full pl-10 pr-10 py-3 border-none rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="w-full pl-5">
            <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-x-4 gap-y-6 overflow-x-auto pb-2 pr-5 no-scrollbar w-full touch-pan-x">

            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                className="w-[68px] flex flex-col items-center cursor-pointer group"
                onClick={() => onSelectCategory(cat)}
              >
                <div className="w-[68px] h-[66px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-1 flex-shrink-0 gap-1 group-hover:shadow-md group-hover:border-primary-200 transition-all">
                  
                  <div className="text-primary-500 dark:text-primary-400 text-[18px] mb-[2px]">
                    {cat.icon}
                  </div>

                  <span className="text-[9px] text-gray-600 dark:text-gray-300 text-center leading-tight break-words max-w-[60px] mt-[2px]">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}

            </div>
        </div>
      )}

      {/* Featured / Cashback / Achadinhos */}
      {!searchTerm && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Banner Destaque (Carousel) */}
            <div className="px-5">
                <div className="w-full h-48 rounded-3xl overflow-hidden relative shadow-lg group cursor-pointer bg-gray-100 dark:bg-gray-800">
                    
                    {banners.length > 0 ? (
                      banners.map((bannerUrl, index) => (
                        <div 
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                          }`}
                          onClick={() => onStoreClick && onStoreClick(STORES[0])} // Using first store as dummy link for now
                        >
                           <img 
                              src={bannerUrl} 
                              alt={`Banner ${index + 1}`} 
                              className="w-full h-full object-cover" 
                           />
                        </div>
                      ))
                    ) : (
                      // Fallback skeleton
                      <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    )}

                    {/* Indicators */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {banners.map((_, idx) => (
                           <div 
                             key={idx}
                             className={`h-1.5 rounded-full transition-all duration-300 ${
                               idx === currentBannerIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                             }`}
                           ></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cashback Mini Banner */}
            <div className="px-5">
                <div onClick={() => onNavigate('cashback')} className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-lg border border-yellow-500/30 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform">
                    <div className="absolute -left-6 -top-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center gap-3 z-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 flex items-center justify-center shadow-md shadow-yellow-500/20 border border-yellow-400/50">
                            <Coins className="w-5 h-5 text-yellow-950" />
                        </div>
                        <div>
                            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Seu Cashback</p>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white font-display tracking-tight">
                                    {showBalance ? 'R$ 54,90' : '••••••'}
                                </span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} 
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="flex items-center gap-1 text-yellow-400 text-xs font-bold hover:text-yellow-300 transition-colors z-10 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                        Ver extrato
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Cashback Stores */}
            <div className="pl-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <Percent className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        Lojas que já participam do Cashback
                    </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 pr-5 no-scrollbar">
                    {cashbackStores.map((store) => (
                        <div
                            key={store.id}
                            onClick={() => onStoreClick && onStoreClick(store)}
                            className="min-w-[120px] w-[120px] flex flex-col gap-1.5 group cursor-pointer"
                        >
                            <div className="w-full h-[80px] rounded-xl overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700">
                                <img
                                    src={store.image}
                                    alt={store.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-1 right-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    {store.cashback}%
                                </div>
                            </div>
                            <div className="px-0.5">
                                <h4 className="text-[11px] font-bold text-gray-800 dark:text-white line-clamp-1 leading-tight">
                                    {store.name}
                                </h4>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
                                    {store.category}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achadinhos */}
            <div className="pl-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500 fill-purple-100 dark:fill-purple-900" />
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">Achadinhos da Freguesia</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 pr-5 no-scrollbar">
                    {marketplaceStores.map((store) => (
                        <div key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="min-w-[140px] w-[140px] flex flex-col gap-2 group cursor-pointer">
                            <div className="w-full h-40 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 group-hover:shadow-md transition-all">
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                                    <ShoppingBag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-12"></div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1 leading-tight">{store.name}</h4>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {store.price ? `R$ ${store.price.toFixed(2).replace('.', ',')}` : 'Oferta'}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div 
                      onClick={() => onNavigate('marketplace')}
                      className="min-w-[100px] flex flex-col items-center justify-center gap-2 cursor-pointer pr-4 group"
                    >
                         <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                            <ChevronRight className="w-6 h-6" />
                         </div>
                         <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Ver tudo</span>
                    </div>
                </div>
            </div>

            {/* Solicite um orçamento */}
            <div className="px-5 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-100 dark:border-gray-700/50">
                  
                  {/* Header do Bloco */}
                  <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm">
                         <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Solicite um orçamento</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Receba propostas de profissionais verificados da região.
                          </p>
                      </div>
                  </div>

                  {/* Carrossel de Cards */}
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pt-4 pb-2 -mx-2 px-2">
                      {serviceNiches.slice(0, 10).map((service, idx) => (
                          <button 
                              key={idx}
                              onClick={() => handleOpenQuote(service.name)}
                              className="min-w-[100px] h-[110px] bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm flex flex-col items-center justify-center gap-3 p-3 transition-all hover:shadow-md hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-500 active:scale-95 group"
                          >
                              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                  {service.icon}
                              </div>
                              <span className="text-[11px] font-bold text-center text-gray-700 dark:text-gray-200 line-clamp-2 leading-tight px-1">
                                  {service.name}
                              </span>
                          </button>
                      ))}
                      
                      {/* Botão Ver Mais */}
                      <button className="min-w-[80px] h-[110px] flex flex-col items-center justify-center gap-2 group">
                           <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 group-hover:text-primary-500 group-hover:border-primary-200 transition-all shadow-sm">
                               <ChevronRight className="w-5 h-5" />
                           </div>
                           <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors">Ver mais</span>
                      </button>
                  </div>
              </div>
            </div>

        </div>
      )}

      {/* Store List */}
      <div className="px-5 pb-4 min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Lojas & Serviços'}
            </h3>
            {!searchTerm && <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold cursor-pointer">Ver todos</span>}
        </div>
        
        {visibleStores.length > 0 ? (
          <div className="flex flex-col gap-4">
            {visibleStores.map((store, index) => (
              <div 
                key={`${store.id}-${index}`} 
                onClick={() => onStoreClick && onStoreClick(store)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
              >
                {store.adType === AdType.PREMIUM && (
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary-500 to-orange-400 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl z-10">
                        PATROCINADO
                    </div>
                )}

                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-1">
                      <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{store.name}</h4>
                      {store.adType !== AdType.ORGANIC && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-blue-900" />}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1 text-yellow-500 font-bold">
                          <Star className="w-3 h-3 fill-current" /> {store.rating}
                      </span>
                      <span>•</span>
                      <span>{store.category}</span>
                      <span>•</span>
                      <span>{store.distance}</span>
                  </div>

                  {store.cashback && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 w-fit px-2 py-1 rounded-md">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{store.cashback}% Cashback</span>
                      </div>
                  )}
                  {!store.cashback && (
                      <p className="text-[11px] text-gray-400 line-clamp-1">{store.description}</p>
                  )}
                </div>
              </div>
            ))}
            {!searchTerm && (
                <div ref={loadMoreRef} className="h-20 flex items-center justify-center w-full text-gray-400 text-xs animate-pulse">
                    Carregando mais lojas...
                </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm">Poxa, não encontramos nada para "{searchTerm}"</p>
            <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-500 font-bold text-sm hover:underline"
            >
                Limpar busca
            </button>
          </div>
        )}
      </div>

      <QuoteRequestModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        categoryName={selectedQuoteNiche} 
      />
    </div>
  );
};
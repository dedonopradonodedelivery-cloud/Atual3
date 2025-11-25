import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, TrendingUp } from 'lucide-react';
import { Category, Store } from '../types';
import { SUBCATEGORIES, STORES } from '../constants';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
}

const BANNERS = [
  'https://picsum.photos/800/300?random=101',
  'https://picsum.photos/800/300?random=102',
  'https://picsum.photos/800/300?random=103',
  'https://picsum.photos/800/300?random=104',
  'https://picsum.photos/800/300?random=105',
];

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Get subcategories or fallback to default
  const subcategories = SUBCATEGORIES[category.name] || SUBCATEGORIES['default'];

  // Filter stores based on current category and selected subcategory
  const filteredStores = STORES.filter((store) => {
    // Normalization for robust matching (e.g. Alimentos vs Alimentação)
    const storeCat = store.category.toLowerCase();
    const currentCat = category.name.toLowerCase();
    
    // Match category (Handle specific mock data mismatch Alimentos vs Alimentação)
    const matchesCategory = storeCat === currentCat || (currentCat === 'alimentação' && storeCat === 'alimentos');
    
    // Match subcategory (if exists in data)
    const matchesSub =
      !selectedSubcategory ||
      !('subcategory' in store) ||
      (store as any).subcategory === selectedSubcategory;

    return matchesCategory && matchesSub;
  });

  // Carousel Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-gray-900 px-5 py-4 flex items-center justify-between shadow-sm dark:shadow-none">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
          {category.name}
        </h2>

        <button className="p-2 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <Search className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      </div>

      {/* Content Scrollable Area */}
      <div className="p-5 space-y-6">
        
        {/* Carousel (5 Banners, 4s auto) */}
        <div className="w-full aspect-[2/1] rounded-3xl overflow-hidden relative shadow-md">
          {BANNERS.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          ))}
          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {BANNERS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Subcategories Grid */}
        <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">Subcategorias</h3>
            <div className="grid grid-cols-2 gap-4">
            {subcategories.map((sub, idx) => {
                const isSelected = selectedSubcategory === sub.name;
                return (
                    <div 
                    key={idx}
                    onClick={() => setSelectedSubcategory(isSelected ? null : sub.name)}
                    className={`rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-sm transition-all cursor-pointer active:scale-95 border ${
                        isSelected 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'bg-white dark:bg-gray-800 border-transparent dark:border-gray-700 hover:shadow-md'
                    }`}
                    >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 dark:bg-gray-700 text-primary-500'
                    }`}>
                        <div className={isSelected ? 'text-white' : 'text-primary-500'}>
                            {sub.icon}
                        </div>
                    </div>
                    <span className={`font-medium text-base text-center ${
                        isSelected ? 'text-white' : 'text-gray-800 dark:text-white'
                    }`}>
                        {sub.name}
                    </span>
                    </div>
                );
            })}
            </div>
        </div>

        {/* Store List Section */}
        <div className="pt-2">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">
                {selectedSubcategory ? `Lojas de ${selectedSubcategory}` : `Lojas em ${category.name}`}
            </h3>
            
            <div className="flex flex-col gap-4">
                {filteredStores.length > 0 ? (
                    filteredStores.map((store) => (
                        <div 
                            key={store.id} 
                            onClick={() => onStoreClick(store)}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden active:scale-[0.99]"
                        >
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-1 mb-1">
                                    <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{store.name}</h4>
                                    {store.verified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-blue-900" />}
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

                                {store.cashback ? (
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 w-fit px-2 py-1 rounded-md">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[10px] font-bold">{store.cashback}% Cashback</span>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-gray-400 line-clamp-1">{store.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        Nenhuma loja encontrada nesta categoria.
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
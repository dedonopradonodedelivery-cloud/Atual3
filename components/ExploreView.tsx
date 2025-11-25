import React, { useState } from 'react';
import { Search, SlidersHorizontal, Clock, Percent, Star } from 'lucide-react';
import { CATEGORIES, STORES } from '../constants';
import { Category, Store } from '../types';

interface ExploreViewProps {
  onSelectCategory: (category: Category) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onSelectCategory, onNavigate, onStoreClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize text for robust search (accents, case)
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Filter stores using real STORES data
  const displayStores = STORES.filter((store) => {
    const term = normalizeText(searchTerm);
    return (
      normalizeText(store.name).includes(term) ||
      normalizeText(store.category).includes(term) ||
      normalizeText(store.description).includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in fade-in duration-300">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-4 pb-2 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-display mb-4">Explorar</h2>
        <div className="relative group mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lojas, categorias..."
            className="block w-full pl-10 pr-10 py-3.5 border-none rounded-2xl leading-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-xs font-bold shadow-md shadow-primary-500/20 whitespace-nowrap">
            <SlidersHorizontal className="w-3 h-3" />
            Filtros
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap shadow-sm">
            <Percent className="w-3 h-3 text-green-500" />
            Cashback
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap shadow-sm">
            <Clock className="w-3 h-3 text-blue-500" />
            Abertos agora
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium whitespace-nowrap shadow-sm">
            <Star className="w-3 h-3 text-yellow-500" />
            Melhor avaliados
        </button>
      </div>

      <div className="px-5 space-y-8">
        
        {/* Full Categories Grid */}
        <div>
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">Categorias</h3>
           </div>
           <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => onSelectCategory(cat)}
                  className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
                >
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-md group-hover:border-primary-200 transition-all">
                        {cat.icon}
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight line-clamp-2">{cat.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Promo Banner - Clickable for Cashback */}
        <div 
            onClick={() => onNavigate('cashback')}
            className="w-full h-32 rounded-3xl overflow-hidden relative shadow-md cursor-pointer active:scale-[0.98] transition-transform"
        >
            <img src="https://picsum.photos/600/200?random=88" alt="Promo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Oferta da Semana</span>
                <h3 className="text-white font-bold text-xl leading-tight">Ganhe até 10%<br/>de Cashback</h3>
            </div>
        </div>

        {/* Nearby Stores Carousel (Uses DisplayStores) */}
        <div>
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                {searchTerm ? 'Resultados da busca' : 'Lojas perto de você'}
              </h3>
              {/* Map button removed as requested since MapView is not yet implemented */}
           </div>
           
           <div className={`${searchTerm ? 'grid grid-cols-2 gap-4' : 'flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar'}`}>
              {displayStores.map((store) => (
                  <div 
                    key={store.id} 
                    onClick={() => onStoreClick(store)}
                    className={`${searchTerm ? 'w-full' : 'min-w-[160px] w-[160px]'} bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-2 group cursor-pointer active:scale-[0.98] transition-all`}
                  >
                      <div className="w-full h-24 rounded-xl overflow-hidden relative">
                         <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         {store.cashback && (
                             <div className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                                 {store.cashback}%
                             </div>
                         )}
                      </div>
                      
                      <div>
                          <h4 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{store.name}</h4>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{store.rating}</span>
                              <span className="mx-0.5">•</span>
                              <span>{store.distance}</span>
                          </div>
                      </div>
                  </div>
              ))}
              {displayStores.length === 0 && (
                <div className="text-gray-500 text-sm py-4 w-full text-center col-span-2">
                  Nenhuma loja encontrada para "{searchTerm}".
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
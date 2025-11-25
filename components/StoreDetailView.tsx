import React from 'react';
import { ChevronLeft, Star, MapPin, Clock, BadgeCheck, MessageCircle, TrendingUp, Share2, Info } from 'lucide-react';
import { Store } from '../types';

interface StoreDetailViewProps {
  store: Store;
  onBack: () => void;
  onOpenCashback: () => void;
}

export const StoreDetailView: React.FC<StoreDetailViewProps> = ({ store, onBack, onOpenCashback }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300 relative">
      
      {/* Header Image with Back Button */}
      <div className="relative h-72 w-full">
          <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-20">
              <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                  <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                  <Share2 className="w-5 h-5" />
              </button>
          </div>
      </div>

      {/* Main Content Container - Overlapping */}
      <div className="relative -mt-10 bg-gray-50 dark:bg-gray-950 rounded-t-[2.5rem] px-6 pt-8 pb-10 shadow-up">
        
        {/* Header Info */}
        <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{store.name}</h1>
                {store.verified && <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-50 dark:fill-blue-900/30" />}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" /> {store.rating}
                </span>
                <span>•</span>
                <span>{store.category}</span>
                <span>•</span>
                <span>{store.distance}</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={onOpenCashback}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <TrendingUp className="w-5 h-5" />
                {store.cashback ? `Ganhar ${store.cashback}%` : 'Ver Cashback'}
            </button>
            <button className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <MessageCircle className="w-5 h-5 text-green-500" />
                WhatsApp
            </button>
        </div>

        {/* Info Sections */}
        <div className="space-y-6">
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary-500" />
                    Sobre
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {store.description}
                    {store.description.length < 50 && " Uma loja incrível na Freguesia com os melhores produtos e atendimento diferenciado. Venha nos visitar e conferir as novidades da semana!"}
                </p>
            </div>

            {/* Address & Hours */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-primary-500">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Endereço</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{store.address || 'Endereço não informado'}</p>
                        <button className="text-primary-500 text-xs font-bold mt-1">Abrir no Maps</button>
                    </div>
                </div>
                <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Funcionamento</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{store.hours || 'Seg - Sáb: 09h às 19h'}</p>
                        <span className="text-green-500 text-xs font-bold">Aberto agora</span>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            {store.gallery && (
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 ml-2">Fotos</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {store.gallery.map((img, idx) => (
                            <div key={idx} className="w-40 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src={img} alt="Galeria" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Reviews Preview */}
            {store.reviews && (
                <div>
                    <div className="flex items-center justify-between mb-3 ml-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">Avaliações</h3>
                        <span className="text-primary-500 text-xs font-bold">Ver todas</span>
                    </div>
                    <div className="space-y-3">
                        {store.reviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-gray-800 dark:text-white">{review.user}</span>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
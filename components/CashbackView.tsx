import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, ArrowDownLeft, ArrowUpRight, Coins, Wallet } from 'lucide-react';
import { TRANSACTIONS } from '../constants';

interface CashbackViewProps {
  onBack: () => void;
}

export const CashbackView: React.FC<CashbackViewProps> = ({ onBack }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">Minha Carteira</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="p-5">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-yellow-500">
                    <Coins className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Seu Cashback</span>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm opacity-70">R$</span>
                    <span className="text-4xl font-bold font-display">54,90</span>
                </div>

                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    Ver extrato completo
                </button>
            </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Extrato recente</h3>
            <button className="text-xs text-primary-500 font-bold">Ver tudo</button>
        </div>

        <div className="space-y-4">
            {TRANSACTIONS.map((t) => (
                <div key={t.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.cashbackAmount > 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                            {t.cashbackAmount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-white text-sm">{t.storeName}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-sm ${t.cashbackAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                            {t.cashbackAmount > 0 ? `+ R$ ${t.cashbackAmount.toFixed(2)}` : `R$ ${t.amount.toFixed(2)}`}
                        </p>
                        {t.status === 'pending' && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                                Pendente
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>

      </div>

      {/* Floating Bottom Action */}
      <div className="fixed bottom-24 left-0 right-0 px-5 flex justify-center pointer-events-none">
          <button 
            onClick={() => setShowHelp(true)}
            className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-full px-5 py-3 flex items-center gap-2 pointer-events-auto transform hover:scale-105 transition-all"
          >
              <HelpCircle className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Como funciona o cashback?</span>
          </button>
      </div>

      {/* Simple Modal for Help */}
      {showHelp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setShowHelp(false)}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Como funciona?</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                      1. Faça compras nas lojas parceiras.<br/>
                      2. Informe seu telefone no caixa.<br/>
                      3. Receba uma porcentagem do valor de volta na sua carteira digital.<br/>
                      4. Use o saldo para novas compras no bairro!
                  </p>
                  <button onClick={() => setShowHelp(false)} className="w-full bg-primary-500 text-white font-bold py-3 rounded-xl">Entendi</button>
              </div>
          </div>
      )}

    </div>
  );
};
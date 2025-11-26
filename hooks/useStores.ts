// src/hooks/useStores.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, AdType } from '../types';

// Como os dados vêm do banco
type DbBusiness = {
  id: string;
  nome: string;
  categoria: string;
  subcategoria: string | null;
  descricao: string | null;
  imagem_url?: string | null;          // opcional (se você criar depois)
  cashback_percentual?: number | null; // opcional
  nota?: number | null;                // opcional
  distancia_label?: string | null;     // opcional
};

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('estabelecimentos') // 👈 TABELA CERTA
          .select('id, nome, categoria, subcategoria, descricao');

        console.log('SUPABASE_RAW estabelecimentos', { data, error });

        if (error) {
          console.error('Erro ao carregar lojas da Supabase:', error);
          setError(error.message);
          setStores([]);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          console.warn('Nenhuma loja retornada de estabelecimentos');
          setError('Nenhuma loja cadastrada ainda.');
          setStores([]);
          setLoading(false);
          return;
        }

        const mapped: Store[] = (data as DbBusiness[]).map((row) => ({
          id: row.id,
          name: row.nome,
          category: row.categoria || 'Outros',
          image: row.imagem_url || '/placeholder-store.jpg',
          rating: row.nota ?? 4.8,
          distance: row.distancia_label || 'Perto de você',
          adType: AdType.ORGANIC, // padrão até você marcar quem é premium/local
          description: row.descricao || '',
          cashback:
            row.cashback_percentual !== null &&
            row.cashback_percentual !== undefined
              ? row.cashback_percentual
              : undefined,
          isMarketplace: false, // depois você liga isso com uma coluna específica
        }));

        console.log('STORES MAPEADAS', mapped);
        setStores(mapped);
        setLoading(false);
      } catch (e: any) {
        console.error('Erro inesperado no useStores:', e);
        setError(e?.message || 'Erro desconhecido ao carregar lojas.');
        setStores([]);
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  return { stores, loading, error };
}

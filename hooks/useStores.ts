// src/hooks/useStores.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, AdType } from '../types';

type DbBusiness = {
  id: string;
  nome: string;
  categoria: string;
  subcategoria: string | null;
  descricao: string | null;
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
          .from('estabelecimentos')
          .select('id, nome, categoria, subcategoria, descricao');

        console.log('SUPABASE_RAW estabelecimentos', { data, error });

        if (error) {
          setError(error.message);
          setStores([]);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          setError('Nenhuma loja retornada da tabela estabelecimentos.');
          setStores([]);
          setLoading(false);
          return;
        }

        const mapped: Store[] = (data as DbBusiness[]).map((row) => ({
          id: row.id,
          name: row.nome,
          category: row.categoria,
          description: row.descricao || '',
          image: '/placeholder-store.jpg',
          rating: 4.8,
          distance: 'Perto de você',
          cashback: 5,
          adType: AdType.ORGANIC,
          isMarketplace: false,
        }));

        setStores(mapped);
      } catch (e: any) {
        console.error('Erro inesperado ao buscar estabelecimentos', e);
        setError(e?.message ?? 'Erro inesperado');
        setStores([]);
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  return { stores, loading, error };
}

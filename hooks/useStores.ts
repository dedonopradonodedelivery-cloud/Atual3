// src/hooks/useStores.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, AdType } from '../types';

// Formato que vem do banco
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

      const { data, error } = await supabase
        .from('estabelecimentos')        // TABELA CERTA
        .select('id, nome, categoria, subcategoria, descricao');

      console.log('SUPABASE_RAW estabelecimentos:', { data, error });

      if (error) {
        setError(error.message);
        setStores([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setError('Nenhuma loja encontrada.');
        setStores([]);
        setLoading(false);
        return;
      }

      // Mapear para o tipo Store usado no app
      const mapped: Store[] = (data as DbBusiness[]).map((row) => ({
        id: row.id,
        name: row.nome,
        category: row.categoria,
        subcategory: row.subcategoria ?? '',
        description: row.descricao ?? '',

        // CAMPOS OBRIGATÓRIOS DO TIPO Store
        image: '/placeholder-store.jpg', // temporário
        rating: 4.8,                     // temporário
        distance: 'Perto de você',       // temporário
        adType: AdType.ORGANIC,          // temporário

        // opcionais
        cashback: 5,
        isMarketplace: false,
        price: undefined,
        verified: true,
      }));

      setStores(mapped);
      setLoading(false);
    }

    loadStores();
  }, []);

  return { stores, loading, error };
}

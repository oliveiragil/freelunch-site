'use client';

import { useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase-utils';

export default function SupabaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const success = await testSupabaseConnection();
      setResult(success ? 'Conexão bem-sucedida!' : 'Falha na conexão');
    } catch {
      setResult('Erro ao testar conexão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-medium mb-2">Teste Supabase</h3>
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {isLoading ? 'Testando...' : 'Testar Conexão'}
      </button>
      {result && (
        <p className={`text-xs mt-2 ${result.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
          {result}
        </p>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
  fullError?: unknown;
  testEmail?: string;
  exception?: unknown;
  isRLSError?: boolean;
}

interface DebugResults {
  timestamp: string;
  environment: {
    url?: string;
    keyLength?: number;
  };
  tests: Record<string, TestResult>;
}

export default function SupabaseDebug() {
  const [testResults, setTestResults] = useState<DebugResults>({
    timestamp: '',
    environment: {},
    tests: {}
  });

  useEffect(() => {
    runDebugTests();
  }, []);

  const runDebugTests = async () => {
    console.log('🔍 Iniciando testes de debug do Supabase...');
    
    const results: DebugResults = {
      timestamp: new Date().toISOString(),
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      },
      tests: {}
    };

    // Teste 1: Conexão básica
    try {
      console.log('🧪 Teste 1: Conexão básica');
      const { data, error } = await supabase
        .from('emails')
        .select('count', { count: 'exact', head: true });
      
      results.tests.basicConnection = {
        success: !error,
        data,
        error: error?.message,
        fullError: error
      };
      console.log('📊 Resultado Teste 1:', results.tests.basicConnection);
    } catch (err) {
      results.tests.basicConnection = {
        success: false,
        error: String(err),
        exception: err
      };
      console.error('❌ Erro no Teste 1:', err);
    }

    // Teste 2: Verificar estrutura da tabela
    try {
      console.log('🧪 Teste 2: Estrutura da tabela');
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .limit(0);
      
      results.tests.tableStructure = {
        success: !error,
        data,
        error: error?.message,
        fullError: error
      };
      console.log('📊 Resultado Teste 2:', results.tests.tableStructure);
    } catch (err) {
      results.tests.tableStructure = {
        success: false,
        error: String(err),
        exception: err
      };
      console.error('❌ Erro no Teste 2:', err);
    }

    // Teste 3: Tentar inserção de teste com logs detalhados de RLS
    try {
      console.log('🧪 Teste 3: Inserção de teste (verificando RLS)');
      const testEmail = `teste-${Date.now()}@debug.com`;
      
      console.log('🔐 Testando inserção como anon role...');
      const { data, error } = await supabase
        .from('emails')
        .insert([{ email_address: testEmail }])
        .select();
      
      if (error) {
        console.error('❌ Erro RLS detectado:', error);
        if (error.message.includes('row-level security policy')) {
          console.error('🚨 PROBLEMA: Políticas RLS bloqueando inserção anônima!');
          console.error('💡 SOLUÇÃO: Execute o script supabase-fix-rls.sql');
        }
      }
      
      results.tests.insertTest = {
        success: !error,
        testEmail,
        data,
        error: error?.message,
        fullError: error,
        isRLSError: error?.message?.includes('row-level security policy') || false
      };
      console.log('📊 Resultado Teste 3:', results.tests.insertTest);
      
      // Limpar o teste se foi bem-sucedido
      if (!error && data && data.length > 0) {
        await supabase
          .from('emails')
          .delete()
          .eq('email_address', testEmail);
        console.log('🧹 Email de teste removido');
      }
    } catch (err) {
      console.error('💥 Exceção no Teste 3:', err);
      results.tests.insertTest = {
        success: false,
        error: String(err),
        exception: err,
        isRLSError: String(err).includes('row-level security policy')
      };
    }

    setTestResults(results);
    console.log('📋 Relatório completo de debug:', results);
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">🔍 Debug Supabase</h3>
      
      <div className="mb-2">
        <strong>Environment:</strong>
        <div>URL: {testResults.environment?.url?.substring(0, 30)}...</div>
        <div>Key Length: {testResults.environment?.keyLength}</div>
      </div>

      <div className="space-y-2">
        {Object.entries(testResults.tests || {}).map(([testName, result]: [string, TestResult]) => (
          <div key={testName} className="border-t pt-2">
            <div className="flex items-center gap-2">
              <span>{result.success ? '✅' : '❌'}</span>
              <strong>{testName}</strong>
            </div>
            {result.error && (
              <div className={`mt-1 text-sm ${result.isRLSError ? 'text-yellow-300' : 'text-red-300'}`}>
                {result.isRLSError && '🚨 RLS ERROR: '}
                Error: {result.error}
                {result.isRLSError && (
                  <div className="mt-1 text-xs text-yellow-200">
                    Execute: supabase-fix-rls.sql
                  </div>
                )}
              </div>
            )}
            {result.success && !!result.data && (
              <div className="text-green-300 mt-1">
                Success: Data received
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={runDebugTests}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        🔄 Testar Novamente
      </button>
    </div>
  );
}

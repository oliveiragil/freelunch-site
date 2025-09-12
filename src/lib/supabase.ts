import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔧 Configuração Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey?.length);
console.log('Key starts with:', supabaseAnonKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Não precisamos de sessão para inserção anônima
  }
})

console.log('✅ Cliente Supabase criado com sucesso');

// Tipos para a tabela emails
export interface EmailRecord {
  id?: number
  email_address: string
  created_at?: string
}

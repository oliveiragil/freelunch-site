import { supabase } from './supabase';

// Função para testar a conexão com o Supabase
export async function testSupabaseConnection() {
  try {
    // Tenta fazer uma consulta simples para verificar a conexão
    const { error } = await supabase
      .from('emails')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('Erro ao conectar com Supabase:', error);
      return false;
    }

    console.log('Conexão com Supabase bem-sucedida');
    return true;
  } catch (err) {
    console.error('Erro inesperado ao conectar com Supabase:', err);
    return false;
  }
}

// Função para verificar se um email já existe na base de dados
export async function checkEmailExists(email: string) {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('id')
      .eq('email_address', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (err) {
    console.error('Erro ao verificar email:', err);
    return false;
  }
}

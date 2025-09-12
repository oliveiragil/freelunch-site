-- 🚀 Script SQL completo para configurar waitlist no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se estamos no schema correto
SET search_path TO public;

-- 2. Criar a tabela emails (se não existir)
CREATE TABLE IF NOT EXISTS public.emails (
  id BIGSERIAL PRIMARY KEY,
  email_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_emails_email_address ON public.emails(email_address);
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON public.emails(created_at);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.emails;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.emails;

-- 6. Criar políticas RLS mais permissivas
-- Política para permitir inserção de qualquer usuário (anon + authenticated)
CREATE POLICY "Enable insert for all users" ON public.emails
FOR INSERT 
WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Enable read for authenticated users" ON public.emails
FOR SELECT 
TO authenticated 
USING (true);

-- 7. Dar permissões explícitas para o role anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE public.emails TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.emails_id_seq TO anon;

-- 8. Dar permissões para o role authenticated
GRANT ALL ON TABLE public.emails TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.emails_id_seq TO authenticated;

-- 9. Verificações finais
-- Verificar se a tabela foi criada
SELECT 
  'Tabela emails criada com sucesso!' as status,
  table_name, 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'emails' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  'Políticas RLS configuradas:' as status,
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'emails'
AND schemaname = 'public';

-- Verificar permissões
SELECT 
  'Permissões configuradas:' as status,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'emails' 
AND table_schema = 'public'
AND grantee IN ('anon', 'authenticated', 'service_role');

-- 10. Teste de inserção
-- Inserir um email de teste para verificar se está funcionando
INSERT INTO public.emails (email_address) 
VALUES ('teste-configuracao@freelunch.dev')
ON CONFLICT (email_address) DO NOTHING;

-- Verificar se o teste foi inserido
SELECT 
  'Teste de inserção:' as status,
  id, 
  email_address, 
  created_at 
FROM public.emails 
WHERE email_address = 'teste-configuracao@freelunch.dev';

-- Remover o email de teste
DELETE FROM public.emails 
WHERE email_address = 'teste-configuracao@freelunch.dev';

-- Mensagem final
SELECT '🎉 Configuração concluída! A tabela emails está pronta para uso.' as resultado;

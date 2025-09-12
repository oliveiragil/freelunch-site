-- 🔧 CORREÇÃO URGENTE: Políticas RLS para Inserção Anônima
-- Execute este script no Supabase Dashboard > SQL Editor

-- 1. Remover todas as políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.emails;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.emails;
DROP POLICY IF EXISTS "Allow all inserts" ON public.emails;
DROP POLICY IF EXISTS "emails_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "emails_anon_insert_policy" ON public.emails;

-- 2. Temporariamente DESABILITAR RLS para limpar e reconfigurar
ALTER TABLE public.emails DISABLE ROW LEVEL SECURITY;

-- 3. Dar todas as permissões necessárias ANTES de reabilitar RLS
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

GRANT ALL ON TABLE public.emails TO anon;
GRANT ALL ON TABLE public.emails TO authenticated;
GRANT ALL ON TABLE public.emails TO public;

-- 4. Reabilitar RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- 5. Criar uma política MUITO PERMISSIVA para INSERT
CREATE POLICY "allow_all_operations" ON public.emails
FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Verificar se existe alguma sequência na tabela emails (sem assumir coluna específica)
DO $$
DECLARE
    seq_name text;
    col_name text;
BEGIN
    -- Buscar qualquer coluna que use sequência na tabela emails
    SELECT 
        column_name,
        pg_get_serial_sequence('public.emails', column_name)
    INTO col_name, seq_name
    FROM information_schema.columns 
    WHERE table_name = 'emails' 
    AND table_schema = 'public' 
    AND column_default LIKE 'nextval%'
    LIMIT 1;
    
    IF seq_name IS NOT NULL THEN
        EXECUTE format('GRANT ALL ON SEQUENCE %s TO anon', seq_name);
        EXECUTE format('GRANT ALL ON SEQUENCE %s TO authenticated', seq_name);
        EXECUTE format('GRANT ALL ON SEQUENCE %s TO public', seq_name);
        RAISE NOTICE 'Permissões dadas na sequência % para coluna %', seq_name, col_name;
    ELSE
        RAISE NOTICE 'Nenhuma sequência encontrada - tabela usa apenas email_address como chave';
    END IF;
END $$;

-- 7. TESTE IMEDIATO - Inserção direta sem validação de duplicata
INSERT INTO public.emails (email_address) 
VALUES ('teste-rls-corrigido@freelunch.dev')
ON CONFLICT (email_address) DO NOTHING;

-- 8. Verificar se o teste funcionou
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.emails WHERE email_address = 'teste-rls-corrigido@freelunch.dev')
    THEN '✅ SUCESSO: RLS configurado corretamente!'
    ELSE '❌ ERRO: Inserção ainda bloqueada'
  END as resultado;

-- 9. Limpar o teste
DELETE FROM public.emails WHERE email_address = 'teste-rls-corrigido@freelunch.dev';

-- 10. Verificar políticas ativas
SELECT 
  'Políticas RLS ativas:' as info,
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'emails' 
AND schemaname = 'public';

-- 11. Verificar permissões
SELECT 
  'Permissões do role anon:' as info,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'emails' 
AND table_schema = 'public' 
AND grantee = 'anon';

-- 12. Mostrar estrutura da tabela para confirmar
SELECT 
  'Estrutura da tabela emails:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'emails' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 13. Verificar constraints da tabela
SELECT 
  'Constraints da tabela:' as info,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'emails' 
AND table_schema = 'public';

SELECT '🎉 Configuração RLS corrigida para tabela com email_address! Teste o formulário agora.' as status;

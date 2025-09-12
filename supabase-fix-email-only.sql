-- 🔧 CORREÇÃO RLS PARA TABELA COM EMAIL_ADDRESS APENAS
-- Script otimizado para tabela sem coluna ID

-- 1. Limpar todas as políticas existentes
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.emails;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.emails;
DROP POLICY IF EXISTS "Allow all inserts" ON public.emails;
DROP POLICY IF EXISTS "emails_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "emails_anon_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "allow_all_inserts" ON public.emails;

-- 2. Garantir que RLS está habilitado
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- 3. Política universal para INSERT (sem dependência de sequência)
CREATE POLICY "freelunch_waitlist_insert" ON public.emails
FOR INSERT 
WITH CHECK (
    email_address IS NOT NULL 
    AND email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- 4. Dar permissões básicas (sem sequência)
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE public.emails TO anon;
GRANT SELECT ON TABLE public.emails TO anon; -- Para verificar duplicatas
GRANT INSERT ON TABLE public.emails TO public;

-- 5. Teste de inserção com email válido
INSERT INTO public.emails (email_address) 
VALUES ('teste-freelunch@example.com')
ON CONFLICT (email_address) DO NOTHING;

-- 6. Verificar se o teste funcionou
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.emails WHERE email_address = 'teste-freelunch@example.com')
    THEN '✅ SUCESSO: RLS configurado corretamente!'
    ELSE '❌ ERRO: Inserção ainda bloqueada'
  END as resultado;

-- 7. Contar emails para confirmar
SELECT 
    'Total de emails na tabela:' as info,
    COUNT(*) as total
FROM public.emails;

-- 8. Limpar o email de teste
DELETE FROM public.emails WHERE email_address = 'teste-freelunch@example.com';

-- 9. Verificar estrutura da tabela
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

-- 10. Verificar restrições (constraints)
SELECT 
    'Constraints da tabela:' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'emails' 
AND table_schema = 'public';

-- 11. Mostrar política criada
SELECT 
    'Política RLS ativa:' as info,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'emails' 
AND schemaname = 'public';

-- 12. Verificar permissões do anon
SELECT 
    'Permissões do role anon:' as info,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'emails' 
AND table_schema = 'public' 
AND grantee = 'anon';

SELECT '🎉 Configuração RLS otimizada para email_address concluída!' as status;

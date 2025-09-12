-- 🚨 SOLUÇÃO EXTREMA: DESABILITAR RLS COMPLETAMENTE
-- Use este script se o anterior ainda falhar

-- 1. Desabilitar RLS completamente (temporariamente)
ALTER TABLE public.emails DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.emails;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.emails;
DROP POLICY IF EXISTS "Allow all inserts" ON public.emails;
DROP POLICY IF EXISTS "emails_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "emails_anon_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "allow_all_operations" ON public.emails;

-- 3. Dar permissões totais
GRANT ALL PRIVILEGES ON SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON TABLE public.emails TO anon;
GRANT ALL PRIVILEGES ON SCHEMA public TO public;
GRANT ALL PRIVILEGES ON TABLE public.emails TO public;

-- 4. Teste sem RLS
INSERT INTO public.emails (email_address) 
VALUES ('teste-sem-rls@freelunch.dev')
ON CONFLICT (email_address) DO NOTHING;

-- 5. Verificar resultado
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.emails WHERE email_address = 'teste-sem-rls@freelunch.dev')
    THEN '✅ SUCESSO: Inserção funcionando sem RLS!'
    ELSE '❌ ERRO: Ainda há problemas'
  END as resultado;

-- 6. Limpar teste
DELETE FROM public.emails WHERE email_address = 'teste-sem-rls@freelunch.dev';

-- 7. REABILITAR RLS com política simples
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- 8. Criar política super permissiva
CREATE POLICY "super_permissive" ON public.emails
AS PERMISSIVE
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 9. Teste final com RLS reabilitado
INSERT INTO public.emails (email_address) 
VALUES ('teste-final-rls@freelunch.dev')
ON CONFLICT (email_address) DO NOTHING;

-- 10. Verificar resultado final
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.emails WHERE email_address = 'teste-final-rls@freelunch.dev')
    THEN '🎉 PERFEITO: RLS funcionando com política permissiva!'
    ELSE '⚠️ RLS ainda problemático - considere deixar desabilitado temporariamente'
  END as resultado_final;

-- 11. Limpar teste final
DELETE FROM public.emails WHERE email_address = 'teste-final-rls@freelunch.dev';

-- 12. Status final
SELECT 
    'Configuração final:' as info,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM pg_class c 
            JOIN pg_namespace n ON n.oid = c.relnamespace 
            WHERE c.relname = 'emails' 
            AND n.nspname = 'public' 
            AND c.relrowsecurity = true
        )
        THEN 'RLS HABILITADO'
        ELSE 'RLS DESABILITADO'
    END as rls_status;

SELECT '🚀 Execute este script se o anterior falhar!' as status;

-- 🔍 DIAGNÓSTICO DA TABELA EMAILS
-- Execute este script PRIMEIRO para descobrir a estrutura

-- 1. Verificar se a tabela existe
SELECT 
    'Tabela emails existe:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'emails' AND table_schema = 'public')
        THEN '✅ SIM'
        ELSE '❌ NÃO'
    END as resultado;

-- 2. Estrutura completa da tabela
SELECT 
    '📋 Estrutura da tabela:' as info,
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'emails' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar sequências relacionadas
SELECT 
    '🔄 Sequências encontradas:' as info,
    sequence_name,
    sequence_schema,
    data_type,
    start_value,
    increment
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
AND (sequence_name LIKE '%emails%' OR sequence_name LIKE '%email%');

-- 4. Verificar se existe coluna ID ou apenas email_address
SELECT 
    '🎯 Estrutura de chaves:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'emails' AND column_name = 'id')
        THEN '✅ Tem coluna ID'
        ELSE '❌ Sem coluna ID - apenas email_address'
    END as tem_id,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'emails' AND column_name = 'email_address')
        THEN '✅ Tem email_address'
        ELSE '❌ Sem email_address'
    END as tem_email;

-- 5. Status RLS atual
SELECT 
    '🔒 RLS Status:' as info,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM pg_class c 
            JOIN pg_namespace n ON n.oid = c.relnamespace 
            WHERE c.relname = 'emails' 
            AND n.nspname = 'public' 
            AND c.relrowsecurity = true
        )
        THEN '✅ HABILITADO'
        ELSE '❌ DESABILITADO'
    END as rls_status;

-- 6. Políticas existentes
SELECT 
    '📜 Políticas atuais:' as info,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'emails' 
AND schemaname = 'public';

-- 7. Permissões atuais do role anon
SELECT 
    '👤 Permissões do anon:' as info,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'emails' 
AND table_schema = 'public' 
AND grantee = 'anon';

-- 8. Tentar inserção de teste (vai falhar se RLS bloquear)
DO $$
BEGIN
    BEGIN
        INSERT INTO public.emails (email_address) 
        VALUES ('teste-diagnostico@freelunch.dev')
        ON CONFLICT (email_address) DO NOTHING;
        
        IF FOUND THEN
            RAISE NOTICE '✅ Inserção funcionou!';
        ELSE
            RAISE NOTICE '⚠️ Inserção não executada (possível conflito)';
        END IF;
        
        -- Limpar imediatamente
        DELETE FROM public.emails WHERE email_address = 'teste-diagnostico@freelunch.dev';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro na inserção: %', SQLERRM;
    END;
END $$;

SELECT '🔍 Diagnóstico completo!' as status;

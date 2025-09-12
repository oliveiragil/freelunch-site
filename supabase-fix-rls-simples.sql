-- 🔧 CORREÇÃO RLS SIMPLIFICADA
-- Execute este script se o anterior falhar com erro de sequência

-- 1. Limpar políticas existentes
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.emails;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.emails;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.emails;
DROP POLICY IF EXISTS "Allow all inserts" ON public.emails;
DROP POLICY IF EXISTS "emails_insert_policy" ON public.emails;
DROP POLICY IF EXISTS "emails_anon_insert_policy" ON public.emails;

-- 2. Garantir que RLS está habilitado
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- 3. Política universal para INSERT (mais simples)
CREATE POLICY "allow_all_inserts" ON public.emails
FOR INSERT 
WITH CHECK (true);

-- 4. Dar permissões básicas
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE public.emails TO anon;
GRANT INSERT ON TABLE public.emails TO public;

-- 5. Verificar se existe sequência (não necessária se só temos email_address)
DO $$
DECLARE
    seq_name text;
    has_serial_column boolean := false;
BEGIN
    -- Verificar se existe alguma coluna serial/auto-increment
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'emails' 
        AND table_schema = 'public' 
        AND column_default LIKE 'nextval%'
    ) INTO has_serial_column;
    
    IF has_serial_column THEN
        -- Buscar sequência se existir coluna serial
        SELECT pg_get_serial_sequence('public.emails', column_name) INTO seq_name
        FROM information_schema.columns 
        WHERE table_name = 'emails' 
        AND table_schema = 'public' 
        AND column_default LIKE 'nextval%'
        LIMIT 1;
        
        IF seq_name IS NOT NULL THEN
            EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO anon', seq_name);
            RAISE NOTICE 'Permissões dadas na sequência: %', seq_name;
        END IF;
    ELSE
        RAISE NOTICE 'Tabela não usa sequência - apenas email_address como chave';
    END IF;
END $$;

-- 6. Teste simples
INSERT INTO public.emails (email_address) 
VALUES ('teste-simples@freelunch.dev')
ON CONFLICT (email_address) DO NOTHING;

-- 7. Verificar resultado
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM public.emails WHERE email_address = 'teste-simples@freelunch.dev')
    THEN '✅ SUCESSO: RLS configurado!'
    ELSE '❌ AINDA COM PROBLEMAS'
  END as resultado;

-- 8. Limpar teste
DELETE FROM public.emails WHERE email_address = 'teste-simples@freelunch.dev';

-- 9. Mostrar estrutura da tabela para debug
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'emails' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Mostrar políticas ativas
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'emails' 
AND schemaname = 'public';

SELECT '🎉 Script simplificado executado!' as status;

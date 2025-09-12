-- Script SQL para criar a tabela emails no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- Criar a tabela emails se ela não existir
CREATE TABLE IF NOT EXISTS public.emails (
  id BIGSERIAL PRIMARY KEY,
  email_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Criar índice no email_address para consultas mais rápidas
CREATE INDEX IF NOT EXISTS idx_emails_email_address ON public.emails(email_address);

-- Habilitar RLS (Row Level Security) 
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;

-- Política para permitir inserção de emails (public)
CREATE POLICY "Allow public email insertion" ON public.emails 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados (opcional)
CREATE POLICY "Allow authenticated read" ON public.emails 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para permitir operações para anon role (necessário para inserção pública)
CREATE POLICY "Allow anon insert" ON public.emails
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Verificar se a tabela foi criada
SELECT 'Tabela emails criada com sucesso!' as status;

-- Verificar políticas RLS
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'emails';

# 🚨 Resolução do Erro: "Error saving email"

## Problema Identificado

O erro "Error saving email" está ocorrendo porque:

1. **A tabela `emails` não foi criada no Supabase**
2. **As políticas RLS não estão configuradas corretamente**
3. **Permissões insuficientes para inserção pública**

## ✅ Solução: Configurar Tabela no Supabase

### Passo 1: Acessar o Supabase Dashboard

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto: `slnovslrzzohqmynlttf`

### Passo 2: Executar Script SQL

1. No dashboard, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole o seguinte script:

```sql
-- Criar a tabela emails se ela não existir
CREATE TABLE IF NOT EXISTS public.emails (
  id BIGSERIAL PRIMARY KEY,
  email_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Criar índice no email_address
CREATE INDEX IF NOT EXISTS idx_emails_email_address ON public.emails(email_address);

-- Habilitar RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow public email insertion" ON public.emails;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.emails;
DROP POLICY IF EXISTS "Allow anon insert" ON public.emails;

-- Política para inserção pública (anon role)
CREATE POLICY "Allow anon insert" ON public.emails
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para leitura autenticada
CREATE POLICY "Allow authenticated read" ON public.emails 
FOR SELECT 
TO authenticated 
USING (true);
```

4. Clique em **Run** para executar o script

### Passo 3: Verificar Criação

Execute este comando para verificar:

```sql
-- Verificar se a tabela foi criada
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'emails' 
AND table_schema = 'public';

-- Verificar políticas RLS
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'emails';
```

### Passo 4: Testar Inserção Manual

Para testar se está funcionando:

```sql
-- Inserir um email de teste
INSERT INTO public.emails (email_address) 
VALUES ('teste@exemplo.com');

-- Verificar se foi inserido
SELECT * FROM public.emails;

-- Remover o teste
DELETE FROM public.emails WHERE email_address = 'teste@exemplo.com';
```

## 🔧 Código Atualizado

O código foi melhorado com:

- ✅ **Logs detalhados** para debug
- ✅ **Tratamento de erro específico** para diferentes problemas
- ✅ **Verificação de variáveis de ambiente**
- ✅ **Uso de `maybeSingle()`** em vez de `single()`
- ✅ **Mensagens de erro mais descritivas**

## 📊 Logs para Debug

Quando você testar o formulário, verifique o console do browser (F12) para ver:

- `Tentando salvar email: [email]`
- `Resultado da verificação: {...}`
- `Resultado da inserção: {...}`
- `Email salvo com sucesso!`

## ⚠️ Possíveis Erros e Soluções

### 1. "Tabela não encontrada"
**Solução:** Execute o script SQL acima no Supabase Dashboard

### 2. "Permissão negada"
**Solução:** Verifique se as políticas RLS estão corretas

### 3. "relation 'emails' does not exist"
**Solução:** A tabela não foi criada - execute o script

### 4. Variáveis de ambiente não carregadas
**Solução:** Verifique se o arquivo `.env` está na raiz do projeto

## 🚀 Após Configuração

1. **Reinicie o servidor**: `npm run dev`
2. **Acesse**: http://localhost:3000
3. **Teste o formulário** da waitlist
4. **Verifique os logs** no console do browser
5. **Confirme no Supabase** se os emails estão sendo salvos

## 📞 Suporte

Se ainda houver problemas:

1. Verifique os logs do console no browser
2. Confirme se a tabela existe no Supabase Dashboard
3. Teste a inserção manual no SQL Editor
4. Verifique se as credenciais estão corretas no `.env`

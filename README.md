# FlowMind 🧠

Gerenciador de projetos com Kanban, integrado ao Supabase e Stripe.

## 📁 Estrutura de Arquivos

```
flowmind/
├── app/
│   ├── page.tsx              ← Página inicial (landing + pagamento)
│   ├── layout.tsx            ← Layout raiz
│   ├── dashboard/
│   │   └── page.tsx          ← Dashboard Kanban
│   ├── sucesso/
│   │   └── page.tsx          ← Página pós-pagamento
│   └── api/
│       ├── checkout/
│       │   └── route.ts      ← API Stripe checkout
│       ├── projetos/
│       │   └── route.ts      ← API CRUD projetos
│       └── tarefas/
│           └── route.ts      ← API CRUD tarefas
├── .env.example              ← Modelo das variáveis de ambiente
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## ⚙️ Variáveis de Ambiente necessárias no Vercel

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | Stripe → Products → seu produto → Price ID |
| `NEXT_PUBLIC_APP_URL` | URL do seu site no Vercel |

## 🗄️ Tabelas no Supabase

### Tabela `projetos`
```sql
create table projetos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  usuario_email text,
  criado_em timestamp default now()
);
```

### Tabela `tarefas`
```sql
create table tarefas (
  id uuid default gen_random_uuid() primary key,
  projeto_id uuid references projetos(id),
  titulo text not null,
  status text default 'a_fazer',
  criado_em timestamp default now()
);
```

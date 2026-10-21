# Site do casamento

Site Next.js com confirmação de presença, lista de presentes e painel administrativo. Os formulários públicos são renderizados no próprio site; as APIs Next.js gravam no Supabase. O painel em `/admin` lista respostas, presentes escolhidos e oferece exportação CSV.

## Desenvolvimento

Use Node.js compatível com Next.js 16 e instale as dependências com `npm ci`. Copie `.env.example` para `.env.local` e configure:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chave pública do projeto. Os formulários atuais enviam os dados pelas APIs do site, então esta chave não substitui a chave secreta abaixo.
- `SUPABASE_SECRET_KEY`: chave secreta usada apenas pelas rotas de servidor. Nunca coloque `NEXT_PUBLIC_` neste nome. A chave legada `SUPABASE_SERVICE_ROLE_KEY` também é aceita.
- `ADMIN_PASSWORD`: senha do painel administrativo.
- `NEXT_PUBLIC_PASSWORD` e `NEXT_PUBLIC_WEBSITE_SKIP_PASSWORD`: acesso à página pública.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: mapa, se usado.

Inicie com `npm run dev`. Verifique tipos com `npx tsc --noEmit --incremental false` e a compilação com `npm run build`.

## Preparar o Supabase

Aplique [a migração SQL](supabase/migrations/20261021_forms.sql) no SQL Editor do **projeto Supabase já utilizado pelo site**, depois de exportar as tabelas atuais. Ela mantém registros existentes, cria os campos necessários, impede duas reservas simultâneas de um presente e restringe o acesso direto às tabelas à chave de servidor.

Antes de aplicar, confira se não há emails duplicados entre RSVPs já existentes:

```sql
select lower(email), count(*)
from public.rsvps
where email is not null
group by lower(email)
having count(*) > 1;
```

Resolva eventuais duplicatas antes da migração. Respostas antigas sem email permanecem no painel para reconciliação manual. Não importe novamente presentes ou respostas que já estejam no Supabase.

A migração usa as tabelas `rsvps`, `gifts` e `form_rate_limits`, além das funções `save_rsvp`, `reserve_gift` e `consume_form_attempt`. O bucket `gift-images` continua sendo usado pelo upload de fotos no painel. Verifique que as fotos já existentes tenham URLs permanentes fora do Airtable.

## Virada dos formulários antigos

1. Exporte os dados atuais do Airtable e as respostas do Fillout para arquivos privados. Compare com `rsvps` e `gifts` no Supabase.
2. Aplique a migração e configure as variáveis do ambiente de prévia.
3. Teste RSVP com presença e ausência, reenvio no mesmo navegador, painel, escolha de presente e duas tentativas simultâneas no mesmo presente.
4. Publique esta versão do site. Confira uma resposta de teste em cada formulário e no painel.
5. Desative os formulários e webhooks antigos do Fillout e retire a integração Airtable. Endereços antigos de formulários compartilhados diretamente também precisam ser desativados ou redirecionados.

O RSVP usa o email como identificador e guarda um token de edição no navegador. Reenvios no mesmo navegador atualizam a resposta. Para alterar de outro dispositivo ou após limpar os dados do navegador, o convidado deve falar com os noivos. A escolha de um presente o reserva imediatamente; o botão **Liberar** na aba Resgates do painel desfaz uma escolha por engano. A reserva não confirma pagamento.

O histórico de configuração antiga está em `airtable/` e `fillout/`; esses arquivos são exemplos e não representam necessariamente o estado publicado. O roteiro e os critérios da migração estão em [docs/plano-migracao-formularios.md](docs/plano-migracao-formularios.md).

## Cotas gratuitas

A arquitetura usa os planos gratuitos existentes de Supabase e Vercel, sujeitos às cotas e regras de atividade de cada serviço. Faça exportações privadas periódicas, pois o Supabase Free não inclui backups automáticos. Veja [Supabase](https://supabase.com/pricing) e [Vercel Hobby](https://vercel.com/docs/plans/hobby).

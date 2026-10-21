# Plano de migração dos formulários sem custo recorrente

Data do levantamento: 21/10/2026. Objetivo: retirar o Airtable do fluxo de RSVP e escolha de presentes, mantendo os dados no Supabase já usado pelo projeto.

## Andamento

Os formulários próprios, as APIs e o painel de liberação estão implementados no código local. A migração SQL foi aplicada em 21/10/2026 no projeto Supabase `xkcxsovrzucsrehvgupo`. Antes dela, foram copiados 20 presentes e 25 RSVPs para o esquema privado `migration_backup_20261021`, com RLS habilitado nas duas tabelas de cópia. Após a migração, os totais permaneceram iguais, as funções novas existem e a leitura direta de `gifts` pela função `anon` foi bloqueada. Os 25 RSVPs históricos não tinham email; precisam de reconciliação se for necessário vinculá-los a envios futuros. A publicação, o teste completo das APIs e a desativação dos formulários antigos ainda precisam ser concluídos. Nenhum CSV antigo do repositório foi usado como fonte dos dados atuais.

## Situação encontrada no repositório

- O site abre dois formulários do Fillout: RSVP em `src/components/home/hero.tsx` e escolha de presentes em `src/components/gifts/gift.tsx`.
- Os webhooks em `src/pages/api/webhook/rsvp.ts` e `src/pages/api/webhook/fillout.ts` já tentam gravar em `rsvps` e `gifts` no Supabase. O painel `/admin` já lê essas tabelas e exporta CSV.
- `src/utils/airtable.ts` e a dependência `airtable` ainda existem, mas não há importação desse utilitário no fluxo atual de páginas e APIs. O README ainda descreve a arquitetura antiga.
- Os JSONs de exemplo em `fillout/` incluem campos `RecordPicker` para buscar convidados. Eles podem depender da integração Airtable no Fillout ativo, que não é visível no código. Os JSONs também têm textos antigos; não devem ser tratados como cópia fiel dos formulários publicados.
- O RSVP atual sempre faz `insert`, então reenvios podem duplicar pessoas. O resgate de presente faz `update` sem verificar se já havia alguém associado; a coluna `status` não é alterada. As duas rotas de webhook aceitam POST sem autenticação e registram respostas com dados pessoais nos logs.
- Não há migrações SQL nem esquema de banco versionado no repositório. As tabelas e políticas de acesso precisam ser verificadas no Supabase antes da alteração.

## Decisão recomendada

Usar **formulários próprios no Next.js + APIs do projeto + Supabase existente**. Google Sheets pode receber uma exportação CSV para organização, mas não deve controlar o RSVP nem a disponibilidade dos presentes: a escolha de um presente precisa de uma operação atômica para impedir duas reservas simultâneas.

Como transição curta, é possível manter o Fillout enviando webhooks ao Supabase, desde que a integração Airtable e qualquer `RecordPicker` dependente sejam removidos. Isso ainda depende da cota do Fillout; a solução definitiva elimina essa dependência. Não alterar os formulários publicados antes de verificar as configurações e guardar uma cópia das respostas.

## Execução

### 1. Preservar e reconciliar dados

1. Exportar CSV das tabelas e respostas **atuais** do Airtable e do Fillout, além de `rsvps` e `gifts` no Supabase. Guardar os arquivos com dados pessoais fora do Git.
2. Comparar contagens, emails/nomes, datas e presentes escolhidos. Definir uma regra para duplicatas e conflitos: preservar a resposta mais recente de RSVP e revisar manualmente presentes com mais de uma reivindicação.
3. Conferir no Fillout publicado quais integrações, webhooks, campos de busca e páginas condicionais estão ativos. Os CSVs e JSONs do repositório são apenas exemplos antigos.

### 2. Preparar o banco

1. Versionar uma migração SQL para as tabelas usadas de fato. Definir campos obrigatórios, índices e política de acesso. Manter a chave `SUPABASE_SECRET_KEY` (ou a legada `SUPABASE_SERVICE_ROLE_KEY`) somente no servidor.
2. RSVP: guardar `name`, `email`, `attending`, `adults`, `children`, restrições, música e timestamps. Definir uma identidade estável para atualização (`invitee_id` ou código de convite; até lá, email normalizado com revisão administrativa). Um novo envio deve atualizar a resposta existente, sem inflar as contagens.
3. Presentes: registrar escolha, nome/email e horário. Criar uma única operação condicional no banco que só reserva um presente ainda disponível. Se outra pessoa chegou antes, responder `409` e pedir nova escolha. Definir explicitamente se “escolhido” significa reserva simbólica ou pagamento confirmado.
4. Restringir leitura pública de respostas e dos dados de quem escolheu presentes. A lista pública precisa receber somente os campos necessários para exibir os cards.

### 3. Substituir os formulários

1. Criar formulário de RSVP no site, mantendo as perguntas e ramificações realmente usadas no Fillout publicado. Validar entradas no servidor, limitar tamanho, evitar spam e mostrar confirmação ou erro recuperável.
2. Criar modal de presente no site. Enviar somente o ID do presente e os dados digitados pela pessoa; buscar nome, valor e disponibilidade no servidor, sem confiar nos parâmetros do navegador.
3. Mostrar presentes indisponíveis e atualizar a lista após uma escolha. A página hoje usa regeneração de 300 segundos, portanto a API deve impedir conflito mesmo quando o card ainda estiver visível.
4. Adaptar o painel `/admin` para mostrar respostas atualizadas e resgates; manter exportação CSV. Remover dos logs e respostas HTTP o payload completo, emails e campos de depuração.

### 4. Virada e limpeza

1. Testar em ambiente de prévia: RSVP sim/não, acompanhantes, edição de resposta, campos vazios, duas pessoas escolhendo o mesmo presente ao mesmo tempo, falha de rede e consulta no painel.
2. Importar respostas faltantes, comparar totais e fazer um último backup. Publicar os formulários próprios e verificar uma resposta de teste de ponta a ponta.
3. Desativar as integrações/webhooks antigos no Fillout e Airtable **depois** de confirmar o novo fluxo em produção. Remover embeds, variáveis de ambiente, dependência/código Airtable sem uso e atualizar o README. Manter os backups privados.

## Critérios de pronto

- Nenhum envio novo depende de Airtable ou Fillout; RSVP e presente funcionam no site e aparecem no painel.
- Reenvio de RSVP atualiza uma resposta; duas tentativas simultâneas não escolhem o mesmo presente.
- Dados pessoais não aparecem em endpoints públicos nem em logs de depuração.
- Histórico migrado confere com os backups, e os CSVs administrativos continuam disponíveis.
- O uso medido permanece dentro das cotas gratuitas da hospedagem e do Supabase. “Sem gastos” depende dessas cotas e da atividade do projeto.

## Cotas e fontes consultadas

- [Supabase Free](https://supabase.com/pricing): US$ 0/mês, 500 MB de banco, 1 GB de arquivos e pausa possível após uma semana de baixa atividade. Não há backup automático no plano gratuito; manter exportações privadas periódicas.
- [Fillout Free](https://www.fillout.com/pricing): 1.000 respostas/mês; integrações e webhooks constam na [comparação de planos](https://support.fillout.com/pricing). É útil para a transição, mas conserva uma cota externa.
- [Airtable Free](https://support.airtable.com/articles/2277136852-airtable-plans-overview): 1.000 registros por base e 1.000 chamadas de API por workspace/mês.
- [Vercel Hobby](https://vercel.com/docs/plans/hobby): hospedagem gratuita para uso pessoal, sujeita às cotas do plano.

## Decisões desta implementação

O RSVP usa nome e email, com token de edição guardado no navegador. Uma resposta repetida com o mesmo email e token atualiza a anterior; de outro navegador, o painel precisará de reconciliação manual. O presente fica indisponível assim que é escolhido. Essa escolha é uma reserva simbólica e não representa confirmação de pagamento.

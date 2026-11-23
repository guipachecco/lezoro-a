# Lezoro'a

Cultive sua fé, um dia de cada vez. Um app de aprendizado bíblico com lições curtas, sequência de dias ("dias regados") e o mascote Grão, que cresce junto com você.

Esta é a versão web (PWA): abre no navegador e pode ser instalada na tela inicial do celular. O mesmo código pode virar app da Play Store e da App Store depois, com Capacitor.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # regras do jogo e conteúdo
npm run build    # gera dist/ pronto para publicar
```

## Ligar o Supabase (login com senha e progresso na nuvem)

Sem configuração o app roda em **modo local**: sem senha, com o progresso salvo só no navegador.

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No projeto, abra **SQL Editor > New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication > URL Configuration**, coloque em *Site URL* o endereço do app (`http://localhost:5173` enquanto testa; depois o link da Vercel) e adicione o mesmo em *Redirect URLs*.
4. Em **Project Settings > API**, copie a *Project URL* e a chave *anon public*.
5. Copie `.env.example` para `.env.local`, preencha os dois valores e rode `npm run dev` de novo.

A chave *anon* é pública por natureza; quem protege os dados é a regra RLS do `schema.sql`. Nunca use a chave *service_role* no app.

## Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| `src/content.js` | Unidades, lições e perguntas (a primeira alternativa é a certa) e os versículos do desafio do dia |
| `src/game.js` | Regras: sementes, lamparinas, dias regados, níveis e selos |
| `src/art.js` | Grão, símbolo, plantas e ícones em SVG |
| `src/Start.jsx` | Boas-vindas, cadastro e personalização |
| `src/Tabs.jsx` | Trilha, Bíblia, Conquistas e Perfil |
| `src/Lesson.jsx` | Perguntas, feedback e resultado |
| `src/store.js` | Onde o progresso é salvo (navegador e Supabase) |
| `src/supabase.js` | Cliente do Supabase, ligado pelas variáveis do `.env.local` |
| `supabase/schema.sql` | Tabela de progresso e regras de acesso (RLS) |
| `scripts/icons.mjs` | Gera os ícones PNG do PWA (`node scripts/icons.mjs`) |

## Limitações desta versão

- Com Supabase, se o mesmo usuário jogar em dois aparelhos ao mesmo tempo, o último a salvar sobrescreve o outro.
- O progresso é gravado pelo próprio app, então um usuário experiente consegue alterar as próprias sementes. Antes de ter ranking entre usuários, a pontuação precisa ser calculada no servidor.
- Os lembretes escolhidos na personalização ainda não disparam notificações.
- Há uma unidade (Gênesis) com 4 lições.

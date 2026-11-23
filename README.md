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

## Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| `src/content.js` | Unidades, lições e perguntas (a primeira alternativa é a certa) e os versículos do desafio do dia |
| `src/game.js` | Regras: sementes, lamparinas, dias regados, níveis e selos |
| `src/art.js` | Grão, símbolo, plantas e ícones em SVG |
| `src/Start.jsx` | Boas-vindas, cadastro e personalização |
| `src/Tabs.jsx` | Trilha, Bíblia, Conquistas e Perfil |
| `src/Lesson.jsx` | Perguntas, feedback e resultado |
| `src/store.js` | Onde o progresso é salvo |
| `scripts/icons.mjs` | Gera os ícones PNG do PWA (`node scripts/icons.mjs`) |

## Limitações desta versão

- O progresso fica salvo só no navegador do aparelho e o login não tem senha. O próximo passo é ligar o Supabase (cadastro com senha e banco de dados).
- Os lembretes escolhidos na personalização ainda não disparam notificações.
- Há uma unidade (Gênesis) com 4 lições.

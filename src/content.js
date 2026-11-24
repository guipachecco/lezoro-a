// Conteúdo das lições. Em cada pergunta, a[0] é a resposta certa (a ordem é embaralhada na tela).
export const UNITS = [
  {
    id: 'gn',
    title: 'Gênesis',
    subtitle: 'Do princípio a Abraão',
    lessons: [
      {
        id: 'gn-1', title: 'A criação',
        qs: [
          { q: 'No princípio, Deus criou os céus e a ___.', a: ['terra', 'luz', 'água', 'vida'], ref: 'Gênesis 1:1' },
          { q: 'O que Deus criou no primeiro dia?', a: ['A luz', 'Os animais', 'As plantas', 'As estrelas'], ref: 'Gênesis 1:3-5' },
          { q: 'Em que dia Deus descansou?', a: ['No sétimo', 'No sexto', 'No primeiro', 'No quarto'], ref: 'Gênesis 2:2' },
          { q: 'Do que Deus formou o homem?', a: ['Do pó da terra', 'Da água', 'De uma árvore', 'Da luz'], ref: 'Gênesis 2:7' },
          { q: 'Como se chamava o jardim onde Deus colocou o homem?', a: ['Éden', 'Getsêmani', 'Sião', 'Canaã'], ref: 'Gênesis 2:8' },
        ],
      },
      {
        id: 'gn-2', title: 'O jardim e os irmãos',
        qs: [
          { q: 'De qual árvore Deus proibiu o homem de comer?', a: ['Do conhecimento do bem e do mal', 'Da vida', 'A figueira', 'A oliveira'], ref: 'Gênesis 2:17' },
          { q: 'Quem convenceu Eva a comer do fruto?', a: ['A serpente', 'Adão', 'Caim', 'Um anjo'], ref: 'Gênesis 3:1-6' },
          { q: 'Quem foram os dois primeiros filhos de Adão e Eva?', a: ['Caim e Abel', 'Sete e Enos', 'Esaú e Jacó', 'Isaque e Ismael'], ref: 'Gênesis 4:1-2' },
          { q: 'Qual era o trabalho de Abel?', a: ['Pastor de ovelhas', 'Lavrador', 'Pescador', 'Carpinteiro'], ref: 'Gênesis 4:2' },
          { q: 'Qual filho Adão e Eva tiveram depois da morte de Abel?', a: ['Sete', 'Noé', 'Enoque', 'Matusalém'], ref: 'Gênesis 4:25' },
        ],
      },
      {
        id: 'gn-3', title: 'Noé e o dilúvio',
        qs: [
          { q: 'Quem construiu a arca para salvar sua família do dilúvio?', a: ['Noé', 'Abraão', 'Moisés', 'Davi'], ref: 'Gênesis 6:14' },
          { q: 'Quantos dias e noites choveu sobre a terra?', a: ['40', '7', '12', '100'], ref: 'Gênesis 7:12' },
          { q: 'Que ave voltou para a arca com uma folha de oliveira?', a: ['A pomba', 'O corvo', 'A águia', 'O pardal'], ref: 'Gênesis 8:11' },
          { q: 'Qual foi o sinal da aliança de Deus com Noé?', a: ['O arco-íris', 'Uma estrela', 'Uma pomba', 'Um altar'], ref: 'Gênesis 9:13' },
          { q: 'Quantos filhos Noé tinha?', a: ['3', '2', '7', '12'], ref: 'Gênesis 6:10' },
        ],
      },
      {
        id: 'gn-4', title: 'Abraão',
        qs: [
          { q: 'Qual era o nome de Abraão antes de Deus mudá-lo?', a: ['Abrão', 'Ló', 'Terá', 'Naor'], ref: 'Gênesis 17:5' },
          { q: 'Quem era a esposa de Abraão?', a: ['Sara', 'Rebeca', 'Raquel', 'Lia'], ref: 'Gênesis 17:15' },
          { q: 'Qual filho Deus prometeu a Abraão e Sara?', a: ['Isaque', 'Ismael', 'Jacó', 'José'], ref: 'Gênesis 17:19' },
          { q: 'Quantos anos Abraão tinha quando Isaque nasceu?', a: ['100', '75', '40', '120'], ref: 'Gênesis 21:5' },
          { q: 'Qual sobrinho de Abraão foi morar em Sodoma?', a: ['Ló', 'Labão', 'Esaú', 'Eliézer'], ref: 'Gênesis 14:12' },
        ],
      },
      {
        id: 'gn-5', title: 'Isaque, Esaú e Jacó',
        qs: [
          { q: 'Quem foi a esposa de Isaque?', a: ['Rebeca', 'Raquel', 'Lia', 'Sara'], ref: 'Gênesis 24:67' },
          { q: 'Quais eram os filhos gêmeos de Isaque e Rebeca?', a: ['Esaú e Jacó', 'Caim e Abel', 'Efraim e Manassés', 'Moisés e Arão'], ref: 'Gênesis 25:24-26' },
          { q: 'Em troca de que Esaú vendeu seu direito de primogenitura?', a: ['Um prato de comida', 'Um saco de prata', 'Um rebanho de ovelhas', 'Um pedaço de terra'], ref: 'Gênesis 25:33-34' },
          { q: 'O que Jacó viu em sonho, em Betel?', a: ['Uma escada que chegava ao céu', 'Sete vacas gordas', 'Uma sarça ardente', 'Um arco-íris'], ref: 'Gênesis 28:12' },
          { q: 'Que novo nome Deus deu a Jacó?', a: ['Israel', 'Abraão', 'Judá', 'Benjamim'], ref: 'Gênesis 32:28' },
        ],
      },
      {
        id: 'gn-6', title: 'José no Egito',
        qs: [
          { q: 'Que presente de Jacó deixou os irmãos de José com inveja?', a: ['Uma túnica colorida', 'Um anel de ouro', 'Uma espada', 'Um cajado'], ref: 'Gênesis 37:3-4' },
          { q: 'O que os irmãos fizeram com José?', a: ['Venderam-no como escravo', 'Fizeram dele seu líder', 'Mandaram-no estudar no Egito', 'Deram uma festa para ele'], ref: 'Gênesis 37:28' },
          { q: 'Que sonho do faraó José interpretou?', a: ['Sete vacas gordas e sete magras', 'Uma escada até o céu', 'Uma estátua de ouro', 'Uma torre muito alta'], ref: 'Gênesis 41:1-4' },
          { q: 'Que cargo José recebeu no Egito?', a: ['Governador de todo o Egito', 'Sacerdote do templo', 'Chefe dos soldados', 'Copeiro do rei'], ref: 'Gênesis 41:41' },
          { q: 'Quem era o irmão mais novo de José?', a: ['Benjamim', 'Rúben', 'Judá', 'Levi'], ref: 'Gênesis 42:4' },
        ],
      },
    ],
  },
  {
    id: 'ex',
    title: 'Êxodo',
    subtitle: 'Da escravidão à liberdade',
    lessons: [
      {
        id: 'ex-1', title: 'Moisés',
        qs: [
          { q: 'Onde a mãe de Moisés colocou o bebê para salvá-lo?', a: ['Num cesto, no rio Nilo', 'Numa caverna', 'Num poço', 'No templo'], ref: 'Êxodo 2:3' },
          { q: 'Quem encontrou o bebê Moisés no rio?', a: ['A filha do faraó', 'Uma pastora de Midiã', 'A esposa de Arão', 'Um soldado egípcio'], ref: 'Êxodo 2:5-6' },
          { q: 'Como Deus chamou Moisés no monte Horebe?', a: ['De uma sarça que ardia sem se queimar', 'Num sonho', 'Por um anjo numa caverna', 'Com um terremoto'], ref: 'Êxodo 3:2-4' },
          { q: 'O que Deus respondeu quando Moisés perguntou o Seu nome?', a: ['EU SOU O QUE SOU', 'O Todo-Poderoso', 'O Rei dos reis', 'O Pastor de Israel'], ref: 'Êxodo 3:14' },
          { q: 'Quem Deus enviou para falar junto com Moisés?', a: ['Arão, seu irmão', 'Josué', 'Calebe', 'Jetro'], ref: 'Êxodo 4:14-16' },
        ],
      },
      {
        id: 'ex-2', title: 'As pragas e a Páscoa',
        qs: [
          { q: 'Quantas pragas Deus enviou sobre o Egito?', a: ['10', '7', '12', '3'], ref: 'Êxodo 7–12' },
          { q: 'Qual foi a primeira praga?', a: ['A água virou sangue', 'Rãs', 'Gafanhotos', 'Trevas'], ref: 'Êxodo 7:20' },
          { q: 'O que os israelitas passaram nas portas na noite da Páscoa?', a: ['Sangue de cordeiro', 'Azeite', 'Água', 'Cinzas'], ref: 'Êxodo 12:7' },
          { q: 'Qual foi a última praga?', a: ['A morte dos primogênitos', 'Granizo', 'Piolhos', 'Úlceras'], ref: 'Êxodo 12:29' },
          { q: 'Que festa Deus mandou celebrar para lembrar aquela noite?', a: ['A Páscoa', 'Pentecostes', 'Tabernáculos', 'Purim'], ref: 'Êxodo 12:14' },
        ],
      },
      {
        id: 'ex-3', title: 'A travessia',
        qs: [
          { q: 'Que mar Deus abriu para o povo passar?', a: ['O mar Vermelho', 'O mar Morto', 'O mar da Galileia', 'O mar Mediterrâneo'], ref: 'Êxodo 14:21-22' },
          { q: 'Como Deus guiava o povo durante o dia?', a: ['Com uma coluna de nuvem', 'Com uma estrela', 'Com o vento', 'Com um mapa'], ref: 'Êxodo 13:21' },
          { q: 'E como Deus guiava o povo durante a noite?', a: ['Com uma coluna de fogo', 'Com a lua', 'Com tochas', 'Com uma estrela'], ref: 'Êxodo 13:21' },
          { q: 'Que alimento Deus mandou do céu no deserto?', a: ['O maná', 'Pão de cevada', 'Figos', 'Tâmaras'], ref: 'Êxodo 16:15' },
          { q: 'Por quantos anos o povo comeu maná no deserto?', a: ['40', '7', '12', '70'], ref: 'Êxodo 16:35' },
        ],
      },
      {
        id: 'ex-4', title: 'Os Dez Mandamentos',
        qs: [
          { q: 'Em que monte Deus entregou os Dez Mandamentos?', a: ['Sinai', 'Carmelo', 'Sião', 'das Oliveiras'], ref: 'Êxodo 19:20; 20:1-17' },
          { q: 'Em que os mandamentos foram escritos?', a: ['Em tábuas de pedra', 'Em rolos de papiro', 'Em placas de ouro', 'Em peles de animais'], ref: 'Êxodo 31:18' },
          { q: 'Honra teu pai e tua ___.', a: ['mãe', 'casa', 'terra', 'família'], ref: 'Êxodo 20:12' },
          { q: 'Lembra-te do dia de ___, para o santificar.', a: ['sábado', 'festa', 'Páscoa', 'colheita'], ref: 'Êxodo 20:8' },
          { q: 'O que o povo fez enquanto Moisés estava no monte?', a: ['Um bezerro de ouro', 'Uma torre', 'Um templo', 'Um muro'], ref: 'Êxodo 32:4' },
        ],
      },
    ],
  },
  {
    id: 'jesus',
    title: 'Vida de Jesus',
    subtitle: 'Os Evangelhos',
    lessons: [
      {
        id: 'jesus-1', title: 'O nascimento',
        qs: [
          { q: 'Em que cidade Jesus nasceu?', a: ['Belém', 'Nazaré', 'Jerusalém', 'Cafarnaum'], ref: 'Mateus 2:1' },
          { q: 'Onde o menino Jesus foi deitado ao nascer?', a: ['Numa manjedoura', 'Num berço de ouro', 'Num barco', 'No templo'], ref: 'Lucas 2:7' },
          { q: 'Quem anunciou a Maria que ela seria mãe de Jesus?', a: ['O anjo Gabriel', 'O anjo Miguel', 'Isabel', 'O profeta Simeão'], ref: 'Lucas 1:26-31' },
          { q: 'Quem seguiu uma estrela até o menino Jesus?', a: ['Os magos do Oriente', 'Os pastores', 'Os fariseus', 'O rei Herodes'], ref: 'Mateus 2:1-2, 9' },
          { q: 'Em que cidade Jesus cresceu?', a: ['Nazaré', 'Belém', 'Jericó', 'Betânia'], ref: 'Lucas 2:39-40' },
        ],
      },
      {
        id: 'jesus-2', title: 'Batismo e milagres',
        qs: [
          { q: 'Quem batizou Jesus no rio Jordão?', a: ['João Batista', 'Pedro', 'André', 'Elias'], ref: 'Mateus 3:13-16' },
          { q: 'Qual foi o primeiro milagre de Jesus, em Caná?', a: ['Transformou água em vinho', 'Andou sobre as águas', 'Curou um cego', 'Multiplicou pães'], ref: 'João 2:1-11' },
          { q: 'Quantos pães Jesus usou para alimentar cinco mil homens?', a: ['5', '2', '7', '12'], ref: 'Mateus 14:17-21' },
          { q: 'Quem Jesus ressuscitou em Betânia, irmão de Marta e Maria?', a: ['Lázaro', 'Bartimeu', 'Zaqueu', 'Nicodemos'], ref: 'João 11:1, 43-44' },
          { q: 'Qual discípulo andou sobre as águas em direção a Jesus?', a: ['Pedro', 'João', 'Tomé', 'Judas'], ref: 'Mateus 14:29' },
        ],
      },
      {
        id: 'jesus-3', title: 'As parábolas',
        qs: [
          { q: 'Na parábola do semeador, o que a semente representa?', a: ['A palavra de Deus', 'O dinheiro', 'O tempo', 'Os anjos'], ref: 'Lucas 8:11' },
          { q: 'O Reino dos céus é semelhante a um grão de ___.', a: ['mostarda', 'trigo', 'arroz', 'cevada'], ref: 'Mateus 13:31' },
          { q: 'O que o pai fez quando o filho pródigo voltou?', a: ['Correu, abraçou e fez uma festa', 'Mandou-o embora', 'Fez dele um empregado', 'Ficou em silêncio'], ref: 'Lucas 15:20-24' },
          { q: 'Quantas ovelhas o pastor deixou para procurar a que se perdeu?', a: ['99', '9', '50', '100'], ref: 'Lucas 15:4' },
          { q: 'Na parábola, quem cuidou do homem ferido na estrada?', a: ['Um samaritano', 'Um sacerdote', 'Um levita', 'Um soldado romano'], ref: 'Lucas 10:33-34' },
        ],
      },
      {
        id: 'jesus-4', title: 'A cruz e a ressurreição',
        qs: [
          { q: 'Qual discípulo traiu Jesus?', a: ['Judas Iscariotes', 'Pedro', 'Tomé', 'Mateus'], ref: 'Mateus 26:14-16' },
          { q: 'Quantas vezes Pedro negou Jesus?', a: ['3', '1', '7', '12'], ref: 'Mateus 26:69-75' },
          { q: 'Em que dia Jesus ressuscitou?', a: ['No terceiro dia', 'No sétimo dia', 'No primeiro dia', 'No quadragésimo dia'], ref: '1 Coríntios 15:4' },
          { q: 'Segundo João, quem viu Jesus ressuscitado primeiro, junto ao túmulo?', a: ['Maria Madalena', 'Pedro', 'Tomé', 'Maria, mãe de Jesus'], ref: 'João 20:14-16' },
          { q: 'Qual discípulo só acreditou depois de ver as marcas nas mãos de Jesus?', a: ['Tomé', 'Pedro', 'João', 'Tiago'], ref: 'João 20:25-28' },
        ],
      },
    ],
  },
]

export const DAILY = [
  { q: 'Lâmpada para os meus pés é a tua ___.', a: ['palavra', 'graça', 'lei', 'luz'], ref: 'Salmos 119:105' },
  { q: 'O Senhor é o meu ___; nada me faltará.', a: ['pastor', 'rei', 'escudo', 'amigo'], ref: 'Salmos 23:1' },
  { q: 'Tudo posso naquele que me ___.', a: ['fortalece', 'chama', 'guia', 'salva'], ref: 'Filipenses 4:13' },
  { q: 'Vós sois a ___ do mundo.', a: ['luz', 'esperança', 'força', 'paz'], ref: 'Mateus 5:14' },
  { q: 'O amor é ___, é benigno.', a: ['paciente', 'eterno', 'forte', 'puro'], ref: '1 Coríntios 13:4' },
  { q: 'No princípio era o ___.', a: ['Verbo', 'Pai', 'Caminho', 'Espírito'], ref: 'João 1:1' },
  { q: 'Eu sou o caminho, a verdade e a ___.', a: ['vida', 'luz', 'porta', 'paz'], ref: 'João 14:6' },
  { q: 'Sê forte e ___; não temas.', a: ['corajoso', 'paciente', 'humilde', 'calado'], ref: 'Josué 1:9' },
  { q: 'Confia no Senhor de todo o teu ___.', a: ['coração', 'tempo', 'caminho', 'dinheiro'], ref: 'Provérbios 3:5' },
]

// Quiz do cadastro (uma chance só): 10 perguntas do mais fácil ao mais difícil. A pontuação define a trilha.
export const PLACEMENT = [
  { q: 'Qual é o primeiro livro da Bíblia?', a: ['Gênesis', 'Êxodo', 'Salmos', 'Mateus'] },
  { q: 'Quem foi engolido por um grande peixe?', a: ['Jonas', 'Pedro', 'Elias', 'Noé'] },
  { q: 'Quem venceu o gigante Golias?', a: ['Davi', 'Sansão', 'Saul', 'Gideão'] },
  { q: 'Quem foi o primeiro rei de Israel?', a: ['Saul', 'Davi', 'Salomão', 'Samuel'] },
  { q: 'Quem levou o povo de Israel para Canaã depois de Moisés?', a: ['Josué', 'Arão', 'Calebe', 'Samuel'] },
  { q: 'Qual era o trabalho de Mateus antes de seguir Jesus?', a: ['Cobrador de impostos', 'Pescador', 'Carpinteiro', 'Soldado'] },
  { q: 'Qual profeta enfrentou os profetas de Baal no monte Carmelo?', a: ['Elias', 'Eliseu', 'Isaías', 'Jeremias'] },
  { q: 'Em qual evangelho está a parábola do filho pródigo?', a: ['Lucas', 'Mateus', 'Marcos', 'João'] },
  { q: 'Quem escreveu o livro de Apocalipse?', a: ['João', 'Paulo', 'Pedro', 'Lucas'] },
  { q: 'Quantos livros tem o Novo Testamento?', a: ['27', '39', '66', '12'] },
]

// Versículos conhecidos para os desafios "Onde está o versículo?" e "Termine o versículo".
// start | end separam o começo do final do versículo.
export const VERSES = [
  ['João 3:16', 'Porque Deus amou o mundo de tal maneira', 'que deu o seu Filho unigênito'],
  ['Salmos 23:1', 'O Senhor é o meu pastor;', 'nada me faltará'],
  ['Filipenses 4:13', 'Tudo posso', 'naquele que me fortalece'],
  ['Gênesis 1:1', 'No princípio, Deus criou', 'os céus e a terra'],
  ['João 14:6', 'Eu sou o caminho,', 'a verdade e a vida'],
  ['Provérbios 3:5', 'Confia no Senhor de todo o teu coração', 'e não te estribes no teu próprio entendimento'],
  ['Romanos 8:28', 'Todas as coisas cooperam para o bem', 'daqueles que amam a Deus'],
  ['Mateus 6:33', 'Buscai primeiro o Reino de Deus', 'e a sua justiça'],
  ['Isaías 40:31', 'Os que esperam no Senhor', 'renovam as suas forças'],
  ['Josué 1:9', 'Sê forte e corajoso;', 'não temas, nem te espantes'],
  ['Salmos 119:105', 'Lâmpada para os meus pés é a tua palavra', 'e luz para o meu caminho'],
  ['Mateus 11:28', 'Vinde a mim, todos os que estais cansados e oprimidos,', 'e eu vos aliviarei'],
  ['Romanos 6:23', 'O salário do pecado é a morte,', 'mas o dom gratuito de Deus é a vida eterna'],
  ['1 João 4:8', 'Aquele que não ama não conhece a Deus,', 'porque Deus é amor'],
  ['Hebreus 11:1', 'A fé é a certeza das coisas que se esperam', 'e a convicção de fatos que não se veem'],
  ['Salmos 46:1', 'Deus é o nosso refúgio e fortaleza,', 'socorro bem presente na angústia'],
  ['Mateus 5:14', 'Vós sois a luz do mundo;', 'não se pode esconder uma cidade edificada sobre um monte'],
  ['Efésios 2:8', 'Pela graça sois salvos, por meio da fé;', 'e isto não vem de vós, é dom de Deus'],
  ['Gálatas 5:22', 'O fruto do Espírito é:', 'amor, alegria, paz, paciência, benignidade'],
  ['1 Coríntios 13:4', 'O amor é paciente,', 'o amor é bondoso'],
].map(([ref, start, end]) => ({ ref, start, end }))

// Perguntas de aprofundamento (só na trilha Profunda), 3 por lição.
const DEEP = {
  'gn-1': [
    { q: 'O que Deus criou no quarto dia?', a: ['O sol, a lua e as estrelas', 'Os peixes e as aves', 'A terra seca e as plantas', 'O homem e a mulher'], ref: 'Gênesis 1:14-19' },
    { q: 'À imagem de quem o ser humano foi criado?', a: ['À imagem de Deus', 'À imagem dos anjos', 'À imagem de Adão', 'À imagem da terra'], ref: 'Gênesis 1:27' },
    { q: 'De onde Deus formou a mulher?', a: ['De uma costela do homem', 'Do pó da terra', 'Da água do rio', 'De um ramo de árvore'], ref: 'Gênesis 2:21-22' },
  ],
  'gn-2': [
    { q: 'Qual era o trabalho de Caim?', a: ['Lavrador', 'Pastor', 'Pescador', 'Ferreiro'], ref: 'Gênesis 4:2' },
    { q: 'O que Deus pôs a leste do Éden para guardar o caminho da árvore da vida?', a: ['Querubins e uma espada flamejante', 'Um muro de pedra', 'Um rio profundo', 'Um leão'], ref: 'Gênesis 3:24' },
    { q: 'Com que Deus vestiu Adão e Eva?', a: ['Túnicas de peles', 'Folhas de figueira', 'Linho fino', 'Lã de ovelha'], ref: 'Gênesis 3:21' },
  ],
  'gn-3': [
    { q: 'Quais eram os filhos de Noé?', a: ['Sem, Cam e Jafé', 'Caim, Abel e Sete', 'Rúben, Simeão e Levi', 'Esaú, Jacó e Ló'], ref: 'Gênesis 6:10' },
    { q: 'Sobre que montes a arca repousou?', a: ['Ararate', 'Sinai', 'Carmelo', 'Hermom'], ref: 'Gênesis 8:4' },
    { q: 'Qual ave Noé soltou primeiro?', a: ['Um corvo', 'Uma pomba', 'Uma águia', 'Um pardal'], ref: 'Gênesis 8:7' },
  ],
  'gn-4': [
    { q: 'De que cidade Abraão saiu com sua família?', a: ['Ur dos caldeus', 'Jerusalém', 'Babilônia', 'Nínive'], ref: 'Gênesis 11:31' },
    { q: 'Que rei e sacerdote abençoou Abraão com pão e vinho?', a: ['Melquisedeque', 'Abimeleque', 'Faraó', 'Ló'], ref: 'Gênesis 14:18-19' },
    { q: 'Que animal Deus providenciou no lugar de Isaque?', a: ['Um carneiro', 'Um cordeiro', 'Um bezerro', 'Uma pomba'], ref: 'Gênesis 22:13' },
  ],
  'gn-5': [
    { q: 'Quem Abraão enviou para buscar uma esposa para Isaque?', a: ['Seu servo', 'Ló', 'Ismael', 'Labão'], ref: 'Gênesis 24:2-4' },
    { q: 'Ao todo, quantos anos Jacó trabalhou para Labão por Raquel?', a: ['14', '7', '10', '20'], ref: 'Gênesis 29:20, 27-30' },
    { q: 'Que nome Jacó deu ao lugar onde lutou até o amanhecer?', a: ['Peniel', 'Betel', 'Berseba', 'Hebrom'], ref: 'Gênesis 32:30' },
  ],
  'gn-6': [
    { q: 'Quem comprou José no Egito?', a: ['Potifar', 'O faraó', 'O copeiro-chefe', 'Jetro'], ref: 'Gênesis 37:36' },
    { q: 'Por quantas peças de prata José foi vendido?', a: ['20', '30', '10', '50'], ref: 'Gênesis 37:28' },
    { q: 'Como se chamavam os filhos de José?', a: ['Manassés e Efraim', 'Rúben e Judá', 'Benjamim e Levi', 'Perez e Zerá'], ref: 'Gênesis 41:51-52' },
  ],
  'ex-1': [
    { q: 'Para qual terra Moisés fugiu depois de matar um egípcio?', a: ['Midiã', 'Canaã', 'Babilônia', 'Edom'], ref: 'Êxodo 2:15' },
    { q: 'Quem era o sogro de Moisés?', a: ['Jetro', 'Labão', 'Arão', 'Hur'], ref: 'Êxodo 3:1' },
    { q: 'Em que se transformou o cajado de Moisés quando ele o lançou ao chão?', a: ['Numa serpente', 'Numa árvore', 'Em fogo', 'Em ouro'], ref: 'Êxodo 4:3' },
  ],
  'ex-2': [
    { q: 'Qual foi a segunda praga?', a: ['Rãs', 'Piolhos', 'Moscas', 'Granizo'], ref: 'Êxodo 8:2-6' },
    { q: 'Por quantos dias as trevas cobriram o Egito?', a: ['3', '7', '1', '40'], ref: 'Êxodo 10:22' },
    { q: 'Com o que os israelitas deviam comer o cordeiro da Páscoa?', a: ['Pães sem fermento e ervas amargas', 'Mel e leite', 'Vinho e figos', 'Azeite e sal'], ref: 'Êxodo 12:8' },
  ],
  'ex-3': [
    { q: 'Em Mara, como a água amarga ficou doce?', a: ['Moisés lançou uma árvore nela', 'Choveu do céu', 'Arão orou sobre ela', 'O povo cavou um poço'], ref: 'Êxodo 15:23-25' },
    { q: 'O que Moisés fez para sair água da rocha em Horebe?', a: ['Feriu a rocha com o cajado', 'Falou com a rocha', 'Quebrou a rocha', 'Cavou ao lado dela'], ref: 'Êxodo 17:6' },
    { q: 'Quem segurou os braços de Moisés na batalha contra Amaleque?', a: ['Arão e Hur', 'Josué e Calebe', 'Jetro e Arão', 'Miriã e Arão'], ref: 'Êxodo 17:12' },
  ],
  'ex-4': [
    { q: 'Qual é o primeiro mandamento?', a: ['Não terás outros deuses diante de mim', 'Não matarás', 'Honra teu pai e tua mãe', 'Não furtarás'], ref: 'Êxodo 20:3' },
    { q: 'Quanto tempo Moisés ficou no monte com Deus?', a: ['40 dias e 40 noites', '7 dias', '3 dias', '12 dias'], ref: 'Êxodo 24:18' },
    { q: 'O que Moisés fez com as tábuas ao ver o bezerro de ouro?', a: ['Quebrou as tábuas', 'Escondeu as tábuas', 'Enterrou as tábuas', 'Entregou-as a Arão'], ref: 'Êxodo 32:19' },
  ],
  'jesus-1': [
    { q: 'Qual rei mandou matar os meninos de Belém?', a: ['Herodes', 'Pilatos', 'César Augusto', 'Davi'], ref: 'Mateus 2:16' },
    { q: 'Para onde José fugiu com Maria e o menino?', a: ['Egito', 'Nazaré', 'Babilônia', 'Roma'], ref: 'Mateus 2:13-14' },
    { q: 'Quem tomou o menino nos braços no templo e disse que já podia partir em paz?', a: ['Simeão', 'Zacarias', 'João Batista', 'Nicodemos'], ref: 'Lucas 2:25-29' },
  ],
  'jesus-2': [
    { q: 'Por quantos dias Jesus jejuou no deserto?', a: ['40', '7', '3', '12'], ref: 'Mateus 4:2' },
    { q: 'Qual cego de Jericó gritou: Filho de Davi, tem misericórdia de mim?', a: ['Bartimeu', 'Lázaro', 'Zaqueu', 'Jairo'], ref: 'Marcos 10:46-47' },
    { q: 'De quem era a filha que Jesus ressuscitou dizendo: Talitá cumi?', a: ['De Jairo', 'De Pedro', 'De Zaqueu', 'De Nicodemos'], ref: 'Marcos 5:22, 41' },
  ],
  'jesus-3': [
    { q: 'Na parábola das dez virgens, quantas eram prudentes?', a: ['5', '3', '7', '10'], ref: 'Mateus 25:2' },
    { q: 'O que o homem achou escondido no campo e vendeu tudo para comprar o campo?', a: ['Um tesouro', 'Uma pérola', 'Uma ovelha', 'Uma moeda'], ref: 'Mateus 13:44' },
    { q: 'Na parábola do semeador, o que houve com a semente à beira do caminho?', a: ['As aves a comeram', 'Secou ao sol', 'Os espinhos a sufocaram', 'Deu muito fruto'], ref: 'Mateus 13:4' },
  ],
  'jesus-4': [
    { q: 'Por quantas moedas de prata Judas traiu Jesus?', a: ['30', '20', '40', '100'], ref: 'Mateus 26:15' },
    { q: 'Em que lugar Jesus orou antes de ser preso?', a: ['Getsêmani', 'Éden', 'Betânia', 'Gólgota'], ref: 'Mateus 26:36' },
    { q: 'Quem foi obrigado a carregar a cruz de Jesus?', a: ['Simão de Cirene', 'Pedro', 'José de Arimateia', 'João'], ref: 'Mateus 27:32' },
  ],
}
for (const u of UNITS) for (const l of u.lessons) l.deep = DEEP[l.id] || []

// Sugestões de cena para a primeira rodada do Gartic da Bíblia (dá para trocar pelo que quiser).
export const GARTIC_SCENES = [
  'Davi vence Golias', 'Noé e a arca cheia de animais', 'Jonas engolido pelo grande peixe', 'Moisés abre o mar Vermelho',
  'Daniel na cova dos leões', 'A torre de Babel', 'Jesus anda sobre as águas', 'A multiplicação dos pães e peixes',
  'Sansão derruba as colunas do templo', 'A sarça que ardia sem se queimar', 'Zaqueu sobe na árvore para ver Jesus',
  'O filho pródigo volta para casa', 'Adão e Eva no jardim do Éden', 'A escada de Jacó até o céu', 'José e a túnica colorida',
  'Elias sobe ao céu num carro de fogo', 'Jesus nasce na manjedoura', 'O galo canta depois que Pedro nega Jesus',
  'As muralhas de Jericó caem', 'O bom samaritano ajuda o ferido', 'O pastor acha a ovelha perdida', 'Gideão e os 300 com tochas',
  'A pesca maravilhosa', 'Lázaro sai do túmulo', 'Jesus acalma a tempestade', 'Os magos seguem a estrela',
  'Moisés desce do monte com as tábuas', 'Ester diante do rei', 'Rute colhe espigas no campo', 'A pomba volta com a folha de oliveira',
]

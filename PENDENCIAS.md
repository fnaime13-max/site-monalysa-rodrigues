# Pendências · Site Monalysa Rodrigues

Legenda: **[FORNECIDO]** veio do formulário ou das fotos · **[CONFIRMADO]** é público no Instagram ou no Linktree dela · **[INFERÊNCIA]** foi escrito por nós e precisa de aprovação · **[PENDENTE]** o dado ainda falta.

## Obrigatório antes de publicar
- [ ] **[PENDENTE] Número do CRN-9.** A exibição é obrigatória (CFN 856/2026, art. 24). Hoje aparece `{{PREENCHER}}` no card do "Sobre" e no rodapé de `index.html`. O CRN-9 também é inferência, tirada do DDD 34 (MG): confirmar o regional.
- [ ] **[PENDENTE] Domínio.** `https://www.monalysarodrigues.com.br/` é provisório. Ele aparece em `index.html` (canonical, og:url, og:image e JSON-LD), `robots.txt` e `sitemap.xml`.
- [ ] **[INFERÊNCIA] "+1000 pessoas já passaram pelo Método LeveMente".** A bio diz "+1000 vidas transformadas", e isso soa como resultado, o que é vetado pelo CFN (art. 69). Por isso o texto foi reescrito como número de atendidas. Ela confirma que mais de 1000 pessoas foram atendidas?
- [ ] **[INFERÊNCIA] Aviso de IA no rodapé** ("revisados pela nutricionista"). Só pode ficar no ar depois que ela revisar os textos.
- [ ] **Foto no palco (fisiculturismo).** É pública no Instagram dela [CONFIRMADO]. Confirmar que ela quer essa foto no site. Ela não pode ser usada como "resultado".

## Textos para a Monalysa aprovar
- [ ] [INFERÊNCIA] Itens do acompanhamento: "Consulta individual", "Plano alimentar" e "Suporte". Plano e suporte vêm da bio dela [CONFIRMADO]. Faltam duração, retornos, app e se o suporte é por WhatsApp.
- [ ] [INFERÊNCIA] Os textos das abas Leve ("no prato") e Mente ("na cabeça"). A "refeição livre sem culpa" vem de um story dela.
- [ ] [INFERÊNCIA] "Já subi ao palco do fisiculturismo": confirmar a categoria e o título, se ela quiser citá-los.
- [ ] [FORNECIDO] "Na quarta, a gente usa rosa". O texto do movimento foi adaptado da resposta dela.
- [ ] Ela atende online? Se sim, vale incluir esse dado no site e nas Dúvidas.

## Dados que ainda faltam
- [ ] Endereço e cidade do consultório. Pelo DDD 34, a região seria o Triângulo Mineiro, mas isso não foi confirmado. Depois de confirmado, entra em seção e mapa, e no JSON-LD (`address`).
- [ ] Tempo de atendimento (anos). Ela marcou "experiência e tempo de atendimento" como algo que passa confiança.
- [ ] Formação e especializações. Nenhuma foi citada, para não inventar.
- [ ] Depoimentos: não há nenhum no site. Hoje o site aponta para o destaque "Elas venceram!" do Instagram. Não usar antes/depois nem números de peso.
- [ ] E-mail (opcional).
- [ ] Logo: não recebemos. O site usa o nome escrito em Epilogue 800 vinho, e o favicon é um "M" rosa sobre vinho.

## Fotos
Todas saíram dos posts do Instagram que vieram em PDF. Seria bom pedir os originais.

| Arquivo (`assets/images/`) | Seção | Tamanho e proporção | Situação |
|---|---|---|---|
| `monalysa-rosa.(webp/jpg)` | Hero (moldura em arco) | 720×960, 3:4 | ✅ resolução baixa. Pedir o original (ideal: 1200×1600) |
| `monalysa-retrato` | Sobre | 960×1200, 4:5 | ✅ |
| `monalysa-palco` | Sobre (polaroid) | 720×959, 3:4 | ✅ aguarda aprovação |
| `og-image.jpg` | Compartilhamento | 1200×630 | ✅ gerada |

A faixa do consultório foi removida a pedido. Os arquivos `consultorio-*` e `monalysa-consultorio` continuam na pasta, mas não são usados.

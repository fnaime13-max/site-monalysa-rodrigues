# Site · Monalysa Rodrigues, nutricionista

Site estático de uma página: HTML, CSS e JavaScript puros, sem instalar nada.

## Conceito
**Rosas-do-deserto**, desenhadas em canvas num rosa suave.
- Na **abertura**, a contagem vai de 0 a 100% enquanto a semana se preenche (a quarta é rosa) e dois buquês brotam nos cantos. No fim, as pétalas voam e a cortina sobe.
- No **hero**, um buquê de florzinhas sai do canto superior esquerdo da moldura em arco (o espelho das selfies dela). Elas balançam com o mouse e, quando ele passa por cima, soltam pétalas e folhas, que caem e rebrotam depois de alguns segundos. Um clique ou toque derruba várias pétalas de uma vez.
- O adesivo do hero e a seção "Na quarta, a gente usa rosa" mudam conforme o dia da semana.

## Estrutura
```
index.html            conteúdo e SEO
css/styles.css        tokens de cor, fonte e espaço no topo (:root)
js/main.js            CONFIG, flores, abertura e interações
assets/images/        fotos (webp + jpg)
assets/icons/         favicon
qa/                   scripts de teste (Playwright) e capturas
_originais/           imagens extraídas dos PDFs (não publicar)
```

## Como alterar
- **WhatsApp e Instagram:** edite o `CONFIG`, no topo de `js/main.js`. Todos os botões se atualizam sozinhos.
- **Fotos:** substitua o arquivo em `assets/images/` mantendo o mesmo nome (o .webp e o .jpg). Se a foto faltar, aparece "foto em breve".
- **CRN:** procure `{{PREENCHER}}` em `index.html` (são 2 lugares).
- **Cores:** variáveis `--wine`, `--rose` etc. em `css/styles.css`.
- **Domínio:** troque `monalysarodrigues.com.br` em `index.html`, `robots.txt` e `sitemap.xml`.

## Publicar
Envie a pasta inteira (sem `_originais/` e `qa/`) para qualquer hospedagem estática: Hostinger, Netlify, Vercel ou GitHub Pages.

## Testar
`node qa/shots.cjs` tira capturas em 1440, 1024, 768, 390 e 360 px e lista overflow, imagens quebradas e erros de console. `node qa/interact.cjs` testa o mouse e as abas.

## Notas técnicas
- Respeita `prefers-reduced-motion`: com ele ativo, a abertura é curta e as flores ficam paradas.
- As flores do hero pausam fora da tela (IntersectionObserver). A chuva de pétalas só roda enquanto há algo caindo.
- Para mudar a cor das flores, edite `drawPetal` em `js/main.js`; posição e tamanho ficam em `heroGarden` (lista `heads`).
- As fontes são Epilogue e Fraunces, carregadas do Google Fonts.

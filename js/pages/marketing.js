const PS = [{"en": "Product", "pt": "Produto", "k": true, "d": "O que você oferece e como isso é percebido.", "items": ["Qualidade", "Imagem", "Branding", "Recursos", "Variações", "Mix", "Suporte", "Serviços ao usuário", "Ocasiões de uso", "Disponibilidade", "Garantias"]}, {"en": "Promotion", "pt": "Promoção", "k": true, "d": "Como a marca se comunica e chega até as pessoas.", "items": ["Comunicações de marketing", "Promoção pessoal", "Promoção de vendas", "Relações públicas", "Marketing direto"]}, {"en": "Price", "pt": "Preço", "k": true, "d": "Quanto custa, como se cobra e como se posiciona.", "items": ["Posicionamento", "Listas", "Descontos", "Crédito", "Métodos de pagamento", "Elementos gratuitos ou com valor agregado"]}, {"en": "Place", "pt": "Praça", "k": true, "d": "Onde e como o produto chega ao cliente.", "items": ["Canais de venda", "Suporte de vendas", "Número de canais", "Canais segmentados"]}, {"en": "People", "pt": "Pessoas", "k": false, "d": "Quem faz a marca acontecer no dia a dia.", "items": ["Indivíduos em atividades de marketing", "Indivíduos em contato com o consumidor", "Recrutamento", "Cultura e imagem", "Treinamento e habilidades", "Remuneração"]}, {"en": "Process", "pt": "Processos", "k": false, "d": "Como o trabalho é feito, de ponta a ponta.", "items": ["Foco no cliente", "Líderes de negócios", "Suporte à tecnologia da informação", "Design de ferramentas", "Pesquisa e desenvolvimento"]}, {"en": "Physical evidence", "pt": "Evidências físicas", "k": false, "d": "Tudo que o cliente vê, toca e experimenta.", "items": ["Contato do time de vendas com a experiência de marca", "Embalagem do produto", "Experiência online"]}];
class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const mode = st.mode || 7;
let sel = st.sel != null ? st.sel : 0;
if (mode === 4 && !PS[sel].k) sel = 0;
const tick = st.tick || 0;
const go = (i) => () => this.setState({ sel: i, tick: tick + 1 });
const c = PS[sel];
const ans = st.ans || '';
return {
accent: this.props.accent ?? '#FD3029',
mixTitle: mode === 4 ? 'Os 4Ps do marketing.' : 'Os 7Ps do marketing.',
is4: mode === 4 ? 'true' : 'false', is7: mode === 7 ? 'true' : 'false',
seg4: mode === 4 ? 'on' : '', seg7: mode === 7 ? 'on' : '',
set4: () => this.setState({ mode: 4, tick: tick + 1 }),
set7: () => this.setState({ mode: 7, tick: tick + 1 }),
ps: PS.map((p, i) => {
const off = mode === 4 && !p.k;
return { en: p.en, pt: p.pt, isNew: mode === 7 && !p.k, disabled: off, pressed: i === sel ? 'true' : 'false', cls: 'ptile' + (i === sel ? ' on' : '') + (off ? ' off' : ''), pick: go(i) };
}),
cur: { en: c.en, pt: c.pt, d: c.d, num: sel + 1, items: c.items.map((t, j) => ({ t, d: (j * 0.04).toFixed(2) + 's' })) },
panelCls: 'ppanel' + (tick % 2 ? ' b' : ''),
hasAns: !!ans,
ansText: ans === 'mkt' ? 'Perfeito. A needesign cuida de todas as etapas, da estrutura à divulgação, com um plano sob medida para o seu momento.' : 'Sem problema. Também atuamos só na divulgação, com redes sociais e tráfego pago. E, se precisar, ajudamos nas etapas anteriores.',
ansCta: ans === 'mkt' ? 'Montar meu plano completo' : 'Ver redes sociais',
ansHref: ans === 'mkt' ? '/orcamento/' : '/servicos/#servico-redes',
ansMkt: () => this.setState({ ans: 'mkt' }),
ansPromo: () => this.setState({ ans: 'promo' })
};
}
}
DC.mount(Component, { accent: '#FD3029' });

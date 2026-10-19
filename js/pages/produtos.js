const PRODUCTS = [{"id": "propostas", "n": "Need Propostas", "kicker": "Propostas comerciais editáveis", "fmt": "PSD", "fmtLong": "Arquivos PSD editáveis", "head": "Impressione seus clientes com propostas profissionais.", "lead": "Modelos editáveis em PSD para freelancers e autônomos de Social Media, Web Design e Identidade Visual. Documentos organizados, bonitos e totalmente personalizáveis para fechar mais negócios.", "why": "Uma proposta comercial bem estruturada é essencial para fechar negócios e se destacar da concorrência.", "items": [["Proposta para Social Media", "Apresente sua oferta de gestão de redes sociais com espaço para plano de conteúdo, métricas, cronograma de publicações, pacotes e investimentos."], ["Proposta para Website", "Layout funcional para apresentar o escopo de um projeto de site: design, estrutura, funcionalidades, prazos e valores de cada fase."], ["Proposta para Logotipo & Identidade Visual", "Destaque seus projetos de logotipo, paleta de cores e tipografia, com valores e prazos bem definidos."]], "feats": [["Arquivos PSD editáveis", "Design profissional, pronto para personalizar com a sua marca e seus serviços."], ["Layout profissional", "Estrutura visualmente agradável e fácil de navegar, para propostas claras e impactantes."], ["Facilidade de uso", "É só abrir no Photoshop e ajustar informações, cores e logotipo."]], "buy": "https://pay.hotmart.com/J12787577F?checkoutMode=10&bid=1728605461429", "tool": "Photoshop"}, {"id": "contratos", "n": "Need Contratos", "kicker": "Contratos personalizados", "fmt": "DOC", "fmtLong": "Versão editável em Word", "head": "Proteja seu tempo, sua energia e seus direitos.", "lead": "Contratos feitos sob medida para freelancers e autônomos de Social Media, Web Design e Design Gráfico. Expectativas claras evitam mal-entendidos e deixam o trabalho fluir.", "why": "Como profissional independente, garantir que você e seu cliente estejam protegidos evita mal-entendidos e assegura que o trabalho flua tranquilamente.", "items": [["Contrato para Social Media", "Para gestão de redes, criação de conteúdo, métricas e interação com o público. Inclui entregas, revisões, direitos autorais, frequência de posts e relatórios."], ["Contrato para Web Designer", "Cobre escopo do projeto, prazos de entrega, alterações, manutenções futuras e direitos sobre o código e o design."], ["Contrato para Designer Gráfico", "Para identidades visuais, logotipos e peças gráficas. Inclui entregas, revisões, licenciamento das artes e direitos sobre os trabalhos."]], "feats": [["Modelos personalizados", "Documentos completos e prontos para uso, adaptáveis à sua realidade e à do seu cliente."], ["Versão editável", "Todos os contratos em Word, para ajustes rápidos e fáceis."], ["Base de mercado", "Estruturados com base nas principais práticas de mercado e na proteção dos direitos do freelancer."]], "buy": "https://pay.hotmart.com/U56112433Q?checkoutMode=10&bid=1728605417520", "tool": "Word"}];
class Component extends DCLogic {
componentDidMount() {
const h = (window.location.hash || '').replace('#', '');
const i = PRODUCTS.findIndex((p) => p.id === h);
if (i >= 0) this.setState({ idx: i });
}
renderVals() {
const st = this.state || {};
const idx = st.idx || 0;
const pad = (n) => (n < 10 ? '0' : '') + n;
const pick = (i, scroll) => () => {
this.setState({ idx: i, tick: (st.tick || 0) + 1 });
if (scroll) setTimeout(() => { const d = document.getElementById('detalhe'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
};
const p0 = PRODUCTS[idx];
const o = (idx + 1) % PRODUCTS.length;
return {
accent: this.props.accent ?? '#FD3029',
cards: PRODUCTS.map((p, i) => ({ n: p.n, kicker: p.kicker, head: p.head, fmt: p.fmt, d: (0.3 + i * 0.12).toFixed(2) + 's', cls: 'pcard' + (i === idx ? ' on' : ''), pressed: i === idx ? 'true' : 'false', cta: i === idx ? 'Detalhes abaixo' : 'Ver detalhes', pick: pick(i, true) })),
p: {
n: p0.n, head: p0.head, lead: p0.lead, why: p0.why, buy: p0.buy, tool: p0.tool, fmtLong: p0.fmtLong,
items: p0.items.map((it, j) => ({ t: it[0], x: it[1], d: (0.1 + j * 0.08).toFixed(2) + 's' })),
feats: p0.feats.map((f, j) => ({ t: f[0], x: f[1], num: pad(j + 1) })),
wa: 'https://wa.me/5516996377918?text=' + encodeURIComponent('Olá! Tenho uma dúvida sobre o ' + p0.n + '.')
},
swapCls: 'swap' + ((st.tick || 0) % 2 ? ' b' : ''),
otherName: PRODUCTS[o].n,
other: pick(o, true)
};
}
}
DC.mount(Component, { accent: '#FD3029' });

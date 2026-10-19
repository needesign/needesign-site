class Component extends DCLogic {
renderVals() {
const accent = this.props.accent ?? '#FD3029';
const st = this.state || {};
const sel = st.sel || {};
const plan = !!st.plan;
const fmt = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
const PRICES = { 3: 10900, 6: 8900, 12: 6900 };
const term = st.term || 12;
const PLAN = PRICES[term];
const horizon = plan ? term : 12;
const catalog = [
{ g: 'once', id: 'marca', name: 'Construção de marca', desc: 'Naming, identidade visual e manual de marca.', price: 3997, inPlan: true },
{ g: 'once', id: 'site', name: 'Website', desc: 'Institucional, landing page, one-page ou hot page. Domínio e hospedagem não inclusos.', price: 3497, inPlan: true },
{ g: 'once', id: 'consult', name: 'Consultoria estratégica (1h)', desc: 'Sessão online com o Business Model Canvas e PDF completo em até 3 dias úteis.', price: 250, inPlan: true },
{ g: 'monthly', id: 'trafego', name: 'Tráfego pago', desc: 'Gestão de campanhas no Meta Ads e no Google Ads.', price: 1497, inPlan: true },
{ g: 'monthly', id: 'redes', name: 'Redes sociais', desc: 'Conteúdo estratégico para Instagram e Facebook.', price: null, inPlan: true },
{ g: 'monthly', id: 'email', name: 'E-mail marketing', desc: 'Um disparo por semana para a sua base de contatos.', price: null, inPlan: true },
{ g: 'quote', id: 'video', name: 'Captação e edição de vídeo', desc: 'Da gravação à edição final, com a linguagem da sua marca.', price: null, inPlan: true },
{ g: 'quote', id: 'impressos', name: 'Impressos e papelaria', desc: 'Cartões, folders, placas, banners e materiais físicos.', price: null, inPlan: true },
{ g: 'quote', id: 'analise', name: 'Análise de mercado', desc: 'Benchmarking e definição do cliente ideal (ICP).', price: null, inPlan: true },
{ g: 'quote', id: 'planejamento', name: 'Planejamento estratégico', desc: 'Diagnóstico e plano de ação antes de qualquer execução.', price: null, inPlan: true }
];
const isMonthlyGroup = (c) => c.g === 'monthly';
const items = catalog.map((c) => {
const included = plan && c.inPlan;
const on = !included && !!sel[c.id];
let priceLabel = 'Sob consulta';
if (c.price != null) priceLabel = fmt(c.price) + (isMonthlyGroup(c) ? '/mês' : ' · único');
else if (isMonthlyGroup(c)) priceLabel = 'Sob consulta · mensal';
if (included) priceLabel = 'Incluso';
return Object.assign({}, c, {
included, on, priceLabel,
pressed: on ? 'true' : 'false',
cls: 'opt' + (on ? ' on' : '') + (included ? ' inc' : ''),
toggle: () => { if (included) return; const n = Object.assign({}, sel); n[c.id] = !n[c.id]; this.setState({ sel: n }); }
});
});
const groups = [
{ title: 'Projetos pontuais', sub: 'Você paga uma única vez.', items: items.filter((i) => i.g === 'once') },
{ title: 'Serviços mensais', sub: 'Recorrentes, cobrados todo mês.', items: items.filter((i) => i.g === 'monthly') },
{ title: 'Sob consulta', sub: 'O valor é definido junto com você na proposta.', items: items.filter((i) => i.g === 'quote') }
];
const chosen = items.filter((i) => i.on);
let once = 0, monthly = plan ? PLAN : 0;
const lines = [];
if (plan) lines.push({ name: 'Plano Completo (' + term + ' meses)', value: fmt(PLAN) + '/mês' });
chosen.forEach((i) => {
if (i.price != null && i.g === 'once') { once += i.price; lines.push({ name: i.name, value: fmt(i.price) }); }
else if (i.price != null && i.g === 'monthly') { monthly += i.price; lines.push({ name: i.name, value: fmt(i.price) + '/mês' }); }
else lines.push({ name: i.name, value: 'sob consulta' });
});
const quoteItems = chosen.filter((i) => i.price == null);
const hasAny = plan || chosen.length > 0;
const coveredPicked = !plan ? chosen.filter((i) => i.inPlan).length : 0;
const extraInPlan = catalog.filter((c) => c.inPlan).length - coveredPicked;
const nItems = chosen.length + (plan ? 1 : 0);
const lname = (st.leadName || '').trim();
const lphone = st.leadPhone || '';
const waLines = [lname ? 'Olá! Sou ' + lname + ' e montei meu plano no site da needesign:' : 'Olá! Montei meu plano no site da needesign:'].concat(lines.map((l) => '• ' + l.name + ' — ' + l.value));
if (hasAny) waLines.push('', 'Pontual: ' + fmt(once) + ' | Mensal: ' + fmt(monthly) + '/mês');
if (lphone) waLines.push('Meu WhatsApp: ' + lphone + (st.leadEmail ? ' | E-mail: ' + st.leadEmail : ''));
const waUrl = 'https://wa.me/5516996377918?text=' + encodeURIComponent(hasAny ? waLines.join('\n') : 'Olá! Quero montar um plano com a needesign.');
const digits = lphone.replace(/\D/g, '');
const maskPhone = (v) => { const d = v.replace(/\D/g, '').slice(0, 11); if (d.length <= 2) return d.length ? '(' + d : ''; if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2); if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6); return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7); };
return {
accent,
groups,
planCls: 'plan' + (plan ? ' on' : ''),
term,
planPriceStr: fmt(PLAN),
planBtnCls: plan ? 'ghost' : 'btn',
planBtnText: plan ? 'Remover plano' : 'Escolher este plano',
terms: [3, 6, 12].map((m) => ({ label: m + ' meses', price: fmt(PRICES[m]), save: m === 3 ? '' : 'economize ' + Math.round((1 - PRICES[m] / PRICES[3]) * 100) + '%', pressed: term === m ? 'true' : 'false', cls: 'term' + (term === m ? ' on' : ''), pick: () => this.setState({ term: m, plan: true }) })),
planPressed: plan ? 'true' : 'false',
planIncl: ['Construção de marca', 'Website + manutenção', 'Redes sociais', 'Tráfego pago', 'E-mail marketing', 'E-mail corporativo', 'Copywriting', 'Criativos digitais', 'Criativos impressos', 'Captação + edição de vídeo', 'Planej. estratégico', 'Consultoria semanal', 'Endomarketing', 'Análise de mercado'],
togglePlan: () => this.setState({ plan: !plan }),
pickPlan: () => this.setState({ plan: true }),
reset: () => this.setState({ plan: false, sel: {} }),
lines,
hasAny,
empty: !hasAny,
countText: nItems === 0 ? 'Nada selecionado' : (nItems === 1 ? '1 item' : nItems + ' itens'),
onceStr: fmt(once),
monthlyStr: fmt(monthly),
monthlyPerStr: fmt(monthly) + '/mês',
monthlySub: plan ? 'contrato de ' + term + ' meses' : 'cobrado todo mês',
midLabel: 'Do 2º ao ' + horizon + 'º mês',
totalLabel: 'Total em ' + horizon + ' meses',
firstStr: fmt(once + monthly),
y12Str: fmt(once + monthly * horizon),
hasQuote: quoteItems.length > 0,
quoteText: '+ ' + (quoteItems.length === 1 ? '1 item sob consulta, com valor definido' : quoteItems.length + ' itens sob consulta, com valores definidos') + ' na proposta.',
showUpsell: !plan && coveredPicked >= 2,
upsellText: 'O Plano Completo já cobre ' + coveredPicked + ' dos serviços que você escolheu e inclui mais ' + extraInPlan + ' (como vídeo, redes sociais e e-mail marketing), com consultoria semanal, a partir de R$ 6.900/mês.',
waHref: waUrl,
leadOpen: !!st.leadOpen,
leadForm: !st.leadSent,
leadSent: !!st.leadSent,
leadName: st.leadName || '', leadPhone: lphone, leadEmail: st.leadEmail || '',
firstName: lname.split(' ')[0] || '',
nameErr: !!st.tried && lname.length < 2,
phoneErr: !!st.tried && (digits.length < 10),
nameCls: st.tried && lname.length < 2 ? 'bad' : '',
phoneCls: st.tried && digits.length < 10 ? 'bad' : '',
onName: (e) => this.setState({ leadName: e.target.value }),
onPhone: (e) => this.setState({ leadPhone: maskPhone(e.target.value) }),
onEmail: (e) => this.setState({ leadEmail: e.target.value }),
openLead: () => this.setState({ leadOpen: true, leadSent: false, tried: false }),
closeLead: () => this.setState({ leadOpen: false }),
submitLead: () => {
if (lname.length < 2 || digits.length < 10) { this.setState({ tried: true }); return; }
if (window.needLead) window.needLead({ nome: lname, whatsapp: lphone, email: st.leadEmail || '', plano: lines.map((l) => l.name + ' — ' + l.value).join('\n'), pontual: fmt(once), mensal: fmt(monthly) });
window.open(waUrl, '_blank', 'noopener');
this.setState({ leadSent: true });
}
};
}
}
DC.mount(Component, { accent: '#FD3029' });

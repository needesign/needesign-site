const BLOCKS = [{"id": "parcerias", "n": "Parcerias principais", "area": "parc", "q": "Quem são os parceiros e fornecedores que ajudam o negócio a funcionar?", "x": "A rede de fornecedores e parceiros que torna o modelo possível, reduzindo riscos ou trazendo recursos que você não tem."}, {"id": "atividades", "n": "Atividades-chave", "area": "ativ", "q": "O que a empresa precisa fazer muito bem para entregar sua proposta de valor?", "x": "As ações mais importantes que o negócio precisa executar para o modelo dar certo."}, {"id": "recursos", "n": "Recursos principais", "area": "recu", "q": "Quais ativos são indispensáveis: pessoas, tecnologia, marca, capital?", "x": "Os ativos mais importantes para o modelo funcionar, sejam físicos, intelectuais, humanos ou financeiros."}, {"id": "proposta", "n": "Proposta de valor", "area": "prop", "q": "Que problema você resolve e por que o cliente escolheria você?", "x": "O conjunto de benefícios que faz o cliente escolher a sua empresa e não a concorrência. É o coração do Canvas."}, {"id": "relacionamento", "n": "Relacionamento com clientes", "area": "rela", "q": "Como você conquista, mantém e faz o cliente comprar de novo?", "x": "O tipo de relação que você estabelece com cada segmento de clientes, do atendimento pessoal ao autosserviço."}, {"id": "canais", "n": "Canais", "area": "cana", "q": "Por onde o cliente conhece, compra e recebe o que você vende?", "x": "Os pontos de contato de comunicação, venda e entrega entre a empresa e os clientes."}, {"id": "segmentos", "n": "Segmentos de clientes", "area": "segm", "q": "Para quem você cria valor? Quem é o seu cliente mais importante?", "x": "Os grupos de pessoas ou empresas que o negócio quer alcançar e atender."}, {"id": "custos", "n": "Estrutura de custos", "area": "cust", "q": "Quais são os custos mais relevantes para operar o modelo?", "x": "Todos os custos envolvidos na operação, e quais recursos e atividades pesam mais."}, {"id": "receitas", "n": "Fontes de receita", "area": "rece", "q": "Por que valor o cliente está disposto a pagar, e como ele paga?", "x": "Como o negócio gera dinheiro com cada segmento de clientes: vendas, assinaturas, taxas, licenças."}];
class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const sel = st.sel != null ? st.sel : 3;
const pad = (n) => (n < 10 ? '0' : '') + n;
const go = (i) => () => this.setState({ sel: (i + BLOCKS.length) % BLOCKS.length, tick: (st.tick || 0) + 1 });
const b0 = BLOCKS[sel];
return {
accent: this.props.accent ?? '#FD3029',
blocks: BLOCKS.map((b, i) => ({ n: b.n, area: b.area, num: pad(i + 1), d: (0.05 * i).toFixed(2) + 's', pressed: i === sel ? 'true' : 'false', cls: 'blk ' + b.area + (i === sel ? ' on' : ''), pick: go(i) })),
b: b0,
bNum: pad(sel + 1),
panelCls: 'panel' + ((st.tick || 0) % 2 ? ' b' : ''),
nextB: go(sel + 1),
prevB: go(sel - 1)
};
}
}
DC.mount(Component, { accent: '#FD3029' });

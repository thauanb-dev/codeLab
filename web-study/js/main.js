// ============================================
// CONSULTA CNPJ - Brasil API (Layout Completo)
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Estado
let historico = JSON.parse(localStorage.getItem('cnpj_historico') || '[]');
const MAX_HISTORICO = 20;

// Utilitários
function formatarCnpj(cnpj) {
    const n = String(cnpj).replace(/\D/g, '').padStart(14, '0');
    return n.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function formatarData(iso) {
    if (!iso) return '-';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarCapital(valor) {
    if (!valor) return '-';
    const num = Number(valor);
    if (isNaN(num)) return valor;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
}

function getSituacaoClass(situacao) {
    const s = (situacao || '').toUpperCase();
    if (s.includes('ATIVA')) return 'bg-success/10 text-success';
    if (s.includes('BAIXADA') || s.includes('NULA') || s.includes('CANCELADA') || s.includes('EXTINTA')) return 'bg-danger/10 text-danger';
    if (s.includes('SUSPENSA')) return 'bg-warning/10 text-warning';
    if (s.includes('INAPTA')) return 'bg-gray/10 text-gray-600';
    return 'bg-gray-100 text-gray-700';
}

function getSituacaoLabel(situacao) {
    return situacao || 'DESCONHECIDO';
}

function escapeHtml(str) {
    if (!str) return '-';
    return String(str)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
}

function criarLinha(label, valor, extraClass = '') {
    if (!valor || valor === '-') return '';
    return `
        <div class="${extraClass}">
            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">${escapeHtml(label)}</dt>
            <dd class="text-gray-900 text-sm font-medium">${escapeHtml(valor)}</dd>
        </div>
    `;
}

function toast(msg, tipo = 'info') {
    const container = $('#toast-container');
    const cores = {
        sucesso: 'bg-success text-white',
        erro: 'bg-danger text-white',
        aviso: 'bg-warning text-white',
        info: 'bg-primary text-white'
    };
    const icones = {
        sucesso: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        erro: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        aviso: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };
    const el = document.createElement('div');
    el.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${cores[tipo]} animate-slide-in`;
    el.innerHTML = `${icones[tipo]}<span class="text-sm font-medium">${escapeHtml(msg)}</span>`;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; setTimeout(() => el.remove(), 300); }, 4000);
}

// Renderização dos Cards
function renderIdentificacao(d) {
    $('#razao-social').textContent = d.razao_social || '-';
    $('#nome-fantasia').textContent = d.nome_fantasia || 'Sem nome fantasia';
    
    const badgeSituacao = $('#badge-situacao');
    badgeSituacao.textContent = getSituacaoLabel(d.descricao_situacao_cadastral);
    badgeSituacao.className = `px-3 py-1 text-sm font-medium rounded-full ${getSituacaoClass(d.descricao_situacao_cadastral)}`;
    
    const badgePorte = $('#badge-porte');
    if (d.porte) {
        badgePorte.textContent = d.porte;
        badgePorte.classList.remove('hidden');
    } else {
        badgePorte.classList.add('hidden');
    }

    const container = $('#dados-basicos');
    container.innerHTML = `
        ${criarLinha('CNPJ', formatarCnpj(d.cnpj))}
        ${criarLinha('Abertura', formatarData(d.data_inicio_atividade))}
        ${criarLinha('Situação Cadastral', getSituacaoLabel(d.descricao_situacao_cadastral))}
        ${criarLinha('Porte', d.porte)}
        ${criarLinha('Natureza Jurídica', d.natureza_juridica)}
        ${criarLinha('Capital Social', formatarCapital(d.capital_social))}
        ${criarLinha('Tipo', d.tipo)}
        ${criarLinha('Fantasia', d.nome_fantasia)}
        ${criarLinha('E-mail', d.email)}
        ${criarLinha('Telefone', d.telefone)}
        ${criarLinha('EFR', d.efr)}
        ${criarLinha('Situação Especial', d.situacao_especial)}
        ${criarLinha('Data Situação Especial', formatarData(d.data_situacao_especial))}
    `;
    $('#card-identificacao').classList.remove('hidden');
}

function renderEndereco(d) {
    const container = $('#endereco-content');
    const partes = [
        ['Logradouro', `${d.logradouro || ''} ${d.numero ? `, ${d.numero}` : ''} ${d.complemento ? ` - ${d.complemento}` : ''}`.trim()],
        ['Bairro', d.bairro],
        ['Cidade', d.municipio],
        ['UF', d.uf],
        ['CEP', d.cep ? d.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2') : null],
        ['País', d.pais]
    ].filter(([, v]) => v).map(([l, v]) => criarLinha(l, v)).join('');
    
    container.innerHTML = partes || '<p class="text-gray-500 text-sm">Endereço não informado</p>';
    $('#card-endereco').classList.remove('hidden');
}

function renderCnaes(d) {
    const container = $('#cnaes-content');
    let html = '';
    
    if (d.cnae_fiscal_descricao) {
        html += `
            <div class="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <dt class="text-xs font-medium text-primary uppercase tracking-wider mb-1">Principal</dt>
                <dd class="font-medium text-gray-900">${escapeHtml(d.cnae_fiscal)} - ${escapeHtml(d.cnae_fiscal_descricao)}</dd>
            </div>
        `;
    }
    
    if (d.cnaes_secundarias?.length) {
        html += '<div class="space-y-3">';
        d.cnaes_secundarias.forEach(c => {
            html += `
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/50 transition">
                    <span class="font-mono text-sm text-primary">${escapeHtml(c.codigo)}</span>
                    <span class="ml-2 text-gray-700">${escapeHtml(c.descricao)}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    container.innerHTML = html || '<p class="text-gray-500 text-sm">Nenhuma atividade informada</p>';
    $('#card-cnaes').classList.remove('hidden');
}

function renderSocios(d) {
    const container = $('#socios-content');
    
    if (!d.qsa?.length) {
        container.innerHTML = '<p class="text-gray-500 text-sm">Nenhum sócio informado</p>';
        $('#card-socios').classList.remove('hidden');
        return;
    }
    
    let html = '<div class="space-y-4">';
    d.qsa.forEach((s, i) => {
        const qualLabels = {
            '1': 'Pessoa Física - Residente',
            '2': 'Pessoa Física - Não Residente',
            '3': 'Pessoa Jurídica - Residente',
            '4': 'Pessoa Jurídica - Não Residente',
            '10': 'Pessoa Física - Residente - Capital Estrangeiro',
            '11': 'Pessoa Jurídica - Residente - Capital Estrangeiro',
            '15': 'Pessoa Física - Não Residente - Capital Estrangeiro',
            '16': 'Pessoa Jurídica - Não Residente - Capital Estrangeiro'
        };
        
        html += `
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="font-semibold text-gray-900">${escapeHtml(s.nome)}</span>
                            <span class="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">${escapeHtml(s.qual || 'Sócio')}</span>
                            ${s.qual_socio ? `<span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">${escapeHtml(s.qual_socio)}</span>` : ''}
                        </div>
                        <dl class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            ${criarLinha('Qualificação', qualLabels[s.qual] || s.qual, 'sm:col-span-1')}
                            ${criarLinha('Entrada', formatarData(s.data_entrada), 'sm:col-span-1')}
                            ${criarLinha('CPF/CNPJ (parcial)', s.cnpj_cpf_socio ? `${s.cnpj_cpf_socio.slice(0, 3)}.***.***-${s.cnpj_cpf_socio.slice(-2)}` : '-', 'sm:col-span-1')}
                            ${criarLinha('País', s.pais_origem || '-', 'sm:col-span-1')}
                            ${criarLinha('Faixa Etária', s.faixa_etaria || '-', 'sm:col-span-1')}
                            ${criarLinha('Nome Representante', s.nome_rep_legal || '-', 'sm:col-span-1')}
                            ${criarLinha('Qual. Representante', s.qual_rep_legal || '-', 'sm:col-span-1')}
                        </dl>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    $('#card-socios').classList.remove('hidden');
}

function renderComplementares(d) {
    const container = $('#complementares-content');
    
    const campos = [
        ['CNPJ Raiz', d.cnpj_raiz],
        ['Matriz/Filial', d.identificador_matriz_filial === '1' ? 'Matriz' : d.identificador_matriz_filial === '2' ? 'Filial' : d.identificador_matriz_filial],
        ['Código Porte', d.codigo_porte],
        ['Opção Simples', d.opcao_pelo_simples ? 'Sim' : 'Não'],
        ['Data Opção Simples', formatarData(d.data_opcao_pelo_simples)],
        ['Data Exclusão Simples', formatarData(d.data_exclusao_do_simples)],
        ['Opção MEI', d.opcao_pelo_mei ? 'Sim' : 'Não'],
        ['Data Opção MEI', formatarData(d.data_opcao_pelo_mei)],
        ['Data Exclusão MEI', formatarData(d.data_exclusao_do_mei)],
        ['Entidade Responsável', d.ente_federativo_responsavel]
    ].filter(([, v]) => v).map(([l, v]) => criarLinha(l, v)).join('');
    
    container.innerHTML = campos || '<p class="text-gray-500 text-sm">Nenhuma informação complementar</p>';
    $('#card-complementares').classList.remove('hidden');
}

function renderJson(d) {
    $('#json-raw').textContent = JSON.stringify(d, null, 2);
    $('#card-json').classList.remove('hidden');
}

function mostrarResultado(d) {
    $('#empty-state').classList.add('hidden');
    $('#resultado-section').classList.remove('hidden');
    
    // Timestamp
    $('#timestamp-consulta').textContent = new Date().toLocaleString('pt-BR');
    
    // Render cards
    renderIdentificacao(d);
    renderEndereco(d);
    renderCnaes(d);
    renderSocios(d);
    renderComplementares(d);
    renderJson(d);
    
    // Scroll suave
    $('#resultado-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Salva no histórico
    salvarHistorico(d);
}

function mostrarErro(msg) {
    $('#icone-loading').classList.add('hidden');
    $('#icone-erro').classList.remove('hidden');
    $('#btn-cnpj').disabled = false;
    $('#btn-cnpj').innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><span>Consultar</span>`;
    toast(msg, 'erro');
}

function mostrarLoading() {
    $('#icone-loading').classList.remove('hidden');
    $('#icone-sucesso').classList.add('hidden');
    $('#icone-erro').classList.add('hidden');
    $('#btn-cnpj').disabled = true;
    $('#btn-cnpj').innerHTML = `<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Consultando...</span>`;
}

function mostrarSucesso() {
    $('#icone-loading').classList.add('hidden');
    $('#icone-sucesso').classList.remove('hidden');
    $('#btn-cnpj').disabled = false;
    $('#btn-cnpj').innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><span>Consultar</span>`;
    setTimeout(() => { $('#icone-sucesso').classList.add('hidden'); }, 2000);
}

function resetForm() {
    $('#cnpj-input').value = '';
    $('#icone-loading').classList.add('hidden');
    $('#icone-sucesso').classList.add('hidden');
    $('#icone-erro').classList.add('hidden');
    $('#btn-cnpj').disabled = false;
    $('#btn-cnpj').innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><span>Consultar</span>`;
    $('#empty-state').classList.remove('hidden');
    $('#resultado-section').classList.add('hidden');
    // Esconde cards
    $$('#cards-container > article').forEach(el => el.classList.add('hidden'));
    $('#json-content').classList.add('hidden');
    $('#json-chevron').style.transform = 'rotate(0deg)';
    $('#btn-toggle-json').querySelector('span').textContent = 'Expandir';
}

// Histórico
function salvarHistorico(d) {
    const item = {
        cnpj: d.cnpj,
        razao_social: d.razao_social,
        nome_fantasia: d.nome_fantasia,
        situacao: d.descricao_situacao_cadastral,
        data: new Date().toISOString()
    };
    historico = [item, ...historico.filter(h => h.cnpj !== d.cnpj)].slice(0, MAX_HISTORICO);
    localStorage.setItem('cnpj_historico', JSON.stringify(historico));
}

function renderHistorico() {
    const container = $('#historico-lista');
    if (!historico.length) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">Nenhuma consulta no histórico</p>';
        return;
    }
    container.innerHTML = historico.map(h => `
        <button data-cnpj="${h.cnpj}" class="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition flex items-center justify-between">
            <div>
                <p class="font-medium text-gray-900">${escapeHtml(h.razao_social)}</p>
                <p class="text-sm text-gray-500">${formatarCnpj(h.cnpj)} ${h.nome_fantasia ? `• ${escapeHtml(h.nome_fantasia)}` : ''}</p>
            </div>
            <div class="text-right">
                <span class="px-2 py-0.5 text-xs rounded ${getSituacaoClass(h.situacao).replace('bg-', 'bg-').replace('text-', 'text-')}">${escapeHtml(h.situacao)}</span>
                <p class="text-xs text-gray-400 mt-1">${new Date(h.data).toLocaleString('pt-BR')}</p>
            </div>
        </button>
    `).join('');
    
    $$('#historico-lista button').forEach(btn => {
        btn.addEventListener('click', () => {
            $('#cnpj-input').value = btn.dataset.cnpj;
            $('#form-cnpj').dispatchEvent(new Event('submit'));
            fecharHistorico();
        });
    });
}

function abrirHistorico() {
    renderHistorico();
    $('#modal-historico').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharHistorico() {
    $('#modal-historico').classList.add('hidden');
    document.body.style.overflow = '';
}

// Eventos
$('#form-cnpj').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cnpj = $('#cnpj-input').value.replace(/\D/g, '');
    if (cnpj.length !== 14) {
        toast('Digite um CNPJ válido com 14 dígitos', 'aviso');
        return;
    }
    
    mostrarLoading();
    
    try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        
        if (!res.ok) {
            if (res.status === 404) throw new Error('CNPJ não encontrado na base da Receita Federal');
            if (res.status === 400) throw new Error('CNPJ inválido');
            throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        mostrarResultado(data);
        mostrarSucesso();
        toast('Consulta realizada com sucesso', 'sucesso');
        
    } catch (err) {
        mostrarErro(err.message);
    }
});

// Máscara no input
$('#cnpj-input').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 14) v = v.slice(0, 14);
    if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4$5');
    else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{3})/, '$1.$2');
    e.target.value = v;
});

// Botão exemplo
$('#btn-exemplo').addEventListener('click', () => {
    const exemplos = ['11222333000181', '04252011000110', '60746948000112', '33000167000101'];
    const aleatorio = exemplos[Math.floor(Math.random() * exemplos.length)];
    $('#cnpj-input').value = formatarCnpj(aleatorio);
    $('#cnpj-input').focus();
});

// Exemplos rápidos
$$('.btn-exemplo-rápido').forEach(btn => {
    btn.addEventListener('click', () => {
        $('#cnpj-input').value = formatarCnpj(btn.dataset.cnpj);
        $('#form-cnpj').dispatchEvent(new Event('submit'));
    });
});

// Copiar JSON
$('#btn-copiar-json').addEventListener('click', () => {
    const json = $('#json-raw').textContent;
    if (json) {
        navigator.clipboard.writeText(json);
        toast('JSON copiado para a área de transferência', 'sucesso');
    }
});

// Imprimir
$('#btn-imprimir').addEventListener('click', () => window.print());

// Toggle JSON
$('#btn-toggle-json').addEventListener('click', () => {
    const content = $('#json-content');
    const chevron = $('#json-chevron');
    const label = $('#btn-toggle-json').querySelector('span');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
        label.textContent = 'Recolher';
    } else {
        content.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
        label.textContent = 'Expandir';
    }
});

// Histórico Modal
$('#btn-historico').addEventListener('click', abrirHistorico);
$('#btn-fechar-historico').addEventListener('click', fecharHistorico);
$('#modal-historico').addEventListener('click', (e) => {
    if (e.target === $('#modal-historico')) fecharHistorico();
});

// Limpar tudo
$('#btn-limpar').addEventListener('click', () => {
    if (confirm('Limpar formulário e resultado?')) {
        resetForm();
        toast('Formulário limpo', 'info');
    }
});

// Teclas de atalho
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharHistorico();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        $('#cnpj-input').focus();
    }
});

// Inicialização
console.log('🚀 Consulta CNPJ - Brasil API carregada');
console.log('💡 Dica: Ctrl+K foca no input | Exemplos rápidos abaixo do formulário');

// Tema (Light/Dark)
function initTema() {
    const btn = $('#btn-tema');
    const html = document.documentElement;
    
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('tema', isDark ? 'dark' : 'light');
        toast(isDark ? 'Modo escuro ativado' : 'Modo claro ativado', 'info');
    });
    
    // Atalho: Ctrl+Shift+T
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            btn.click();
        }
    });
}

initTema();

// Animação de entrada para toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
`;
document.head.appendChild(style);

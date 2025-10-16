// Estado da aplicação
let state = {
    categoria: 'premium',
    procedimentosMes: 20,
    mostrarTabela: false,
    mixProcedimentos: {
        faceSublime: 40,
        cirurgicos: 30,
        outros: 30
    }
};

const investimento = {
    total: 229900,
    entrada: 10000,
    parcela: 6108
};

const precos = {
    popular: 2000,
    premium: 3000,
    luxo: 5000
};

const preciosMedios = {
    cirurgicos: {
        popular: 3000,
        premium: 5000,
        luxo: 8000
    },
    outros: {
        popular: 2500,
        premium: 4000,
        luxo: 6500
    }
};

// Custos operacionais (% do faturamento)
const custosOperacionais = {
    insumos: 0.08, // 8% do faturamento
    marketing: 0.05, // 5%
    administrativo: 0.03 // 3%
};

// Formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

// Calcular faturamento
function calcularFaturamento() {
    const faceSublimeQtd = (state.procedimentosMes * state.mixProcedimentos.faceSublime) / 100;
    const cirurgicosQtd = (state.procedimentosMes * state.mixProcedimentos.cirurgicos) / 100;
    const outrosQtd = (state.procedimentosMes * state.mixProcedimentos.outros) / 100;

    const faturamentoFace = faceSublimeQtd * precos[state.categoria];
    const faturamentoCirurgicos = cirurgicosQtd * preciosMedios.cirurgicos[state.categoria];
    const faturamentoOutros = outrosQtd * preciosMedios.outros[state.categoria];

    const faturamentoMensal = faturamentoFace + faturamentoCirurgicos + faturamentoOutros;
    const faturamentoAnual = faturamentoMensal * 12;
    
    // Custos operacionais
    const custoInsumos = faturamentoMensal * custosOperacionais.insumos;
    const custoMarketing = faturamentoMensal * custosOperacionais.marketing;
    const custoAdm = faturamentoMensal * custosOperacionais.administrativo;
    const custosTotais = custoInsumos + custoMarketing + custoAdm + investimento.parcela;
    
    const lucroMensal = faturamentoMensal - custosTotais;
    const mesesParaROI = investimento.total / lucroMensal;

    return {
        mensal: faturamentoMensal,
        anual: faturamentoAnual,
        porTipo: {
            faceSublime: faturamentoFace,
            cirurgicos: faturamentoCirurgicos,
            outros: faturamentoOutros
        },
        custos: {
            insumos: custoInsumos,
            marketing: custoMarketing,
            administrativo: custoAdm,
            financiamento: investimento.parcela,
            total: custosTotais
        },
        roi: {
            lucroMensal,
            mesesParaROI: mesesParaROI > 0 ? mesesParaROI : 0
        }
    };
}

// Gerar cronograma ROI detalhado
function gerarCronogramaROI(faturamento) {
    const cronograma = [];
    const roiMeses = Math.ceil(faturamento.roi.mesesParaROI);
    let acumulado = -investimento.entrada; // Começa negativo pela entrada
    
    for (let mes = 1; mes <= Math.min(roiMeses + 3, 12); mes++) {
        acumulado += faturamento.roi.lucroMensal;
        cronograma.push({
            mes: mes,
            faturamento: faturamento.mensal,
            custos: faturamento.custos.total,
            lucro: faturamento.roi.lucroMensal,
            acumulado: acumulado,
            roi: acumulado >= 0
        });
    }
    
    return cronograma;
}

// Gerar estratégias de 90 dias
function gerarEstrategias() {
    return {
        mes1: {
            titulo: 'MES 1 - ESTRUTURACAO',
            acoes: [
                'Instalacao e calibracao do equipamento Reversi',
                'Treinamento completo da equipe (protocolos e seguranca)',
                'Definicao de precificacao e pacotes de tratamento',
                'Registro fotografico de casos (antes/depois)',
                'Configuracao de agenda e sistema de gestao'
            ]
        },
        mes2: {
            titulo: 'MES 2 - LANCAMENTO',
            acoes: [
                'Campanha de lancamento com condicoes especiais',
                'Divulgacao em redes sociais e Google Ads',
                'Parcerias com influenciadores locais',
                'Eventos de demonstracao para publico-alvo',
                'Follow-up de primeiros pacientes e depoimentos'
            ]
        },
        mes3: {
            titulo: 'MES 3 - CONSOLIDACAO',
            acoes: [
                'Analise de resultados e ajuste de estrategias',
                'Programa de fidelizacao e indicacoes',
                'Expansao de protocolos combinados',
                'Marketing com cases de sucesso reais',
                'Otimizacao de agenda para maximizar procedimentos'
            ]
        }
    };
}

// Atualizar UI
function atualizarResultados() {
    const faturamento = calcularFaturamento();
    
    document.getElementById('result-mensal').textContent = formatarMoeda(faturamento.mensal);
    document.getElementById('result-mensal-desc').textContent = 'Baseado em ' + state.procedimentosMes + ' procedimentos/mes';
    document.getElementById('result-anual').textContent = formatarMoeda(faturamento.anual);
    document.getElementById('result-roi').textContent = faturamento.roi.mesesParaROI > 0 ? 
        Math.ceil(faturamento.roi.mesesParaROI) + ' meses' : 'N/A';
    document.getElementById('result-lucro').textContent = formatarMoeda(faturamento.roi.lucroMensal);
    
    document.getElementById('breakdown-face').textContent = formatarMoeda(faturamento.porTipo.faceSublime) + '/mes';
    document.getElementById('breakdown-cirurgicos').textContent = formatarMoeda(faturamento.porTipo.cirurgicos) + '/mes';
    document.getElementById('breakdown-outros').textContent = formatarMoeda(faturamento.porTipo.outros) + '/mes';
}

// Set Categoria
function setCategoria(cat) {
    state.categoria = cat;
    
    document.querySelectorAll('.categoria-btn').forEach(function(btn) {
        btn.className = 'categoria-btn py-3 px-2 sm:px-4 rounded-lg font-semibold transition-all text-sm sm:text-base';
    });
    
    const cores = {
        popular: 'bg-blue-600 text-white shadow-lg scale-105',
        premium: 'bg-purple-600 text-white shadow-lg scale-105',
        luxo: 'bg-amber-600 text-white shadow-lg scale-105'
    };
    
    const coresInativas = {
        popular: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        premium: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
        luxo: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    };
    
    document.getElementById('btn-popular').className += ' ' + (cat === 'popular' ? cores.popular : coresInativas.popular);
    document.getElementById('btn-premium').className += ' ' + (cat === 'premium' ? cores.premium : coresInativas.premium);
    document.getElementById('btn-luxo').className += ' ' + (cat === 'luxo' ? cores.luxo : coresInativas.luxo);
    
    atualizarResultados();
}

// Toggle Tabela
function toggleTabela() {
    state.mostrarTabela = !state.mostrarTabela;
    const tabela = document.getElementById('tabela-precos');
    const btnText = document.getElementById('btn-tabela-text');
    
    if (state.mostrarTabela) {
        tabela.classList.remove('hidden');
        btnText.textContent = 'Ocultar';
    } else {
        tabela.classList.add('hidden');
        btnText.textContent = 'Ver';
    }
}

// Slider Procedimentos
document.getElementById('slider-procedimentos').addEventListener('input', function(e) {
    state.procedimentosMes = Number(e.target.value);
    document.getElementById('label-procedimentos').textContent = state.procedimentosMes;
    atualizarResultados();
});

// Slider Face
document.getElementById('slider-face').addEventListener('input', function(e) {
    const valor = Number(e.target.value);
    const resto = 100 - valor;
    state.mixProcedimentos = {
        faceSublime: valor,
        cirurgicos: Math.round(resto * 0.5),
        outros: resto - Math.round(resto * 0.5)
    };
    document.getElementById('label-face').textContent = valor + '%';
    document.getElementById('label-cirurgicos').textContent = state.mixProcedimentos.cirurgicos + '%';
    document.getElementById('label-outros').textContent = state.mixProcedimentos.outros + '%';
    atualizarResultados();
});

// Slider Cirúrgicos
document.getElementById('slider-cirurgicos').addEventListener('input', function(e) {
    const valor = Number(e.target.value);
    const resto = 100 - valor;
    state.mixProcedimentos = {
        faceSublime: Math.round(resto * 0.5),
        cirurgicos: valor,
        outros: resto - Math.round(resto * 0.5)
    };
    document.getElementById('slider-face').value = state.mixProcedimentos.faceSublime;
    document.getElementById('label-face').textContent = state.mixProcedimentos.faceSublime + '%';
    document.getElementById('label-cirurgicos').textContent = valor + '%';
    document.getElementById('label-outros').textContent = state.mixProcedimentos.outros + '%';
    atualizarResultados();
});

// Countdown
function iniciarContador() {
    const dataLimite = new Date('2025-10-24T23:59:59').getTime();
    
    setInterval(function() {
        const agora = new Date().getTime();
        const diferenca = dataLimite - agora;
        
        if (diferenca < 0) {
            document.getElementById('countdown').innerHTML = '<span class="text-yellow-300">OFERTA ENCERRADA</span>';
            return;
        }
        
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerHTML = 
            '<span class="countdown-item">' + dias + 'd</span>' +
            '<span class="countdown-item">' + horas + 'h</span>' +
            '<span class="countdown-item">' + minutos + 'm</span>' +
            '<span class="countdown-item">' + segundos + 's</span>';
    }, 1000);
}

// Submit form
document.getElementById('formCaptura').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp'),
        cidade: formData.get('cidade'),
        temClinica: formData.get('temClinica') === 'sim',
        simulacao: {
            categoria: state.categoria,
            procedimentosMes: state.procedimentosMes,
            faturamento: calcularFaturamento()
        }
    };
    
    // Preencher campos hidden
    document.getElementById('hidden-categoria').value = state.categoria;
    document.getElementById('hidden-procedimentos').value = state.procedimentosMes;
    document.getElementById('hidden-faturamento').value = dados.simulacao.faturamento.mensal;
    document.getElementById('hidden-roi').value = Math.ceil(dados.simulacao.faturamento.roi.mesesParaROI);
    
    // Gerar PDF
    await gerarPDF(dados);
    
    // Mostrar sucesso
    const successMsg = document.getElementById('successMessage');
    successMsg.classList.add('show');
    
    // Enviar para Netlify Forms (em background)
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(e.target))
    });
    
    // Redirecionar para WhatsApp após 3 segundos
    setTimeout(function() {
        const mensagem = 'Ola! Acabei de baixar meu Plano de Faturamento Reversi. Gostaria de mais informacoes sobre a condicao de lancamento (valida ate 24/10/2025).';
        window.open('https://wa.me/5562983160209?text=' + encodeURIComponent(mensagem), '_blank');
        successMsg.classList.remove('show');
    }, 3000);
});

// Gerar PDF COMPLETO (com todas as melhorias)
async function gerarPDF(dados) {
    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();
    
    const faturamento = dados.simulacao.faturamento;
    const roiMeses = Math.ceil(faturamento.roi.mesesParaROI);
    const cronograma = gerarCronogramaROI(faturamento);
    const estrategias = gerarEstrategias();
    
    // PÁGINA 1 - CAPA
    pdf.setFillColor(62, 44, 37);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(243, 226, 210);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(28);
    pdf.text('PLANO DE FATURAMENTO', 105, 80, { align: 'center' });
    pdf.text('PERSONALIZADO', 105, 95, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.text(dados.nome, 105, 120, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Laser CO2 Ultrapulsado com Microcoring', 105, 140, { align: 'center' });
    pdf.text('Reversi - Fismatek', 105, 150, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Simulacao gerada em: ' + new Date().toLocaleDateString('pt-BR'), 105, 170, { align: 'center' });
    
    pdf.setFillColor(199, 169, 126);
    pdf.rect(30, 190, 150, 25, 'F');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONDICAO ESPECIAL DE LANCAMENTO', 105, 200, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Valida ate 24/10/2025', 105, 208, { align: 'center' });
    
    // PÁGINA 2 - RESUMO EXECUTIVO
    pdf.addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('SEU POTENCIAL DE FATURAMENTO', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 80, 35);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DA SUA SIMULACAO', 20, 50);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Categoria: ' + state.categoria.toUpperCase(), 25, 58);
    pdf.text('Procedimentos mensais: ' + state.procedimentosMes, 25, 65);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEUS RESULTADOS PROJETADOS', 20, 85);
    
    pdf.setFillColor(243, 226, 210);
    pdf.rect(20, 90, 170, 85, 'F');
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(1);
    pdf.rect(20, 90, 170, 85, 'S');
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Faturamento Mensal:', 30, 103);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.mensal), 30, 112);
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Faturamento Anual:', 30, 127);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.anual), 30, 136);
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Lucro Liquido Mensal:', 30, 151);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.roi.lucroMensal), 30, 160);
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ROI (Retorno):', 120, 103);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text(roiMeses + ' meses', 120, 115);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ANALISE:', 20, 190);
    pdf.setFont('helvetica', 'normal');
    const periodo = roiMeses <= 12 ? '1 ano' : Math.ceil(roiMeses/12) + ' anos';
    const analise = 'Com base na sua simulacao, seu investimento se paga em menos de ' + periodo + ', gerando um lucro liquido superior a ' + formatarMoeda(faturamento.roi.lucroMensal * 12) + ' no primeiro ano.';
    const splitAnalise = pdf.splitTextToSize(analise, 170);
    pdf.text(splitAnalise, 20, 198);
    
    // PÁGINA 3 - CRONOGRAMA ROI DETALHADO
    pdf.addPage();
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('CRONOGRAMA DE ROI', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 75, 35);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Projecao mes a mes do seu retorno sobre investimento', 20, 45);
    
    // Cabeçalho da tabela
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, 55, 170, 10, 'F');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MES', 25, 62);
    pdf.text('FATURAMENTO', 45, 62);
    pdf.text('CUSTOS', 85, 62);
    pdf.text('LUCRO', 115, 62);
    pdf.text('ACUMULADO', 145, 62);
    
    // Linhas da tabela
    let y = 72;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    
    cronograma.forEach(function(linha, index) {
        pdf.setTextColor(62, 44, 37);
        
        if (index % 2 === 0) {
            pdf.setFillColor(243, 226, 210);
            pdf.rect(20, y - 5, 170, 8, 'F');
        }
        
        pdf.text(String(linha.mes), 25, y);
        pdf.text(formatarMoeda(linha.faturamento), 45, y);
        pdf.text(formatarMoeda(linha.custos), 85, y);
        pdf.text(formatarMoeda(linha.lucro), 115, y);
        
        if (linha.roi) {
            pdf.setTextColor(34, 139, 34);
            pdf.setFont('helvetica', 'bold');
        } else {
            pdf.setTextColor(178, 34, 34);
        }
        pdf.text(formatarMoeda(linha.acumulado), 145, y);
        
        pdf.setFont('helvetica', 'normal');
        y += 8;
    });
    
    // Legenda
    pdf.setFontSize(8);
    pdf.setTextColor(34, 139, 34);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Verde: ROI atingido', 20, y + 10);
    pdf.setTextColor(178, 34, 34);
    pdf.text('Vermelho: Periodo de recuperacao', 20, y + 16);
    
    // PÁGINA 4 - BREAKDOWN DETALHADO
    pdf.addPage();
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('ANALISE DETALHADA', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 75, 35);
    
    // Faturamento por tipo
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FATURAMENTO POR TIPO DE PROCEDIMENTO', 20, 50);
    
    pdf.setFillColor(243, 226, 210);
    pdf.rect(20, 55, 170, 35, 'F');
    pdf.setDrawColor(199, 169, 126);
    pdf.rect(20, 55, 170, 35, 'S');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(62, 44, 37);
    pdf.text('Face Sublime (Microcoring):', 25, 65);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.porTipo.faceSublime) + '/mes', 120, 65);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(62, 44, 37);
    pdf.text('Procedimentos Cirurgicos:', 25, 75);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.porTipo.cirurgicos) + '/mes', 120, 75);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(62, 44, 37);
    pdf.text('Outros Tratamentos:', 25, 85);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(199, 169, 126);
    pdf.text(formatarMoeda(faturamento.porTipo.outros) + '/mes', 120, 85);
    
    // Custos operacionais
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CUSTOS OPERACIONAIS MENSAIS', 20, 105);
    
    pdf.setFillColor(243, 226, 210);
    pdf.rect(20, 110, 170, 45, 'F');
    pdf.setDrawColor(199, 169, 126);
    pdf.rect(20, 110, 170, 45, 'S');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Insumos e Materiais (8%):', 25, 120);
    pdf.text(formatarMoeda(faturamento.custos.insumos), 120, 120);
    
    pdf.text('Marketing e Divulgacao (5%):', 25, 130);
    pdf.text(formatarMoeda(faturamento.custos.marketing), 120, 130);
    
    pdf.text('Administrativo (3%):', 25, 140);
    pdf.text(formatarMoeda(faturamento.custos.administrativo), 120, 140);
    
    pdf.text('Financiamento Equipamento:', 25, 150);
    pdf.text(formatarMoeda(faturamento.custos.financiamento), 120, 150);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(0.5);
    pdf.line(25, 153, 180, 153);
    pdf.text('TOTAL DE CUSTOS:', 25, 162);
    pdf.setTextColor(178, 34, 34);
    pdf.text(formatarMoeda(faturamento.custos.total), 120, 162);
    
    // Lucro líquido destacado
    pdf.setTextColor(34, 139, 34);
    pdf.setFontSize(12);
    pdf.text('LUCRO LIQUIDO MENSAL:', 25, 175);
    pdf.setFontSize(16);
    pdf.text(formatarMoeda(faturamento.roi.lucroMensal), 120, 175);
    
    // PÁGINA 5 - TABELA DE PRECIFICAÇÃO
    pdf.addPage();
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('TABELA DE PRECIFICACAO SUGERIDA', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 95, 35);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Valores de referencia para cada categoria', 20, 45);
    
    // Cabeçalho
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, 55, 170, 10, 'F');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROCEDIMENTO', 25, 62);
    pdf.text('POPULAR', 85, 62);
    pdf.text('PREMIUM', 115, 62);
    pdf.text('LUXO', 155, 62);
    
    // Linhas
    const tabelaPrecos = [
        { nome: 'Face Sublime (Microcoring)', pop: 2000, prem: 3000, luxo: 5000 },
        { nome: 'Rejuvenescimento Facial', pop: 2500, prem: 4000, luxo: 6500 },
        { nome: 'Tratamento de Cicatrizes', pop: 1800, prem: 3000, luxo: 5000 },
        { nome: 'Procedimentos Cirurgicos', pop: 3000, prem: 5000, luxo: 8000 },
        { nome: 'Estrias e Textura', pop: 1500, prem: 2500, luxo: 4000 },
        { nome: 'Melasma e Manchas', pop: 1800, prem: 3000, luxo: 5000 }
    ];
    
    let yTable = 72;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    
    tabelaPrecos.forEach(function(item, index) {
        if (index % 2 === 0) {
            pdf.setFillColor(243, 226, 210);
            pdf.rect(20, yTable - 5, 170, 8, 'F');
        }
        
        pdf.setTextColor(62, 44, 37);
        pdf.text(item.nome, 25, yTable);
        pdf.text(formatarMoeda(item.pop), 85, yTable);
        pdf.text(formatarMoeda(item.prem), 115, yTable);
        pdf.text(formatarMoeda(item.luxo), 155, yTable);
        
        yTable += 8;
    });
    
    // Nota
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    const nota = 'Valores sugeridos baseados em pesquisa de mercado. Ajuste conforme seu posicionamento e regiao.';
    const splitNota = pdf.splitTextToSize(nota, 170);
    pdf.text(splitNota, 20, yTable + 10);
    
    // PÁGINA 6 - ESTRATÉGIAS 90 DIAS
    pdf.addPage();
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('PLANO DE ACAO - 90 DIAS', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 80, 35);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Seu roteiro completo para maximizar resultados', 20, 45);
    
    let yEst = 60;
    
    // Mês 1
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, yEst - 5, 170, 8, 'F');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(62, 44, 37);
    pdf.text(estrategias.mes1.titulo, 25, yEst);
    yEst += 10;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    estrategias.mes1.acoes.forEach(function(acao) {
        const splitAcao = pdf.splitTextToSize('- ' + acao, 165);
        pdf.text(splitAcao, 25, yEst);
        yEst += splitAcao.length * 5;
    });
    
    yEst += 5;
    
    // Mês 2
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, yEst - 5, 170, 8, 'F');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(estrategias.mes2.titulo, 25, yEst);
    yEst += 10;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    estrategias.mes2.acoes.forEach(function(acao) {
        const splitAcao = pdf.splitTextToSize('- ' + acao, 165);
        pdf.text(splitAcao, 25, yEst);
        yEst += splitAcao.length * 5;
    });
    
    yEst += 5;
    
    // Mês 3
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, yEst - 5, 170, 8, 'F');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(estrategias.mes3.titulo, 25, yEst);
    yEst += 10;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    estrategias.mes3.acoes.forEach(function(acao) {
        const splitAcao = pdf.splitTextToSize('- ' + acao, 165);
        pdf.text(splitAcao, 25, yEst);
        yEst += splitAcao.length * 5;
    });
    
    // Destaque
    pdf.setFillColor(243, 226, 210);
    pdf.rect(20, yEst + 5, 170, 15, 'F');
    pdf.setDrawColor(199, 169, 126);
    pdf.rect(20, yEst + 5, 170, 15, 'S');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('IMPORTANTE: Acompanhe os indicadores semanalmente e ajuste as', 25, yEst + 12);
    pdf.text('estrategias conforme necessario para otimizar seus resultados.', 25, yEst + 17);
    
    // PÁGINA 7 - INVESTIMENTO
    pdf.addPage();
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('INFORMACOES DO INVESTIMENTO', 20, 30);
    
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 100, 35);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Valor Total: R$ 229.900,00', 20, 55);
    pdf.text('Entrada: R$ 10.000,00', 20, 65);
    pdf.text('36x de R$ 6.108,00 sem juros', 20, 75);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lucro Mensal: ' + formatarMoeda(faturamento.roi.lucroMensal), 20, 95);
    
    pdf.setFillColor(199, 169, 126);
    pdf.rect(20, 110, 170, 25, 'F');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(13);
    pdf.text('CONDICAO ESPECIAL DE LANCAMENTO', 105, 120, { align: 'center' });
    pdf.setFontSize(11);
    pdf.text('Valida ate 24/10/2025', 105, 128, { align: 'center' });
    
    // Contatos
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROXIMOS PASSOS:', 20, 155);
    pdf.setFont('helvetica', 'normal');
    pdf.text('WhatsApp: (62) 98316-0209', 20, 165);
    pdf.text('Email: vendasrennovari7@gmail.com', 20, 172);
    
    // PÁGINA FINAL - RESUMO
    pdf.addPage();
    pdf.setFillColor(62, 44, 37);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(243, 226, 210);
    pdf.setFontSize(20);
    pdf.setFont('times', 'bold');
    pdf.text('SEU RESUMO EM NUMEROS', 105, 80, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Investimento: R$ 229.900', 105, 110, { align: 'center' });
    pdf.setTextColor(199, 169, 126);
    pdf.setFontSize(16);
    pdf.text('Faturamento Ano 1: ' + formatarMoeda(faturamento.anual), 105, 130, { align: 'center' });
    pdf.text('ROI: ' + roiMeses + ' meses', 105, 150, { align: 'center' });
    
    pdf.setTextColor(243, 226, 210);
    pdf.setFontSize(11);
    pdf.text('Reversi - Fismatek', 105, 240, { align: 'center' });
    pdf.text('(62) 98316-0209', 105, 250, { align: 'center' });
    
    // Salvar PDF
    const nomeArquivo = 'Plano_Reversi_' + dados.nome.replace(/\s+/g, '_') + '.pdf';
    pdf.save(nomeArquivo);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    iniciarContador();
    atualizarResultados();
});

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
    
    const lucroMensal = faturamentoMensal - investimento.parcela;
    const mesesParaROI = investimento.total / lucroMensal;

    return {
        mensal: faturamentoMensal,
        anual: faturamentoAnual,
        porTipo: {
            faceSublime: faturamentoFace,
            cirurgicos: faturamentoCirurgicos,
            outros: faturamentoOutros
        },
        roi: {
            lucroMensal,
            mesesParaROI: mesesParaROI > 0 ? mesesParaROI : 0
        }
    };
}

// Atualizar UI
function atualizarResultados() {
    const faturamento = calcularFaturamento();
    
    document.getElementById('result-mensal').textContent = formatarMoeda(faturamento.mensal);
    document.getElementById('result-mensal-desc').textContent = 'Baseado em ' + state.procedimentosMes + ' procedimentos/mês';
    document.getElementById('result-anual').textContent = formatarMoeda(faturamento.anual);
    document.getElementById('result-roi').textContent = faturamento.roi.mesesParaROI > 0 ? 
        Math.ceil(faturamento.roi.mesesParaROI) + ' meses' : 'N/A';
    document.getElementById('result-lucro').textContent = formatarMoeda(faturamento.roi.lucroMensal);
    
    document.getElementById('breakdown-face').textContent = formatarMoeda(faturamento.porTipo.faceSublime) + '/mês';
    document.getElementById('breakdown-cirurgicos').textContent = formatarMoeda(faturamento.porTipo.cirurgicos) + '/mês';
    document.getElementById('breakdown-outros').textContent = formatarMoeda(faturamento.porTipo.outros) + '/mês';
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
        const mensagem = 'Olá! Acabei de baixar meu Plano de Faturamento Reversi. Gostaria de mais informações sobre a condição de lançamento (válida até 24/10/2025).';
        window.open('https://wa.me/5562983160209?text=' + encodeURIComponent(mensagem), '_blank');
        successMsg.classList.remove('show');
    }, 3000);
});

// Gerar PDF (identidade visual sofisticada, sem emojis, sem spread operator)
async function gerarPDF(dados) {
    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();
    
    const faturamento = dados.simulacao.faturamento;
    const roiMeses = Math.ceil(faturamento.roi.mesesParaROI);
    
    // Página 1 - Capa
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
    
    // Box condição especial
    pdf.setFillColor(199, 169, 126);
    pdf.rect(30, 190, 150, 25, 'F');
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONDICAO ESPECIAL DE LANCAMENTO', 105, 200, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Valida ate 24/10/2025', 105, 208, { align: 'center' });
    
    // Página 2 - Resumo Executivo
    pdf.addPage();
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, 'F');
    
    pdf.setTextColor(62, 44, 37);
    pdf.setFontSize(22);
    pdf.setFont('times', 'bold');
    pdf.text('SEU POTENCIAL DE FATURAMENTO', 20, 30);
    
    // Linha decorativa
    pdf.setDrawColor(199, 169, 126);
    pdf.setLineWidth(2);
    pdf.line(20, 35, 80, 35);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DA SUA SIMULACAO', 20, 50);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Categoria: ' + state.categoria.toUpperCase(), 25, 58);
    pdf.text('Procedimentos mensais: ' + state.procedimentosMes, 25, 65);
    
    // Resultados
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEUS RESULTADOS PROJETADOS', 20, 85);
    
    // Box com resultados
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
    
    // Análise
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ANALISE:', 20, 190);
    pdf.setFont('helvetica', 'normal');
    const periodo = roiMeses <= 12 ? '1 ano' : Math.ceil(roiMeses/12) + ' anos';
    const analise = 'Com base na sua simulacao, seu investimento se paga em menos de ' + periodo + ', gerando um lucro liquido superior a ' + formatarMoeda(faturamento.roi.lucroMensal * 12) + ' no primeiro ano.';
    const splitAnalise = pdf.splitTextToSize(analise, 170);
    pdf.text(splitAnalise, 20, 198);
    
    // Página 3 - Investimento
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
    
    // Página final
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
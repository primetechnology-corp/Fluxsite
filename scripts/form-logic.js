document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credit-form');
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        step5: document.getElementById('step5'),
    };
    const messages = {
        contratoNao: document.getElementById('msg-contrato-nao'),
        porteMei: document.getElementById('msg-porte-mei'),
        faturamentoBaixo: document.getElementById('msg-faturamento-baixo'),
        final: document.getElementById('msg-final'),
    };

    // Função para esconder todos os passos e mensagens
    const hideAll = () => {
        Object.values(steps).forEach(step => step.classList.remove('active'));
        Object.values(messages).forEach(msg => msg.style.display = 'none');
    };

    // Função para mostrar um passo específico
    const showStep = (stepId) => {
        hideAll();
        if (steps[stepId]) {
            steps[stepId].classList.add('active');
        }
    };

    // Função para mostrar uma mensagem específica
    const showMessage = (messageId) => {
        hideAll();
        if (messages[messageId]) {
            messages[messageId].style.display = 'block';
        }
    };
    
    // Adiciona listeners para os botões de rádio
    form.querySelectorAll('input[name="contrato"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'sim') {
                showStep('step2');
            } else {
                showMessage('contratoNao');
            }
        });
    });

    form.querySelectorAll('input[name="porte"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'mei') {
                showMessage('porteMei');
            } else {
                showStep('step3');
            }
        });
    });

    form.querySelectorAll('input[name="faturamento"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'ate_100k') {
                showMessage('faturamentoBaixo');
            } else {
                showStep('step4');
            }
        });
    });

    // Listener para o envio do formulário
    form.addEventListener('submit', (event) => {
        const activeStep = document.querySelector('.form-step.active');
        
        // Se estamos no passo 4, prevenimos o envio e vamos para o passo 5
        if (activeStep && activeStep.id === 'step4') {
            event.preventDefault(); // Previne o envio para poder mostrar o próximo passo
            showStep('step5');
        }
        // Se estivermos no passo 5 (ou qualquer outro passo final), o formulário será enviado normalmente,
        // pois não chamamos event.preventDefault().
    });

    // Garante que o formulário e a primeira etapa estejam visíveis ao carregar
    form.style.display = 'block';
    showStep('step1');
});
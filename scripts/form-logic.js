document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credit-form');
    const WORKER_URL = 'https://send-email.devops-2aa.workers.dev/'; 

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

    const hideAll = () => {
        Object.values(steps).forEach(step => step.classList.remove('active'));
        Object.values(messages).forEach(msg => msg.style.display = 'none');
    };

    const showStep = (stepId) => {
        hideAll();
        if (steps[stepId]) steps[stepId].classList.add('active');
    };

    const showMessage = (messageId) => {
        hideAll();
        if (messages[messageId]) messages[messageId].style.display = 'block';
    };

    // --- Lógica de Navegação Corrigida ---

    // Passo 1: Contrato Ativo (Verifica "Sim" com S maiúsculo)
    form.querySelectorAll('input[name="contrato"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Sim') { 
                showStep('step2');
            } else {
                showMessage('contratoNao');
            }
        });
    });

    // Passo 2: Porte (Verifica "MEI")
    form.querySelectorAll('input[name="porte"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'MEI') {
                showMessage('porteMei');
            } else {
                showStep('step3');
            }
        });
    });

    // Passo 3: Faturamento (Verifica "Até R$ 100 mil")
    form.querySelectorAll('input[name="faturamento"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Até R$ 100 mil') {
                showMessage('faturamentoBaixo');
            } else {
                showStep('step4');
            }
        });
    });

    // Passo 4 para 5
    const btnToStep5 = document.getElementById('btn-to-step5');
    if (btnToStep5) {
        btnToStep5.addEventListener('click', () => {
            const inputsPasso4 = steps.step4.querySelectorAll('input[required]');
            let formValido = true;
            inputsPasso4.forEach(input => {
                if (!input.value.trim()) {
                    formValido = false;
                    input.style.borderColor = "red";
                } else {
                    input.style.borderColor = "#ddd";
                }
            });
            if (formValido) showStep('step5');
            else alert("Preencha os campos obrigatórios.");
        });
    }

    // Envio Final
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const btnFinal = document.getElementById('btn-final');
        btnFinal.disabled = true;
        btnFinal.innerText = "Enviando...";

        const formData = new FormData(form);

        try {
            // Worker (Google Drive)
            await fetch(WORKER_URL, { method: 'POST', body: formData });

            // FormSubmit (E-mail)
            const emailRes = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (emailRes.ok) {
                showMessage('final');
                setTimeout(() => {
                    const nextUrl = form.querySelector('input[name="_next"]').value;
                    window.location.href = nextUrl;
                }, 3000);
            }
        } catch (error) {
            alert("Erro: " + error.message);
            btnFinal.disabled = false;
            btnFinal.innerText = "Tentar Novamente";
        }
    });
});
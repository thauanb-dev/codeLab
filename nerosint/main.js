/**
 * @template {Element} T
 * @param {string} sel
 * @returns {T | null}
 */
const $ = (sel) => document.querySelector(sel);
/**
 * @template {Element} T
 * @param {string} sel
 * @returns {NodeListOf<T>}
 */
const $$ = (sel) => document.querySelectorAll(sel);

/** verifica se o CNPJ está no formato correto (14 dígitos numéricos)
 * @param {string} cnpj
 * @returns {boolean}
 */
function isValidCNPJ(cnpj){
    const regex = /^\d{14}$/;
    return regex.test(cnpj);
}
/** exibe uma mensagem temporária no terminal
 * @param {string} message
 * @param {number} timeout
 * @param {string} [color]
 */
function tempMessage(message, color, timeout = 5000) {
    terminalMessage.textContent = message;
    terminalMessage.style.color = color || 'var(--text)';
    setTimeout(() => {
        terminalMessage.textContent = "";
    }, timeout);
}

/* exibe uma mensagem no terminal
 * @param {string} message
 * @param {string} [color]
 */
function terminalLog(message,color){
    terminalMessage.textContent = message;
    terminalMessage.style.color = color || 'var(--text)';
}

const terminalInput = $('.terminal-input');
const terminalMessage = $('.terminal-message');
const form = $('.terminal-form');


form.addEventListener('submit', (e) => {
    e.preventDefault(); //impede o comportamento padrão do formulário (recarregar a página)
    const resp = terminalInput.value.trim().split(' ');
    const command = resp[0].trim().toLowerCase();
    const commandList = ['cnpj', 'help', 'clear'];
    console.log(resp)

    if (!commandList.includes(command)) {
        tempMessage('Comando inválido, digite "help" para ver os comandos disponíveis...','var(--danger)');
    }

    if (command == 'help') {
        terminalLog(`Comandos disponíveis: \n
                cnpj -> consulta de CNPJ \n
                clear -> limpar terminal

            `);
    }
    if (command =='cnpj'){
        const cnpj = resp[1];
        if (!cnpj) {
                tempMessage('Informe um CNPJ para consulta...','var(--danger)');
                return;
                }
        if (isValidCNPJ(cnpj)) {
            tempMessage('Pesquisando CNPJ '+cnpj);
        } else {
            tempMessage('CNPJ no formato inválido 🤨, tente novamente..','var(--warning)');
        }
    }

});

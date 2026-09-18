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
    console.log(resp)

    if (command =='cnpj'){
        if (isValidCNPJ(resp[1])) {
            tempMessage('Pesquisando CNPJ '+resp[1]);
        } else {
            tempMessage('CNPJ no formato inválido 🤨, tente novamente..','var(--warning)');
        }
    }

});

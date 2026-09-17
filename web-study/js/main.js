document.querySelector('#btn-cnpj').addEventListener('click', async () => {
    const cnpj = document.querySelector('#cnpj-input').value.replace(/\D/g, '');
    const div = document.querySelector('#cnpj-resultado');
    div.textContent = 'Carregando...';
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const data = await res.json();
    div.textContent = JSON.stringify(data, null, 2);
});

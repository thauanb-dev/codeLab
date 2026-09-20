export default function Commands() {
  return (
    <div className="commands">

      <div className="commands-header">
        <h2>Comandos</h2>
        <p>Comandos disponíveis no NeroSINT</p>
      </div>

      <div className="commands-list">

        <div className="command-item">
          <span className="command-name">help</span>
          <span className="command-description">
            Exibe os comandos disponíveis
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">cls</span>
          <span className="command-description">
            Limpa o terminal
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">cnpj &lt;número&gt;</span>
          <span className="command-description">
            Consulta um CNPJ
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">cep &lt;número&gt;</span>
          <span className="command-description">
            Consulta um CEP
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">ip &lt;endereço&gt;</span>
          <span className="command-description">
            Consulta um endereço IP
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">domain &lt;domínio&gt;</span>
          <span className="command-description">
            Consulta informações de um domínio
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">dns &lt;domínio&gt;</span>
          <span className="command-description">
            Consulta registros DNS
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">whois &lt;domínio&gt;</span>
          <span className="command-description">
            Consulta informações WHOIS
          </span>
        </div>

        <div className="command-item">
          <span className="command-name">search &lt;termo&gt;</span>
          <span className="command-description">
            Pesquisa um termo
          </span>
        </div>

      </div>

    </div>
  );
}

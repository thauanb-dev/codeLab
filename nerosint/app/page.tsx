"use client"
import { useState } from "react";
import {Eraser} from 'lucide-react';

type Command = {
  input: string;
  output: string;
}
type CommandResult = {
  output: string;
  action?: "cls";
};

const defaultResponse = {
    "uf": "BA",
    "cep": "41820770",
    "qsa": [
        {
            "pais": null,
            "nome_socio": "MARCELO ALEXIM SILVA MENEZES",
            "codigo_pais": null,
            "faixa_etaria": "Entre 41 a 50 anos",
            "cnpj_cpf_do_socio": "***194575**",
            "qualificacao_socio": "Sócio-Administrador",
            "codigo_faixa_etaria": 5,
            "data_entrada_sociedade": "2008-11-04",
            "identificador_de_socio": 2,
            "cpf_representante_legal": "***000000**",
            "nome_representante_legal": "",
            "codigo_qualificacao_socio": 49,
            "qualificacao_representante_legal": "Não informada",
            "codigo_qualificacao_representante_legal": 0
        },
        {
            "pais": null,
            "nome_socio": "MARISE MENEZES PAIM",
            "codigo_pais": null,
            "faixa_etaria": "Entre 41 a 50 anos",
            "cnpj_cpf_do_socio": "***053595**",
            "qualificacao_socio": "Sócio",
            "codigo_faixa_etaria": 5,
            "data_entrada_sociedade": "2004-10-14",
            "identificador_de_socio": 2,
            "cpf_representante_legal": "***000000**",
            "nome_representante_legal": "",
            "codigo_qualificacao_socio": 22,
            "qualificacao_representante_legal": "Não informada",
            "codigo_qualificacao_representante_legal": 0
        }
    ],
    "cnpj": "07038163000102",
    "pais": null,
    "email": null,
    "porte": "DEMAIS",
    "bairro": "CAMINHO DAS ARVORES",
    "numero": "000314",
    "ddd_fax": "",
    "municipio": "SALVADOR",
    "logradouro": "ALCEU AMOROSO LIMA",
    "cnae_fiscal": 4645101,
    "codigo_pais": null,
    "complemento": "EDIF ANTARES EMPRESARIAL SALA 701 A705 E 713",
    "codigo_porte": 5,
    "razao_social": "VIPMEDIC PRODUTOS MEDICO-HOSPITALAR LTDA",
    "nome_fantasia": "VIPMEDIC",
    "capital_social": 1000000,
    "ddd_telefone_1": "7131720700",
    "ddd_telefone_2": "",
    "opcao_pelo_mei": false,
    "codigo_municipio": 3849,
    "cnaes_secundarios": [],
    "natureza_juridica": "Sociedade Empresária Limitada",
    "regime_tributario": [
        {
            "ano": 2019,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        },
        {
            "ano": 2020,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        },
        {
            "ano": 2021,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        },
        {
            "ano": 2022,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        },
        {
            "ano": 2023,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        },
        {
            "ano": 2024,
            "cnpj_da_scp": null,
            "forma_de_tributacao": "LUCRO PRESUMIDO",
            "quantidade_de_escrituracoes": 1
        }
    ],
    "situacao_especial": "",
    "opcao_pelo_simples": false,
    "situacao_cadastral": 2,
    "data_opcao_pelo_mei": null,
    "data_exclusao_do_mei": null,
    "cnae_fiscal_descricao": "Comércio atacadista de instrumentos e materiais para uso médico, cirúrgico, hospitalar e de laboratórios",
    "codigo_municipio_ibge": 2927408,
    "data_inicio_atividade": "2004-10-14",
    "data_situacao_especial": null,
    "data_opcao_pelo_simples": "2007-07-01",
    "data_situacao_cadastral": null,
    "nome_cidade_no_exterior": "",
    "codigo_natureza_juridica": 2062,
    "data_exclusao_do_simples": "2007-07-01",
    "motivo_situacao_cadastral": 0,
    "ente_federativo_responsavel": "",
    "identificador_matriz_filial": 1,
    "qualificacao_do_responsavel": 49,
    "descricao_situacao_cadastral": "ATIVA",
    "descricao_tipo_de_logradouro": "RUA",
    "descricao_motivo_situacao_cadastral": "SEM MOTIVO",
    "descricao_identificador_matriz_filial": "MATRIZ"
}

export default function Home() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<Command[]>([]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();

    const result = await processCommand(command);

    if (result.action === "cls") {
      clearHistory();
      setCommand("");
      return;
    }

    const newCommand: Command = {
      input: command,
      output: result.output
    };
    setHistory([...history, newCommand])
  }
  function clearHistory() {
  setHistory([]);
  }
  function clearCNPJ(cnpj: string){
    return cnpj.replace(/\D/g, '');
  }
  function formatCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}
function isValidCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let sum = 0;
  let weight = 5;

  for (let i = 0; i < 12; i++) {
    sum += Number(cnpj[i]) * weight;
    weight--;

    if (weight === 1) {
      weight = 9;
    }
  }

  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;

  if (Number(cnpj[12]) !== firstDigit) {
    return false;
  }

  sum = 0;
  weight = 6;

  for (let i = 0; i < 13; i++) {
    sum += Number(cnpj[i]) * weight;
    weight--;

    if (weight === 1) {
      weight = 9;
    }
  }

  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;

  return Number(cnpj[13]) === secondDigit;
}

  async function cnpjCheck(args: string[]) : Promise<CommandResult>{
    if (!args[0]) {
    return {
      output: "Uso: cnpj <número do CNPJ>"
    };
  }
    if (!isValidCNPJ(clearCNPJ(args[0]))) {
      return {
        output: "CNPJ inválido. Certifique-se de fornecer um CNPJ válido."
      };
    }
    
    const cnpj = clearCNPJ(args[0]);
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;


    const response = await fetch(url)
    const data  = await response.json()
    // const data = defaultResponse
    console.log(data)

    return {
      output: `
    ╔══════════════════════════════════════════════════════════════╗
    ║                    RESULTADO — CNPJ                         ║
    ╚══════════════════════════════════════════════════════════════╝

    [ IDENTIFICAÇÃO ]
    CNPJ           : ${formatCnpj(data.cnpj)}
    Razão Social   : ${data.razao_social}
    Nome Fantasia  : ${data.nome_fantasia}
    Situação       : ${data.descricao_situacao_cadastral}
    Natureza       : ${data.natureza_juridica}
    Porte          : ${data.porte}

    [ ENDEREÇO ]
    Logradouro     : ${data.descricao_tipo_de_logradouro} ${data.logradouro}, ${data.numero}
    Complemento    : ${data.complemento}
    Bairro         : ${data.bairro}
    Município      : ${data.municipio}/${data.uf}
    CEP            : ${data.cep}

    [ ATIVIDADE ]
    CNAE           : ${data.cnae_fiscal_descricao}

    [ CONTATO ]
    Telefone       : ${data.ddd_telefone_1}
    E-mail         : ${data.email ?? "Não informado"}

    ──────────────────────────────────────────────────────────────
    `
    };

  }

async function processCommand(command: string) : Promise<CommandResult> {
  const normalizedCommand = command.trim().toLowerCase();
  const [commandName, ...args] = normalizedCommand.split(/\s+/);
  switch (commandName) {
    case "help":
      return { output: "Comandos disponíveis" };
    case "cls":
      return  { output: "Limpar histórico", action: "cls" };
    case "cnpj":
      return cnpjCheck(args)
    default:
      return  { output: "Comando não encontrado" };
  }
}

  return (
    <main>
      <header className="app-header">
        <div className="logo">
          <span className="logo-symbol">▣</span>
          <h1>NeroSINT</h1>
          <span className="version">v0.1.0</span>
        </div>
          <span className="header-description">
            OSINT // INVESTIGATE // CONNECT
          </span>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <h2>Entidades</h2>
          <nav>
            <button className="active">Busca</button>
            <button>Pessoas</button>
            <button>Empresas</button>
            <button>Endereços</button>
            <button>Telefones</button>
            <button>E-mails</button>
          </nav>
        </aside>

        <section className="workspace">
          <div className="terminal">
            <div className="terminal-header">
              <span>NEROSINT TERMINAL</span>
                {history.length > 0 &&
                    (
                      <button className="clear-button" onClick={clearHistory} type="button">
                        <Eraser className="h-4 w-4"/>
                      </button>
                    )
                }
            </div>
            <div className="terminal-body">
              {
                history.map((item,index) => (
                    <div key={index}>
                      <span className="prompt-history">nerosint:~$</span>{" "}
                      <span className="prompt-history">{item.input}</span>

                      <div className="command-output">
                        {`> ${item.output}`}
                      </div>
                    </div>
                ))
              }
              <form className="terminal-form"
                    onSubmit={handleSubmit}>
                <span className="prompt">nerosint:~$</span>
                <input
                  type="text"
                  className="terminal-input"
                  placeholder="digite um comando"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}/>
              </form>
              {history.length === 0 && (
                <p className="terminal-message">
                  Sistema aguardando consulta...
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client"
import { useState } from "react";
import {Eraser} from 'lucide-react';
import Commands from "./components/Commands";

type Command = {
  input: string;
  output: string;
}
type CommandResult = {
  output: string;
  action?: "cls";
};

export default function Home() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<Command[]>([]);
  const [view, setView] = useState<"terminal" | "commands">("terminal");

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
        ╔══════════════════════════════════════════════════════════════════╗
        ║                       RESULTADO — CNPJ                          ║
        ╚══════════════════════════════════════════════════════════════════╝

        [ IDENTIFICAÇÃO ]

          CNPJ                     : ${formatCnpj(data.cnpj)}
          Razão Social             : ${data.razao_social}
          Nome Fantasia            : ${data.nome_fantasia}
          Matriz/Filial             : ${data.descricao_identificador_matriz_filial}
          Situação Cadastral       : ${data.descricao_situacao_cadastral}
          Motivo Situação          : ${data.descricao_motivo_situacao_cadastral}
          Situação Especial         : ${data.situacao_especial || "Não informado"}
          Data Situação             : ${data.data_situacao_cadastral || "Não informado"}
          Data Situação Especial    : ${data.data_situacao_especial || "Não informado"}

        [ NATUREZA JURÍDICA ]

          Natureza                  : ${data.natureza_juridica}
          Código                    : ${data.codigo_natureza_juridica}
          Qualificação Responsável  : ${data.qualificacao_do_responsavel}

        [ PORTE E CAPITAL ]

          Porte                     : ${data.porte}
          Código do Porte           : ${data.codigo_porte}
          Capital Social            : R$ ${Number(data.capital_social).toLocaleString("pt-BR", {
              minimumFractionDigits: 2
            })}

        [ ATIVIDADE PRINCIPAL ]

          CNAE                      : ${data.cnae_fiscal}
          Descrição                 : ${data.cnae_fiscal_descricao}

        [ ENDEREÇO ]

          Tipo Logradouro           : ${data.descricao_tipo_de_logradouro}
          Logradouro                : ${data.logradouro}
          Número                    : ${data.numero}
          Complemento               : ${data.complemento || "Não informado"}
          Bairro                    : ${data.bairro}
          Município                 : ${data.municipio}
          UF                        : ${data.uf}
          CEP                       : ${data.cep}

          Código Município          : ${data.codigo_municipio}
          Código IBGE               : ${data.codigo_municipio_ibge}

        [ ATIVIDADE E DATAS ]

          Data Início Atividade     : ${data.data_inicio_atividade}

        [ REGIME TRIBUTÁRIO ]

        ${data.regime_tributario
          .map(
            (regime: {
              ano: number;
              forma_de_tributacao: string;
              quantidade_de_escrituracoes: number;
            }) =>
              `Ano ${regime.ano}                  : ${regime.forma_de_tributacao}
        Escriturações             : ${regime.quantidade_de_escrituracoes}`
          )
          .join("\n\n")}

        [ SIMPLES / MEI ]

          Optante pelo Simples     : ${data.opcao_pelo_simples ? "SIM" : "NÃO"}
          Data Opção Simples       : ${data.data_opcao_pelo_simples || "Não informado"}
          Data Exclusão Simples    : ${data.data_exclusao_do_simples || "Não informado"}

          Optante pelo MEI         : ${data.opcao_pelo_mei ? "SIM" : "NÃO"}
          Data Opção MEI           : ${data.data_opcao_pelo_mei || "Não informado"}
          Data Exclusão MEI        : ${data.data_exclusao_do_mei || "Não informado"}

        [ CONTATO ]

          Telefone 1               : ${data.ddd_telefone_1 || "Não informado"}
          Telefone 2               : ${data.ddd_telefone_2 || "Não informado"}
          Fax                       : ${data.ddd_fax || "Não informado"}
          E-mail                    : ${data.email || "Não informado"}

        [ RESPONSABILIDADE ]

          Ente Federativo           : ${data.ente_federativo_responsavel || "Não informado"}
          Qualificação Responsável  : ${data.qualificacao_do_responsavel}

        [ SOCIEDADE — QSA ]

        ${data.qsa
          .map(
            (socio: {
              nome_socio: string;
              cnpj_cpf_do_socio: string;
              qualificacao_socio: string;
              data_entrada_sociedade: string;
              faixa_etaria: string;
              nome_representante_legal: string;
              qualificacao_representante_legal: string;
            }, index: number) =>
              `Sócio ${index + 1}

          Nome                      : ${socio.nome_socio}
          CPF/CNPJ                  : ${socio.cnpj_cpf_do_socio}
          Qualificação              : ${socio.qualificacao_socio}
          Data Entrada              : ${socio.data_entrada_sociedade}
          Faixa Etária              : ${socio.faixa_etaria}
          Representante Legal       : ${socio.nome_representante_legal || "Não informado"}
          Qualificação Representante: ${socio.qualificacao_representante_legal}`
          )
          .join("\n\n")}

        [ OUTRAS INFORMAÇÕES ]

          País                      : ${data.pais || "Brasil"}
          Código País               : ${data.codigo_pais || "Não informado"}
          Nome Cidade Exterior      : ${data.nome_cidade_no_exterior || "Não informado"}
          Código Município          : ${data.codigo_municipio}
          Matriz/Filial              : ${data.identificador_matriz_filial}

        ══════════════════════════════════════════════════════════════════
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
          <button
            className={view === "terminal" ? "active" : ""}
            onClick={() => setView("terminal")}
          >
            Terminal
          </button>

          <button
            className={view === "commands" ? "active" : ""}
            onClick={() => setView("commands")}
          >
            Comandos
          </button>
        </nav>
      </aside>

      <section className="workspace">

        {view === "terminal" && (
          <div className="terminal">

            <div className="terminal-header">
              <span>NEROSINT TERMINAL</span>

              {history.length > 0 && (
                <button
                  className="clear-button"
                  onClick={clearHistory}
                  type="button"
                >
                  <Eraser className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="terminal-body">

              {history.map((item, index) => (
                <div key={index}>

                  <span className="prompt-history">
                    nerosint:~$
                  </span>{" "}

                  <span className="prompt-history">
                    {item.input}
                  </span>

                  <div className="command-output">
                    {`> ${item.output}`}
                  </div>

                </div>
              ))}

              <form
                className="terminal-form"
                onSubmit={handleSubmit}
              >
                <span className="prompt">
                  nerosint:~$
                </span>

                <input
                  type="text"
                  className="terminal-input"
                  placeholder="digite um comando"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
              </form>

              {history.length === 0 && (
                <p className="terminal-message">
                  Sistema aguardando consulta...
                </p>
              )}

            </div>

          </div>
        )}

        {view === "commands" && (
          <Commands/>
        )}

      </section>

    </div>

  </main>
);
}

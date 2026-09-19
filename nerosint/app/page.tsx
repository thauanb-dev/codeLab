"use client"
import { useState } from "react";

type Command = {
  input: string;
  output: string;
}

export default function Home() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<Command[]>([]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();

    const output = processCommand(command);
    console.log(output);

    const newCommand: Command = {
      input: command,
      output
    };
    setHistory([...history, newCommand])
  }
  function clearHistory() {
  setHistory([]);
}
function processCommand(command: string) {
  switch (command) {
    case "help":
      return "Comandos disponíveis";
    case "clear":
      return "Limpar histórico";
    default:
      return "Comando não encontrado";
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
              <button className="clear-button" onClick={clearHistory} type="button">Limpar</button>
            </div>
            <div className="terminal-body">
              {
                history.map((item,index) => (
                    <div key={index}>
                      <span className="prompt-history">nerosint:~$</span>{" "}
                      <span className="prompt-history">{item.input}</span>

                      <div className="command-output">
                        {item.output}
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

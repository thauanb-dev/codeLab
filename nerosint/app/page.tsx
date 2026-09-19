"use client"
import { useState } from "react";

type Command = {
  input: string;
}

export default function Home() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<Command[]>([]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    const newCommand: Command = {
      input: command,
    };
    setHistory([...history, newCommand])
    console.log(command);
  }
  function clearHistory() {
  setHistory([]);
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
              <button onClick={clearHistory} type="button">Limpar</button>
            </div>
            <div className="terminal-body">
              {
                history.map((item,index) => (
                    <div key={index}>
                      <span className="prompt-history">nerosint:~$</span>{" "}
                      <span className="prompt-history">{item.input}</span>
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

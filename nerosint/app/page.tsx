"use client"
import { useState } from "react";

export default function Home() {
  const [command, setCommand] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    console.log(command);
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
            </div>
            <div className="terminal-body">
              <form className="terminal-form"
                  onSubmit={handleSubmit}
              >
                <span className="prompt">nerosint:~$</span>
                <input
                  type="text"
                  className="terminal-input"
                  placeholder="digite um comando"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}

                />
              </form>
              <p className="terminal-message">
                Sistema aguardando consulta...
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

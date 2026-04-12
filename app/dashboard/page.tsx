"use client";
import { useState, useEffect } from "react";

type Projeto = { id: string; nome: string };
type Tarefa = { id: string; projeto_id: string; titulo: string; status: string };

export default function Dashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetoAtivo, setProjetoAtivo] = useState<Projeto | null>(null);
  const [showNovoProjeto, setShowNovoProjeto] = useState(false);
  const [showNovaTarefa, setShowNovaTarefa] = useState(false);
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [nomeTarefa, setNomeTarefa] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => { carregarProjetos(); }, []);

  async function carregarProjetos() {
    const res = await fetch("/api/projetos");
    const data = await res.json();
    if (data.projetos) {
      setProjetos(data.projetos);
      if (data.projetos.length > 0) {
        setProjetoAtivo(data.projetos[0]);
        carregarTarefas(data.projetos[0].id);
      }
    }
  }

  async function carregarTarefas(id: string) {
    const res = await fetch(`/api/tarefas?projeto_id=${id}`);
    const data = await res.json();
    if (data.tarefas) setTarefas(data.tarefas);
  }

  async function criarProjeto() {
    if (!nomeProjeto.trim()) return;
    setLoading(true);
    setErro("");
    const res = await fetch("/api/projetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeProjeto, descricao: "" }),
    });
    const data = await res.json();
    if (data.projeto) {
      setProjetos(p => [data.projeto, ...p]);
      setProjetoAtivo(data.projeto);
      setTarefas([]);
      setShowNovoProjeto(false);
      setNomeProjeto("");
    } else {
      setErro(data.error || "Erro ao criar projeto");
    }
    setLoading(false);
  }

  async function criarTarefa() {
    if (!nomeTarefa.trim() || !projetoAtivo) return;
    setLoading(true);
    const res = await fetch("/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: nomeTarefa, projeto_id: projetoAtivo.id }),
    });
    const data = await res.json();
    if (data.tarefa) {
      setTarefas(t => [...t, data.tarefa]);
      setShowNovaTarefa(false);
      setNomeTarefa("");
    }
    setLoading(false);
  }

  async function moverTarefa(id: string, status: string) {
    await fetch("/api/tarefas", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setTarefas(t => t.map(x => x.id === id ? { ...x, status } : x));
  }

  async function deletarTarefa(id: string) {
    await fetch(`/api/tarefas?id=${id}`, { method: "DELETE" });
    setTarefas(t => t.filter(x => x.id !== id));
  }

  const colunas = [
    { id: "a_fazer", label: "A fazer", cor: "#888" },
    { id: "em_progresso", label: "Em progresso", cor: "#378ADD" },
    { id: "concluido", label: "Concluido", cor: "#1D9E75" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "system-ui" }}>
      <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#5B4CF5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>F</div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>FlowMind</span>
        </div>
        <span style={{ fontSize: 12, background: "#E1F5EE", color: "#0F6E56", padding: "3px 10px", borderRadius: 20 }}>Acesso Vitalicio</span>
      </header>
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <div style={{ width: 220, background: "white", borderRight: "1px solid #eee", padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 8 }}>PROJETOS</div>
          {projetos.map(p => (
            <div key={p.id} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: projetoAtivo?.id === p.id ? "#5B4CF5" : "#444", background: projetoAtivo?.id === p.id ? "#EEEDFE" : "transparent" }} onClick={() => { setProjetoAtivo(p); carregarTarefas(p.id); }}>
              {p.nome}
            </div>
          ))}
          <div style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#5B4CF5", border: "1px dashed #c4c0f8", textAlign: "center", marginTop: 8 }} onClick={() => setShowNovoProjeto(true)}>+ Novo projeto</div>
        </div>
        <div style={{ flex: 1, padding: 24, overflow: "auto" }}>
          {projetoAtivo ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{projetoAtivo.nome}</div>
                <button style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={() => setShowNovaTarefa(true)}>+ Nova tarefa</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {colunas.map(col => {
                  const items = tarefas.filter(t => t.status === col.id);
                  return (
                    <div key={col.id} style={{ background: "#f0f0f0", borderRadius: 12, padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.cor }}></div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#666" }}>{col.label}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa", background: "white", padding: "1px 7px", borderRadius: 10 }}>{items.length}</span>
                      </div>
                      {items.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: "#bbb", fontSize: 12 }}>Nenhuma tarefa</div>}
                      {items.map(t => (
                        <div key={t.id} style={{ background: "white", border: "1px solid #eee", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                          <div style={{ fontSize: 13, marginBottom: 8 }}>{t.titulo}</div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {col.id !== "a_fazer" && <button style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid #ddd", background: "transparent", cursor: "pointer" }} onClick={() => moverTarefa(t.id, col.id === "em_progresso" ? "a_fazer" : "em_progresso")}>Voltar</button>}
                            {col.id !== "concluido" && <button style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid #c4c0f8", background: "transparent", cursor: "pointer", color: "#5B4CF5" }} onClick={() => moverTarefa(t.id, col.id === "a_fazer" ? "em_progresso" : "concluido")}>Avancar</button>}
                            <button style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid #fcc", background: "transparent", cursor: "pointer", color: "#e24b4a", marginLeft: "auto" }} onClick={() => deletarTarefa(t.id)}>X</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Crie seu primeiro projeto</div>
              <button style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }} onClick={() => setShowNovoProjeto(true)}>+ Criar projeto</button>
            </div>
          )}
        </div>
      </div>
      {showNovoProjeto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowNovoProjeto(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Novo projeto</div>
            {erro && <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{erro}</div>}
            <input style={{ width: "100%", height: 40, border: "1px solid #ddd", borderRadius: 8, padding: "0 12px", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }} placeholder="Nome do projeto" value={nomeProjeto} onChange={e => setNomeProjeto(e.target.value)} autoFocus />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, height: 40, border: "1px solid #ddd", borderRadius: 8, background: "transparent", fontSize: 14, cursor: "pointer" }} onClick={() => setShowNovoProjeto(false)}>Cancelar</button>
              <button style={{ flex: 2, height: 40, background: loading ? "#999" : "#5B4CF5", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }} onClick={criarProjeto} disabled={loading}>{loading ? "Criando..." : "Criar projeto"}</button>
            </div>
          </div>
        </div>
      )}
      {showNovaTarefa && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowNovaTarefa(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, width: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Nova tarefa</div>
            <input style={{ width: "100%", height: 40, border: "1px solid #ddd", borderRadius: 8, padding: "0 12px", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" }} placeholder="Nome da tarefa" value={nomeTarefa} onChange={e => setNomeTarefa(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && criarTarefa()} />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, height: 40, border: "1px solid #ddd", borderRadius: 8, background: "transparent", fontSize: 14, cursor: "pointer" }} onClick={() => setShowNovaTarefa(false)}>Cancelar</button>
              <button style={{ flex: 2, height: 40, background: loading ? "#999" : "#5B4CF5", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }} onClick={criarTarefa} disabled={loading}>{loading ? "Criando..." : "Criar tarefa"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

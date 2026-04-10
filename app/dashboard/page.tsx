"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Projeto = { id: string; nome: string; descricao: string; criado_em: string };
type Tarefa = { id: string; projeto_id: string; titulo: string; status: string };

export default function Dashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetoAtivo, setProjetoAtivo] = useState<Projeto | null>(null);
  const [showNovoProjeto, setShowNovoProjeto] = useState(false);
  const [showNovaTarefa, setShowNovaTarefa] = useState(false);
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [descProjeto, setDescProjeto] = useState("");
  const [nomeTarefa, setNomeTarefa] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { carregarProjetos(); }, []);
  useEffect(() => { if (projetoAtivo) carregarTarefas(projetoAtivo.id); }, [projetoAtivo]);

  async function carregarProjetos() {
    const { data } = await supabase.from("projetos").select("*").order("criado_em", { ascending: false });
    if (data) { setProjetos(data); if (data.length > 0) setProjetoAtivo(data[0]); }
  }

  async function carregarTarefas(projetoId: string) {
    const { data } = await supabase.from("tarefas").select("*").eq("projeto_id", projetoId);
    if (data) setTarefas(data);
  }

  async function criarProjeto() {
    if (!nomeProjeto.trim()) return;
    setLoading(true);
    const { data } = await supabase.from("projetos").insert({ nome: nomeProjeto, descricao: descProjeto, usuario_email: "usuario@flowmind.app" }).select().single();
    if (data) { setProjetos(p => [data, ...p]); setProjetoAtivo(data); setShowNovoProjeto(false); setNomeProjeto(""); setDescProjeto(""); }
    setLoading(false);
  }

  async function criarTarefa() {
    if (!nomeTarefa.trim() || !projetoAtivo) return;
    setLoading(true);
    const { data } = await supabase.from("tarefas").insert({ titulo: nomeTarefa, projeto_id: projetoAtivo.id, status: "a_fazer" }).select().single();
    if (data) { setTarefas(t => [...t, data]); setShowNovaTarefa(false); setNomeTarefa(""); }
    setLoading(false);
  }

  async function moverTarefa(id: string, novoStatus: string) {
    await supabase.from("tarefas").update({ status: novoStatus }).eq("id", id);
    setTarefas(t => t.map(t => t.id === id ? { ...t, status: novoStatus } : t));
  }

  async function deletarTarefa(id: string) {
    await supabase.from("tarefas").delete().eq("id", id);
    setTarefas(t => t.filter(t => t.id !== id));
  }

  const colunas = [
    { id: "a_fazer", label: "A fazer", cor: "#888780" },
    { id: "em_progresso", label: "Em progresso", cor: "#378ADD" },
    { id: "concluido", label: "Concluído", cor: "#1D9E75" },
  ];

  const s: Record<string, React.CSSProperties> = {
    app: { minHeight: "100vh", background: "#f5f5f5", fontFamily: "system-ui, sans-serif" },
    header: { background: "white", borderBottom: "1px solid #eee", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoIcon: { width: 28, height: 28, background: "#5B4CF5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 },
    logoName: { fontWeight: 600, fontSize: 15, color: "#1a1a1a" },
    badge: { fontSize: 12, background: "#E1F5EE", color: "#0F6E56", padding: "3px 10px", borderRadius: 20, fontWeight: 500 },
    body: { display: "flex", height: "calc(100vh - 56px)" },
    sidebar: { width: 220, background: "white", borderRight: "1px solid #eee", padding: 16, display: "flex", flexDirection: "column", gap: 8 },
    sideTitle: { fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 4 },
    projetoItem: { padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#444", transition: "all 0.15s" },
    projetoAtivo: { padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#5B4CF5", background: "#EEEDFE", fontWeight: 500 },
    addBtn: { padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#5B4CF5", background: "transparent", border: "1px dashed #c4c0f8", textAlign: "center" as const, marginTop: 4 },
    main: { flex: 1, padding: 24, overflow: "auto" },
    topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    pageTitle: { fontSize: 20, fontWeight: 700, color: "#1a1a1a" },
    pageSub: { fontSize: 13, color: "#aaa", marginTop: 2 },
    btnPrimary: { background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
    kanban: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
    col: { background: "#f0f0f0", borderRadius: 12, padding: 12 },
    colHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
    colDot: { width: 8, height: 8, borderRadius: "50%" },
    colTitle: { fontSize: 12, fontWeight: 600, color: "#666" },
    colCount: { marginLeft: "auto", fontSize: 11, color: "#aaa", background: "white", padding: "1px 7px", borderRadius: 10 },
    taskCard: { background: "white", border: "1px solid #eee", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
    taskTitle: { fontSize: 13, color: "#1a1a1a", marginBottom: 8 },
    taskActions: { display: "flex", gap: 4, flexWrap: "wrap" as const },
    taskBtn: { fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid #ddd", background: "transparent", cursor: "pointer", color: "#666" },
    taskDel: { fontSize: 10, padding: "2px 8px", borderRadius: 10, border: "1px solid #fcc", background: "transparent", cursor: "pointer", color: "#e24b4a", marginLeft: "auto" },
    emptyCol: { textAlign: "center" as const, padding: "20px 0", color: "#bbb", fontSize: 12 },
    overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
    modal: { background: "white", borderRadius: 16, padding: 28, width: 400, maxWidth: "90vw" },
    modalTitle: { fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 },
    input: { width: "100%", height: 40, border: "1px solid #ddd", borderRadius: 8, padding: "0 12px", fontSize: 14, marginBottom: 12, boxSizing: "border-box" as const, outline: "none", fontFamily: "system-ui" },
    modalBtns: { display: "flex", gap: 8, marginTop: 8 },
    btnCancel: { flex: 1, height: 40, border: "1px solid #ddd", borderRadius: 8, background: "transparent", fontSize: 14, cursor: "pointer", color: "#666" },
    btnSave: { flex: 2, height: 40, background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
    emptyState: { textAlign: "center" as const, padding: "60px 20px" },
    emptyIcon: { fontSize: 40, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 },
    emptyDesc: { fontSize: 14, color: "#888", marginBottom: 24 },
  };

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>F</div>
          <span style={s.logoName}>FlowMind</span>
        </div>
        <span style={s.badge}>Acesso Vitalício ✓</span>
      </header>

      <div style={s.body}>
        {/* SIDEBAR */}
        <div style={s.sidebar}>
          <div style={s.sideTitle}>Projetos</div>
          {projetos.map(p => (
            <div key={p.id} style={projetoAtivo?.id === p.id ? s.projetoAtivo : s.projetoItem} onClick={() => setProjetoAtivo(p)}>
              📋 {p.nome}
            </div>
          ))}
          <div style={s.addBtn} onClick={() => setShowNovoProjeto(true)}>+ Novo projeto</div>
        </div>

        {/* MAIN */}
        <div style={s.main}>
          {projetoAtivo ? (
            <>
              <div style={s.topRow}>
                <div>
                  <div style={s.pageTitle}>{projetoAtivo.nome}</div>
                  <div style={s.pageSub}>{projetoAtivo.descricao || "Sem descrição"}</div>
                </div>
                <button style={s.btnPrimary} onClick={() => setShowNovaTarefa(true)}>+ Nova tarefa</button>
              </div>

              <div style={s.kanban}>
                {colunas.map(col => {
                  const tarefasCol = tarefas.filter(t => t.status === col.id);
                  return (
                    <div key={col.id} style={s.col}>
                      <div style={s.colHeader}>
                        <div style={{ ...s.colDot, background: col.cor }}></div>
                        <span style={s.colTitle}>{col.label}</span>
                        <span style={s.colCount}>{tarefasCol.length}</span>
                      </div>
                      {tarefasCol.length === 0 && <div style={s.emptyCol}>Nenhuma tarefa</div>}
                      {tarefasCol.map(t => (
                        <div key={t.id} style={s.taskCard}>
                          <div style={s.taskTitle}>{t.titulo}</div>
                          <div style={s.taskActions}>
                            {col.id !== "a_fazer" && <button style={s.taskBtn} onClick={() => moverTarefa(t.id, col.id === "em_progresso" ? "a_fazer" : "em_progresso")}>← Voltar</button>}
                            {col.id !== "concluido" && <button style={{ ...s.taskBtn, color: "#5B4CF5", borderColor: "#c4c0f8" }} onClick={() => moverTarefa(t.id, col.id === "a_fazer" ? "em_progresso" : "concluido")}>Avançar →</button>}
                            <button style={s.taskDel} onClick={() => deletarTarefa(t.id)}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>📋</div>
              <div style={s.emptyTitle}>Crie seu primeiro projeto</div>
              <div style={s.emptyDesc}>Organize suas tarefas em um quadro Kanban com IA integrada.</div>
              <button style={s.btnPrimary} onClick={() => setShowNovoProjeto(true)}>+ Criar projeto</button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO PROJETO */}
      {showNovoProjeto && (
        <div style={s.overlay} onClick={() => setShowNovoProjeto(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Novo projeto</div>
            <input style={s.input} placeholder="Nome do projeto" value={nomeProjeto} onChange={e => setNomeProjeto(e.target.value)} autoFocus/>
            <input style={s.input} placeholder="Descrição (opcional)" value={descProjeto} onChange={e => setDescProjeto(e.target.value)}/>
            <div style={s.modalBtns}>
              <button style={s.btnCancel} onClick={() => setShowNovoProjeto(false)}>Cancelar</button>
              <button style={s.btnSave} onClick={criarProjeto} disabled={loading}>{loading ? "Criando..." : "Criar projeto"}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA TAREFA */}
      {showNovaTarefa && (
        <div style={s.overlay} onClick={() => setShowNovaTarefa(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Nova tarefa</div>
            <input style={s.input} placeholder="Nome da tarefa" value={nomeTarefa} onChange={e => setNomeTarefa(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && criarTarefa()}/>
            <div style={s.modalBtns}>
              <button style={s.btnCancel} onClick={() => setShowNovaTarefa(false)}>Cancelar</button>
              <button style={s.btnSave} onClick={criarTarefa} disabled={loading}>{loading ? "Criando..." : "Criar tarefa"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

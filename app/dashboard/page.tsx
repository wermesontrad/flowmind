// ARQUIVO: app/dashboard/page.tsx
// Dashboard principal do FlowMind após compra

export default function Dashboard() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "system-ui, sans-serif" }}>
      {/* TOPBAR */}
      <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#5B4CF5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>F</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a" }}>FlowMind</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, background: "#E1F5EE", color: "#0F6E56", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>Acesso Vitalício ✓</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#5B4CF5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>W</div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        {/* BOAS VINDAS */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Bem-vindo ao FlowMind! 🎉</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Seu acesso vitalício está ativo. Comece criando seu primeiro projeto.</p>
        </div>

        {/* MÉTRICAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Tarefas ativas", value: "0", color: "#5B4CF5" },
            { label: "Concluídas", value: "0", color: "#1D9E75" },
            { label: "Projetos", value: "0", color: "#BA7517" },
            { label: "Membros", value: "1", color: "#378ADD" },
          ].map(m => (
            <div key={m.label} style={{ background: "white", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* CRIAR PRIMEIRO PROJETO */}
        <div style={{ background: "white", border: "2px dashed #ddd", borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Crie seu primeiro projeto</h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Organize suas tarefas em um quadro Kanban com IA integrada.</p>
          <button style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            + Criar projeto
          </button>
        </div>
      </div>
    </main>
  );
}

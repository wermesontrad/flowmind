// ARQUIVO: app/page.tsx
// Página de vendas principal do FlowMind

"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleComprar() {
    if (!email) { alert("Digite seu e-mail primeiro!"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert("Erro ao iniciar pagamento. Tente novamente."); setLoading(false); }
    } catch {
      alert("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui, sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#5B4CF5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>F</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: "#1a1a1a" }}>FlowMind</span>
        </div>
        <button onClick={handleComprar} style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Comprar agora
        </button>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "72px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#EEEDFE", color: "#534AB7", fontSize: 12, fontWeight: 600, padding: "4px 14px", borderRadius: 20, marginBottom: 20 }}>
          Acesso vitalício por apenas R$ 30,00
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 18 }}>
          Gerencie projetos com<br />inteligência artificial
        </h1>
        <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, marginBottom: 36 }}>
          Kanban inteligente, IA integrada (Claude) e relatórios em tempo real. Pague uma vez, use para sempre.
        </p>

        {/* FORMULÁRIO DE COMPRA */}
        <div style={{ background: "white", border: "1px solid #eee", borderRadius: 16, padding: 28, maxWidth: 420, margin: "0 auto 48px" }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Digite seu e-mail para começar:</p>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", height: 44, border: "1px solid #ddd", borderRadius: 8, padding: "0 14px", fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" }}
          />
          <button
            onClick={handleComprar}
            disabled={loading}
            style={{ width: "100%", height: 48, background: loading ? "#999" : "#5B4CF5", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Redirecionando..." : "Comprar por R$ 30,00 →"}
          </button>
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 10 }}>
            Pagamento único · Acesso vitalício · Stripe (100% seguro)
          </p>
        </div>

        {/* SELOS DE CONFIANÇA */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          {["Sem mensalidade", "LGPD compliant", "Suporte incluso", "Dados no Brasil"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666" }}>
              <span style={{ color: "#1D9E75", fontWeight: 700 }}>✓</span> {item}
            </div>
          ))}
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section style={{ background: "white", padding: "56px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 40 }}>
            Tudo que você precisa para gerenciar projetos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "📋", title: "Kanban inteligente", desc: "Organize tarefas em colunas. Arraste e solte com facilidade." },
              { icon: "🤖", title: "IA integrada (Claude)", desc: "Pergunte qualquer coisa sobre seus projetos e receba respostas inteligentes." },
              { icon: "📊", title: "Relatórios em tempo real", desc: "Acompanhe o progresso da equipe com métricas claras." },
              { icon: "👥", title: "Gestão de equipe", desc: "Convide membros, atribua tarefas e acompanhe entregas." },
              { icon: "⚡", title: "Sprints e prazos", desc: "Organize seu trabalho em sprints com datas de entrega." },
              { icon: "🔒", title: "100% seguro", desc: "Dados criptografados e armazenados no Brasil." },
            ].map(f => (
              <div key={f.title} style={{ padding: "20px 22px", border: "1px solid #f0f0f0", borderRadius: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Pronto para começar?</h2>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 28 }}>Pague uma vez. Use para sempre. Sem surpresas.</p>
        <button
          onClick={handleComprar}
          style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
        >
          Comprar FlowMind por R$ 30,00
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a1a", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#666", fontSize: 12 }}>© 2026 FlowMind · Todos os direitos reservados · LGPD</p>
      </footer>
    </main>
  );
}

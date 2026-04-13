"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComprar() {
    if (!email) { alert("Digite seu e-mail!"); return; }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert("Erro ao iniciar pagamento."); setLoading(false); }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui" }}>
      <header style={{ background: "white", borderBottom: "1px solid #eee", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#5B4CF5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>F</div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>FlowMind</span>
        </div>
        <button onClick={handleComprar} style={{ background: "#5B4CF5", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer" }}>Comprar agora</button>
      </header>
      <section style={{ maxWidth: 600, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Gerencie projetos com inteligência artificial</h1>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 36 }}>Kanban inteligente, IA integrada e relatórios em tempo real. Pague uma vez, use para sempre.</p>
        <div style={{ background: "white", border: "1px solid #eee", borderRadius: 16, padding: 28, maxWidth: 400, margin: "0 auto" }}>
          <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", height: 44, border: "1px solid #ddd", borderRadius: 8, padding: "0 14px", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
          <button onClick={handleComprar} disabled={loading} style={{ width: "100%", height: 48, background: loading ? "#999" : "#5B4CF5", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Redirecionando..." : "Comprar por R$ 30,00"}
          </button>
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 10 }}>Pagamento único · Acesso vitalício · Stripe</p>
        </div>
      </section>
    </main>
  );
}

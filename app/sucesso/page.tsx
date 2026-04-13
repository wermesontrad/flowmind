"use client";
import { useRouter } from "next/navigation";

export default function Sucesso() {
  const router = useRouter();
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", background: "#fafafa" }}>
      <div style={{ background: "white", border: "1px solid #eee", borderRadius: 20, padding: "48px 40px", maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E1F5EE", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 18l8 8 14-14" stroke="#0F6E56" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>Pagamento confirmado!</h1>
        <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>Acesso vitalicio liberado. Bem-vindo ao FlowMind!</p>
        <button onClick={() => router.push("/dashboard")} style={{ width: "100%", padding: 14, background: "#5B4CF5", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Entrar no FlowMind
        </button>
      </div>
    </main>
  );
}

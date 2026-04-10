import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("projetos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projetos: data });
}

export async function POST(req: NextRequest) {
  const { nome, descricao } = await req.json();

  if (!nome) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

  const { data, error } = await supabase
    .from("projetos")
    .insert({ nome, descricao: descricao || "", usuario_email: "flowmind@app.com" })
    .select()
    .single();

  if (error) {
    console.error("Erro Supabase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ projeto: data });
}
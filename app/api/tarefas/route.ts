import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projeto_id = searchParams.get("projeto_id");
  const { data, error } = await supabase.from("tarefas").select("*").eq("projeto_id", projeto_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tarefas: data });
}

export async function POST(req: NextRequest) {
  const { titulo, projeto_id } = await req.json();
  const { data, error } = await supabase.from("tarefas").insert({ titulo, projeto_id, status: "a_fazer" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tarefa: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const { error } = await supabase.from("tarefas").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { error } = await supabase.from("tarefas").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

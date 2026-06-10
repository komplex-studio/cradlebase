import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

async function getPost(id) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[admin edit] failed to load:", error.message);
    return null;
  }
  return data;
}

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostForm initial={post} />;
}

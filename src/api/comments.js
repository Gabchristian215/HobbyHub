import { supabase } from "../lib/supabase.js";

const COMMENTS_TABLE = "comments";

function throwDatabaseError(operation, error) {
  if (error) {
    throw new Error(`Unable to ${operation}: ${error.message}`);
  }
}

function toCommentPayload(values = {}) {
  return {
    post_id: values.postId,
    content: values.content,
    author_id: values.authorId ?? null,
  };
}

function toCommentUpdatePayload(changes = {}) {
  return Object.fromEntries(
    Object.entries({
      content: changes.content,
      author_id: changes.authorId,
    }).filter(([, value]) => value !== undefined),
  );
}

export async function listCommentsByPostId(postId) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  throwDatabaseError("load comments", error);
  return data;
}

export async function getCommentById(commentId) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .select("*")
    .eq("id", commentId)
    .single();

  throwDatabaseError("load the comment", error);
  return data;
}

export async function createComment(values) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .insert(toCommentPayload(values))
    .select()
    .single();

  throwDatabaseError("create the comment", error);
  return data;
}

export async function updateComment(commentId, changes) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .update({
      ...toCommentUpdatePayload(changes),
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select()
    .single();

  throwDatabaseError("update the comment", error);
  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .delete()
    .eq("id", commentId);

  throwDatabaseError("delete the comment", error);
}

import Post from "../models/Post.js";
import { supabase } from "../lib/supabase.js";

const POSTS_TABLE = "posts";

function throwDatabaseError(operation, error) {
  if (error) {
    throw new Error(`Unable to ${operation}: ${error.message}`);
  }
}

function toPostPayload(values = {}) {
  const post = new Post(values);
  const payload = post.toDatabase();

  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;

  return payload;
}

function toPostUpdatePayload(changes = {}) {
  return Object.fromEntries(
    Object.entries({
      title: changes.title,
      content: changes.content,
      image_url: changes.imageUrl,
      author_id: changes.authorId,
      upvotes: changes.upvotes,
    }).filter(([, value]) => value !== undefined),
  );
}

export async function listPosts({ orderBy = "created_at", ascending = false } = {}) {
  const allowedOrderings = new Set(["created_at", "upvotes", "title"]);
  const sortColumn = allowedOrderings.has(orderBy) ? orderBy : "created_at";

  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .select("*")
    .order(sortColumn, { ascending });

  throwDatabaseError("load posts", error);
  return data.map((row) => Post.fromDatabase(row));
}

export async function getPostById(postId) {
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .select("*")
    .eq("id", postId)
    .single();

  throwDatabaseError("load the post", error);
  return Post.fromDatabase(data);
}

export async function createPost(values) {
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .insert(toPostPayload(values))
    .select()
    .single();

  throwDatabaseError("create the post", error);
  return Post.fromDatabase(data);
}

export async function updatePost(postId, changes) {
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .update({
      ...toPostUpdatePayload(changes),
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select()
    .single();

  throwDatabaseError("update the post", error);
  return Post.fromDatabase(data);
}

export async function deletePost(postId) {
  const { error } = await supabase
    .from(POSTS_TABLE)
    .delete()
    .eq("id", postId);

  throwDatabaseError("delete the post", error);
}

export async function upvotePost(postId) {
  const post = await getPostById(postId);
  post.upvote();
  return updatePost(postId, { upvotes: post.upvotes });
}

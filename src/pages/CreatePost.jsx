import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts.js";
import PostForm from "../components/PostForm.jsx";

function CreatePost() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const post = await createPost(values);
    navigate(`/post/${post.id}`);
  }

  return (
    <section className="page page--narrow">
      <h1 className="page__title">Create a post</h1>
      <PostForm onSubmit={handleSubmit} submitLabel="Create post" />
    </section>
  );
}

export default CreatePost;

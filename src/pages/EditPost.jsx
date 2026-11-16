import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/posts.js";
import PostForm from "../components/PostForm.jsx";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getPostById(id)
      .then((data) => !ignore && setPost(data))
      .catch((err) => !ignore && setError(err.message));

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleSubmit(values) {
    await updatePost(id, values);
    navigate(`/post/${id}`);
  }

  return (
    <section className="page page--narrow">
      <Link className="back-link" to={`/post/${id}`}>
        ← Back to post
      </Link>
      <h1 className="page__title">Edit post</h1>
      {error && <p className="error">{error}</p>}
      {!post && !error && <p className="muted">Loading post…</p>}
      {post && (
        <PostForm
          initialValues={post}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      )}
    </section>
  );
}

export default EditPost;

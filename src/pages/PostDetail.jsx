import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createComment, listCommentsByPostId } from "../api/comments.js";
import { deletePost, getPostById, upvotePost } from "../api/posts.js";
import { timeAgo } from "../utils/time.js";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    let ignore = false;

    Promise.all([getPostById(id), listCommentsByPostId(id)])
      .then(([postData, commentData]) => {
        if (!ignore) {
          setPost(postData);
          setComments(commentData);
        }
      })
      .catch((err) => !ignore && setError(err.message));

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleUpvote() {
    setUpvoting(true);
    setActionError(null);
    try {
      setPost(await upvotePost(id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpvoting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setActionError(null);
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setActionError(err.message);
      setDeleting(false);
    }
  }

  async function handleComment(event) {
    event.preventDefault();
    const content = commentText.trim();
    if (!content) {
      return;
    }

    setCommenting(true);
    setActionError(null);
    try {
      const comment = await createComment({ postId: id, content });
      setComments((current) => [...current, comment]);
      setCommentText("");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCommenting(false);
    }
  }

  if (error) {
    return (
      <section className="page page--narrow">
        <p className="error">{error}</p>
        <Link to="/">Back Home</Link>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page page--narrow">
        <p className="muted">Loading post…</p>
      </section>
    );
  }

  return (
    <section className="page page--narrow">
      <Link className="back-link" to="/">
        ← Back to feed
      </Link>

      <article className="post-detail">
        <p className="muted small">
          Posted {timeAgo(post.createdAt)}
          {post.updatedAt.getTime() - post.createdAt.getTime() > 1000 &&
            ` · edited ${timeAgo(post.updatedAt)}`}
        </p>
        <h1 className="post-detail__title">{post.title}</h1>

        {post.content && <p className="post-detail__content">{post.content}</p>}
        {post.imageUrl && (
          <img alt={post.title} className="post-detail__image" src={post.imageUrl} />
        )}

        <div className="post-detail__actions">
          <button
            className="button button--secondary"
            disabled={upvoting}
            onClick={handleUpvote}
            type="button"
          >
            ▲ {post.upvotes} upvote{post.upvotes === 1 ? "" : "s"}
          </button>
          <div className="post-detail__owner-actions">
            <Link className="button button--secondary" to={`/post/${id}/edit`}>
              Edit
            </Link>
            <button
              className="button button--danger"
              disabled={deleting}
              onClick={handleDelete}
              type="button"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
        {actionError && <p className="error">{actionError}</p>}
      </article>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <p className="muted">No comments yet. Start the conversation!</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li className="comment" key={comment.id}>
                <p>{comment.content}</p>
                <span className="muted small">{timeAgo(comment.created_at)}</span>
              </li>
            ))}
          </ul>
        )}

        <form className="comment-form" onSubmit={handleComment}>
          <input
            aria-label="Leave a comment"
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Leave a comment…"
            value={commentText}
          />
          <button
            className="button"
            disabled={commenting || !commentText.trim()}
            type="submit"
          >
            {commenting ? "Posting…" : "Comment"}
          </button>
        </form>
      </section>
    </section>
  );
}

export default PostDetail;

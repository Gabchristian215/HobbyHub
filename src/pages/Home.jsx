import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPosts } from "../api/posts.js";
import { timeAgo } from "../utils/time.js";

const SORT_OPTIONS = {
  newest: { orderBy: "created_at", label: "Newest" },
  popular: { orderBy: "upvotes", label: "Most popular" },
};

function Home() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [sort, setSort] = useState("newest");
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    listPosts({ orderBy: SORT_OPTIONS[sort].orderBy, ascending: false })
      .then((data) => {
        if (!ignore) {
          setPosts(data);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setStatus("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, [sort]);

  const visiblePosts = useMemo(
    () =>
      query
        ? posts.filter((post) => post.title.toLowerCase().includes(query))
        : posts,
    [posts, query],
  );

  return (
    <section className="page">
      <div className="feed-toolbar">
        <h1 className="page__title">Explore your hobbies</h1>
        <div className="sort-buttons" role="group" aria-label="Sort posts">
          <span>Order by:</span>
          {Object.entries(SORT_OPTIONS).map(([key, option]) => (
            <button
              key={key}
              type="button"
              className={sort === key ? "chip chip--active" : "chip"}
              aria-pressed={sort === key}
              onClick={() => {
                if (sort !== key) {
                  setStatus("loading");
                  setSort(key);
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {query && (
        <p className="muted">
          Showing posts matching “{searchParams.get("q")}”
        </p>
      )}

      {status === "loading" && <p className="muted">Loading posts…</p>}
      {status === "error" && <p className="error">{error}</p>}

      {status === "ready" && visiblePosts.length === 0 && (
        <div className="empty">
          <p>{query ? "No posts match your search." : "No posts yet."}</p>
          <Link className="button" to="/create">
            Create the first one
          </Link>
        </div>
      )}

      {status === "ready" && visiblePosts.length > 0 && (
        <ul className="post-list">
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <Link className="post-card" to={`/post/${post.id}`}>
                <span className="muted small">Posted {timeAgo(post.createdAt)}</span>
                <h2 className="post-card__title">{post.title}</h2>
                <span className="small">
                  {post.upvotes} upvote{post.upvotes === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Home;

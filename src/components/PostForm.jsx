import { useState } from "react";

const EMPTY_VALUES = { title: "", content: "", imageUrl: "" };

function PostForm({ initialValues = EMPTY_VALUES, submitLabel, onSubmit }) {
  const [values, setValues] = useState({
    title: initialValues.title ?? "",
    content: initialValues.content ?? "",
    imageUrl: initialValues.imageUrl ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("A title is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim() || null,
        imageUrl: values.imageUrl.trim() || null,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label>
        Title <span className="required">*</span>
        <input
          name="title"
          maxLength={200}
          onChange={handleChange}
          placeholder="What are you working on?"
          required
          value={values.title}
        />
      </label>

      <label>
        Content <span className="muted small">(optional)</span>
        <textarea
          name="content"
          onChange={handleChange}
          placeholder="Share some details…"
          rows={6}
          value={values.content}
        />
      </label>

      <label>
        Image URL <span className="muted small">(optional)</span>
        <input
          name="imageUrl"
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          type="url"
          value={values.imageUrl}
        />
      </label>

      {values.imageUrl.trim() && (
        <img alt="Preview" className="post-form__preview" src={values.imageUrl} />
      )}

      {error && <p className="error">{error}</p>}

      <button className="button" disabled={submitting} type="submit">
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

export default PostForm;

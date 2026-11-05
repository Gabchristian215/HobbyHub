const MAX_TITLE_LENGTH = 200;

function normalizeOptionalString(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeDate(value, fieldName) {
  if (value === null || value === undefined) {
    return new Date();
  }

  const date = value instanceof Date ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`${fieldName} must be a valid date.`);
  }

  return date;
}

/**
 * Domain model for a HobbyHub post.
 */
export class Post {
  constructor({
    id = null,
    title,
    content = null,
    imageUrl = null,
    upvotes = 0,
    authorId = null,
    createdAt = new Date(),
    updatedAt = createdAt,
  } = {}) {
    this.id = id;
    this.title = Post.validateTitle(title);
    this.content = normalizeOptionalString(content);
    this.imageUrl = normalizeOptionalString(imageUrl);
    this.upvotes = Post.validateUpvotes(upvotes);
    this.authorId = normalizeOptionalString(authorId);
    this.createdAt = normalizeDate(createdAt, "createdAt");
    this.updatedAt = normalizeDate(updatedAt, "updatedAt");
  }

  static validateTitle(title) {
    const normalizedTitle = normalizeOptionalString(title);

    if (!normalizedTitle) {
      throw new TypeError("title is required.");
    }

    if (normalizedTitle.length > MAX_TITLE_LENGTH) {
      throw new RangeError(
        `title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
      );
    }

    return normalizedTitle;
  }

  static validateUpvotes(upvotes) {
    if (!Number.isInteger(upvotes) || upvotes < 0) {
      throw new RangeError("upvotes must be a non-negative integer.");
    }

    return upvotes;
  }

  static fromDatabase(row) {
    if (!row || typeof row !== "object") {
      throw new TypeError("A database row is required.");
    }

    return new Post({
      id: row.id,
      title: row.title,
      content: row.content,
      imageUrl: row.image_url,
      upvotes: row.upvotes,
      authorId: row.author_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    });
  }

  toDatabase() {
    return {
      ...(this.id ? { id: this.id } : {}),
      title: this.title,
      content: this.content,
      image_url: this.imageUrl,
      upvotes: this.upvotes,
      author_id: this.authorId,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  update(changes = {}) {
    const updatedPost = new Post({
      id: this.id,
      title: changes.title ?? this.title,
      content: changes.content ?? this.content,
      imageUrl: changes.imageUrl ?? this.imageUrl,
      upvotes: changes.upvotes ?? this.upvotes,
      authorId: this.authorId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });

    Object.assign(this, updatedPost);
    return this;
  }

  upvote() {
    this.upvotes += 1;
    this.updatedAt = new Date();
    return this;
  }
}

export default Post;

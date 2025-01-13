import { Alert, Badge, Box, Button, Card, TextField, Typography, Avatar, Stack, Pagination } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ExtendedSession } from "../ExtendedSession";
import { Post } from "../types";
import Markdown from 'react-markdown'

const ViewTopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const limit = 10;
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();
  
  const fetchPosts = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * limit;
      const resp = await fetch(
        import.meta.env.VITE_API_URL +
          `/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`
      );

      if (session) {
        await fetch(
          import.meta.env.VITE_API_URL +
            `/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session?.token}`,
                }}
        );
      }

      if (resp.status === 429) {
        const retryAfterHeader = resp.headers.get("Retry-After");
        setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
        throw new Error("Too many requests. Please try again later.");
      }

      if (!resp.ok) {
        throw new Error(`Error: ${resp.statusText}`);
      }

      const result = await resp.json();
      setPosts(result.posts);
      setTotalPages(Math.ceil(result.count / limit));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async () => {
    try {
      const resp = await fetch(
        import.meta.env.VITE_API_URL + `/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as ExtendedSession).token}`,
          },
          body: JSON.stringify({ content: replyContent }),
        }
      );

      if (resp.status === 429) {
        const retryAfterHeader = resp.headers.get("Retry-After");
        setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
        throw new Error("Too many requests. Please try again later.");
      }

      if (!resp.ok) {
        throw new Error(`Error: ${resp.statusText}`);
      }

      setReplyContent("");
      await fetchPosts(page);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (error) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Alert severity="error" sx={{ marginBottom: "1rem" }}>
          {error}
        </Alert>
        {retryAfter && <Typography color="text.secondary">Please try again in {retryAfter} seconds.</Typography>}
      </Box>
    );
  }

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!posts.length) return <Typography align="center">No data found</Typography>;

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Topic Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        {posts[0]?.Topic?.Title || "Topic Title"}
      </Typography>

      {/* Posts Section */}
      {posts &&
        posts.map((post) => (
          <Card key={post.Id} sx={{ display: "flex", marginBottom: "1.5rem", boxShadow: 2 }}>
            {/* User Info */}
            <Box sx={{ width: "20%", textAlign: "center", padding: "1rem", borderRight: "1px solid #ddd" }}>
              <Avatar
                src={"http://www.gravatar.com/avatar/" + post.User.Email}
                sx={{ height: "auto", width: "70%", margin: "0 auto" }}
              />
              <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                <Link to="">{post.User.Username}</Link>
              </Typography>
              {post.User.IsModerator && <Badge badgeContent="Mod" color="primary" />}
              {post.User.IsAdministrator && <Badge badgeContent="Admin" color="error" />}
            </Box>

            {/* Post Content */}
            <Box sx={{ flex: 1, padding: "1rem" }}>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.CreatedAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                <Markdown>{post.Content}</Markdown>
              </Typography>

              {/* Post Actions */}
              {!session && (
                  <Button disabled="true" variant="outlined" color="primary" size="small">
                    {post.LikeCount} Likes
                  </Button>
              )}
              {session && session.user?.name === post.User.Username && (
                <Stack direction="row" spacing={1} sx={{ marginTop: "1rem" }}>
                  <Button variant="outlined" color="primary" size="small" onClick={async () => {
                    await fetch(
                        import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${post.Id}/like`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${(session as ExtendedSession).token}`,
                          },
                          body: JSON.stringify({ content: replyContent }),
                        }).then((resp: any) => resp.text()).then(() => {
                          location.reload();
                        }
                    );
                  }}>
                    {post.LikeCount} Likes
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    <Link to={`/category/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${post.Id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={async () => {
                      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
                      if (!confirmDelete) return;

                      try {
                        const resp = await fetch(
                          import.meta.env.VITE_API_URL +
                            `/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${post.Id}`,
                          {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${(session as ExtendedSession).token}`,
                            },
                          }
                        );

                        if (resp.status === 429) {
                          const retryAfterHeader = resp.headers.get("Retry-After");
                          setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
                          throw new Error("Too many requests. Please try again later.");
                        }

                        if (!resp.ok) {
                          throw new Error(`Error: ${resp.statusText}`);
                        }

                        const success = await resp.json();
                        if (success) {
                          navigate("/");
                        }
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={async () => {
                      try {
                        const resp = await fetch(
                          import.meta.env.VITE_API_URL +
                            `/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${post.Id}/flag`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${(session as ExtendedSession).token}`,
                            },
                          }
                        );

                        if (resp.status === 429) {
                          const retryAfterHeader = resp.headers.get("Retry-After");
                          setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
                          throw new Error("Too many requests. Please try again later.");
                        }

                        const response = await resp.text()
                        if (!resp.ok) {
                          window.alert(`Error: ${response}`);
                        } else {
                          window.alert("Post has been flagged for review by forum moderators!")
                        }
                      } catch (err: any) {
                        setError(err.message);
                      }
                    }}
                  >
                    Flag Post For Moderator Review
                  </Button>
                </Stack>
              )}
            </Box>
          </Card>
        ))}

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" />
      </Box>

      {/* Reply Section */}
      {session && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handlePostClick();
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reply to Topic
          </Typography>
          <TextField
            id="replyContent"
            label="Your Reply"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                You can format your content using Markdown. Here are some examples:
                <ul>
                  <li>
                    <strong>Bold:</strong> <code>**bold text**</code> → <strong>bold text</strong>
                  </li>
                  <li>
                    <strong>Italic:</strong> <code>*italic text*</code> → <em>italic text</em>
                  </li>
                  <li>
                    <strong>Link:</strong> <code>[link text](https://example.com)</code> →{" "}
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                      link text
                    </a>
                  </li>
                  <li>
                    <strong>List:</strong> <code>- Item 1</code> → - Item 1
                  </li>
                  <li>
                    <strong>Code:</strong> <code>`inline code`</code> → <code>inline code</code>
                  </li>
                </ul>
                For more details, check out the{" "}
                <a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer">
                  Markdown Guide
                </a>.
              </Typography>
          <Button type="submit" variant="contained" sx={{ marginTop: "1rem" }}>
            Post Reply
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ViewTopicPage;

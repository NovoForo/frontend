import { Alert, Badge, Box, Button, Card, TextField, Typography, Avatar, Stack, Pagination } from "@mui/material";
// import { useSession } from "@toolpad/core";
import { useSession } from "../SessionProvider";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
// import { ExtendedSession } from "../ExtendedSession";
import { Post } from "../types";
import Markdown from "react-markdown";
import LikeDislikeButton from "../Buttons/LikeDislikeButton";
import EditPostButton from "../Buttons/EditPostButton";
import DeletePostButton from "../Buttons/DeletePostButton";
import FlagPostButton from "../Buttons/FlagPostButton";
import ReplyToPostForm from "../forms/ReplyToPostForm";

const ViewTopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const limit = 10;
  const { session } = useSession();
  const navigate = useNavigate();

  const fetchPosts = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * limit;
      const resp = await fetch(
        import.meta.env.VITE_API_URL +
          `/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.token ? `Bearer ${session?.token}` : "",
          },
        }
      );

      if (session) {
        await fetch(
          import.meta.env.VITE_API_URL +
            `/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
          }
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

  useEffect(() => {
    fetchPosts(page);
  }, [page, session]);

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
                <LikeDislikeButton
                  categoryId="123"
                  forumId="456"
                  topicId="789"
                  post={{ id: String(post.Id), likeCount: post.LikeCount, likeStatus: post.LikeStatusText }}
                />
              )}
              {session && session.user?.name === post.User.Username && (
                <Stack direction="row" spacing={1} sx={{ marginTop: "1rem" }}>
                  <LikeDislikeButton
                    categoryId="123"
                    forumId="456"
                    topicId="789"
                    post={{
                      id: String(post.Id),
                      likeCount: post.LikeCount,
                      likeStatus: post.LikeStatusText,
                    }}
                    session={{ token: session.token }}
                  />

                  <EditPostButton categoryId={categoryId} forumId={forumId} topicId={topicId} postId={post.Id} />

                  <DeletePostButton
                    categoryId={categoryId}
                    forumId={forumId}
                    topicId={topicId}
                    postId={post.Id}
                    token={session.token}
                  />

                  <FlagPostButton
                    categoryId={categoryId}
                    forumId={forumId}
                    topicId={topicId}
                    postId={post.Id}
                    session={session}
                  />
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
        <ReplyToPostForm
          categoryId={categoryId}
          forumId={forumId}
          topicId={topicId}
          session={session}
          page={page}
          fetchPosts={fetchPosts}
          setError={setError}
          setRetryAfter={setRetryAfter}
        />
      )}
    </Box>
  );
};

export default ViewTopicPage;

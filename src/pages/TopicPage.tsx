import { Badge, Box, Button, Card, Divider, TextField, Typography, Avatar, Stack, Pagination } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExtendedSession } from "./signIn";
import { Post } from "../types";

const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const session = useSession();

  const fetchPosts = async (currentPage: number) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * limit;
      const resp = await fetch(
        `http://localhost:8000/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`
      );
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
      await fetch(`http://localhost:8000/categories/${categoryId}/forums/${forumId}/topics/${topicId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as ExtendedSession).token}`,
        },
        body: JSON.stringify({ content: replyContent }),
      });
      setReplyContent('');
      await fetchPosts(page);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (error) return <Typography color="error" align="center">Error: {error}</Typography>;
  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!posts.length) return <Typography align="center">No data found</Typography>;

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Topic Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {posts[0]?.Title || "Topic Title"}
      </Typography>

      {/* Posts Section */}
      {posts.map((post) => (
        <Card key={post.Id} sx={{ display: 'flex', marginBottom: '1.5rem', boxShadow: 2 }}>
          {/* User Info */}
          <Box sx={{ width: '200px', textAlign: 'center', padding: '1rem', borderRight: '1px solid #ddd' }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/193647016?s=400&v=4"
              sx={{ width: 80, height: 80, margin: '0 auto' }}
            />
            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}>
              <Link to="">{post.User.Username}</Link>
            </Typography>
            {post.User.IsModerator && (
              <Badge badgeContent="Mod" color="primary" />
            )}
            {post.User.IsAdministrator && (
              <Badge badgeContent="Admin" color="error" />
            )}
          </Box>

          {/* Post Content */}
          <Box sx={{ flex: 1, padding: '1rem' }}>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.CreatedAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}>
              {post.Content}
            </Typography>

            {/* Post Actions */}
            {session && session.user?.name === post.User.Username && (
              <Stack direction="row" spacing={1} sx={{ marginTop: '1rem' }}>
                <Button variant="outlined" color="secondary" size="small">Edit</Button>
                <Button variant="outlined" color="error" size="small">Delete</Button>
              </Stack>
            )}
          </Box>
        </Card>
      ))}

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Reply Section */}
      {session && (
        <Box component="form" noValidate autoComplete="off" onSubmit={(e) => { e.preventDefault(); handlePostClick(); }}>
          <Typography variant="h6" gutterBottom>Reply to Topic</Typography>
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
          <Button type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
            Post Reply
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TopicPage;

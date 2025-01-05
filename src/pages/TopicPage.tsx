import { Badge, Box, Button, Card, Divider, TextField, Typography } from "@mui/material";
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
  const [totalPages, setTotalPages] = useState(1); // For total pages
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
      const skip = (page - 1) * limit;
      await fetch(`http://localhost:8000/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as ExtendedSession).token}`,
        },
        body: JSON.stringify({ content: replyContent }),
      });
      setReplyContent(''); // Clear the form
      await fetchPosts(page); // Refresh posts after submitting
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts(page); // Fetch posts when component mounts or page changes
  }, [page]);

  if (error) return <p>Error: {error}</p>;
  if (loading) return <p>Loading...</p>;
  if (!posts || posts.length === 0) return <p>No data found</p>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {posts[0]?.Title}
      </Typography>
      {posts.map((post) => (
        <Card
          key={post.Id}
          sx={{
            display: "flex",
            marginBottom: "1rem",
            padding: "1rem",
            paddingLeft: "0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "11.875rem",
              padding: "1rem",
            }}
          >
            <img src='https://avatars.githubusercontent.com/u/193647016?s=400&v=4' style={{
              maxHeight: '100px',
              maxWidth: '100px',
            }}></img>

            <p><Link to=''>{post.User.Username}</Link></p>

            {post.User.IsModerator && (
                  <Badge
                  badgeContent="Mod"
                  color="primary"
                  overlap="circular"
                >
                </Badge>
            )}

            {post.User.IsAdministrator && (
                  <Badge
                  badgeContent="Administrator"
                  color="error"
                  overlap="circular"
                >
                </Badge>
            )}
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
          sx={{
            position: "relative",
            padding: "1rem",
            minHeight: "200px", // Adjust based on your needs
          }}
        >
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {new Date(post.CreatedAt).toLocaleString()}
          </Typography>
          {post.Content}


          <Box
              sx={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                right: "1rem",
                width: '100%'
              }}
            >
              {session && session.user?.name === post.User.Username && (
                <>
                  <Link to='/'><Button color='secondary'>Edit Post</Button></Link>
                  <Link to='/'><Button color='error'>Delete Post</Button></Link>
                </>
              )}
        </Box>
          
        </Box>

        </Card>
      ))}
      <hr />
      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <Button
          variant="contained"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <Typography variant="body1">Page {page} of {totalPages}</Typography>
        <Button
          variant="contained"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </Box>
      <hr />
      {session && (
        <Box component="form" noValidate autoComplete="off" onSubmit={(e) => { e.preventDefault(); handlePostClick(); }}>
          <TextField
            id="replyContent"
            label="Reply"
            fullWidth
            margin="normal"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Post
          </Button>
        </Box>
      )}
    </>
  );
};

export default TopicPage;

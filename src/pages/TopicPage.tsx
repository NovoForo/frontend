import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, TextField } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExtendedSession } from "./signIn";
import { ExpandMore } from "@mui/icons-material";

const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [page, setPage] = useState(1); // Start with page 1
  const limit = 10;
  const session = useSession();

  const fetchPosts = async (page: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit; // Calculate skip based on the current page
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}/forums/${forumId}/topics/${topicId}?skip=${skip}&limit=${limit}`
      );
      if (!resp.ok) {
        throw new Error(`Error: ${resp.statusText}`);
      }
      const result = await resp.json();
      setData(result.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(session as ExtendedSession).token}`,
        },
        body: JSON.stringify({ content: replyContent }),
      });
      if (!resp.ok) {
        throw new Error(`Error: ${resp.statusText}`);
      }
      const newReply = await resp.json(); // Get the newly created reply
      newReply.post.User.Username = session?.user?.name;
      setReplyContent('');
      setData((prevData) => [...prevData, newReply.post]); // Append the new reply to the existing posts
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchPosts(page); // Fetch posts when page changes
  }, [page]);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {data.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />} style={{ fontSize: '1.3em' }}>
            {data[0]?.Title}
          </AccordionSummary>
          <AccordionDetails>
            <strong>Posted by:</strong> {data[0]?.User?.Username} at {new Date(data[0]?.CreatedAt).toLocaleString()}
            <br />
            {data[0]?.Topic.Description}
          </AccordionDetails>
        </Accordion>
      )}

      <hr />

      {data.map((post) => (
        <Paper key={post.Id} elevation={3} style={{ marginBottom: '1rem', padding: '1rem' }}>
          <strong>{post?.User?.Username} at {new Date(post?.CreatedAt).toLocaleString()}</strong>
          <br />
          {post.Content}
        </Paper>
      ))}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="outlined"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{ marginRight: '1rem' }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={() => handlePageChange(page + 1)}
            style={{ marginLeft: '1rem' }}
          >
            Next
          </Button>
        </Box>
      )}

      <hr />

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

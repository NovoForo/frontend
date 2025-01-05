import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExtendedSession } from "./signIn";
import { ExpandMore } from "@mui/icons-material";


const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const session = useSession();

  const handlePostClick = () => {

    fetch(import.meta.env.VITE_API_URL + `/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}`,
        {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${(session as ExtendedSession).token}`,
            },
            body: JSON.stringify({
              content: replyContent, // Include the reply content in the body
            }),
          }
    ).then(() => {
        async function fetchData() {
            try {
              const resp = await fetch(
                import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
              );
              if (!resp.ok) {
                throw new Error(`Error: ${resp.statusText}`);
              }
              const result = await resp.json();
              setData(result);
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }
      
          fetchData();
    })

    setReplyContent(''); // Clear the form
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch(
          import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
        );
        if (!resp.ok) {
          throw new Error(`Error: ${resp.statusText}`);
        }
        const result = await resp.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, forumId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.posts) return <p>No data found.</p>;

  console.log(data)

  return (
    <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} style={{fontSize: '1.3em'}}>{data.posts[0].Title}</AccordionSummary>
      <AccordionDetails>
        <strong>Posted by:</strong> {data.posts[0].User.Username} at {new Date(data.posts[0].CreatedAt).toLocaleString()}
        <br />
        {data.posts[0].Topic.Description}
      </AccordionDetails>
    </Accordion>

    <hr />

    {data.posts.map((post) => (
        <Paper key={post.Id} elevation={3}>
            <strong>{post.User.Username} at {new Date(post.CreatedAt).toLocaleString()}</strong>
            <br />
            {post.Content}
        </Paper>
      ))}

    <hr />
    {session && (
        <Box component="form" noValidate autoComplete="off">
        <TextField
            id="replyContent"
            label="Reply"
            fullWidth
            margin="normal"
            value={replyContent} // Controlled value
            onChange={(e) => setReplyContent(e.target.value)} // Update state on change
        />
        <Button 
            variant="contained" 
            onClick={handlePostClick}
        >
            Post
        </Button>
        </Box>
    )}
    </>
  );
};

export default TopicPage;

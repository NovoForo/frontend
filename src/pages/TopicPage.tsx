import { Box, Button, Card, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExtendedSession } from "./signIn";


const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const session = useSession();

  const handlePostClick = () => {

    fetch(`http://localhost:8000/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}`,
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
                `http://localhost:8000/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
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
          `http://localhost:8000/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
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

  return (
    <>
    <Typography><h2>{data.posts[0].Title}</h2></Typography>
    <TableContainer component={Paper}>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Post Content</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {data.posts.map((post) => (
        <TableRow key={post.Id}>
          <TableCell>
            {post.User.Username}
            <br />
            {new Date(post.CreatedAt).toLocaleString()}

          </TableCell>
          <TableCell>{post.Content}</TableCell>
        </TableRow>
      ))}
      </TableBody>
    </TableContainer>
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

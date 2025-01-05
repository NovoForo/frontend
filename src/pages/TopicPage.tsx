import { Box, Button, Card, CardContent, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
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
    <Card variant="outlined">
        <CardContent>
            <Typography>
                <h2>{data.posts[0].Title}</h2>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Posted by {data.posts[0].User.Username} at {new Date(data.posts[0].CreatedAt).toLocaleString()}
                </Typography>
                <p>{data.posts[0].Topic.Description}</p>
            </Typography>
        </CardContent>
    </Card>
    
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

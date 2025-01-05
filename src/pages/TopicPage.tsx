import { Box, Button, Card, Divider, TextField, Typography } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExtendedSession } from "./signIn";
import { Post } from "../types";

const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [posts, setPosts] = useState<Post[]>()
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
              // setData(result);
              setPosts(result.posts)
            } catch (err: any) {
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
        setPosts(result.posts)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, forumId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts || posts.length == 0) return <p>No data found</p>

  return (
    <>
    <Typography variant="h4" gutterBottom>
        {posts[0].Title}
    </Typography>
      {posts.length > 0 && posts.map((post) => (
          <Card key={post.Id} sx={{display: 'flex', marginBottom: '1rem', padding: '1rem', paddingLeft: '0'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '11.875rem', padding: '1rem'}}>
              <p>{post.User.Username}</p>
              <p>{new Date(post.CreatedAt).toLocaleString()}</p>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{padding: '1rem'}}>
              {post.Content}
            </Box>
          </Card>
        )
      )}
    <hr />
    {session && (
        < Box component="form" noValidate autoComplete="off">
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

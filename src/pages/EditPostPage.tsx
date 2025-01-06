import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@toolpad/core';
import { useState, useEffect } from 'react';
import { ExtendedSession } from './signIn';

export default function EditPostPage() {
  const { categoryId, forumId, topicId, postId } = useParams();
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [initialPostFetched, setInitialPostFetched] = useState(false);

  // Basic validation: require all fields to be non-empty
  const isFormValid = postTitle.trim() && postContent.trim();

  const handlePostClick = () => {
    fetch(
      import.meta.env.VITE_API_URL +
        `/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${postId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
        }),
      }
    ).then( async (resp) => {
      let json = await resp.json();
      navigate(`/category/${categoryId}/forums/${forumId}/topics/${topicId}`);
    });
  };

  useEffect(() => {
    if (!session) {
      navigate('/');
    }

    if (!initialPostFetched) {
      fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}/forums/${forumId}/topics/${topicId}`)
      .then(async (resp) => {
        if (!resp.ok) {
          throw new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
        }
    
        const json = await resp.json();
        if (!json || !json.posts) {
          throw new Error('Invalid response format: posts not found');
        }
    
        const post = await json.posts.find((post: { Id: string | undefined }) => post.Id == postId);
    
        if (post) {
          setPostTitle(post.Title);
          setPostContent(post.Content);
        } else {
          throw new Error('Post not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
      });
    }

  }, [session, navigate]);

  return (
    <>
      {session && (
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Edit Post
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                if (isFormValid) {
                  handlePostClick();
                }
              }}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                required
                id="topicTitle"
                label="Title"
                fullWidth
                margin="normal"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                error={!postTitle.trim()} // Show red border if empty
                helperText={
                  !postTitle.trim() ? 'Please provide a title.' : ''
                }
              />
              <TextField
                required
                id="postContent"
                label="Content"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                error={!postContent.trim()}
                helperText={
                  !postContent.trim() ? 'Please add some content.' : ''
                }
              />
              <Button
                type="submit" // Mark the button as the submit button
                variant="contained"
                disabled={!isFormValid}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
}

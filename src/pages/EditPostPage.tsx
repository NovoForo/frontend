import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@toolpad/core';
import { useState, useEffect } from 'react';
import { ExtendedSession } from "../ExtendedSession";

export default function EditPostPage() {
  const { categoryId, forumId, topicId, postId } = useParams();
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState('');
  const [initialPostFetched, setInitialPostFetched] = useState(false);
  const [error429, setError429] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isFormValid = postContent.trim();

  const handlePostClick = async () => {
    try {
      const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${postId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({
              content: postContent,
            }),
          }
      );

      if (resp.status === 429) {
        setError429(true);
        setTimeout(() => setError429(false), 10000);
        return;
      }

      if (!resp.ok) {
        throw new Error(`Failed to update post: ${resp.statusText}`);
      }

      navigate(`/category/${categoryId}/forums/${forumId}/topics/${topicId}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!session) {
        navigate('/');
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        const resp = await fetch(
            `${import.meta.env.VITE_API_URL}/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
        );

        if (resp.status === 429) {
          setError429(true);
          setTimeout(() => setError429(false), 10000);
          return;
        }

        if (!resp.ok) {
          throw new Error(`Failed to fetch post: ${resp.statusText}`);
        }

        const json = await resp.json();
        const post = json.posts?.find(
            (p: { Id: number }) => p.Id === parseInt(postId, 10) // Ensure type matches
        );

        if (post) {
          setPostContent(post.Content || '');
        } else {
          throw new Error('Post not found in response');
        }

        setInitialPostFetched(true);
      } catch (error) {
        console.error('Error fetching post:', error);
        setFetchError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (!initialPostFetched) {
      fetchPost();
    }
  }, [session, initialPostFetched, categoryId, forumId, topicId, postId, navigate]);

  return (
      <>
        {session && (
            <Container maxWidth="sm">
              {error429 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Too many requests. Please try again in 10 seconds.
                  </Alert>
              )}
              {fetchError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {fetchError}
                  </Alert>
              )}
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Edit Post
                </Typography>
                {loading ? (
                    <Typography variant="body1">Loading post...</Typography>
                ) : (
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (isFormValid) {
                            handlePostClick();
                          }
                        }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
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
                          helperText={!postContent.trim() ? 'Please add some content.' : ''}
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
                      <Button
                          type="submit"
                          variant="contained"
                          disabled={!isFormValid}
                      >
                        Save Changes
                      </Button>
                    </Box>
                )}
              </Paper>
            </Container>
        )}
      </>
  );
}

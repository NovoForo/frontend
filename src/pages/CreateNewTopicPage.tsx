import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@toolpad/core';
import { useState, useEffect } from 'react';
import { ExtendedSession } from "../ExtendedSession";

export default function NewTopicsPage() {
  const { categoryId, forumId } = useParams();
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [postContent, setPostContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const isFormValid = topicTitle.trim() && topicDescription.trim() && postContent.trim();

  const handlePostClick = async () => {
    try {
      const resp = await fetch(
          import.meta.env.VITE_API_URL +
          `/s/categories/${categoryId}/forums/${forumId}/topics`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({
              title: topicTitle,
              description: topicDescription,
              content: postContent,
            }),
          }
      );

      if (resp.status === 429) {
        setError('Too many requests. Please try again in 10 seconds.');
        setShowAlert(true);
        return;
      }

      if (!resp.ok) {
        throw new Error('An error occurred while creating the topic.');
      }

      const json = await resp.json();
      navigate(`/category/${categoryId}/forums/${forumId}/topics/${json["Topic"]["Id"]}`);
    } catch (err) {
      setError(err.message);
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
      <>
        {session && (
            <Container maxWidth="sm">
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Create New Topic
                </Typography>
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
                      id="topicTitle"
                      label="Title"
                      fullWidth
                      margin="normal"
                      value={topicTitle}
                      onChange={(e) => setTopicTitle(e.target.value)}
                      error={!topicTitle.trim()}
                      helperText={!topicTitle.trim() ? 'Please provide a title.' : ''}
                  />
                  <TextField
                      required
                      id="topicDescription"
                      label="Description"
                      fullWidth
                      margin="normal"
                      value={topicDescription}
                      onChange={(e) => setTopicDescription(e.target.value)}
                      error={!topicDescription.trim()}
                      helperText={
                        !topicDescription.trim() ? 'Please provide a description.' : ''
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
                      helperText={!postContent.trim() ? 'Please add some content.' : ''}
                  />
                  <Button
                      type="submit"
                      variant="contained"
                      disabled={!isFormValid}
                  >
                    Create New Topic
                  </Button>
                </Box>
              </Paper>
              <Snackbar
                  open={showAlert}
                  autoHideDuration={6000}
                  onClose={() => setShowAlert(false)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert
                    onClose={() => setShowAlert(false)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                  {error}
                </Alert>
              </Snackbar>
            </Container>
        )}
      </>
  );
}

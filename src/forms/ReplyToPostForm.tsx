import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ReplyToPostForm = ({ categoryId, forumId, topicId, session, page, fetchPosts, setError, setRetryAfter }) => {
  const [replyContent, setReplyContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePostClick = async () => {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ content: replyContent }),
        }
      );

      if (resp.status === 429) {
        const retryAfterHeader = resp.headers.get("Retry-After");
        setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
        throw new Error("Too many requests. Please try again later.");
      }

      if (!resp.ok) {
        throw new Error(`Error: ${resp.statusText}`);
      }

      setReplyContent("");
      await fetchPosts(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDialogOpen(false); // Close the dialog after the post action
    }
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        setIsDialogOpen(true); // Open the dialog on form submission
      }}
    >
      <Typography variant="h6" gutterBottom>
        Reply to Topic
      </Typography>
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
      <Button type="submit" variant="contained" sx={{ marginTop: "1rem" }}>
        Post Reply
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to post your reply?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              handlePostClick();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReplyToPostForm;

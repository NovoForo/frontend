import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const FlagPostButton = ({ categoryId, forumId, topicId, postId, session }) => {
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleFlagPost = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${postId}/flag`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
        throw new Error("Too many requests. Please try again later.");
      }

      const responseText = await response.text();
      if (!response.ok) {
        setDialogMessage(`Error: ${responseText}`);
      } else {
        setDialogMessage(
          "Post has been flagged for review by forum moderators!"
        );
      }
    } catch (error) {
      setDialogMessage(`Error: ${error.message}`);
    } finally {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogMessage("");
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {retryAfter && (
        <p style={{ color: "orange" }}>
          Please wait {retryAfter} seconds before retrying.
        </p>
      )}
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleFlagPost}
        sx={{
          textTransform: "none",
          padding: "4px 12px",
          "&:hover": {
            borderColor: "error.main",
            backgroundColor: "error.light",
          },
        }}
      >
        Flag Post
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
      >
        <DialogTitle id="notification-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="notification-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlagPostButton;

import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router";

const DeletePostButton = ({ categoryId, forumId, topicId, postId, token }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(0);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/s/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        setRetryAfter(retryAfterHeader ? parseInt(retryAfterHeader, 10) : 10);
        throw new Error("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const success = await response.json();
      if (success) {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleClickOpen}
        sx={{
          textTransform: "none",
          padding: "4px 12px",
          "&:hover": {
            borderColor: "error.main",
            backgroundColor: "error.light",
          },
        }}
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeletePostButton;

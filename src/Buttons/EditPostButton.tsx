import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Link } from "react-router";

const EditPostButton = ({ categoryId, forumId, topicId, postId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={handleOpenDialog}
        sx={{
          textTransform: "none",
          padding: "4px 12px",
          "&:hover": {
            borderColor: "secondary.main",
            backgroundColor: "secondary.light",
          },
        }}
      >
        Edit
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-edit-title"
        aria-describedby="confirm-edit-description"
      >
        <DialogTitle id="confirm-edit-title">Confirm Edit</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-edit-description">
            Are you sure you want to edit this post? Any unsaved changes in your current work may be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            component={Link}
            to={`/category/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${postId}`}
            color="secondary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPostButton;

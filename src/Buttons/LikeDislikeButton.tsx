import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

// Define the types for the session object
interface Session {
  token: string;
  // Add other session-related properties if necessary
}

// Define the types for the post object
interface Post {
  id: string; // Changed from 'Id' to 'id' for consistency
  likeCount: number;
  likeStatus: "liked" | "disliked" | "none";
  // Add other post-related properties if necessary
}

// Define the props for the LikeDislikeButton component
interface LikeDislikeButtonProps {
  categoryId: string;
  forumId: string;
  topicId: string;
  post: Post;
  session?: Session; // Make session optional if it can be undefined
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LikeDislikeButton: React.FC<LikeDislikeButtonProps> = ({
  categoryId,
  forumId,
  topicId,
  post,
  session,
}) => {
  // Debug: Log received props on mount and whenever they change
  useEffect(() => {
    console.log("LikeDislikeButton Props:", { categoryId, forumId, topicId, post, session });
  }, [categoryId, forumId, topicId, post, session]);

  const [likeCount, setLikeCount] = useState<number>(post.likeCount || 0);
  const [likeStatus, setLikeStatus] = useState<"liked" | "disliked" | "none">(
    post.likeStatus || "none"
  );

  // Synchronize state with post prop changes
  useEffect(() => {
    setLikeCount(post.likeCount || 0);
    setLikeStatus(post.likeStatus || "none");
    console.log("Synchronized state with post prop. likeCount:", post.likeCount, "likeStatus:", post.likeStatus);
  }, [post.likeCount, post.likeStatus]);

  // Debug: Log initial state
  useEffect(() => {
    console.log("Initial State - likeCount:", likeCount, "likeStatus:", likeStatus);
  }, []);

  // Debug: Log state updates
  useEffect(() => {
    console.log("likeCount updated:", likeCount);
  }, [likeCount]);

  useEffect(() => {
    console.log("likeStatus updated:", likeStatus);
  }, [likeStatus]);

  // State for Snackbar notifications
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">("error");

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Loading state to prevent multiple rapid clicks
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLikeDislike = async (action: "like" | "dislike") => {
    if (!session || isLoading) {
      console.warn("Session not available or action in progress. Action aborted.");
      return;
    }

    setIsLoading(true);
    console.log(`Action triggered: ${action}`);

    try {
      const url = `${import.meta.env.VITE_API_URL}/categories/${categoryId}/forums/${forumId}/topics/${topicId}/posts/${post.id}/${action}`;
      console.log("POST request URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.ok) {
        console.log(`Action ${action} succeeded.`);

        // Assuming the server returns the updated post object
        const updatedPost: Post = await response.json();

        setLikeCount(updatedPost.likeCount || 0);
        setLikeStatus(updatedPost.likeStatus || "none");

        setSnackbarMessage(
          action === "like" ? "You liked this post." : "You disliked this post."
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        console.error("Failed to update like/dislike status. Response not ok.");
        setSnackbarMessage("Failed to update your reaction. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error updating like/dislike:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !session || isLoading; // Disable buttons if session is not provided or action in progress

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton
          color={likeStatus === "liked" ? "primary" : "inherit"} // Changed "default" to "inherit"
          onClick={() => handleLikeDislike("like")}
          disabled={isDisabled}
          aria-label="like"
        >
          {likeStatus === "liked" ? (
            <ThumbUpAltIcon />
          ) : (
            <ThumbUpAltOutlinedIcon />
          )}
        </IconButton>
        <span style={{ margin: "2px", fontSize: "16px" }}>{likeCount}</span>
        <IconButton
          color={likeStatus === "disliked" ? "primary" : "inherit"} // Changed "default" to "inherit"
          onClick={() => handleLikeDislike("dislike")}
          disabled={isDisabled}
          aria-label="dislike"
        >
          {likeStatus === "disliked" ? (
            <ThumbDownAltIcon />
          ) : (
            <ThumbDownAltOutlinedIcon />
          )}
        </IconButton>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LikeDislikeButton;

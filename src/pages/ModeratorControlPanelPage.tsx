import * as React from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useSession } from "../SessionProvider";
import { ExtendedSession } from "../ExtendedSession";

/** Utility function for a11y props */
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/** Reusable TabPanel component */
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/** Helper function for making authorized fetch calls */
async function handleAction(url: string, token: string | undefined, method: string, onSuccess: () => void) {
  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  onSuccess();
}

/** Topics list component */
function TopicsForReview({
  topics,
  token,
  refreshQueue,
  openConfirmationDialog,
}: {
  topics: any[];
  token?: string;
  refreshQueue: () => void;
  openConfirmationDialog: (message: string, onConfirm: () => void) => void;
}) {
  if (!topics || topics.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        No topics available for review.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Topics for Review
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Topics for review">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "30%" }}>Actions</TableCell>
              <TableCell>Topic Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.Id}>
                <TableCell>
                  <Button
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to release this topic?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/topics/${topic.Id}/release`,
                          token,
                          "PATCH",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Release Topic
                  </Button>
                  <Button
                    color="error"
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to delete this topic?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/topics/${topic.Id}`,
                          token,
                          "DELETE",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Delete Topic
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" component="strong">
                    {topic.Title}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/** Posts list component */
function PostsForReview({
  posts,
  token,
  refreshQueue,
  openConfirmationDialog,
}: {
  posts: any[];
  token?: string;
  refreshQueue: () => void;
  openConfirmationDialog: (message: string, onConfirm: () => void) => void;
}) {
  if (!posts || posts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        No posts available for review.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Posts for Review
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Posts for review">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "30%" }}>Actions</TableCell>
              <TableCell>Post Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.Id}>
                <TableCell>
                  <Button
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to release this post?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/posts/${post.Id}/release`,
                          token,
                          "PATCH",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Release Post
                  </Button>
                  <Button
                    color="error"
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to delete this post?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/posts/${post.Id}`,
                          token,
                          "DELETE",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Delete Post
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{post.Content}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/** Flags list component */
function FlagsForReview({
  flags,
  token,
  refreshQueue,
  openConfirmationDialog,
}: {
  flags: any[];
  token?: string;
  refreshQueue: () => void;
  openConfirmationDialog: (message: string, onConfirm: () => void) => void;
}) {
  if (!flags || flags.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        No flags available for review.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Flags for Review
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Flags for review">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "30%" }}>Actions</TableCell>
              <TableCell>Flagged Post Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flags.map((flag) => (
              <TableRow key={flag.Id}>
                <TableCell>
                  <Button
                    sx={{ mr: 1 }}
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to delete this flag?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/posts/${flag.PostId}/flag`,
                          token,
                          "DELETE",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Delete Flag
                  </Button>
                  <Button
                    color="error"
                    onClick={() =>
                      openConfirmationDialog("Are you sure you want to delete this post?", () =>
                        handleAction(
                          `${import.meta.env.VITE_API_URL}/moderator/posts/${flag.Post.Id}`,
                          token,
                          "DELETE",
                          refreshQueue
                        )
                      )
                    }
                  >
                    Delete Post
                  </Button>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{flag.Post.Content}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function ModeratorControlPanelPage() {
  const { session } = useSession();
  const [value, setValue] = React.useState(0);
  const [topics, setTopicsForReview] = React.useState<any[]>([]);
  const [posts, setPostsForReview] = React.useState<any[]>([]);
  const [flags, setFlags] = React.useState<any[]>([]);

  const token = session?.token;

  // A simple "refresh" toggle to trigger data fetching
  const [refreshFlag, setRefreshFlag] = React.useState(false);
  const refreshQueue = React.useCallback(() => {
    setRefreshFlag((prev) => !prev);
  }, []);

  // --- DIALOG STATE ---
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [confirmCallback, setConfirmCallback] = React.useState<() => void>(() => {});

  // Helper to open the dialog, set the message, and set the callback
  const openConfirmationDialog = React.useCallback((message: string, onConfirm: () => void) => {
    setDialogMessage(message);
    setConfirmCallback(() => onConfirm); // store callback for later use
    setDialogOpen(true);
  }, []);

  // Handler for confirm
  const handleDialogConfirm = React.useCallback(() => {
    // Call the stored callback
    confirmCallback();
    // Close the dialog
    setDialogOpen(false);
  }, [confirmCallback]);

  // Handler for cancel
  const handleDialogClose = React.useCallback(() => {
    setDialogOpen(false);
  }, []);

  React.useEffect(() => {
    const fetchModerationQueue = async () => {
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/moderator/queue`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      setTopicsForReview(json.topics || []);
      setPostsForReview(json.posts || []);
      setFlags(json.flags || []);
    };

    fetchModerationQueue();
  }, [token, refreshFlag]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        backgroundColor: "background.paper",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Moderator Control Panel
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="moderation tabs"
          >
            <Tab label="Moderation Queue" {...a11yProps(0)} />
            <Tab label="Review Post Flags" {...a11yProps(1)} />
            <Tab label="Ban User" {...a11yProps(2)} />
            <Tab label="Unban User" {...a11yProps(3)} />
            <Tab label="Lock User" {...a11yProps(4)} />
            <Tab label="Unlock User" {...a11yProps(5)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={value} index={0}>
          <TopicsForReview
            topics={topics}
            token={token}
            refreshQueue={refreshQueue}
            openConfirmationDialog={openConfirmationDialog}
          />
          <PostsForReview
            posts={posts}
            token={token}
            refreshQueue={refreshQueue}
            openConfirmationDialog={openConfirmationDialog}
          />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <FlagsForReview
            flags={flags}
            token={token}
            refreshQueue={refreshQueue}
            openConfirmationDialog={openConfirmationDialog}
          />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography>Ban User</Typography>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Typography>Unban User</Typography>
        </TabPanel>

        <TabPanel value={value} index={4}>
          <Typography>Lock User</Typography>
        </TabPanel>

        <TabPanel value={value} index={5}>
          <Typography>Unlock User</Typography>
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

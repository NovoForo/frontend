import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Topic } from "../types";
import { useSession } from "../SessionProvider";

const ListForumTopics = () => {
  const { categoryId, forumId } = useParams();
  const [topics, setTopics] = useState<Topic[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [totalTopics, setTotalTopics] = useState(0); // Total number of topics
  const [limit] = useState(10); // Number of items per page
  const session = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch total count
        const countResp = await fetch(import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}`);
        const countResult = await countResp.json();
        setTotalTopics(countResult.count); // Set the total count of topics

        // Fetch topics for the current page
        const resp = await fetch(
          import.meta.env.VITE_API_URL +
            `/categories/${categoryId}/forums/${forumId}?skip=${(page - 1) * limit}&limit=${limit}`
        );
        if (!resp.ok) {
          throw new Error(`Error: ${resp.statusText}`);
        }
        const result = await resp.json();
        setTopics(result.topics);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, forumId, page, limit]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: SetStateAction<number>) => {
    setPage(value); // Update the current page
  };

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  if (!topics || topics.length == 0)
    return (
      <Paper elevation={3}>
        {session && (
          <Box mb={2} textAlign="right">
            <Link to={`/category/${categoryId}/forums/${forumId}/topics/new`} style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                New Topic
              </Button>
            </Link>
          </Box>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Topic Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Statistics
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Last Reply
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body1">
                    There are no topics in the forum yet. Start a new discussion to get things going!
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {session && (
        <Box mb={2} textAlign="right">
          <Link to={`/category/${categoryId}/forums/${forumId}/topics/new`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              New Topic
            </Button>
          </Link>
        </Box>
      )}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Topic Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Statistics
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Last Reply
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body1">
                      There are no topics in the forum yet. Start a new discussion to get things going!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {topics.length > 0 &&
                topics.map((topic) => (
                  <TableRow
                    key={topic.Id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Link
                        to={`/category/${categoryId}/forums/${forumId}/topics/${topic.Id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography variant="subtitle1">{topic.Title}</Typography>
                      </Link>
                      <Typography variant="caption">Posted on: {new Date(topic.CreatedAt).toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {topic.Views} Views
                        <br />
                        {topic.Posts.length - 1} Replies
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        <Link to="/" style={{ textDecoration: "none" }}>
                          {topic.Posts[topic.Posts.length - 1].User.Username}
                        </Link>{" "}
                        replied at: {new Date(topic.Posts[topic.Posts.length - 1].CreatedAt).toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(totalTopics / limit)} // Total pages
          page={page} // Current page
          onChange={handlePageChange} // Handle page change
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ListForumTopics;

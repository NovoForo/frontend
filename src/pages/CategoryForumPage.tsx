import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CategoryForumPage = () => {
  const { categoryId, forumId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  // Current page
  const [totalTopics, setTotalTopics] = useState(0);  // Total number of topics
  const [limit] = useState(10);  // Number of items per page
  const session = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch total count
        const countResp = await fetch(
          import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}`
        );
        const countResult = await countResp.json();
        setTotalTopics(countResult.count);  // Set the total count of topics

        // Fetch topics for the current page
        const resp = await fetch(
          import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}?skip=${(page - 1) * limit}&limit=${limit}`
        );
        if (!resp.ok) {
          throw new Error(`Error: ${resp.statusText}`);
        }
        const result = await resp.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, forumId, page, limit]);

  const handlePageChange = (event, value) => {
    setPage(value);  // Update the current page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.topics) return <p>No data found.</p>;

  return (
    <>
      {session && (
        <Link to={`/category/${categoryId}/forums/${forumId}/topics/new`}>
          <Button variant="contained">New Topic</Button>
        </Link>
      )}

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Topic Title</TableCell>
              <TableCell>Statistics</TableCell>
              <TableCell>Last Reply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.topics.length == 0 && (
              <TableRow>
                <TableCell>There are no topics in the forum yet. Start a new discussion to get things going!</TableCell>
              </TableRow>
            )}
            {data.topics.map((topic) => (
              <TableRow key={topic.Id}>
                <TableCell>
                  <Link to={`/category/${categoryId}/forums/${forumId}/topics/${topic.Id}`}>{topic.Title}</Link>
                  <br />
                  Posted on: {new Date(topic.CreatedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {topic["Posts"].length - 1} Replies
                </TableCell>
                <TableCell>
                  <Link to='/'>{topic["Posts"].at(-1).User.Username}</Link> replied at: {new Date(topic["Posts"].at(-1).CreatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(totalTopics / limit)}  // Total pages
        page={page}  // Current page
        onChange={handlePageChange}  // Handle page change
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </>
  );
};

export default CategoryForumPage;

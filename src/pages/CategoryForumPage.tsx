import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSession } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CategoryForumPage = () => {
  const { categoryId, forumId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const session = useSession();
  
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch(
          import.meta.env.VITE_API_URL + `/categories/${categoryId}/forums/${forumId}`
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
  }, [categoryId, forumId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.topics) return <p>No data found.</p>;

  return (
    <>
      {session &&
        <Link to={`/category/${categoryId}/forums/${forumId}/topics/new`}><Button variant="contained">New Topic</Button></Link>
      }
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
          {console.log(data.topics)}
          {data.topics.map((topic) => (
            <TableRow key={topic.Id}>
              <TableCell >
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
    </>
  );
};

export default CategoryForumPage;

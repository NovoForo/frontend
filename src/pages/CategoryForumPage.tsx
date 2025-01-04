import { Button, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
          `http://localhost:8000/categories/${categoryId}/forums/${forumId}`
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
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Topic Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data.topics.map((topic) => (
          <TableRow>
            <TableCell key={topic.Id}><Link to={`/category/${categoryId}/forums/${forumId}/topics/${topic.Id}`}>{topic.Title}</Link></TableCell>
          </TableRow>
        ))}
        </TableBody>
      </TableContainer>
    </>
  );
};

export default CategoryForumPage;

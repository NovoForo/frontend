import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const TopicPage = () => {
  const { categoryId, forumId, topicId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch(
          `http://localhost:8000/categories/${categoryId}/forums/${forumId}/topics/${topicId}`
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
  if (!data || !data.posts) return <p>No data found.</p>;

  return (
    <>
    <Typography><h2>{data.posts[0].Title}</h2></Typography>
    <TableContainer component={Paper}>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Post Content</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {data.posts.map((post) => (
        <TableRow key={post.Id}>
          <TableCell>{post.User.Username}</TableCell>
          <TableCell>{post.Content}</TableCell>
        </TableRow>
      ))}
      </TableBody>
    </TableContainer>
    </>
  );
};

export default TopicPage;

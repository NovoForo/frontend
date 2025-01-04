import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryForumPage = () => {
  const { categoryId, forumId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <ul>
      {data.topics.map((topic) => (
        <li key={topic.Id}>{topic.Title}</li>
      ))}
    </ul>
  );
};

export default CategoryForumPage;

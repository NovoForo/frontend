import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, Forum} from "../types"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

export default function ForumsPage() {
  const [categories, setCategories] = useState<Category[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch(import.meta.env.VITE_API_URL + '/categories');

        if (!resp.ok) {
          throw new Error(`Error: ${resp.statusText}`);
        }

        const result = await resp.json();
        setCategories(result.Categories);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!categories) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Forums
      </Typography>

      {categories.map((category) => (
        <Card key={category.Id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {category.Name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {category.Description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <TableContainer component={Paper}>
              <Table size="small" aria-label="forums table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Forum Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Forum Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.Forums.map((forum) => (
                    <TableRow key={forum.Id}>
                      <TableCell>
                        <Link
                          to={`/category/${category.Id}/forums/${forum.Id}`}
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          {forum.Name}
                        </Link>
                      </TableCell>
                      <TableCell>{forum.Description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

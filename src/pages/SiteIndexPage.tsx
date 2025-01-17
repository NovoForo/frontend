import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Category, Forum } from "../types";
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
  Typography,
} from "@mui/material";

export default function SiteIndexPage() {
  const [categories, setCategories] = useState<Category[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch(import.meta.env.VITE_API_URL + "/categories");

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Forums
      </Typography>

      {categories &&
        categories.map((category) => (
          <Card key={category.Id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {category.Name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {category.Description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {category.Forums && category.Forums.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table aria-label="forums table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Forum Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Forum Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category.Forums.length > 0 &&
                        category.Forums.map((forum) => (
                          <TableRow
                            key={forum.Id}
                            hover
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>
                              <Link
                                to={`/category/${category.Id}/forums/${forum.Id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                              >
                                <Typography variant="subtitle1">{forum.Name}</Typography>
                              </Link>
                            </TableCell>
                            <TableCell>{forum.Description}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No forums available in this category.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}

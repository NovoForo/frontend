import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

type Category = {
  Id: number,
  Name: string,
  Description: string,
  Forums: Forum[]
}

type Forum = {
  Id: number
}

export default function ForumsPage() {
  const [categories, setCategories] = useState<Category[]>()
  const [error, setError] = useState()

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch('http://localhost:8000/categories');

        if (!resp.ok) {
          throw new Error(`Error: ${resp.statusText}`);
        }

        const result = await resp.json();
        setCategories(result.Categories)
      } catch (err: any) {
          setError(err.message);
      }
    }

    fetchData();
  }, [])

  if (error) return <p>Error: {error}</p>;
  // console.log(categories)

  return (
    <>
      {categories && categories.map((category) => (
        <div key={category.Id}>
          <Typography variant="h5" gutterBottom>
              {category.Name}
          </Typography>
          <Typography>{category.Description}</Typography>

          <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
              <TableHead>
                  <TableRow>
                      <TableCell>Forum Name</TableCell>
                      <TableCell>Forum Description</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {category.Forums.map((sub_row) => (
                  <TableRow key={sub_row["Id"]}>
                    <TableCell component="th" scope="row">
                      <Link to={`/category/${category["Id"]}/forums/${sub_row["Id"]}`}>{sub_row.Name}</Link>
                    </TableCell>
                    <TableCell>
                      {sub_row.Description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </>
  );
}

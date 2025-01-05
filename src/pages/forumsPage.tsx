import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PAGE_LIMIT = 5; // Number of rows per page

export default function ForumsPage() {
    const [rows, setRows] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const [page, setPage] = React.useState(0);

    React.useEffect(() => {
        async function fetchData() {
            const skip = page * PAGE_LIMIT;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories?skip=${skip}&limit=${PAGE_LIMIT}`);
            const data = await response.json();
            setRows(data["Categories"]);
            setCount(data["count"]); // Total number of rows
        }
        fetchData();
    }, [page]);

    const handleNext = () => {
        if ((page + 1) * PAGE_LIMIT < count) {
            setPage(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <>
            {rows.map((row) => (
                <div key={row.Id}>
                    <Typography variant="h5" gutterBottom>
                        {row.Name}
                    </Typography>
                    <Typography>{row.Description}</Typography>

                    <TableContainer component={Paper} sx={{ width: '100%' }}>
                        <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Forum Name</TableCell>
                                    <TableCell>Forum Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row["Forums"].map((sub_row) => (
                                    <TableRow key={sub_row["Id"]}>
                                        <TableCell component="th" scope="row">
                                            <Link to={`/category/${row["Id"]}/forums/${sub_row["Id"]}`}>{sub_row.Name}</Link>
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                    variant="contained" 
                    onClick={handlePrev} 
                    disabled={page === 0}
                >
                    Previous
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleNext} 
                    disabled={(page + 1) * PAGE_LIMIT >= count}
                >
                    Next
                </Button>
            </Box>
        </>
    );
}

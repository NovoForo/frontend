import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

const rows = await fetch(import.meta.env.VITE_API_URL + '/categories').then(res => res.json());

export default function ForumsPage() {
    return (
        <>
            {rows["Categories"].map((row) => (
                <>
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
                                        <Link to={`/category/${row["Id"]}/forums/${sub_row["Id"]}`}>{row.Name}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {row.Description}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>


                </>
            ))}
        </>
    );
}

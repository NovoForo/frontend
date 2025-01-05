import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import { useSession } from '@toolpad/core';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { ExtendedSession } from './signIn';

export default function NewTopicsPage() {
      const { categoryId, forumId } = useParams();
    const session = useSession();
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [postContent, setPostContent] = useState('');
    const navigate = useNavigate()

    const handlePostClick = () => {
         fetch(import.meta.env.VITE_API_URL + `/s/categories/${categoryId}/forums/${forumId}/topics`,
                {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${(session as ExtendedSession).token}`,
                    },
                    body: JSON.stringify({
                      title: topicTitle,
                      description: topicDescription,
                      content: postContent,
                    }),
                  }
            ).then(() => {
                navigate('/')
            });
    }

    React.useEffect(() => {
        if (!session) {
            navigate('/')
        }
    })
    
    return (
        <>
            {session && (
            <Box component="form" noValidate autoComplete="off">
            <TextField
                id="topicTitle"
                label="Title"
                fullWidth
                margin="normal"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
            />
            <TextField
                id="topicDescription"
                label="Description"
                fullWidth
                margin="normal"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
            />
            <TextField
                id="postContent"
                label="Content"
                fullWidth
                margin="normal"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
            <br />
            <Button 
                variant="contained" 
                onClick={handlePostClick}
            >
                Create New Topic
            </Button>
            </Box>
        )}
        </>
    );
}

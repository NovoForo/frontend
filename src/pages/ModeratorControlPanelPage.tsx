import { Box, Button, Paper, Typography } from '@mui/material';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useSession } from '@toolpad/core';
import { ExtendedSession } from '../ExtendedSession';

function ModeratorControlPanelPage() {
    const session = useSession() as ExtendedSession | null;
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
      }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
          </div>
        );
      }

    
    const [topics, setTopicsForReview] = React.useState([]);
    const [posts, setPostsForReview] = React.useState([]);
    React.useEffect(() => {
        const fetchModerationQueue = async () => {
            await fetch(import.meta.env.VITE_API_URL + `/moderator/queue`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${session?.token}`,
                    }
                }).then((resp) => resp.json()).then((json) => {
                    setTopicsForReview(json.topics);
                    setPostsForReview(json.posts);
                });
        };
        fetchModerationQueue();
    }, [session]);

    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundColor: "background.paper",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Moderator Control Panel
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Moderation Queue" {...a11yProps(0)} />
                <Tab label="Review Post Flags" {...a11yProps(1)} />
                <Tab label="Ban User" {...a11yProps(2)} />
                <Tab label="Unban User" {...a11yProps(3)} />
                <Tab label="Lock User" {...a11yProps(4)} />
                <Tab label="Unlock User" {...a11yProps(5)} />
            </Tabs>
            </Box>
                <CustomTabPanel value={value} index={0}>
                        <section>
                            <h2>Topics for Review</h2>
                            {topics && topics.results && topics.results.length > 0 ? (
                            <ul>
                                {topics.results.map((topic) => (
                                <li key={topic.Id}>
                                    <Button color="error">Release Topic</Button> <strong>{topic.Title}</strong>
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <p>No topics available for review.</p>
                            )}
                        </section>
                        <section>
                            <h2>Posts for Review</h2>
                            {posts && posts.results && posts.results.length > 0 ? (
                            <ul>
                                {posts.results.map((post) => (
                                <li key={post.Id}>
                                    <Button color="error">Release Post</Button> {post.Content}
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <p>No posts available for review.</p>
                            )}
                    </section>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                Review Post Flags
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                Ban User
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                Unban User
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                Lock User
                </CustomTabPanel>
                <CustomTabPanel value={value} index={5}>
                Unlock User
                </CustomTabPanel>
            </Paper>
    </Box>
    )
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default ModeratorControlPanelPage
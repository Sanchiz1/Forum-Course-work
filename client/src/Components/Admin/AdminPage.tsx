import { Container, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestMonthlyPosts, requestMonthlyUsers } from '../../API/statisticsRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AdminPage() {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [posts, setPosts] = useState<number[]>(Array<number>(12).fill(0));
    const [users, setUsers] = useState<number[]>(Array<number>(12).fill(0));
    const [postsYear, setPostsYear] = useState(new Date().getFullYear());
    const [usersYear, setUsersYear] = useState(new Date().getFullYear());

    useEffect(() => {
        requestMonthlyPosts(postsYear).subscribe({
            next(posts) {
                setPosts(posts);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    }, [postsYear])

    useEffect(() => {
        requestMonthlyUsers(usersYear).subscribe({
        next(users) {
            setUsers(users);
        },
        error(err) {
            dispatch(setGlobalError(err.message));
        },
    })
    }, [usersYear])

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                minHeight: '100vh',
                overflow: 'auto',
                display: 'flex'
            }}
        >
            <Container maxWidth='lg' sx={{
                mt: 4, mb: 4, width: 1
            }}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <Button onClick={() => navigator("/Categories")}>Categories</Button>
                    </Grid>
                    <Grid item xs={12}>

                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Typography variant='h5'>Posts</Typography>
                            <TextField
                                sx={{ml: 'auto'}}
                                size='small'
                                type='number'
                                InputProps={{ inputProps: { min: 2023, max: 2900 } }}
                                value={postsYear}
                                onChange={(e) => setPostsYear(parseInt(e.target.value)!)}>

                            </TextField>
                        </Grid>
                        <BarChart
                            xAxis={[
                                {
                                    id: 'barPosts',
                                    data: months,
                                    scaleType: 'band'
                                },
                            ]}
                            series={[
                                {
                                    data: posts
                                },
                            ]}
                            height={300}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            <Typography variant='h5'>Users</Typography>
                            <TextField
                                sx={{ml: 'auto'}}
                                size='small'
                                type='number'
                                InputProps={{ inputProps: { min: 2023, max: 2900 } }}
                                value={usersYear}
                                onChange={(e) => setUsersYear(parseInt(e.target.value)!)}>

                            </TextField>
                        </Grid>
                        <BarChart
                            xAxis={[
                                {
                                    id: 'barUsers',
                                    data: months,
                                    scaleType: 'band',
                                },
                            ]}
                            series={[
                                {
                                    data: users,
                                },
                            ]}
                            height={300}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
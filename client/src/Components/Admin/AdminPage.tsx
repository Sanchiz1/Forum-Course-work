import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserAccount } from '../../Redux/Epics/AccountEpics';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { Backdrop, Badge, CircularProgress, Container, CssBaseline, IconButton, LinearProgress, Toolbar, Collapse, TextField, Alert, Select, MenuItem, Skeleton, SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { GetDateString } from '../../Helpers/DateFormatHelper';
import { User, UserInput } from '../../Types/User';
import { requestUserByUsername, updateUserRequest } from '../../API/userRequests';
import { SnackbarProvider, VariantType, enqueueSnackbar, useSnackbar } from 'notistack';
import { BootstrapInput } from '../UtilComponents/BootstrapInput';
import { Post } from '../../Types/Post';
import { requestUserPosts } from '../../API/postRequests';
import PostElement from '../Posts/PostElement';
import { BarChart } from '@mui/x-charts';
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

    const Account = useSelector((state: RootState) => state.account.Account);

    const fetchMonthlyPosts = () => {
        requestMonthlyPosts(postsYear).subscribe({
            next(posts) {
                setPosts(posts);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    }
    const fetchMonthlyUsers = () => {
        requestMonthlyUsers(usersYear).subscribe({
            next(users) {
                setUsers(users);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    }
    useEffect(() => {
        fetchMonthlyPosts();
    }, [postsYear])

    useEffect(() => {
        fetchMonthlyUsers();
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
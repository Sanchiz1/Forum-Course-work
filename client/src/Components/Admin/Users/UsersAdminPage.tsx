import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestMonthlyPosts, requestMonthlyUsers } from '../../../API/statisticsRequests';
import { setGlobalError } from '../../../Redux/Reducers/AccountReducer';
import { Title } from '@mui/icons-material';

export default function UsersAdminPage() {
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
                    <Grid item xs={12}>
                        <Title>Recent Orders</Title>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Ship To</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell align="right">Sale Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
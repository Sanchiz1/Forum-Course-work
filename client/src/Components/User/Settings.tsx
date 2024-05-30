import CloseIcon from '@mui/icons-material/Close';
import { Alert, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogTitle, IconButton, LinearProgress, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../../API/loginRequests';
import { DeleteAccountRequest, changeUserPasswordRequest } from '../../API/userRequests';
import { getAccount } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { User } from '../../Types/User';

export default function Settings() {
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
    const [error, setError] = useState<String>('');
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const Account = useSelector((state: RootState) => state.account.Account);

    const handleSubmitChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password')!.toString();
        const new_password = data.get('new_password')!.toString();
        const repeat_new_password = data.get('repeat_new_password')!.toString();
        if (password == '' || new_password == '' || repeat_new_password == '') {
            setError('Fill all field');
            return;
        }
        if (new_password.length < 8 || new_password.length > 50) {
            setError('Password should be between 8 and 50 characters');
            return;
        }
        if (new_password !== repeat_new_password) {
            setError('Repeated password is not the same');
            return;
        }
        changeUserPasswordRequest(password, new_password).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                setOpenChangePassword(false);
            },
            error(err) {
                setError(err.message);
            },
        });
    }

    const handleSubmitDeleteUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password')!.toString();
        if (password == '') {
            setError('Fill password field');
            return;
        }
        DeleteAccountRequest(Account.Id, password).subscribe({
            next() {
                Logout();
                dispatch(getAccount({} as User)); navigator('/');
            },
            error(err) {
                setError(err.message);
            },
        });
    }

    return (
        <>
            {Account !== undefined ?
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
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
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            height: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignSelf: "flex-start"
                                        }}
                                    >
                                        <Typography variant='h5'>
                                            Change password
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Button variant='outlined' color='secondary' sx={{ mb: 3, width: 'fit-content' }}
                                            onClick={() => setOpenChangePassword(true)}>Change password</Button>
                                        <Typography variant='h5'>
                                            Delete account
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <Typography variant='caption'>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </Typography>
                                        <Button variant='outlined' color='error' sx={{ mb: 3, width: 'fit-content' }}
                                            onClick={() => setOpenDeleteAccount(true)}>Delete account</Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
                :
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }

            <Dialog
                open={openChangePassword}
                onClose={() => setOpenChangePassword(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <Box component="form"
                    noValidate sx={{ m: 0 }}
                    onSubmit={handleSubmitChangePassword}
                >
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>

                        <Typography>
                            Old password
                        </Typography>
                        <TextField
                            variant='outlined'
                            size='small'
                            placeholder='Old password'
                            name="password"
                            type={'password'}
                            required
                            fullWidth
                            inputProps={{ maxLength: 50 }}
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                        <Typography>
                            New password
                        </Typography>
                        <TextField
                            variant='outlined'
                            size='small'
                            placeholder='New password'
                            name="new_password"
                            type='password'
                            required
                            fullWidth
                            inputProps={{ maxLength: 50 }}
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                        <Typography>
                            Repeat new password
                        </Typography>
                        <TextField
                            variant='outlined'
                            size='small'
                            placeholder='Repeat new password'
                            name="repeat_new_password"
                            type='password'
                            required
                            fullWidth
                            inputProps={{ maxLength: 50 }}
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                    </DialogTitle>
                    <Collapse in={error != ''}
                        sx={{ px: 3 }}>
                        <Alert
                            color='error'
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setError('');
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    </Collapse>
                    <DialogActions>
                        <Button onClick={() => setOpenChangePassword(false)}>Cancel</Button>
                        <Button type='submit' autoFocus>
                            Change password
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>


            <Dialog
                open={openDeleteAccount}
                onClose={() => setOpenDeleteAccount(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <Box component="form"
                    noValidate sx={{ m: 0 }}
                    onSubmit={handleSubmitDeleteUser}
                >
                    <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
                        <Typography sx={{ mb: 2 }}>
                            Are You sure You want to delete your account? There is no going back.
                        </Typography>
                        <TextField
                            variant='outlined'
                            size='small'
                            placeholder='Password'
                            name="password"
                            type='password'
                            required
                            fullWidth
                            inputProps={{ maxLength: 50 }}
                            minRows={1}
                            sx={{ mb: 2 }}
                            error={error != ''}
                            onFocus={() => setError('')}
                            helperText={error}
                        />
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteAccount(false)}>Cancel</Button>
                        <Button type='submit' autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
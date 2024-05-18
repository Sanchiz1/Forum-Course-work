import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Box, Button, Container, CssBaseline, Dialog, DialogActions, Alert, IconButton, Collapse, Paper, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { useState, useEffect } from 'react';
import { createPostRequest } from '../../API/postRequests';
import { PostInput } from '../../Types/Post';
import { enqueueSnackbar } from 'notistack';


export default function CreatePost() {
    const dispatch = useDispatch();
    const navigator = useNavigate()

    const Account = useSelector((state: RootState) => state.account.Account);


    const [postConfirmOpen, setPostConfirmOpen] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = (e: any) => {
        e.preventDefault()
        e.returnValue = ''
    }


    const [error, setError] = useState<String>('');
    const [titleError, SetTitleError] = useState('');
    const [textError, SetTextError] = useState('');
    const handlePostSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get('title')!.toString().trim();
        const text = data.get('text')!.toString().trim();
        if (title.length == 0) {
            SetTitleError('Fill title field');
            return;
        }
        const postInput: PostInput = {
            title: title,
            text: text
        }
        createPostRequest(postInput).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                navigator("/");
            },
            error(err) {
                setError(err.message)
            },
        })
    };

    return (
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
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex'
                }}
            >
                <Container maxWidth='lg' sx={{
                    mt: 4, mb: 4
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h5" color="text.secondary" component="p" gutterBottom>
                                Create post
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{
                                p: 1,
                                width: 1,
                            }}>

                                <Box component="form" onSubmit={handlePostSubmit} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        label="Title"
                                        name="title"
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 100 }}
                                        error={titleError != ''}
                                        onFocus={() => SetTitleError('')}
                                        helperText={titleError}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="outlined-multiline-flexible"
                                        label="Text"
                                        name="text"
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 1000 }}
                                        multiline
                                        minRows={4}
                                        error={textError != ''}
                                        onFocus={() => SetTextError('')}
                                        helperText={textError}
                                    />
                                    <Collapse in={error != ''}>
                                        <Alert
                                            severity="error"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="inherit"
                                                    onClick={() => {
                                                        setError('');
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                            sx={{ mb: 2, fontSize: 15 }}
                                        >
                                            {error}
                                        </Alert>
                                    </Collapse>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ml: 'auto', width:'fit-content'}}
                                    >
                                        Post
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )


}
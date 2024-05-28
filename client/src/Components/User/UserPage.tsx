import CloseIcon from '@mui/icons-material/Close';
import { Alert, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogTitle, IconButton, LinearProgress, MenuItem, Select, SelectChangeEvent, Skeleton, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { requestUserPosts } from '../../API/postRequests';
import { DeleteUserRequest, requestUserByUsername, updateUserRequest, updateUserRoleRequest } from '../../API/userRequests';
import { GetDateString } from '../../Helpers/DateFormatHelper';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { Post } from '../../Types/Post';
import { User, UserInput } from '../../Types/User';
import PostElement from '../Posts/PostElement';
import { BootstrapInput } from '../UtilComponents/BootstrapInput';
import UserNotFoundPage from './UserNotFoundPage';

const validUsernamePattern = /^[a-zA-Z0-9_.]+$/;
const validEmailPattern = /^(?=.{0,64}$)[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const roles = {
  1: "User",
  2: "Admin",
  3: "Moderator",
};

export default function UserPage() {
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState(0);
  const [userExists, setUserExists] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  let { Username } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation()

  const Account = useSelector((state: RootState) => state.account.Account);

  useEffect(() => {
    requestUserByUsername(Username!).subscribe({
      next(user) {
        if (user === null) {
          setUserExists(false);
          return;
        }
        setUser(user);
        setRole(user.RoleId)
        refetchposts()
      },
      error(err) {
      },
    })
  }, [Username])



  //Edit
  const [usernameError, SetUsernameError] = useState('');
  const [emailError, SetEmailError] = useState('');
  const [bioError, SetBioError] = useState('');
  const [error, setError] = useState<String>('');

  const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username')!.toString().trim();
    const email = data.get('email')!.toString().trim();
    const bio = data.get('bio')!.toString().trim();

    if (!validUsernamePattern.test(username)) {
      SetUsernameError('Invalid username');
      return;
    }
    if (!validEmailPattern.test(email)) {
      SetEmailError('Invalid email');
      return;
    }
    if (bio.length > 100) {
      SetBioError('Bio can have maximum of 100 characters');
      return;
    }

    const userInput: UserInput = {
      username: username,
      email: email,
      bio: bio
    }

    updateUserRequest(userInput).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        setError('');
        setOpenEdit(false);
        navigator("/user/" + userInput.username);
      },
      error(err) {
        setError(err.message)
      },
    })
  }


  // Posts

  const next = 4;
  const [userTimestamp, setUserTimestamp] = useState(new Date());
  const [offset, setOffset] = useState(0);
  const [order, setOrder] = useState("DateCreated");
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [fetching, setFetching] = useState(false);

  const refetchposts = () => {
    setFetching(false);
    setHasMore(true);
    setPosts([]);
    setUserTimestamp(new Date());
    setOffset(0);
    setRefresh(!refresh);
  }

  useEffect(() => {
    refetchposts()
  }, [order]);


  const fetchposts = () => {
    requestUserPosts(Username!, offset, next, order, userTimestamp).subscribe({
      next(value) {
        if (value.length == 0) {
          setHasMore(false);
          setFetching(false);
          return;
        }
        setPosts([...posts, ...value])
        setFetching(false);
        if (document.documentElement.offsetHeight - window.innerHeight < 100) {
          setOffset(offset + next);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      },
      error(err: any) {
        setHasMore(false);
        dispatch(setGlobalError(err.message));
      },
    })
  }
  useEffect(() => {
    if (!fetching && hasMore) {
      setFetching(true);
      fetchposts();
    }
  }, [offset, refresh]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight - 10 || !hasMore || fetching) return;
    setOffset(offset + next);
  }


  // edit role 
  const handleChange = (event: SelectChangeEvent) => {
    setRole(parseInt(event.target.value));
  };

  const handleSubmitEditRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let role_id: number | null = role;
    if (role === 0) {
      role_id = null;
    }
    updateUserRoleRequest(user?.Id!, role_id).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        setError('');
        setOpenEdit(false);
        navigator("/user/" + Username);
      },
      error(err) {
        setError(err.message)
      },
    })
  }


  // delete
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const handleSubmitDeleteUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')!.toString();
    if (password == '') {
      setError('Fill password field');
      return;
    }
    DeleteUserRequest(user!.Id, password).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        navigator('/');
      },
      error(err) {
        setError(err.message);
      },
    });
  }

  return (
    <>
      {userExists ?
        <>
          {user != undefined ?
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
                    <Grid item xs={12} md={4} lg={4}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 1,
                          }}
                        >
                          <Grid sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}>
                            <Typography variant="h4" color="text.secondary" component="p">
                              {user.Username}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="p">
                              Joined: {GetDateString(new Date(user.DateRegistered))}
                            </Typography>
                            {
                              user.Bio &&
                              <>
                                <Typography variant="subtitle1" color="text.secondary" component="p" sx={{ mt: 2, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                                  {user.Bio}
                                </Typography>
                              </>
                            }
                            {(Account != null && user.Id === Account.Id) &&
                              <>
                                <Divider sx={{ mt: 2 }} />
                                <Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
                                <Collapse in={openEdit}>
                                  <Box component="form" onSubmit={handleSubmitEdit} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="username"
                                      label="Username"
                                      name="username"
                                      autoComplete="off"
                                      autoFocus
                                      defaultValue={Account.Username}
                                      error={usernameError != ''}
                                      onFocus={() => SetUsernameError('')}
                                      helperText={usernameError}
                                    />
                                    <TextField
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="email"
                                      label="Email address"
                                      name="email"
                                      autoComplete="off"
                                      autoFocus
                                      defaultValue={Account.Email}
                                      error={emailError != ''}
                                      onFocus={() => SetEmailError('')}
                                      helperText={emailError}
                                    />
                                    <TextField
                                      margin="normal"
                                      fullWidth
                                      id="bio"
                                      label="Bio"
                                      name="bio"
                                      multiline
                                      rows={4}
                                      inputProps={{ maxLength: 100 }}
                                      defaultValue={Account.Bio}
                                      error={bioError != ''}
                                      onFocus={() => SetBioError('')}
                                      helperText={bioError}
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
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                </Collapse>
                              </>}
                            {(Account.Role === 'Admin' && user.Role !== 'Admin') &&
                              <>
                                <Divider sx={{ mt: 2 }} />
                                <Button onClick={() => setOpenEdit(!openEdit)}>Settings</Button>
                                <Collapse in={openEdit}>
                                  <Box component="form" onSubmit={handleSubmitEditRole} noValidate sx={{ mt: 1, mb: 3 }}>
                                    <Select
                                      labelId="role-label"
                                      id="role"
                                      value={role.toString()}
                                      fullWidth
                                      onChange={handleChange}
                                      sx={{ mb: 2 }}
                                    >
                                      <MenuItem value={0}>User</MenuItem>
                                      <MenuItem value={1}>Moderator</MenuItem>
                                      <MenuItem value={2}>Admin</MenuItem>
                                    </Select>
                                    <Button
                                      type="submit"
                                      fullWidth
                                      variant="outlined"
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                  <Button color='error' sx={{ width: "100%" }} onClick={() => { setOpenDeleteAccount(true) }}>Delete user</Button>
                                </Collapse>
                              </>}
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={8} lg={8}>
                      <Grid item xs={12} sx={{ mb: 2 }}>
                        <Paper
                          sx={{
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 1,
                          }}
                        >
                          <Grid item xs={12} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.primary" component="p">
                              {user.Posts} posts
                            </Typography>
                            <Typography variant="subtitle1" color="text.primary" component="p">
                              {user.Comments} comments
                            </Typography>
                          </Grid>
                          <Divider sx={{ mb: 1 }} />
                          <Grid item xs={12} sx={{
                            width: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                          }}>
                            <Typography variant="subtitle1" color="text.primary" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                              {user.Username}`s posts
                            </Typography>
                            <Typography variant="subtitle1" sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                              <Select
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                input={<BootstrapInput sx={{ height: 1, display: 'flex' }} />}
                              >
                                <MenuItem value={"Likes"}>Top</MenuItem>
                                <MenuItem value={"DateCreated"}>New</MenuItem>
                              </Select>
                            </Typography>
                          </Grid>
                        </Paper>
                      </Grid>
                      {
                        posts?.map((post, index) =>
                          <PostElement
                            post={post}
                            key={index}
                            customClickEvent={(event: React.MouseEvent<HTMLDivElement>) => navigator('/post/' + post.Id, { state: state })}
                            sx={{ mb: 1 }}
                          ></PostElement>
                        )
                      }
                      <Grid item xs={12} md={12} lg={12}>
                        {
                          hasMore &&
                          <Paper sx={{
                            p: 1,
                            width: 1,
                            ":hover": {
                              boxShadow: 5
                            }
                          }}>
                            <Skeleton width="10%" animation="wave" sx={{ fontSize: '10px' }} />
                            <Skeleton width="30%" animation="wave" />
                            <Divider />
                            <Skeleton animation="wave" height={40} />
                          </Paper>
                        }
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </Box>

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
                      Are You sure You want to delete this user? There is no going back.
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
            </Box>
            :
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          }
        </>
        :
        <UserNotFoundPage></UserNotFoundPage>
      }
    </>
  );
}
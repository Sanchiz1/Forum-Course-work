import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Box, Button, Container, CssBaseline, MenuItem, Paper, Select, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAccount } from '../Redux/Epics/AccountEpics';
import { RootState } from '../Redux/store';
import ButtonWithCheck from './UtilComponents/ButtonWithCheck';
import { isSigned } from '../API/loginRequests';
import { useLocation, useNavigate } from 'react-router-dom';
import { setGlobalError, setLogInError } from '../Redux/Reducers/AccountReducer';
import { useEffect, useRef, useState } from 'react';
import { requestPosts } from '../API/postRequests';
import { Post } from '../Types/Post';
import PostElement from './Posts/PostElement';
import { User } from '../Types/User';
import { BootstrapInput } from './UtilComponents/BootstrapInput';
import CategoriesFilter from './Categories/CategoryFilter';

export default function Main() {
  const next = 4;
  const [userTimestamp, setUserTimestamp] = useState(new Date());
  const [offset, setOffset] = useState(0);
  const [order, setOrder] = useState("Date_Created");
  const [categories, setCategories] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);

  const elementRef = useRef(null);

  const dispatch = useDispatch();
  const navigator = useNavigate()
  const { state } = useLocation()

  const Account: User = useSelector((state: RootState) => state.account.Account);

  useEffect(() => {
    setFetching(false);
    setHasMore(true);
    setPosts([]);
    setUserTimestamp(new Date());
    setOffset(0);
  }, [order, categories]);

  const fetchposts = () => {
    requestPosts(offset, next, order, userTimestamp, categories).subscribe({
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
      error(err) {
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
  }, [offset, userTimestamp]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight - 10 || !hasMore || fetching) return;
    setOffset(offset + next);
  }


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
          minHeight: '100vh',
          overflow: 'auto',
          display: 'flex'
        }}
      >
        <Container maxWidth='lg' sx={{
          mt: 4, mb: 4
        }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{
                p: 1,
                width: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Typography variant="caption" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                  <Select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    input={<BootstrapInput sx={{ height: 1, display: 'flex' }} />}
                  >
                    <MenuItem value={"Likes"}>Top</MenuItem>
                    <MenuItem value={"Date_Created"}>New</MenuItem>
                  </Select>
                </Typography>
                <CategoriesFilter Categories={categories} SetCategories={setCategories}></CategoriesFilter>
                <ButtonWithCheck sx={{ ml: 'auto' }} variant='text' ActionWithCheck={() => { navigator('/CreatePost'); }}>Create Post</ButtonWithCheck>
              </Paper>
            </Grid>
            {
              posts?.map((post, index) =>
                <PostElement post={post} key={index} customClickEvent={(event: React.MouseEvent<HTMLDivElement>) => navigator('/post/' + post.id, { state: state })}></PostElement>
              )
            }
            <Grid item xs={12} md={12} lg={12}>
              {
                hasMore ?
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
                  :
                  <Paper sx={{
                    p: 1,
                    width: 1,
                    ":hover": {
                      boxShadow: 5
                    }
                  }}>
                    <Typography>
                      You scrolled to the end...
                    </Typography>
                  </Paper>
              }
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )


}
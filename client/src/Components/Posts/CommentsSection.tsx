import { MenuItem, Select } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createCommentRequest, requestComments } from '../../API/commentRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { Comment, CommentInput } from '../../Types/Comment';
import { Post } from '../../Types/Post';
import { User } from '../../Types/User';
import CommentElement from '../Comments/CommentElement';
import { BootstrapInput } from '../UtilComponents/BootstrapInput';
import CommentInputElement from '../UtilComponents/CommentInputElement';

interface CommentsSectionProps {
    Post: Post
}

export default function CommentsSection(Props: CommentsSectionProps) {

    const [comments, setComments] = useState<Comment[]>([]);

    const [hasMore, setHasMore] = useState(true);

    const next = 4;
    const [userTimestamp, setUserTimestamp] = useState(new Date());
    const [offset, setOffset] = useState(0);
    const [order, setOrder] = useState("DateCreated");

    const [fetching, setFetching] = useState(false);



    let { PostId } = useParams();
    const dispatch = useDispatch();


    const refetchComments = () => {
        setFetching(false);
        setHasMore(true)
        setComments([]);
        setUserTimestamp(new Date())
        setOffset(0);
    }

    const fetchComments = () => {
        requestComments(parseInt(PostId!), offset, next, order, userTimestamp).subscribe({
            next(value) {
                if (value.length == 0) {
                    setFetching(false);
                    setHasMore(false);
                    return;
                }
                setComments([...comments, ...value]);
                setFetching(false);
                if (document.documentElement.offsetHeight - window.innerHeight < 100) {
                    setOffset(offset + next);
                }
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            },
            error(err) {
                dispatch(setGlobalError(err.message));
            },
        })
    }

    useEffect(() => {
        if (!fetching && hasMore) {
            setFetching(true);
            fetchComments()
        }
    }, [offset, userTimestamp])

    useEffect(() => {
        refetchComments()
    }, [order])

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.scrollHeight - 10 || !hasMore || fetching) return;
        setOffset(offset + next);
    }


    return (
        <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{
                p: 1,
                width: 1
            }}>
                <Grid sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    py: 0,
                }}>
                    <Typography variant="caption" sx={{ mr: 1, fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                        {Props.Post.Comments.toString()} Comments
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
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
                <CommentInputElement
                    Action={(e: string) => {
                        if (e.trim() === '') return;
                        const commentInput: CommentInput = {
                            postId: Props.Post.Id,
                            text: e
                        }
                        createCommentRequest(commentInput).subscribe(
                            {
                                next(value) {
                                    enqueueSnackbar(value, {
                                        variant: 'success', anchorOrigin: {
                                            vertical: 'top',
                                            horizontal: 'center'
                                        },
                                        autoHideDuration: 1500
                                    });
                                    refetchComments();
                                },
                                error(err) {
                                    dispatch(setGlobalError(err.message));
                                },
                            }
                        )
                    }
                    }></CommentInputElement>
                {
                    comments?.length === 0 ? <></> :
                        <>
                            {

                                comments?.map((comment, index) =>
                                    <CommentElement comment={comment} key={index} refreshComments={refetchComments}></CommentElement>
                                )
                            }
                        </>
                }
            </Paper>
        </Grid>
    );
}
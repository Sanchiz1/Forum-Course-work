import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Link, MenuItem, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { deleteCommentRequest, likeCommentRequest, requestCommentById, updateCommentRequest } from '../../API/commentRequests';
import { createReplyRequest, requestReplies } from '../../API/replyRequests';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { Comment } from '../../Types/Comment';
import { Reply, ReplyInput } from '../../Types/Reply';
import ButtonWithCheck from '../UtilComponents/ButtonWithCheck';
import CommentInputElement from '../UtilComponents/CommentInputElement';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import ReplyInputElement from '../UtilComponents/ReplyInputElement';
import { StyledMenu } from '../UtilComponents/StyledMenu';
import ReplyElement from './ReplyElement';
import { ShowFailure, ShowSuccess } from '../../Helpers/SnackBarHelper';

interface Props {
  comment: Comment;
  refreshComments: () => void
}

export default function CommentElement(props: Props) {
  const [comment, setComment] = useState(props.comment);
  const [liked, setLiked] = useState(props.comment.Liked);
  const [likes, setLikes] = useState(props.comment.Likes);
  const [replies, SetReplies] = useState<Reply[]>([])
  const [openReplyInput, setOpenReplyInput] = useState(false);
  const [openReplies, setOpenReplies] = useState(false);
  const dispatch = useDispatch();
  const Account = useSelector((state: RootState) => state.account.Account);


  const refetchComment = () => {
    setUserTimestamp(new Date())
    requestCommentById(comment.Id).subscribe({
      next(result) {
        setComment(result);
        refetchReplies();
      },
      error(err) {
        ShowFailure(err.message);
      }
    })
  }


  //menu
  const [showButton, setShowButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //edit
  const [openEdit, setOpenEdit] = useState(false);
  const [error, setError] = useState<String>('');

  const handleSubmitEdit = (text: string) => {
    if (text.trim().length === 0) {
      setError('Comment cannot be empty');
      return;
    }

    updateCommentRequest(text, props.comment.Id).subscribe({
      next(value) {
        ShowSuccess (value);
        setError('');
        setOpenEdit(false);
        refetchComment();
      },
      error(err) {
        ShowFailure(err.message);
      },
    })


  }

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const handleSubmitDelete = () => {
    deleteCommentRequest(comment.Id).subscribe({
      next(value) {
        ShowSuccess(value);
        setOpenDelete(false);
        props.refreshComments();
      },
      error(err) {
        ShowFailure(err.message);
      },
    })
  }

  //replies
  const next = 3;
  const order = "Date"
  const [fetching, setFetching] = useState(false);
  const [userTimestamp, setUserTimestamp] = useState(new Date());
  const [offset, setOffset] = useState(0);
  const [update, setUpdate] = useState<boolean>(false);

  const refetchReplies = () => {
    SetReplies([]);
    setFetching(true);
    setUserTimestamp(new Date());
    offset === 0 ? setUpdate(!update) : setOffset(0);
  }

  const fetchReplies = () => {
    requestReplies(comment.Id, offset, next, order, userTimestamp).subscribe({
      next(result) {
        SetReplies([...replies, ...result]);
        setFetching(false);
      },
      error(err) {
        ShowFailure(err.message);
      }
    })
  };

  useEffect(() => {
    if (!openReplies) return;
    setFetching(true);
    fetchReplies();
  }, [offset, update])

  useEffect(() => {
    refetchReplies()
  }, [openReplies])

  return (
    <div
      onMouseOver={() => setShowButton(true)}
      onMouseOut={() => setShowButton(false)}
    >
      <Grid item xs={12} md={12} lg={12} sx={{ mb: 2 }}>
        <Grid item xs={12} md={12} lg={12} sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          pl: 0.5
        }}>
          <Grid item xs={11} md={11} lg={11}>
            <Grid sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}>
              <Grid>
                <Avatar
                  onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.comment.UserUsername}
                  src={'http://localhost:8000/avatars/' + props.comment.UserId + ".png"}
                  sx={{
                    width: 35, height: 35,
                    bgcolor: '#212121',
                    color: '#757575',
                    textDecoration: 'none',
                    border: '2px solid #424242',
                    fontSize: '1rem',
                    mr: 1
                  }}
                >{props.comment.UserUsername[0].toUpperCase()}</Avatar>
              </Grid>
              <Grid sx={{ width: '100%' }}>
                <Grid sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  pl: 0.5
                }}>
                  <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + comment.UserUsername} color="primary" sx={{
                    mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                    ":hover": {
                      textDecoration: 'underline'
                    }
                  }
                  } >
                    {comment.UserUsername}
                  </Link>
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily: 'cursive' }}>
                    ·
                  </Typography>
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5 }}>
                    {timeSince(GetLocalDate(new Date(comment.DateCreated)))}
                  </Typography>
                  {comment.DateEdited ?
                    <>
                      <Tooltip title={timeSince(GetLocalDate(new Date(comment.DateEdited)))} placement="right" arrow>
                        <Typography variant="caption" color="text.disabled" component="p">
                          (edited)
                        </Typography>
                      </Tooltip>
                    </>
                    :
                    <>
                    </>}
                </Grid>
                {openEdit ?
                  <CommentInputElement Action={(e) => {
                    handleSubmitEdit(e)
                  }} Comment={props.comment.Text} CancelAction={() => setOpenEdit(false)}></CommentInputElement>
                  :
                  <Typography variant="subtitle1" component="p" sx={{ pl: 0.5, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                    {comment.Text}
                  </Typography>
                }
                <Grid lg={12} md={12} xs={12} item sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ fontSize: '14px', display: 'flex', alignItems: 'center', mr: 3 }}>
                    <IconButtonWithCheck sx={{ p: 0.5, color: 'inherit' }} ActionWithCheck={() => {
                      setLikes(liked ? likes - 1 : likes + 1); setLiked(!liked)
                      likeCommentRequest(comment.Id).subscribe({
                        next(value) {

                        },
                        error(err) {
                          ShowFailure(err.message);
                        },
                      })
                    }}>
                      {liked ? <FavoriteIcon sx={{ fontSize: '18px' }}></FavoriteIcon> :
                        <FavoriteBorderIcon sx={{ fontSize: '18px' }}></FavoriteBorderIcon>}
                    </IconButtonWithCheck>
                    {likes.toString()}
                  </Typography>
                  <ButtonWithCheck variant='text' sx={{ color: "text.secondary", fontSize: "14px important!" }} ActionWithCheck={() => {
                    setOpenReplyInput(!openReplyInput);
                  }}>Reply</ButtonWithCheck>
                </Grid>
                {openReplyInput ?
                  <Box sx={{ pl: 5 }}>
                    <ReplyInputElement
                      setState={setOpenReplyInput}
                      Action={(e: string) => {
                        if (e.trim() === '') return;
                        const replyInput: ReplyInput = {
                          commentId: props.comment.Id,
                          text: e,
                        }
                        createReplyRequest(replyInput).subscribe(
                          {
                            next(value) {
                              enqueueSnackbar(value, {
                                variant: 'success', anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'center'
                                },
                                autoHideDuration: 1500
                              });
                              refetchComment()
                            },
                            error(err) {
                              dispatch(setGlobalError(err.message));
                            },
                          }
                        )
                      }
                      }></ReplyInputElement>
                  </Box>
                  : <></>}
                {
                  comment.Replies > 0 ?
                    <Button onClick={() => setOpenReplies(!openReplies)}>{comment.Replies} Replies</Button>
                    :
                    <></>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} md={1} lg={1} sx={{ display: 'flex', mb: 'auto' }}>
            {(comment.UserId == Account.Id || Account.Role === 'Administrator' || Account.Role === 'Moderator') && showButton ? <>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClickMenu}
                sx={{ ml: 'auto', p: 0.5 }}
              >
                <MoreVertIcon />
              </IconButton>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
              >
                {comment.UserId == Account.Id &&
                  <MenuItem onClick={() => { setOpenEdit(true); handleCloseMenu(); }} disableRipple>
                    <EditIcon />
                    Edit
                  </MenuItem>
                }
                <MenuItem onClick={() => { setOpenDelete(true); handleCloseMenu(); }} disableRipple>
                  <DeleteIcon />
                  Delete
                </MenuItem>
              </StyledMenu>
            </> : <></>}
          </Grid>

          <Dialog
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
              {"Are You sure you want to delete this comment?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
              <Button onClick={() => handleSubmitDelete()} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={12}>
          {
            openReplies ?
              <Box sx={{ pl: 5 }}>
                {
                  replies.map((reply) =>
                    <ReplyElement reply={reply} key={reply.Id} refreshComment={refetchComment}></ReplyElement>
                  )
                }
                {
                  comment.Replies > replies.length && !fetching ?
                    <Button onClick={() => setOffset(offset + next)}>Load More</Button>
                    : <></>
                }
              </Box>
              :
              <></>
          }
        </Grid>
      </Grid>
    </div>
  )
}
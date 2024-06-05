import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Link, MenuItem, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createReplyRequest, deleteReplyRequest, likeReplyRequest, updateReplyRequest } from '../../API/replyRequests';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { RootState } from '../../Redux/store';
import { Reply, ReplyInput } from '../../Types/Reply';
import ButtonWithCheck from '../UtilComponents/ButtonWithCheck';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import ReplyInputElement from '../UtilComponents/ReplyInputElement';
import { StyledMenu } from '../UtilComponents/StyledMenu';

interface Props {
  reply: Reply;
  refreshComment: () => void
}

export default function ReplyElement(props: Props) {
  const { reply, refreshComment } = props;
  const [liked, setLiked] = useState(reply.Liked);
  const [likes, setLikes] = useState(reply.Likes);
  const [openReplyInput, setOpenReplyInput] = useState(false);
  const dispatch = useDispatch()
  const Account = useSelector((state: RootState) => state.account.Account);


  // menu
  const [showButton, setShowButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // edit

  const [openEdit, setOpenEdit] = useState(false);
  const [error, setError] = useState<String>('');

  const handleSubmitEdit = (text: string) => {
    if (text.trim().length === 0) {
      setError('Comment cannot be empty');
      return;
    }

    updateReplyRequest(text, props.reply.Id).subscribe({
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
        refreshComment();
      },
      error(err) {
        setGlobalError(err.message);
      },
    })

  }

  // delete
  const [openDelete, setOpenDelete] = useState(false);

  const handleSubmitDelete = () => {
    deleteReplyRequest(props.reply.Id).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        setOpenDelete(false);
        props.refreshComment();
      },
      error(err) {
        setError(err.message)
      },
    })
  }

  return (

    <div
      onMouseOver={() => setShowButton(true)}
      onMouseOut={() => setShowButton(false)}
    >
      <Grid item xs={12} md={12} lg={12} sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        pl: 1
      }}>
        <Grid item xs={11} md={11} lg={11}>
            <Grid sx={{
              display: 'flex',
              flexDirection: 'row'
            }}>
              <Grid>
                <Avatar
                  onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.reply.UserUsername}
                  src={'http://localhost:8000/avatars/' + props.reply.UserId + ".png"}
                  sx={{
                    width: 35, height: 35,
                    bgcolor: '#212121',
                    color: '#757575',
                    textDecoration: 'none',
                    border: '2px solid #424242',
                    fontSize: '1rem',
                    mr: 1
                  }}
                >{props.reply.UserUsername[0].toUpperCase()}</Avatar>
              </Grid>
              <Grid  sx={{ width: '100%' }}>
                <Grid sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  pl: 0.5
                }}>
                  <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.reply.UserUsername} color="primary" sx={{
                    mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                    ":hover": {
                      textDecoration: 'underline'
                    }
                  }
                  } >
                    {props.reply.UserUsername}
                  </Link>
                  {
                    props.reply.ToUserId && props.reply.ToUserUsername ?
                      <>
                        <Typography variant="caption" component="p" sx={{ mr: 0.5 }}>to</Typography>
                        <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.reply.ToUserUsername} color="primary" sx={{
                          mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
                          ":hover": {
                            textDecoration: 'underline'
                          }
                        }
                        } >
                          {props.reply.ToUserUsername}
                        </Link>
                      </>
                      : <></>
                  }
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily: 'cursive' }}>
                    ·
                  </Typography>
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5 }}>
                    {timeSince(GetLocalDate(new Date(props.reply.DateCreated)))}
                  </Typography>
                  {props.reply.DateEdited ?
                    <>
                      <Tooltip title={timeSince(GetLocalDate(new Date(props.reply.DateEdited)))} sx={{ m: 0 }} placement="right" arrow>
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
                  <ReplyInputElement Action={(e) => {
                    handleSubmitEdit(e)
                  }} Reply={props.reply.Text} setState={setOpenEdit}></ReplyInputElement>
                  :
                  <Typography variant="subtitle1" component="p" sx={{ pl: 0.5, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                    {props.reply.Text}
                  </Typography>
                }
                <Grid lg={1} md={2} xs={3} item sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" color="text.disabled" component="p" sx={{ fontSize: '14px', display: 'flex', alignItems: 'center', mr: 3 }}>
                    <IconButtonWithCheck sx={{ p: 0.5, color: 'inherit' }} ActionWithCheck={() => {
                      likeReplyRequest(props.reply.Id).subscribe({
                        next(value) {
                          setLikes(liked ? likes - 1 : likes + 1); setLiked(!liked);
                        },
                        error(err) {
                          dispatch(setGlobalError(err.message));
                        },
                      })
                    }}>
                      {liked ? <FavoriteIcon sx={{ fontSize: '18px' }}></FavoriteIcon> : <FavoriteBorderIcon sx={{ fontSize: '18px' }}></FavoriteBorderIcon>}
                    </IconButtonWithCheck>
                    {likes.toString()}
                  </Typography>
                  <ButtonWithCheck variant='text' sx={{ color: "text.secondary" }} ActionWithCheck={() => {
                    setOpenReplyInput(!openReplyInput);
                  }
                  }>Reply</ButtonWithCheck>
                </Grid>
                {openReplyInput ?
                  <Box>
                    <ReplyInputElement
                      setState={setOpenReplyInput}
                      Action={(e: string) => {
                        if (e.trim() === '') return;
                        const replyInput: ReplyInput = {
                          commentId: props.reply.CommentId,
                          toUserId: props.reply.UserId,
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
                              props.refreshComment()
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} md={1} lg={1} sx={{ display: 'flex', mb: 'auto' }}>
            {(props.reply.UserId == Account.Id || Account.Role === 'Admin' || Account.Role === 'Moderator') && showButton && <>
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
                {props.reply.UserId == Account.Id &&
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
            </>}
          </Grid>
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
    </div >
  )
}
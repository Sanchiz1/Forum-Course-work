import React, { useState } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Paper, Link, Stack, IconButton, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../../Types/Post';
import { GetLocalDate, timeSince } from '../../Helpers/TimeHelper';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IconButtonWithCheck from '../UtilComponents/IconButtonWithCheck';
import { likePostRequest } from '../../API/postRequests';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';

interface Props {
  post: Post;
  customClickEvent: React.MouseEventHandler<HTMLDivElement>
  sx?: SxProps<Theme> | undefined,
}

export default function PostElement(props: Props) {
  const [liked, SetLiked] = useState(props.post.liked);
  const [likes, setLikes] = useState(props.post.likes.valueOf());
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Grid item xs={12} md={12} lg={12} onClick={props.customClickEvent} sx={props.sx}>
      <Paper sx={{
        p: 1,
        width: 1,
        ":hover": {
          boxShadow: 5
        }
      }}>
        <Grid sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Link variant="caption" onClick={(e) => e.stopPropagation()} component={RouterLink} to={'/user/' + props.post.user_Username} color="primary" sx={{
            mr: 0.5, textDecoration: 'none', cursor: 'pointer', color: 'white',
            ":hover": {
              textDecoration: 'underline'
            }
          }
          } >
            {props.post.user_Username}
          </Link>
          <Typography variant="caption" color="text.disabled" component="p" sx={{ mr: 0.5, fontFamily:'cursive' }}>
            ·
          </Typography>
          <Typography variant="caption" color="text.disabled" component="p">
            {timeSince(GetLocalDate(new Date(props.post.date_Created)))}
          </Typography>
        </Grid>
        <Typography variant="subtitle1" component="p">
          {props.post.title}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="subtitle1" component="p" sx={{
          maxHeight: '150px', overflow: 'hidden',
          whiteSpace: 'pre-line',
          textOverflow: 'ellipsis',
          content: 'none',
          position: 'relative',
          "&::before": {
            content: 'no-close-quote',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            background: 'linear-gradient(transparent 70px, #1E1E1E)'
          }
        }}>
          {props.post.text}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
        >
          <Grid lg={1} md={2} xs={3} item>
            <Typography variant="caption" color="text.disabled" component="p" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <IconButtonWithCheck sx={{ p: 0.5, color: 'inherit' }} ActionWithCheck={() => {
                setLikes(liked ? likes - 1 : likes + 1); SetLiked(!liked)
                likePostRequest(props.post.id).subscribe({
                  next(value) {

                  },
                  error(err) {
                    dispatch(setGlobalError(err.message));
                  },
                })
              }}>
                {liked ? <FavoriteIcon></FavoriteIcon> : <FavoriteBorderIcon></FavoriteBorderIcon>}
              </IconButtonWithCheck>
              {likes.toString()}
            </Typography>
          </Grid>

          <Grid lg={1} md={2} sm={3} xs={5} item>
            <Typography variant="caption" color="text.disabled" component="p" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ p: 0.5, color: 'inherit' }}>
                <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
              </IconButton>
              {props.post.comments.toString()}
            </Typography>
          </Grid>
        </Stack>
      </Paper>
    </Grid>
  )
}
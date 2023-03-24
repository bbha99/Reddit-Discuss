import { ChatBubbleOutline, MoreHoriz } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Fade, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { useContext } from "react";
import { authContext } from '../providers/AuthProvider';
import moment from 'moment';
const Comment = (props) => {
  const [newNestedComment, setNewNestedComment] = React.useState("");
  const [nestedCommentVisibility, setNestedCommentVisibility] = React.useState(false);

  // Current user
  const { user } = useContext(authContext);
  
  // Delete post action
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Toggle comment display
  const handleCommentVisibility = () => {
    setNestedCommentVisibility(!nestedCommentVisibility);
  };

    // Allows user to create a new comment for a post
    const handleCommentSubmit = (event) => {
      event.preventDefault();
  
      if (user) {
        const newCommentDetails = {
          "description": newNestedComment,
          "post_id": props.commentDetails.post_id,
          "user_id": user.id,
          "deleted": null,
          "parent_comment_id": props.commentDetails.id
        };
        axios.post('http://localhost:3001/comments', null, { params: { newCommentDetails: newCommentDetails } })
          .then((newCommentData) => {
            props.setPosts((prev) => {
              const newPost = [...prev];
              newPost.forEach((post) => {
                if (props.commentDetails.post_id === post.postsDetails.id) {
                  post.postComments.push(newCommentData.data.userCommentOnPost);
                }
              });
              return newPost;
            });
          })
          .catch((response) => {
            throw new Error(response.status);
          });
      }
      setNewNestedComment("")
    };

  return (
    <Card sx={{ marginBottom: 2, borderLeft: 3, marginLeft: props.marginLeft }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 30, height: 30 }} src={props.commentDetails.user.image} />
        }
        action={user && user.id === props.commentDetails.user.id &&
          <div>
            <IconButton onClick={handleClick}>
              <MoreHoriz />
            </IconButton>
            <Menu
              id="fade-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleClose} sx={{ color: "blue", fontWeight: 500 }}>Edit</MenuItem>
              <MenuItem onClick={handleClose} sx={{ color: "red", fontWeight: 500 }}>Delete</MenuItem>
            </Menu>
          </div>
        }
        subheader={props.commentDetails.user.username + " " + moment(props.commentDetails.created_at).fromNow()}
      />
      <CardContent>
        <Typography component="p">
          {props.commentDetails.description}
        </Typography>
      </CardContent>
      {user && <CardActions>
        <Button
          variant="text"
          onClick={() => { handleCommentVisibility(); }}
          type="submit">
          <ChatBubbleOutline />
          Reply
        </Button>
      </CardActions>}
      <Divider />
      {nestedCommentVisibility === true && <CardContent>
        {user && <form onSubmit={handleCommentSubmit}>
          <Box sx={{ display: 'flex', marginBottom: 2 }}>
            <TextField
              id="outlined-textarea"
              placeholder={`Reply to comment`}
              rows={1}
              fullWidth={true}
              value={newNestedComment}
              onChange={(event) => { setNewNestedComment(event.target.value); }}
            />
            <Button type='submit' variant="contained" sx={{ marginRight: 2, marginLeft: 2 }}>
              Comment
            </Button>
          </Box>
        </form>}
      </CardContent>}
    </Card>
  );
};

export default Comment;
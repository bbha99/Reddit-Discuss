import { Avatar, Box, Card, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useEffect } from "react";
import React from 'react';
import Post from './Post';
import PostForm from './PostForm';

import axios from "axios";

// List of posts
const PostList = (props) => {
  const [open, setOpen] = React.useState(false);
  const [post, setPost] = React.useState([]);

  const user_session_id = 2
  // Handle dialog open and close event
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Adds the created post to the list of posts
  function save(title, description, image) {
    const newPost = {
      title,
      description,
      image,
      "topic_id": 2,
      "user_id": 1,
      "deleted": false
    };
    props.savePost(newPost);
  }

  // Creates a liked post row in the database
  function likePost(post_id) {

    return axios.post('http://localhost:3001/post_likes', null, { params: { id: user_session_id, post_id: post_id } })
      .then((postLiked) => {
        return 1;
      })
      .catch((response) => {
        throw new Error(response.status);
      });
  }


  // Destroys a liked post row in the database
  function unlikePost(post_id) {

    return axios.delete(`http://localhost:3001/post_likes/${user_session_id}`, { params: { id: user_session_id, post_id: post_id } })
      .then((postUnliked) => {
        return -1;
      })
      .catch((response) => {
        throw new Error(response.status);
      });
  }

   // Retrieve all the posts onload
  useEffect(() => {
    axios.get('http://localhost:3001/posts', { params: { id: user_session_id } })
      .then((response) => {
        setPost(response.data.postDetails);
      });
  }, []);

  const Div = styled(Box)({
    backgroundColor: "#DAE0E6",
    flex: "3"
  });

  let postList = [];
  if (post.length !== 0) {
    postList = post.map(post => {
      return (
        <Post
          key={post.postsDetails.id}
          totalLikes={post.totalLikes}
          post={post.postsDetails}
          userLikedPost={post.userLikedPost}
          likePost={likePost}
          unlikePost={unlikePost}
        // user={props.users[post.user_id]}
        />);
    });
  }
  return (

    <Div p={2}>
      <Card sx={{ display: 'flex', alignItems: "center", marginBottom: 2, padding: 2 }} onClick={handleClickOpen}>
        <Avatar sx={{ width: 50, height: 50, marginRight: 1 }} src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" />
        <TextField
          id="outlined-textarea"
          placeholder="What's on your mind, User?"
          rows={1}
          fullWidth={true}
          onClick={handleClickOpen}
        />

      </Card>
      <PostForm open={open} handleClose={handleClose} onSave={save} />
      {postList.length !== 0 && postList}
    </Div>

  );
};

export default PostList;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Avatar,Box, Grid, Paper, Typography, Container, Button} from "@mui/material";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import UserEditForm from "./UserEditForm";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ bgcolor: "#EAF6FF", py: "2rem" }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: "2rem",
          }}
        >
          <Avatar
            src={user.user.image}
            alt={user.user.username}
            sx={{ width: "200px", height: "200px", mb: "2rem" }}
          />
          <Typography variant="h4">{user.user.username}</Typography>
          <br></br>
          <Box sx={{ display: "flex", alignItems: "center", mb: "1rem" }}>
            {editing ? (
              <UserEditForm
                user={user.user}
                onClose={handleCancel}
                onUpdate={handleUserUpdate}
              />
            ) : (
              <>
                <Button variant="outlined" onClick={handleEdit} startIcon={<EditIcon />}>
                  Edit Profile
                </Button>
              </>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          {user.post.map((post) => (
            <Grid item key={post.id} xs={12}>
              <Paper
                sx={{
                  p: "1rem",
                  borderRadius: "1rem",
                  border: "2px solid #9CA3AF",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: "1rem" }}>
                  <Avatar
                    src={post.image}
                    alt={post.username}
                    sx={{ width: "50px", height: "50px", mr: "1rem" }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2">{post.username}</Typography>
                    <Typography variant="caption">
                      {moment(post.created_at).fromNow()}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: "1rem" }}>
                  {post.description}
                </Typography>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ maxWidth: "100%", borderRadius: "1rem" }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfile;

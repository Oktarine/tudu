import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';


export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <>
        <Box mx={7} my={4} >

          <Card sx={{ maxWidth: 586, display: 'block', ml: 'auto', mr: 'auto' }}>
            <CardActionArea >
              <CardContent >
              </CardContent>
            </CardActionArea>
            <CardActionArea >

              <Typography variant="h5" gutterBottom sx={{ display: 'block', textAlign: 'center', maxWidth: 380, ml: 'auto', mr: 'auto' }}>
                ID : {currentUser.id}
              </Typography>

              {/* 
              <Avatar
                alt="Remy Sharp"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                sx={{ width: 80, height: 80, display: 'block', ml: 'auto', mr: 'auto', mb: 5, mt:5 }}
              /> */}

              <Typography variant="h5" gutterBottom sx={{ display: 'block', textAlign: 'center', maxWidth: 380, ml: 'auto', mr: 'auto' }}>
                {currentUser.email}
              </Typography>



              <Typography variant="h6" gutterBottom sx={{ display: 'block', textAlign: 'center', maxWidth: 380, ml: 'auto', mr: 'auto', mt: 2 }}>
                STATUS :  {currentUser.roles}
              </Typography>

            </CardActionArea>

          </Card>
        </Box>

      </>

    );
  }
}

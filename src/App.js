import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Todo from "./components/todo.component";

import Todo2 from "./components/todo.component2";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }


  render() {

    const { currentUser, showAdminBoard } = this.state;

    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/#/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: '#81c784',
                  textDecoration: 'none',
                }}
              >
                TODO PANEL
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>


                {/* {showModeratorBoard && (
                   <Link to="/todolist" color="inherit"><Button>TODOLIST</Button></Link>
                )} */}

                {showAdminBoard && (
                  <>
                    <Link to="/todolist" color="inherit"><Button>TODOLIST</Button></Link>
                  </>
                )}

                {currentUser && (
                  <>
                    <Link to="/todolist" color="inherit"><Button>TODOLIST</Button></Link>
                  </>
                )}

              </Box>
              <Box sx={{ flexGrow: 0 }}>
                {currentUser ? (
                  <>
                    <Link to="/profile" color="inherit"><Button>{currentUser.username}</Button></Link >
                    <Link to="/login" color="inherit"><Button onClick={this.logOut}>LogOut</Button></Link >
                  </>
                ) : (
                  <>
                    <Link to="/login" color="inherit"><Button>Login</Button></Link >
                    <Link to="/register" color="inherit"><Button>Sign Up</Button></Link >
                  </>
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </Box>

        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/home" element={<Home />} />

            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/todolist" element={<Todo />} />
            <Route path="/Todo2" element={<Todo2 />} />
            

          </Routes>
        </>

        <AuthVerify logOut={this.logOut} />
      </>
    );
  }
}

export default App;

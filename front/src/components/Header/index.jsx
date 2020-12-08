import React, { useState, useEffect } from "react";
import { useHistory, NavLink, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";

import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    IconButton,
    Drawer,
    useScrollTrigger,
    Slide
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { AccountCircle } from "@material-ui/icons";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import "./style.scss";

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiPaper-root": {
        backgroundColor: "#333",
      },
    },
    header: {
      marginBottom: "30px",
      backgroundColor: "#444",
      padding: "5px 25px",
    },
    logo: {
      fontFamily: "Work Sans, sans-serif",
      fontWeight: 600,
      color: "#FFFEFE",
      textAlign: "left",
    },
    menuButton: {
      fontFamily: "Open Sans, sans-serif",
      fontWeight: 700,
      size: "18px",
      marginLeft: "38px",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    drawerContainer: {
      fontWeight: "bold",
      padding: "20px 30px",
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    IconSearch: {
      color: "white",
      maxHeight: "36px",
      maxWidth: "36px",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
      minWidth: "220px",
      paddingLeft: "12px",
    },
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
}
  
HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

function Header( props ) {
    const history = useHistory();
    const {
      root,
      header,
      logo,
      toolbar,
      drawerContainer
    } = useStyles();

    const [searchValue, setSearchValue] = useState(null);
  
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
  
    const classes = useStyles();
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [state, setState] = useState({
      mobileView: false,
      drawerOpen: false,
    });
    const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1200
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    history.push({
      pathname: "/",
      search: `?title=${searchValue}`,
    });
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        <NavLink to="/" className="header__logo">
          {/* <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" /> */}
          <Typography variant="h6" component="h1" className={logo}>
            Home
          </Typography>
        </NavLink>

        {/* Navigation */}
        <div className="header__links">
        <div style={{margin: "0 0 0 20px", height: "100%", display: "inline-block"}}>
          <form className={classes.search} onSubmit={() => handleSubmit()}>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <IconButton
              className={classes.IconSearch}
              aria-label="search"
              component="span"
              onClick={() => handleSubmit()}>
              <SearchIcon />
            </IconButton>
          </form>
          </div>
          <div style={{margin: "0 0 0 20px", height: "100%", display: "inline-block"}}>
        {currentUser ? (
            <>
            <NavLink to="/createproduct" className="header__option" style={{display: "inline-block"}} >
                Create New Product
            </NavLink>
            <NavLink to="/login" className="logged__out--signup" style={{display: "inline-block"}} onClick={logOut} >
                Log Out
            </NavLink>
        </>
        ) : (

            <NavLink to="/login" className="logged__out">
                Log In
            </NavLink>

        )}
        {/* </Nav> */}
        </div>
        </div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className="mobile__responsive">
        {/* <NavLink to="/" className="header__logo" onClick={filterChanged}> */}
        <NavLink to="/" className="header__logo">
          {/* <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" /> */}
          Home
        </NavLink>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}>
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
          className={root}>
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>
      </Toolbar>
    );
  }
  const getDrawerChoices = () => {
    return (
    <>

    <div className="nav__mobile">
        <div>
        <form className={classes.search} onSubmit={() => handleSubmit()}>
        <InputBase
        placeholder="Search…"
        classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => setSearchValue(e.target.value)}
        />
        <IconButton
        className={classes.IconSearch}
        aria-label="search"
        component="span"
        onClick={() => handleSubmit()}
        >
        <SearchIcon />
        </IconButton>
    </form>
    <div style={{margin: '20px 0'}}>
        </div>
        {currentUser ? (
          <>
                <NavLink to="/createproduct" className="header__option" style={{display: "inline-block"}}>
                    Create New Product
                </NavLink>
                <NavLink to="/register" className="logged__out--signup" style={{display: "inline-block"}} onClick={logOut} >
                    Log Out
                </NavLink>
          </>
        ) : (


            <NavLink to={"/login"} className="logged__out">
                Log In
            </NavLink>
        )}
      </div>
      </div>
      </>
    );
  };

  return (
    <>
      <header className="main__header">
        <React.Fragment>
          {/* <HideOnScroll {...props}> */}
            <AppBar className={header}>
              {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
          {/* </HideOnScroll> */}
        </React.Fragment>
      </header>
    </>
  );
}

export default Header;
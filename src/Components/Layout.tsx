import React, {useContext, useEffect, useState} from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, AppBar, Toolbar,
        Typography, IconButton, useTheme, Drawer, CssBaseline,
        Divider, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon,
        ChevronRight as ChevronRightIcon, Home as HomeIcon, List as ListIcon } from '@material-ui/icons';
import { Switch, Route, Link } from 'react-router-dom';
import {Home} from "./Home/Home";
import {Editor} from "./Editor/Editor";
import {Images} from "./Images/Images";
import {context} from "../Store";
import {Types} from "../ImageReducer";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        appBar: {
            transition: theme.transitions.create(['margin','width'],{
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin','width'],{easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
        },
        title: {
            flexGrow: 1,
            color : theme.palette.text.primary
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0,1),
            ...theme.mixins.toolbar,
            justifyContent: 'space-around',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0
        }
    }));

export const Layout: React.FunctionComponent = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(context);
    const theme: Theme = useTheme();
    const [open,setOpen] = useState<boolean>(false);

    const handleDrawer = (value: boolean) => {
        setOpen(value);
    };

    useEffect(() => {
        //load from localstorage
        const images = localStorage.getItem('images');
        if( images !== null){
            dispatch({
                type: Types.Load,
                payload: {
                    images: JSON.parse(images)
                }
            })
        }
    },[]);

    useEffect(() => {
        const imageString = JSON.stringify(state.images);
        localStorage.setItem('images',imageString);
    },[state.images.length])

    return (
      <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position={"fixed"}
            className={clsx(classes.appBar, {
                [classes.appBarShift] : open
            })}
          >
              <Toolbar>
                  <IconButton
                      color={"inherit"}
                      aria-label={"open drawer"}
                      edge={"start"}
                      onClick={() => handleDrawer(true)}
                      className={clsx(open && classes.hide)}
                  >
                      <MenuIcon />
                  </IconButton>
                  <Typography variant={"h6"} noWrap className={classes.title}>
                      Image Editor
                  </Typography>
              </Toolbar>
          </AppBar>
          <Drawer
              className={classes.drawer}
              variant={"persistent"}
              anchor={"left"}
              open={open}
              classes={{
                  paper: classes.drawerPaper
              }}
          >
              <div className={classes.drawerHeader}>
                  <IconButton onClick={() => handleDrawer(false)}>
                      {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
              </div>
              <Divider />
              <List>
                  <ListItem key={"home"} button component={ Link } to={"/"}>
                      <ListItemIcon><HomeIcon /></ListItemIcon>
                      <ListItemText primary={"Home"}/>
                  </ListItem>
                  <ListItem key={"images"} button component={ Link } to={"/images"}>
                      <ListItemIcon><ListIcon /></ListItemIcon>
                      <ListItemText primary={"Images"}/>
                  </ListItem>
              </List>
          </Drawer>
          <main className={clsx(classes.content, {
              [classes.contentShift]: open
          })}>
              <div className={classes.drawerHeader}></div>
              <Switch>
                  <Route path={"/images/add"} component={Editor}/>
                  <Route path={"/images/edit/:id"} component={Editor}/>
                  <Route path={"/images"} component={Images}/>
                  <Route path={"/"} component={ Home }/>
              </Switch>
          </main>
      </div>
    );
}

import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Paper,
    createStyles,
    makeStyles,
    Theme,
    Grid,
    Typography,
    Button,
    GridList,
    GridListTile,
    GridListTileBar, IconButton
} from "@material-ui/core";
import {Image} from "../../Types/Image";
import { Link } from 'react-router-dom';
import { Visibility } from '@material-ui/icons';
import {context} from "../../Store";
import {HomeTile} from "./HomeTile";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            textAlign: 'center'
        },
        button: {
            float: 'right',
            margin: theme.spacing(2)
        },
        galleryList: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            flexWrap: 'nowrap',
            transform: 'translateZ(0)',
            width: '75%'
        },
        title: {
            color: theme.palette.primary.main
        },
        titleBar: {
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
        }
    })
);

export const Home: React.FunctionComponent = () => {
    const classes = useStyles();
    const { state } = useContext(context);

    return (
        <Grid container justify={"center"} alignItems={"center"}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography color={"secondary"} variant={"h2"} gutterBottom>
                        Gallery
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Button component={Link} to={"/images/add"} className={classes.button} variant={"outlined"} color={"secondary"}>Add</Button>
                <Button component={Link} to={"/images"} className={classes.button} variant={"contained"} color={"primary"}>View All</Button>
            </Grid>
            <Grid item xs={12} className={classes.galleryList}>
                <GridList className={classes.gridList} cols={2.5}>
                    { state.images.map( image => (
                        <GridListTile key={image.id}>
                            <HomeTile image={image} />
                            <GridListTileBar
                                title={image.name}
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title
                                }}
                                actionIcon={
                                    <IconButton component={Link} to={`/images/edit/${image.id}`} aria-label={`view ${image.name}`}>
                                        <Visibility className={classes.title}/>
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    )) }
                </GridList>
            </Grid>
        </Grid>
    );
}

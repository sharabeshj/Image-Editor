import React, {useContext, useEffect, useState} from 'react';
import {Grid, Typography, makeStyles, createStyles, Theme, Button} from '@material-ui/core';
import {ImageCard} from "../ImageData/ImageData";
import { Link } from 'react-router-dom';
import {Image} from "../../Types/Image";
import {context} from "../../Store";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            textAlign: 'center'
        },
        page: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        button: {
            float: 'left'
        }
    })
);

export const Images: React.FunctionComponent = () => {
    const classes = useStyles();
    const { state } = useContext(context);

    return (
        <Grid className={classes.page} container spacing={2} justify={"center"}>
            <Grid item xs={12} className={classes.heading}>
                <Typography variant={"h2"}>
                    Images List
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button className={classes.button} component={Link} to={"/images/add"} variant={"contained"} color={"primary"}>Add Image</Button>
            </Grid>
            { state.images.map( image => (
                <Grid key={image.id} item xs={6} sm={3} md={4}>
                    <ImageCard image={image} />
                </Grid>
            )) }
        </Grid>
    );
}

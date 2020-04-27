import React, {useEffect, useRef, useState} from 'react';
import {
    makeStyles,
    Theme,
    createStyles,
    Card,
    CardHeader,
    Avatar,
    IconButton,
    CardMedia,
    CardContent, Typography, CardActions
} from '@material-ui/core';
import {red, blue, cyan, green, deepPurple, pink, yellow} from '@material-ui/core/colors';
import { ImageCardProps } from '../../Types/ImageCard';
import { Visibility, Favorite, Share } from "@material-ui/icons";
import { Link } from 'react-router-dom';

const colors = [
    red[500],
    yellow[500],
    cyan[500],
    green[500],
    blue[500],
    deepPurple[500],
    pink[500]
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345
        },
        media: {
            height: 0,
            paddingTop: '56.25%'
        },
        avatar: {
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
        }
    })
);

export const ImageCard: React.FunctionComponent<ImageCardProps> = ({ image }) => {
    const classes = useStyles();
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [canvas,setCanvas] = useState<HTMLCanvasElement | null>(null);
    // const [context,setContext] = useState<CanvasRenderingContext2D | null>(null);
    //
    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const context = canvas!.getContext('2d');
    //     setCanvas(canvas!);
    //     setContext(context!);
    // },[]);
    //
    // useEffect(() => {
    //     if(context !== null && context !== undefined) loadTheImage(image.imageData!);
    // },[context])
    //
    // const loadTheImage = (image: string) => {
    //     const img = new Image();
    //     img.onload = () => {
    //         context!.drawImage(img, 0, 0);
    //     }
    //     img.src = image;
    // }

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label={"id"} className={classes.avatar}>
                        {image.id}
                    </Avatar>
                }
                action={
                    <IconButton component={Link} to={`/images/edit/${image.id}`} aria-label={"view"}>
                        <Visibility />
                    </IconButton>
                }
                title={image.name}
                subheader={image.date}
            />
            <CardMedia
                className={classes.media}
                title={image.name}
                image={image.imageData}
            >
                {/*<canvas ref={canvasRef} width={'100%'} height={'100%'}/>*/}
            </CardMedia>
            <CardContent>
                <Typography variant={"body2"} color={"textSecondary"} component={"p"}>
                    {image.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing={true}>
                <IconButton aria-label={"likes"}>
                    <Favorite />
                </IconButton>
                <IconButton aria-label={"share"}>
                    <Share />
                </IconButton>
            </CardActions>
        </Card>
    );
;}

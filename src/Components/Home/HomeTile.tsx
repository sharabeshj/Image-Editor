import React, {useEffect, useRef, useState} from 'react';
import {Image as ImageData} from "../../Types/Image";

type HomeTileProps = {
    image: ImageData
}

export const HomeTile:React.FunctionComponent<HomeTileProps> = ({ image }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas,setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [context,setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d');
        setCanvas(canvas!);
        setContext(context!);
    },[]);

    useEffect(() => {
        if(context !== null && context !== undefined) loadTheImage(image.imageData!);
    },[context])

    const loadTheImage = (image: string) => {
        const img = new Image();
        img.onload = () => {
            context!.drawImage(img, 0, 0);
        }
        img.src = image;
    }

    return (
        <canvas
            ref={canvasRef}
            width={'100%'}
            height={'100%'}
        />
    );
}

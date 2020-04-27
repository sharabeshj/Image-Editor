import { Image } from './Image';

export type EditorProps = {
    image: Image;
    handleImageChange: (image: Image) => void;
}

import { Image } from './Image';

export interface EditorProps {
    image: Image;
    handleImageChange: (image: Image) => void;
}

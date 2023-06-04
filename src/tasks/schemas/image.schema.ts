import { Schema } from "../../common/interfaces/schema";

export class ImageSchema extends Schema{
    original: boolean;
    path: string;
    resolution: number;
}
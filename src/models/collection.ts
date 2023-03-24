import {Schema, model} from "mongoose";
import { collection_int } from "./types";

const collectionSchema = new Schema<collection_int>({
    title: {
        type: String,
        require: true,
    },
    about: {
        type: String,
    },
    skills: {
        type: [String],
        default: []
    },
    portfolio: {
        type: String
    },
    album: {
        type: [String],
        default: []
    }
})

export default model<collection_int>("collection", collectionSchema)
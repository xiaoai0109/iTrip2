import { Stay } from "./stay";

export interface Media {
    key?: string;
    name?: string;
    location: Stay;
    createdDate: string;
    fileUrl: string;
    downloadUrl: string;
}
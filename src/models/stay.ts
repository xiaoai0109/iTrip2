import {Location} from "./location";
export interface Stay{
    key?: string;
    address: string;
    lat : number;
    long : number;
    // location: Location;
    // pinCount: number;
    // photoCount: number;
}
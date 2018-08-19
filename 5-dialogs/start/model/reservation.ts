import { Restaurant } from "./restaurant";

export class Reservation {
    public location?: string;
    public cuisine?: string;
    public restaurant?: Restaurant;
    public when? : Date;
    public partySize?: number;
}
import { Url } from "url";

export class Restaurant {
    public name: string;
    public streetAddress: string;
    public city: string;
    public state: string;
    public zip: string;
    public url: Url;
    public logoUrl: Url;
    public foodTypes: [any];

    constructor(name:string, streetAddress:string, city:string, state:string, 
                zip:string, url:Url, logoUrl:Url, foodTypes:[any]) {
        this.name = name;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.url = url;
        this.logoUrl = logoUrl;
        this.foodTypes = foodTypes;
    }

    get address() {
        return `${this.streetAddress}, ${this.city}, ${this.city} - ${this.zip}`
    }

    // tslint:disable-next-line:member-ordering
    public static fromJson(data:any) {
        return new Restaurant(data.name, data.streetAddress, data.city, data.state, data.zip, data.url, data.logoUrl, data.foodTypes);    
    }
}
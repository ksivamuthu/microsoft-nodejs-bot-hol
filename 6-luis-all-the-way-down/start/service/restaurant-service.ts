import * as _ from 'lodash';
import * as rp from 'request-promise-native';
import { Cuisine } from '../model/cuisine';
import { Restaurant } from '../model/restaurant';

const EAT_STREET_API_URL: string = 'https://api.eatstreet.com/publicapi/v1';

export abstract class RestaurantService {

    public static async getCuisines(location: string): Promise<Cuisine[]> {
        const url = EAT_STREET_API_URL + '/restaurant/search';
        const response = await this.eatsApiRequest.get(url, { qs: { 'street-address': location } });
        const foodTypes = _.flatMap(response.restaurants, (i: any) => i.foodTypes);
        const groups = _.groupBy(foodTypes, (i: any) => i);
        return _.map(groups, (x: any) => new Cuisine(x[0], x.length));
    }

    public static async getRestaurants(location: string, cuisine: string) : Promise<Restaurant[]> {
        const url = EAT_STREET_API_URL + '/restaurant/search';
        const response = await this.eatsApiRequest.get(url, { qs: { 'street-address': location } });
        const restaurants = _.map(_.filter(response.restaurants, (x:any) =>
            _.some(x.foodTypes, (f:string) => f.toLowerCase() === cuisine.toLowerCase())),
            (json:any) => Restaurant.fromJson(json));
        return restaurants;
    }

    public static async getRestaurant(location: string, restaurant: string) : Promise<Restaurant | null> {
        const url = EAT_STREET_API_URL + '/restaurant/search';
        const response = await this.eatsApiRequest.get(url, { qs: { 'street-address': location, 'search': restaurant } });
        
        if(response.restaurants && response.restaurants[0]){
            return Restaurant.fromJson(response.restaurants[0]);
        }
        return null;            
    }

    public static async hasRestaurants(location:string) : Promise<boolean> {
        const url = EAT_STREET_API_URL + '/restaurant/search';
        const response = await this.eatsApiRequest.get(url, { qs: { 'street-address': location } });
        return response.restaurants && response.restaurants.length > 0;
    }

    public static async hasRestaurantsWithCuisine(location:string, cuisine: string) : Promise<boolean> {
        const url = EAT_STREET_API_URL + '/restaurant/search';
        const response = await this.eatsApiRequest.get(url, { qs: { 'street-address': location } });
        const restaurants = _.map(_.filter(response.restaurants, (x:any) =>
            _.some(x.foodTypes, (f:string) => f.toLowerCase() === cuisine.toLowerCase())),
            (json:any) => Restaurant.fromJson(json));
        return restaurants && restaurants.length > 0;
    }

    private static eatsApiRequest = rp.defaults({           
        headers: {
            'X-Access-Token': process.env.EAT_STREET_API_KEY
        }, 
        json: true,
        qs: {           
            'method': 'both',
            'pickup-radius': 20
        }
    });
}
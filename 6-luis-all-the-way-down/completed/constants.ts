// tslint:disable-file:max-classes-per-file
export class CONSTANTS {
    // tslint:disable-next-line:max-classes-per-file
    public static entity = class {
        public static locationKey = 'RestaurantReservation.Address';
        public static cuisineKey = 'RestaurantReservation.Cuisine';
        public static datetimeKey = 'builtin.datetimeV2.datetime';
        public static timeKey = 'builtin.datetimeV2.time';
        public static partySizeKey = 'builtin.number';
    }
    
    // tslint:disable-next-line:max-classes-per-file
    public static intents = class {
        public static CREATE_RESERVATION = 'Create Reservation';
        public static SET_RESERVATION_CUISINE = 'Set Reservation Cuisine';
        public static SET_RESERVATION_DATE = 'Set Reservation Date';
        public static SET_RESERVATION_PARTY_SIZE = 'Set Reservation Party Size';
        public static SET_RESERVATION_LOCATION = 'Set Reservation Location';
    }
}
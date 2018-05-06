class Restaurant {
    constructor(name, streetAddress, city, state, zip, url, logoUrl, foodTypes) {
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

    static fromJson(data) {
        return new Restaurant(data.name, data.streetAddress, data.city, data.state, data.zip, data.url, data.logoUrl, data.foodTypes);    
    }
}

module.exports = Restaurant;
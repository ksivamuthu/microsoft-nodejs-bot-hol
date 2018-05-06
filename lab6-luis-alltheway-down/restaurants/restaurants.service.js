var Cuisine = require('./cuisine.model');
var Restaurant = require('./restaurant.model');
var request = require('request-promise');
var config = require('../config');
var _ = require('lodash');

var eatAPIRequest = request.defaults({
    json: true,
    headers: {
        'X-Access-Token': config.EAT_STREET_API_KEY
    }, qs: {
        'method': 'both',
        'pickup-radius': 20
    }
});

function getCuisines(location) {
    return eatAPIRequest.get(config.EAT_STREET_API + '/restaurant/search', {
        qs: { 'street-address': location }
    }).then(function (value) {
        var foodTypes = _.flatMap(value.restaurants, (i) => i.foodTypes);
        var groups = _.groupBy(foodTypes, (i) => i);
        return _.map(groups, (x) => new Cuisine(x[0], x.length));
    });
}

function hasRestaurants(location) {
    return eatAPIRequest.get(config.EAT_STREET_API + '/restaurant/search', {
        qs: { 'street-address': location }
    }).then(function (value) {
        return value.restaurants.length > 0;
    }).catch((err)=> { 
        return false;
    });
}

function hasRestaurantsWithCuisine(location, cuisine) {
    return eatAPIRequest.get(config.EAT_STREET_API + '/restaurant/search', {
        qs: { 'street-address': location }
    }).then(function (value) {
        return _.sumBy(value.restaurants, (x) => _.some(x.foodTypes, (f) => { return f.toLowerCase() === cuisine.toLowerCase(); }))
    }).catch((err)=> { 
        return false;
    });;
}

function getRestaurants(location, cuisine) {
    return eatAPIRequest.get(config.EAT_STREET_API + '/restaurant/search', {
        qs: { 'street-address': location }
    }).then(function (value) {
        return _.map(_.filter(value.restaurants, (x) =>
            _.some(x.foodTypes, (f) => { return f.toLowerCase() === cuisine.toLowerCase(); })),
            (json) => Restaurant.fromJson(json));
    });
}

function getRestaurant(location, restaurant) {
    return eatAPIRequest.get(config.EAT_STREET_API + '/restaurant/search', {
        qs: { 'street-address': location, 'search': restaurant }
    }).then(function (value) {
        var restaurantJson = value.restaurants && value.restaurants[0];
        return Restaurant.fromJson(restaurantJson);
    });
}

module.exports = {
    getCuisines: getCuisines,
    getRestaurant: getRestaurant,
    getRestaurants: getRestaurants,
    hasRestaurants: hasRestaurants,
    hasRestaurantsWithCuisine: hasRestaurantsWithCuisine
};

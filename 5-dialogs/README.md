# Lab 5 - Dialogs

Glad you made it here. This is where our bot starts to get interesting! We're now going to update our bot to walk a user through the entire reservation process. The goal of will be to provide restaurant recommendations based on the user's location and preferred cuisine and help them make a reservation on a given date and for a specified number of people.

At this point, we've trained our LUIS model to allow users to provide most of this information through requests such as I'd like to reserve a table in Pittsburgh at a good Italian restaurant tomorrow at 8:30 pm for six people, but we still need to prompt them to select a restaurant. Additionally, what if the user only provides some of the information required to make a reservation, such as Make me a reservation in Pittsburgh or I'd like a table at 8:30 tomorrow night. In these cases, we still need to collect additional information to complete the request.

In this lab, we are going to create a Dialog for each piece of information we need to collect and prompt the user when additional information is required. Below is a list of the Dialogs we'll be creating:

* ConfirmReservationDialog
* LocationDialog
* CuisineDialog
* RestaurantDialog
* WhenDialog
* PartySizeDialog

## Start project

Once again, you'll need to use the starter solution in this lab has as it contains a number of files that you'll need get your code running. Below is a brief explanation of the new files you'll find in the starter project (take a moment to review them):

### Locale

Contains static strings for bot responses. Doing so makes the code more maintainable and sets us up to support multilingual scenarios in the future.

### service/restaurant-services.ts

Houses the logic for querying and returning restaurants based on location and cuisine. This class makes use of the publicly available EatStreet REST API.

### Models

This directory contains Cuisine, Reservation, Restaurant, and RestaurantSearchResults classes. These classes house the data we retrieve from the RestaurantService

## Prerequisites
There's a quick prerequisite we need to take care of before getting started.  Go ahead an open the *start* directory with Visual Studio code and complete the following steps:

#### Eat Street API Key
The code in the *RestaurantServices* uses the publicly available  [EatStreet REST API](https://www.programmableweb.com/api/eatstreet) to query for restaurants.  Why did I chose this API?  Because it's free and getting access is a breeze.  That being said, you do have to register for an account to receive an access key.  Here are the steps:

1.	Navigate to the [Eat Street sign-in page](https://developers.eatstreet.com/sign-in) and create a new account
	
	![Create Eat Street Account](../images/dialogs/create-eat-street-account.png)

2.	Once registered, you should immediately be taken to a page which allows you to generate an access key.  Click *Request new API Key* and copy the provided key

	![Generate API Key](../images/dialogs/eat-street-registered.png)

3.	Open the *.env* and copy the key to the *EAT_STREET_API_KEY* value 

	![Update .env](../images/dialogs/env.png)

## Reservation Conversation Logic
Alright, we're ready to get going!  Below you'll find a high-level blueprint of the reservation conversational flow your going to be creating.  Hopefully you'll notice a pattern forming. 


* **CreateReservationDialog**
    * Gather the state provided by the user's initial request and *Call* the *LocationDialog*
* **LocationDialog**     
    * *Start*
        * IF the location was NOT retrieved from the original request, ask the user for their preferred location and *Wait* for their response
        * OTHERWISE, *Call* the *CuisineDialog*
    * *Handler*
        * IF the user-provided location is valid, save to state and *Call* the *CuisineDialog*
        * OTHERWISE, notify the user that the location was not found, ask for another location, and *Wait* for their response
* **CuisineDialog**     
    * *Start*
        * IF the cuisine was NOT retrieved from the original request, ask the user for their preferred cuisine and *Wait* for their response
        * OTHERWISE, *Call* the *RestaurantDialog*
    * *Handler*
        * IF the user-provided cusine is valid, save to state and *Call* the *RestaurantDialog*
        * OTHERWISE, notify the user that the cuisine was not found, ask for another cuisine, and *Wait* for their response  
* **RestaurantDialog**     
    * *Start*
        * Ask the user for their preferred restaurant and *Wait* for their response
    * *Handler*
        * IF the user-provided restaurant is valid, save to state and *Call* the *WhenDialog*
        * OTHERWISE, notify the user that the restaurant was not found, ask for another restaurant, and *Wait* for their response            
* **WhenDialog**     
    * *Start*
        * IF the reservation date / time was NOT retrieved from the original request, ask the user for their preferred time and *Wait* for their response
        * OTHERWISE, *Call* the *PartySizeDialog*
    * *Handler*
        * IF the user-provided date / time is valid, save to state and *Call* the *PartySizeDialog*
        * OTHERWISE, notify the user that the provided date / time is invalid, ask for a date / time, and *Wait* for their response  
* **PartySizeDialog**     
    * *Start*
        * IF the party size was NOT retrieved from the original request, ask the user for their preferred number of people and *Wait* for their response
        * OTHERWISE, *Call* the *ConfirmReservationDialog* with a registered *Done* handler
    * *Handler*
        * IF the user-provided party size is valid, save to state and *Call* the *ConfirmReservationDialog* with a registered *Done* handler
        * OTHERWISE, notify the user that the provided party size is invalid, ask for the party size, and *Wait* for their response  

* **ConfirmReservationDialog**     
    * *Start*
        * Ask the user to confirm the reservation and *Wait* for their response
    * *Handler*
        * IF the user-provided a valid confirmation, save to state and call *Done*
        * OTHERWISE, ask the user to confirm their reservation and *Wait* for their response  
Let's run it!  Fire up the Bot Emulator and enter the following information:

1. First, ask your bot to `make me a reservation`
2. When it asked for a location, type `Pittsburgh`
3. Next, select a Cuisine from the provided suggestions
4. Then select a restaurant from the provided options
5. When asked for the date, type `tommorrow night at 7:30`
6. And when asked for the number of people, type `6`
7. Click *Reserve*

Your bot should also be smart enough to avoid asking for information the user provided during the initial request.  Let's try the following:

1. First, ask your bot to `make me a reservation in Pittsburgh for 6 people tomorrow night at 7:30`
2. When asked for cuisine, select from the provided suggestions
4. Next select a restaurant from the provided options
7. Click *Reserve*

Notice this time you should NOT have been asked to provide a date or number of people since you already provided that information in the initial request.

## Quick Recap
Congratulations!  At this point you should have a fairly nifty bot that walks user's through the entire reservation process.  In doing so, we implemented the following:

1. A **Dialog** chain to solicity reservation information from the user
2. Rich visualizations in the form of message **Attachments**

## Next Steps
While our bot is fairly functional, there's a glaring limitation.  What if the user wants to change information provided in a previous step.  At this point, our bot has no way of handling this.  But fear not, in the [Lab 6](6-luis-all-the-way-down), we're going to kick it up a notch and refactor our bot to support fluid conversations!
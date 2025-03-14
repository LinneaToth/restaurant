class MenuItem { //will result in objects with certain readable values
    constructor(dishName, dishDescription, dishType, allergens, dietaryReq, lunchIndex, price) {
        this.dishName = dishName; //String
        this.dishDescription = dishDescription; //String
        this.dishPrice = price;
        this.dishType = dishType; //String, either starter, main or dessert
        this.allergens = allergens; //Array with individual strings; dairy, shellfish, gluten and/or nuts (or empty)
        this.dietaryReq = dietaryReq; //Array with either vegetarian or vegan (or empty)
        this.lunchIndex = lunchIndex; //Number representing weekday on which this dish is going to be on lunch offer
        this.#checkLunchOffer(); //Running function to look if this is on lunch offer today, will be marked as true or false
    }

    #checkLunchOffer() {
        const date = new Date();
        const weekdayNumber = date.getDay();
        this.isLunchOffer = (weekdayNumber === this.lunchIndex); //Check if there is a match between today and the day it's going to be on offer. 
        if (this.isLunchOffer) {
            this.dishPriceLunch = Math.floor(this.dishPrice * 0.9);
        }
    }
}
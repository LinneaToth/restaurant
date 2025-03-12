"use strict"; //I want js to behave as it is supposed to

document.addEventListener("DOMContentLoaded", async () => {


    const toggleDisplay = function (element) {
        if (element.style.display === "none") {
            element.style.display = "inline";
            console.log = "hej";
        } else {
            element.style.display = "none";
            console.log = "hej";
        }
    }


    const body = document.querySelector("body");
    const dishes = []; //will be loaded with instances of MenuItem's 
    const date = new Date();

    const weekdayName = function () {
        const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weekday = weekdayNames[date.getDay()];
        console.log("Today is " + weekday);
        return weekday;
    }

    class MenuItem { //will result in objects with certain readable values
        constructor(dishName, dishDescription, dishType, allergens, dietaryReq, lunchIndex, price) {
            this.dishName = dishName; //String
            this.dishDescription = dishDescription; //String
            this.dishPrice = price;
            this.dishType = dishType; //String, either starter, main or dessert
            this.allergens = allergens; //Array with individual strings; dairy, shellfish, gluten and/or nuts (or empty)
            this.dietaryReq = dietaryReq; //Array with either vegetarian or vegan (or empty)
            this.lunchIndex = lunchIndex; //Number representing weekday on which this dish is going to be on lunch offer
            // this.#checkForAllergensEtc(); //Running function to look for allergens, which will be marked as true or false
            this.#checkLunchOffer(); //Running function to look if this is on lunch offer today, will be marked as true or false
        }

        // #checkForAllergensEtc() {
        //     this.allergenDairy = this.allergens.includes("dairy");
        //     this.allergenGluten = this.allergens.includes("gluten");
        //     this.allergenShellfish = this.allergens.includes("shellfish");
        //     this.allergenNuts = this.allergens.includes("nuts");
        //     this.vegan = this.dietaryReq.includes("vegan");
        //     this.vegetarian = this.dietaryReq.includes("vegetarian");

        //     //delete this.allergens; //Don't need duplicate data, original array is deleted
        //     //delete this.dietaryReq; //Don't need duplicate data, original array is deleted
        // }

        #checkLunchOffer() {
            const date = new Date();
            const weekdayNumber = date.getDay();
            this.isLunchOffer = (weekdayNumber === this.lunchIndex); //Check if there is a match between today and the day it's going to be on offer. 
            if (this.isLunchOffer) {
                this.dishPriceLunch = Math.floor(this.dishPrice * 0.9);
            }
        }
    }

    async function getFoodData() { //function that gets data with dishes from json-file
        try {
            const response = await fetch("./script/dishes.json");
            const dishesData = await response.json();
            return dishesData;

        } catch (error) {
            console.log(error.message);
        }
    }

    const createDishes = async function () { //function that creates dishes from the data, using the MenuItem class
        const dishesData = await getFoodData();
        let dishCounter = 0; //used for reaching the correct index in the dishes array

        for (let dishData of dishesData) {
            dishes[dishCounter] = new MenuItem(...dishData); // ... is used for spreading the array into individual arguments, separated by commas!  
            dishCounter++;
        }
    }


    const buildLunchSite = async function () {
        if (body.id != "lunch") {
            return;
        }
        try {
            const lunchDetailsBtn = document.querySelector("#detailed-lunch-info-button")
            const detailedLunchInfo = document.querySelector("#detailed-lunch-info");
            const dishContainer = document.querySelector(".lunch-dish");
            const lunchDishHeading = document.createElement("h4");
            const lunchDishDescription = document.createElement("p");
            lunchDishDescription.classList.add("lunch-dish-description");
            const lunchDishPrice = document.createElement("p");
            lunchDishPrice.classList.add("lunch-dish-price");
            const weekdayHeading = document.querySelector("#weekday");

            weekdayHeading.innerText = weekdayName() + " deal:";

            // lunchDetailsBtn.addEventListener("click", () => {
            //     if (detailedLunchInfo.style.display === "none") {
            //         detailedLunchInfo.style.display = "block";
            //     } else {
            //         detailedLunchInfo.style.display = "none";
            //     }
            // })

            lunchDetailsBtn.addEventListener("click", () => {
                toggleDisplay(detailedLunchInfo)
            });


            if (date.getDay() > 0 && date.getDay() < 5) {
                for (let dish of dishes) {
                    if (dish.isLunchOffer) {
                        lunchDishHeading.innerText = dish.dishName;
                        lunchDishDescription.innerText = dish.dishDescription;
                        lunchDishPrice.innerText = `Lunch deal: ${dish.dishPriceLunch} sek (ordinary price: ${dish.dishPrice} sek)`;
                        dishContainer.appendChild(lunchDishHeading);
                        dishContainer.appendChild(lunchDishDescription);
                        dishContainer.appendChild(lunchDishPrice);
                    }
                }
            } else {
                weekdayHeading.innerText = "Happy " + weekdayName() + "!  Welcome back for lunch deals offered from Monday through Friday!";
            }
        }

        catch (error) {
            console.log(error);
        }

    }

    const buildMenuSite = async function () {
        if (body.id != "menu") {
            return;
        }
        try {
            const mainContainer = document.querySelector(".main-box");
            const starterSection = document.querySelector("#starter-section");
            const mainSection = document.querySelector("#main-section");
            const dessertSection = document.querySelector("#dessert-section");
            const startersBtn = document.querySelector("#starters-button")
            const mainBtn = document.querySelector("#main-button")
            const dessertBtn = document.querySelector("#dessert-button")


            const toggleSections = function (activeSection, otherSection1, otherSection2) {
                if (otherSection1.style.display != "none") {
                    toggleDisplay(otherSection1)
                };
                if (otherSection2.style.display != "none") {
                    toggleDisplay(otherSection2)
                };
                toggleDisplay(activeSection)
            }

            startersBtn.addEventListener("click", () => {
                toggleSections(starterSection, mainSection, dessertSection);
            });

            mainBtn.addEventListener("click", () => {
                toggleSections(mainSection, starterSection, dessertSection);
            });

            dessertBtn.addEventListener("click", () => {
                toggleSections(dessertSection, mainSection, starterSection);
            });


            for (let dish of dishes) {
                const dishArticle = document.createElement("article");
                dishArticle.classList.add("dish-article");
                const dishHeading = document.createElement("h4");
                dishHeading.innerText = dish.dishName;

                const dishDescription = document.createElement("p");
                dishDescription.innerText = dish.dishDescription;


                dishArticle.appendChild(dishHeading);
                dishArticle.appendChild(dishDescription);


                if (dish.allergens.length > 0) {
                    const allergens = document.createElement("p");
                    allergens.innerText = "Allergens: " + dish.allergens.join(", ");
                    allergens.classList.add("dish-info")
                    dishArticle.appendChild(allergens);
                }

                if (dish.dietaryReq.length > 0) {
                    const vegoInfo = document.createElement("p");
                    vegoInfo.innerText = "Meets dietary requirements: " + dish.dietaryReq.join(", ");
                    vegoInfo.classList.add("dish-info")
                    dishArticle.appendChild(vegoInfo);
                }

                switch (dish.dishType) { //Adds the dish to the matching section
                    case "starter":
                        starterSection.appendChild(dishArticle);
                        break;
                    case "main":
                        mainSection.appendChild(dishArticle);
                        break;
                    case "dessert":
                        dessertSection.appendChild(dishArticle);
                }
            }
        }

        catch (error) {
            console.log(error.message);
        }
    }


    await createDishes();
    await buildLunchSite();
    await buildMenuSite();

})
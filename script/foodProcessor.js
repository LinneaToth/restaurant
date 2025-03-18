"use strict";

//The script on this page deals with putting menu item on the site. The output depends on whether the active page is Lunch or Menu.

document.addEventListener("DOMContentLoaded", async () => {

    const body = document.querySelector("body");
    const dishes = []; //will be loaded with instances of MenuItem's, representing the menu
    let cart = []; //will be loaded with items when added by user


    //Helper function to toggle display of DOM elements
    const toggleDisplay = function (element) {
        if (element.style.display === "none") {
            element.style.display = "inline";
        } else {
            element.style.display = "none";
        }
    }

    //Helper function that returns what day of the week it is today
    const weekdayName = function () {
        const date = new Date();
        const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weekday = weekdayNames[date.getDay()];
        return weekday;
    }

    //Builds the cart
    const buildCart = function (arrayCart) {
        const shoppingSection = document.querySelector("#shopping-cart");
        shoppingSection.innerHTML = "<h3>Your dishes</h3>"; //empties the section, so the cart isn't added to last rendering of it

        let lastDish;
        let quantity = 1;
        let lastDishQuantityText;
        let lastDishPriceText;
        let lastDishPrice;
        let sumDishes = 0;

        cart.sort(function (a, b) { //algorithm found on w3schools array sort doc. Places identical items next to each other in the array. 
            let x = a.dishName;
            let y = b.dishName;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            if (x === y) { return 0; }
        });

        //Going through each of the items in the cart
        for (let j = 0; j < cart.length; j++) {
            if (lastDish === cart[j]) {
                //If there are double listings, the amount of the existing item will increase instead of the page listing them twice
                quantity++;
                lastDishQuantityText.innerText = `Amount: ${quantity}`;
                lastDishPriceText.innerText = `Price: ${quantity * lastDishPrice} sek (${lastDishPrice} sek per serving)`;
                sumDishes += cart[j].dishPrice;
            } else {
                quantity = 1;
                const dishArticle = document.createElement("article");
                dishArticle.classList.add("dish-article");

                const dishName = arrayCart[j].dishName;
                const dishHeading = document.createElement("h4");
                dishHeading.innerText = dishName;

                const quantityText = document.createElement("p");
                const priceText = document.createElement("p");
                quantityText.innerText = `Amount: ${quantity}`;
                lastDishPrice = arrayCart[j].dishPrice * quantity;
                priceText.innerText = `Price: ${lastDishPrice}`;
                dishArticle.appendChild(dishHeading);

                //Adds the trash can icon
                const removeItemH4 = document.createElement("h4");
                const removeItem = document.createElement("i");
                removeItem.classList.add("fa-solid", "fa-trash-can");

                //Puts the elements together
                removeItemH4.appendChild(removeItem)
                dishArticle.appendChild(removeItemH4);
                dishArticle.appendChild(quantityText);
                dishArticle.appendChild(priceText);
                shoppingSection.appendChild(dishArticle);

                //Stores the current dish for comparison in the next turn of the loop
                lastDish = arrayCart[j];
                //Current sum of cost
                sumDishes += arrayCart[j].dishPrice;
                //Stores price elements for the next round in case it's a double listed item and needs to be changed 
                lastDishPriceText = priceText;
                lastDishQuantityText = quantityText;

                //Adds eventlisteners for each cart item. It will return an array with everything that is not the item that is being removed. Then the cart will be rebuilt. 
                removeItem.addEventListener("click", () => {
                    cart = arrayCart.filter((cartItem) => {
                        return cartItem.dishName !== dishName;
                    });
                    buildCart(cart);
                })
            }
        }

        //Add sum to the page
        const sumHeading = document.createElement("h4");
        sumHeading.innerText = `Total cost: ${sumDishes} sek`
        shoppingSection.appendChild(sumHeading);
    }

    async function getFoodData() { //function that gets data with dishes from json-file
        try {
            const response = await fetch("./script/dishes.json");
            const dishesData = await response.json();
            return dishesData; //returns an array with all of the dishes
        } catch (error) {
            console.log(error.message);
        }
    }

    const createDishes = async function () { //function that creates dishes from the data, using the MenuItem class
        const dishesData = await getFoodData();
        let dishCounter = 0; //used for reaching the correct index in the dishes array

        for (let [i, dishData] of dishesData.entries()) { //adding .entries() is a workaround to be able to get the index of the array items when using for...of
            dishes[i] = new MenuItem(...dishData);
        }
    }

    //Function putting the lunch page content together and in place
    const buildLunchSite = function () {
        const date = new Date();

        if (body.id != "lunch") {
            return;
        }
        try {
            //declaring and modifyring DOM elements
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

            //Button hiding and showing lunch details, using the helper function
            lunchDetailsBtn.addEventListener("click", () => {
                toggleDisplay(detailedLunchInfo)
            });

            //Types out the lunch offer if today is a weekday
            if (date.getDay() > 0 && date.getDay() < 6) {
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
                //Wishes you a happy weekend if today is a Saturday or Sunday
                weekdayHeading.innerText = "Happy " + weekdayName() + "!  Welcome back for lunch deals offered from Monday through Friday!";
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    //Function putting the menu page content together and in place
    const buildMenuSite = function () {
        if (body.id != "menu") {
            return; //if it's not the menu page, the rest of the code will not run
        }
        try {
            //declaring and modifyring DOM elements
            const starterSection = document.querySelector("#starter-section");
            const mainSection = document.querySelector("#main-section");
            const dessertSection = document.querySelector("#dessert-section");
            const shoppingSection = document.querySelector("#shopping-cart");
            const startersBtn = document.querySelector("#starters-button")
            const mainBtn = document.querySelector("#main-button")
            const dessertBtn = document.querySelector("#dessert-button")
            const cartBtn = document.querySelector("#shopping-button")

            //Functionality for filtering menu items per category
            const toggleSections = function (activeSection, otherSection1, otherSection2, otherSection3) {
                const argsArray = Array.from(arguments); //adds arguments to array to be looped over

                //Checks if sections that shouldn't be visible are showing, and hides them if so
                for (let i = 1; i < argsArray.length; i++) {
                    if (argsArray[i].style.display != "none") {
                        toggleDisplay(argsArray[i]);
                    }
                }
                // Checks if the wanted section is hidden, and shows it if it is
                if (activeSection.style.display === "none") {
                    toggleDisplay(activeSection)
                }
            }

            startersBtn.addEventListener("click", () => {
                toggleSections(starterSection, mainSection, dessertSection, shoppingSection);
            });

            mainBtn.addEventListener("click", () => {
                toggleSections(mainSection, starterSection, dessertSection, shoppingSection);
            });

            dessertBtn.addEventListener("click", () => {
                toggleSections(dessertSection, mainSection, starterSection, shoppingSection);
            });

            cartBtn.addEventListener("click", () => {
                toggleSections(shoppingSection, dessertSection, mainSection, starterSection);
                buildCart(cart);
            });

            //Looping through the dishes, putting them on the site
            for (let dish of dishes) {
                const dishArticle = document.createElement("article");
                dishArticle.classList.add("dish-article");

                const dishHeading = document.createElement("h4");
                dishHeading.innerText = dish.dishName;

                const dishPrice = document.createElement("h4");
                const cartIcon = document.createElement("i");
                cartIcon.classList.add("fa-solid", "fa-cart-plus");
                dishPrice.innerText = dish.dishPrice + " ";
                dishPrice.appendChild(cartIcon);

                const dishDescription = document.createElement("p");
                dishDescription.innerText = dish.dishDescription;

                dishArticle.appendChild(dishHeading);
                dishArticle.appendChild(dishPrice);
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

                cartIcon.addEventListener("click", () => {
                    cart.push(dish); //Adds the dish to the cart
                })
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    await createDishes(); //Needed everywhere there is a mention of menu items 
    buildLunchSite(); //Will only run through the code if on lunch page
    buildMenuSite(); //Will only run through the code if on menu page

})
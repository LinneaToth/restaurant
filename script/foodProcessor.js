"use strict";

//This script deals with putting menu item on the site. The output depends on whether the active page is Lunch or Menu.

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

    //Returns what day of the week it is today
    const weekdayName = function () {
        const date = new Date();
        const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weekday = weekdayNames[date.getDay()];
        console.log("Today is " + weekday);
        return weekday;
    }

    //Function building he scopping cart
    const buildCart = function (arrayCart) {
        const shoppingSection = document.querySelector("#shopping-cart");
        shoppingSection.innerHTML = "<h3>Your dishes</h3>"; //empties the section, so the cart isn't added to last rendering of it

        let lastDish;
        let quantity = 1;
        let lastDishQuantityText;
        let lastDishPriceText;
        let lastDishPrice;
        let sumDishes = 0;

        cart.sort(function (a, b) { //algorithm found on w3schools array sort doc
            let x = a.dishName;
            let y = b.dishName;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            if (x === y) { return 0; }
        });

        for (let j = 0; j < cart.length; j++) {
            if (lastDish === cart[j]) {
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

                const removeItemH4 = document.createElement("h4");
                const removeItem = document.createElement("i");
                removeItem.classList.add("fa-solid", "fa-trash-can");

                removeItemH4.appendChild(removeItem)
                dishArticle.appendChild(removeItemH4);
                dishArticle.appendChild(quantityText);
                dishArticle.appendChild(priceText);
                shoppingSection.appendChild(dishArticle);

                lastDish = arrayCart[j];
                sumDishes += arrayCart[j].dishPrice;
                lastDishPriceText = priceText;
                lastDishQuantityText = quantityText;

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

    //Function putting the lunch page content together and in place
    const buildLunchSite = async function () {
        const date = new Date();

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

            lunchDetailsBtn.addEventListener("click", () => {
                toggleDisplay(detailedLunchInfo)
            });

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
                weekdayHeading.innerText = "Happy " + weekdayName() + "!  Welcome back for lunch deals offered from Monday through Friday!";
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    //Function putting the menu page content together and in place
    const buildMenuSite = async function () {
        if (body.id != "menu") {
            return;
        }
        try {
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
                if (otherSection1.style.display != "none") {
                    toggleDisplay(otherSection1)
                };
                if (otherSection2.style.display != "none") {
                    toggleDisplay(otherSection2)
                };
                if (otherSection3.style.display != "none") {
                    toggleDisplay(otherSection3)
                };
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
            let dishCounter = 0;
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


    await createDishes(); //Needed everywhere there is a mention of menu items :)
    await buildLunchSite(); //Will only run through the code if on lunch page
    await buildMenuSite(); //Will only run through the code if on menu page


})
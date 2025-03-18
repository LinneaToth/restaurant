"use strict";

//NAVIGATION 
//Function returning the file name of the page we're currently viewing
const getCurrentHTML = function () {
    let path = window.location.pathname;

    //quick-fix to make it work on github pages after subfolder pages was added to the structure
    if (path.includes("restaurant")) {
        path = path.substring(path.lastIndexOf("/"));
    }
    
    //Logic returning the current page name, even if index.html is not explicitly stated
    if (path != "/") {
        return path.substring(path.lastIndexOf("/"));
    } else {
        return "index.html";
    }
}

//Function going through the different nav URLS, putting them into elements and adding them to navbar
const menuItemCreator = function (destinations) {
    destinations.forEach((destination) => {
        const menuItem = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = destination;
        anchor.innerText = destination.substring(destination.lastIndexOf("/") + 1, destination.lastIndexOf("."));
        menuItem.appendChild(anchor);
        navList.appendChild(menuItem);
        if (destination === getCurrentHTML()) {
            menuItem.classList.add("active");
        }
    })
}

//Writing the navbar and injecting it into the top header
//Declaration of elements, and assignment of initial classes
const topHeader = document.querySelector("#top-header");
const nav = document.createElement("nav");
nav.id = "navigation_bar"
const menuIcon = document.createElement("i");
const logoLink = document.createElement("a");
logoLink.innerText = "RÖK";
logoLink.id = "logo-link";
const navList = document.createElement("ul");
navList.id = "nav-list";
navList.classList.add("nav-list")

//some logic for pointing the nav links in the correct direction
let navURLs;
if (!getCurrentHTML().includes("index")) {
    logoLink.href = "../index.html"
    navURLs = ["./lunch.html", "./menu.html", "./reservations.html"];
} else {
    logoLink.href = "./index.html"
    navURLs = ["./pages/lunch.html", "./pages/menu.html", "./pages/reservations.html"];
}

//calling the above function to create the menu items
menuItemCreator(navURLs);
nav.appendChild(menuIcon);
nav.appendChild(logoLink);
nav.appendChild(navList);
topHeader.appendChild(nav);


"use strict"; //I want js to behave as it is supposed to.. 

//NAVIGATION 

//Function returning the file name of the page we're currently viewing
const getCurrentHTML = function () {
    let path = window.location.pathname;
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
const menuIcon = document.createElement("i");

const logoLink = document.createElement("a");
logoLink.href = "/index.html"
logoLink.innerText = "RÖK";
logoLink.id = "logo-link";
const navList = document.createElement("ul");
navList.id = "nav-list";
navList.classList.add("nav-list")
const navURLs = ["./lunch.html", "./menu.html", "./reservations.html"];
const restName = "RÖK";

//calling the above function to create the menu items
menuItemCreator(navURLs);
nav.appendChild(menuIcon);
nav.appendChild(logoLink);
nav.appendChild(navList);
topHeader.appendChild(nav);


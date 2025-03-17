//This script will validate the input from the form 

const submitBtn = document.querySelector("#submit-btn");

let ul = null;

const validateForm = function () {
    let allOk = true;
    const errorBox = document.querySelector("#error-box");
    ul = document.createElement("ul");
    ul.innerText = "Your message was not sent. Please provide:"

    const formName = document.forms["res-inq-form"]["name"].value;
    const formEmail = document.forms["res-inq-form"]["email"].value.trim();
    const formFreeText = document.forms["res-inq-form"]["free_text"].value;
    const formPhone = document.forms["res-inq-form"]["phone"].value.trim();

    const regExMail = /^[\w.]{1,20}@[\w-]{1,20}\.[a-zA-Z]{2,8}$/;
    const regExPhone = /^[\+]?[0-9]{0,4}?[0-9]{0,4}[\-]?[0-9]{5,10}$/;
    const regExName = /^[a-zA-ZÀ-ÿ]+[a-zA-ZÀ-ÿ\s'-]{0,44}$/;

    console.log(regExMail);
    console.log(formEmail.match(regExMail))

    if (!formFreeText || formFreeText.length < 10) {
        const li = document.createElement("li");
        li.innerText = "A message for us";
        ul.appendChild(li);
        allOk = false;
    }

    if (!formName.match(regExName)) {
        const li = document.createElement("li");
        li.innerText = "Your full name";
        ul.appendChild(li);
        allOk = false;
    }

    if (!formEmail.match(regExMail)) {
        const li = document.createElement("li");
        li.innerText = "An e-mail address";
        ul.appendChild(li);
        allOk = false;
    }

    if (!formPhone.match(regExPhone)) {
        const li = document.createElement("li");
        li.innerText = "Your phone number";
        ul.appendChild(li);
        allOk = false;
    }

    if (!allOk) {
        errorBox.appendChild(ul);
    }

    return allOk;
}

submitBtn.addEventListener("click", async function (event) {
    const errorBox = document.querySelector("#error-box");

    if (ul) { ul.remove(); };

    if (!validateForm()) {
        event.preventDefault(); //prevents default submission of form
        console.log("Submission prevented");

    } else {
        confirm("Thank you for reaching out to us! You will hear from us soon!");
    };
})

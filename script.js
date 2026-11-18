const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    if (navbar.classList.contains("show")) {
        icon.className = "fas fa-xmark";
    } else {
        icon.className = "fas fa-bars";
    }
});


document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("show");
        menuBtn.querySelector("i").className = "fas fa-bars";
    });
});

const themeBtn = document.getElementById("themeBtn");
const themeIcon = themeBtn.querySelector("i");

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.className = "fas fa-sun";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const isLight =
        document.body.classList.contains("light-mode");

    themeIcon.className = isLight
        ? "fas fa-sun"
        : "fas fa-moon";

    localStorage.setItem(
        "portfolio-theme",
        isLight ? "light" : "dark"
    );

});


const words = [
    "Computer Science Student",
    "Web Developer",
    "Java Programmer",
    "Software Engineer",
    "Future IT Professional"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typingElement =
    document.querySelector(".typing");

function typeEffect() {

    const currentWord = words[wordIndex];

    if (deleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingElement.textContent =
        currentWord.substring(0, charIndex);

    let speed = deleting ? 50 : 100;

    if (!deleting &&
        charIndex === currentWord.length) {

        deleting = true;
        speed = 1500;

    } else if (deleting && charIndex === 0) {

        deleting = false;

        wordIndex =
            (wordIndex + 1) % words.length;

        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();


const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

    let current = "home";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );

    });

});

const revealElements = document.querySelectorAll(
    ".section-title, .about-container, .skill-card, " +
    ".timeline-item, .project-card, .certificate-card, " +
    ".learning-card, .contact-container"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    observer.observe(element);
});


const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const subject =
        document.getElementById("subject").value.trim();

    const message =
        document.getElementById("message").value.trim();

    // Change this to your real email
    const myEmail = "kaoni071@email.com";

    if (myEmail === "kaoni071@email.com") {
        formMessage.textContent =
            "Please configure the recipient email in script.js.";

        return;
    }

    const mailBody =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`;

    const mailLink =
        `mailto:${myEmail}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(mailBody)}`;

    formMessage.textContent =
        "Opening your email application...";

    window.location.href = mailLink;

});

const footerYear = document.querySelector(".footer");

if (footerYear) {
    const yearText = footerYear.querySelector("p:last-child");

    if (yearText) {
        yearText.textContent =
            `© ${new Date().getFullYear()} KAO NY. All Rights Reserved.`;
    }
}

console.log("KAO NY Portfolio Website Loaded Successfully!");

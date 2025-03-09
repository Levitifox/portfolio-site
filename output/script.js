document.addEventListener("DOMContentLoaded", function () {
    const scrollbar = document.querySelector(".custom-scrollbar");
    const thumb = document.querySelector(".thumb");
    const docElem = document.documentElement;
    let scrollTimeout;

    function updateThumb() {
        const scrollTop = window.pageYOffset || docElem.scrollTop;
        const viewportHeight = window.innerHeight;
        const docHeight = docElem.scrollHeight;
        const trackHeight = scrollbar.clientHeight;

        const maxScroll = docHeight - viewportHeight;
        const maxThumbTravel = trackHeight - thumb.offsetHeight;

        const thumbTop = (scrollTop / maxScroll) * maxThumbTravel;
        thumb.style.top = thumbTop + "px";
    }

    window.addEventListener("scroll", function () {
        updateThumb();
        thumb.style.transform = "scaleY(1.5)";
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            thumb.style.transform = "scaleY(1)";
        }, 10);
    });

    window.addEventListener("resize", updateThumb);

    let isDragging = false;
    let startY, startThumbTop;

    thumb.addEventListener("mousedown", function (e) {
        isDragging = true;
        startY = e.clientY;
        startThumbTop = parseInt(window.getComputedStyle(thumb).top, 10);
        e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        const trackHeight = scrollbar.clientHeight;
        const maxThumbTravel = trackHeight - thumb.offsetHeight;
        const newThumbTop = Math.max(0, Math.min(startThumbTop + deltaY, maxThumbTravel));
        thumb.style.top = newThumbTop + "px";

        const scrollRatio = newThumbTop / maxThumbTravel;
        const maxScroll = docElem.scrollHeight - window.innerHeight;
        window.scrollTo(0, scrollRatio * maxScroll);
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });

    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    let mouseX = 0,
        mouseY = 0;
    let outlineX = 0,
        outlineY = 0;

    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        outline.style.left = outlineX + "px";
        outline.style.top = outlineY + "px";
        requestAnimationFrame(animateOutline);
    }

    animateOutline();

    const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, [data-cursor-interactive]");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            outline.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            outline.classList.remove("cursor-hover");
        });
    });

    const heroLogo = document.querySelector(".hero-logo");
    if (heroLogo) {
        heroLogo.addEventListener("mouseenter", () => outline.classList.add("hero-hover"));
        heroLogo.addEventListener("mouseleave", () => outline.classList.remove("hero-hover"));
    }

    lottie.loadAnimation({
        container: document.getElementById("levitifox-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "{{root}}images/levitifox.json",
    });

    updateThumb();
});

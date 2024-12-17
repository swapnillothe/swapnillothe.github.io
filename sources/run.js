document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const content = document.querySelector('.milky-way');
    const startTime = Date.now();

    // Initially hide the content
    content.style.visibility = 'hidden';

    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);

        setTimeout(() => {
            loader.classList.add('fade-out');
            content.style.visibility = 'visible';
            
            setTimeout(() => {
                loader.style.display = 'none';
                content.classList.add('fade-in');
            }, 500); // This should match the transition duration in CSS
        }, remainingTime);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    const glowbox = document.getElementById("glowbox");
    const background = document.querySelector(".background");
    // After a short delay (adjust as needed), add the final shadow class
    setTimeout(function() {
        glowbox.classList.remove("initial-shadow");
        glowbox.classList.add("final-shadow");
        background.classList.add("show-background");
    }, 0); // Adjust the delay in milliseconds
    
    // You can remove the initial class after adding the final shadow if needed
    // setTimeout(function() {
    //     glowbox.classList.remove("initial-shadow");
    // }, 3000); // Adjust the delay in milliseconds
});

addEventListener("contextmenu", function(e) {
    e.preventDefault();
}); 

// Remove or comment out the following code as it's now redundant
/*
document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};
*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';

    // Disable context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable copy
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showCopyMessage();
    });

    // Disable cut
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showCopyMessage();
    });

    // Disable paste
    document.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    function showCopyMessage() {
        const message = document.createElement('div');
        message.textContent = 'Copying is disabled';
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.padding = '10px 20px';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = 'white';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9999';

        document.body.appendChild(message);

        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
    }
});

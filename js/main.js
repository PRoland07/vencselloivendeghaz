// Init AOS
AOS.init({
    duration: 1000,
    offset: 200,
    easing: 'ease-in',
    once: true
});

// Init Scrollspy
$('body').scrollspy({ target: '#main-nav' });

// Smooth Scrolling for main nav
$("#main-nav a").on('click', function (event) {
        if (this.hash !== "") {
            // clicked anchors will not take the browser to a new URL
            event.preventDefault();

            // this.hash reads the href attribute of this, and gets the part of the URL beginning with #
            const hash = this.hash;

            $('html, body').animate({
            scrollTop: $(hash).offset().top // property to interpolate
            }, 800, // duration
            function () { // on complete
                if (history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    window.location.hash = hash;
                }
            });
        }
    }
);

// Smooth Scrolling for rules nav
$("#rules-nav a").on('click', function (event) {
        if (this.hash !== "") {
            // clicked anchors will not take the browser to a new URL
            event.preventDefault();

            // this.hash reads the href attribute of this, and gets the part of the URL beginning with #
            const hash = this.hash;

            $('html, body').animate({
            scrollTop: $(hash).offset().top // property to interpolate
            }, 800, // duration
            function () { // on complete
                if (history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    window.location.hash = hash;
                }
            });
        }
    }
);

// Init auto-dropdown on hover
const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";

$(window).on("load resize", function() {
if (this.matchMedia("(min-width: 768px)").matches) {
    $dropdown.hover(
    function() {
        const $this = $(this);
        $this.addClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "true");
        $this.find($dropdownMenu).addClass(showClass);
    },
    function() {
        const $this = $(this);
        $this.removeClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "false");
        $this.find($dropdownMenu).removeClass(showClass);
    }
    );
} else {
    $dropdown.off("mouseenter mouseleave");
}
});

// Close mobile navbar on click
$(function(){ 
    var navMain = $(".navbar-collapse"); // avoid dependency on #id
    // "a:not([data-toggle])" - to avoid issues caused when having a dropdown inside navbar
    navMain.on("click", "a:not([data-toggle])", null, function () {
        navMain.collapse('hide');
    });
});

// Video Play
$(function () {
    // Auto play modal video
    $(".video").click(function () {
        var theModal = $(this).data("target"),
        videoSRC = $(this).attr("data-video"),
        videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
        $(theModal + ' iframe').attr('src', videoSRCauto);
        $(theModal + ' button.close').click(function () {
            $(theModal + ' iframe').attr('src', videoSRC);
        });
    });
});

// Init Lightbox
lightbox.option({
    'disableScrolling': true, // prevent the page from scrolling while Lightbox is open.
    'resizeDuration': 200,
    'wrapAround': true,
    'albumLabel': "%1/%2"
});

// Init Testimonials Slider
$('.slider').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    slideToShow: 1,
    slideToScroll: 1
});

// Get the current year for the copyright
$('#year').text(new Date().getFullYear());

// Send form data
function submitForm() {

    // disable the button and change its text to avoid spamming
    const submitBtn = document.getElementById('submit-btn');
    // prevent submit event if button is disabled
    if (submitBtn.classList.contains('disabled')) {
        console.log('spam')
        event.preventDefault();
        event.stopPropagation();
        return;
    }
    let curLang = languages.get(curKey);
    console.log(curLang);
    submitBtn.classList.add('disabled');
    submitBtn.value = curLang['contact_form_btn_loading']
    
    // show process message in h3 as well
    const contactPrompt = document.getElementById('contact-prompt');
    contactPrompt.innerText = curLang['contact_form_prompt_loading']

    const form = document.getElementById("contact-form");
    form.classList.add('was-validated');

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    // extract values
    const lastNameInputVal = document.getElementById('inp-last-name').value;
    const firstNameInputVal = document.getElementById('inp-first-name').value;
    const emailInputVal = document.getElementById('inp-email').value;
    const phoneInputVal = document.getElementById('inp-phone').value;
    const messageInputVal = document.getElementById('inp-message').value;

    const payload_to = 'vvendeghaz@gmail.com'
    const payload_subject = `${lastNameInputVal} ${firstNameInputVal} üzenetet küldött`
    const payload_text = 
`
Kedves Vencsellői Wellness Vendégház!

Üzenet érkezett a weboldalon található kapcsolatfelvételi formon keresztül.

Feladó: ${lastNameInputVal} ${firstNameInputVal}

Feladó email címe: ${emailInputVal}

Feladó telefonszáma: ${phoneInputVal}

Feladó üzenete:
${messageInputVal}

FONTOS: 
Ez egy automatikusan generált email. 
Ne válaszoljon erre a levélre. 
Válaszát a feladó elérhetőségére küldje el új emailként.
`

    fetch("https://spring-boot-mail-api.herokuapp.com/api/v1/send-mail",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({to: [payload_to], subject: payload_subject, text: payload_text})
    })
    .then(function(res) {
        contactPrompt.innerText = curLang['contact_form_prompt_success'];
        form.classList.add('d-none'); // hide form
        document.getElementById('message-sent-check').classList.remove('d-none'); // show success check mark
    })
    .catch(function(res) {
        contactPrompt.innerText = curLang['contact_form_prompt_failure'];
        form.classList.add('d-none'); // hide form
        document.getElementById('message-sent-cross').classList.remove('d-none'); // show failure cross
    });

}

// prevent form submission when having invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        let forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        let validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                } else {
                    submitForm();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

// accordion icon change on click

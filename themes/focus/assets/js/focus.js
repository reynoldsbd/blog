$(document).ready(function() {

    // Enable nav burger toggling
    $('.navbar-burger').click(function() {
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });
});


// Enable fixed-when-scrolling for custom ToC
// let customTocTop = $('#custom-toc').offset().top;
// let customTocLeft = $('#custom-toc').offset().left;
// $(window).scroll(function() {
//     let currentScroll = $(window).scrollTop();
//     if (currentScroll >= customTocTop) {
//         $('#custom-toc').css({
//             position: 'fixed',
//             top: 0,
//             left: customTocLeft
//         });
//     } else {
//         $('#custom-toc').css({
//             position: 'static'
//         });
//     }
// });
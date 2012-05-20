# Slide

jQuery slider/carousel thingie.

- Uses CSS3 transform
- Resorts to margin-left if no CSS3
- Automatically calculates the width of the slides and makes all the slides same size
- **Note:** Fallbacks to scrolling if any of the slides is too big for the container

Example usage with all the options:

    var carousel = $('#carousel');
    
    carousel.Slide({
        startIndex: 0,
        speed: 300,
        onSlideEnd: function() {
            // do something
        }
    });
    
    $('#carousel-btn-1').click(function () {
        carousel.slide(0);
    });
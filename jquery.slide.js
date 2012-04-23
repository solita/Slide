/*!
 * jQuery Slide plugin - version 0.1
 * by Antti-Jussi Kovalainen (ajk@ajk.im)
 */

;(function (window, undefined) {

    jQuery.fn.Slide = function (options_in) {
        return new Slide($(this), options_in);
        //return this.each(function() {
        //});
    };
    
    function Slide(containerr, options_in) {
        var options = $.extend({
            startIndex: 0,
            speed: 300,
            onSlideEnd: function() {
            }
        }, options_in);

        var activeIndex = options.startIndex;
        var container = containerr; //$(this);
        var list = $('#maps ul');
        var listElements = $('#maps > ul > li');
        var listItemWidth = 0;
        var containerTooSmall = false;

        container.css({
            overflow: 'hidden'
        });

        listElements.hide();

        container.imagesLoaded(function() {
            calcWidth();

            listElements.css({
                display: 'inline-block',
                float: 'left'
            });

            listElements.show();
        });

        $(window).resize(function() {
            calcWidth();
        });


        function pos(index) {
            return parseInt(listItemWidth * index);
        }

        function setCssTransforms(duration, translation) {
            if (containerTooSmall) {
                container.scrollLeft(translation);
                translation = 0;
            } else {
                container.scrollLeft(0);
            }

            if (Modernizr.csstransforms3d || Modernizr.csstransforms) {
                var transform = 'translate(-' + translation + 'px, 0px)';

                if (Modernizr.csstransforms3d) {
                    transform = 'translate3d(-' + translation + 'px, 0px, 0px)';
                }

                list.css('-webkit-transition-duration', duration + 'ms');
                list.css('-moz-transition-duration', duration + 'ms');
                list.css('-o-transition-duration', duration + 'ms');
                list.css('-ms-transition-duration', duration + 'ms');
                list.css('transition-duration', duration + 'ms');

                list.css('-webkit-transform', transform);
                list.css('-moz-transform', transform);
                list.css('-o-transform', transform);
                list.css('-ms-transform', transform);
                list.css('transform', transform);

                list.unbind('webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionEnd')
                      .bind('webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionEnd', function() {
                        options.onSlideEnd();
                    });

            } else {
                list.css('margin-left', -translation + 'px');

                setTimeout(function() {
                    options.onSlideEnd();
                }, duration);
            }
        }

        function calcWidth(callback) {

            // container width rocks
            listItemWidth = container.width();

            var minWidth = listItemWidth;

            listElements.css({
                width: 'auto'
            });
            listElements.each(function() {
                var $this = $(this);
                if (minWidth < $this.width()) {
                    minWidth = $this.width();
                }
            });

            if (minWidth > listItemWidth) {
                containerTooSmall = true;
                container.css({
                    overflowX: 'auto'
                });
            } else {
                containerTooSmall = false;
                container.css({
                    overflowX: 'hidden'
                });
            }

            listItemWidth = minWidth;

            list.css({
                width: parseInt(listElements.length * listItemWidth)
            });

            listElements.css({
                display: 'inline-block',
                float: 'left',
                width: listItemWidth
            });

            setCssTransforms(0, pos(activeIndex));

            if (callback !== undefined) {
                callback();
            }
        }

        // public methods:

        function slide(index) {
            activeIndex = index;
            setCssTransforms(options.speed, pos(index));
        }

        this.slide = slide;
    }

})(window);

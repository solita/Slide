// jQuery Slide - version 0.3
// by Antti-Jussi Kovalainen (ajk@ajk.im)

;(function (window, undefined) {
     jQuery.fn.Slide = function (options_in) {
        return new Slide($(this), options_in);
    };

    function Slide(container, options_in) {

        var options = $.extend({
            startIndex: 0,
            speed: 300,
            onSlideEnd: function(index, elem) {}
        }, options_in);

        var activeIndex = options.startIndex;
        var list = container.find('> ul');
        var listElements = list.find('> li');
        var maxIndex = listElements.length;
        var listItemWidth = 0;
        var containerTooSmall = false;
        var marginTimeout = null;

        container.css({
            overflow: 'hidden'
        });

        listElements.hide();

        container.imagesLoaded(function() {
            calcWidth();
            resizeElements();

            listElements.show();
        });

        $(window).resize(function() {
            calcWidth();
            resizeElements();
        });


        function resizeElements() {
            list.css({
                width: parseInt(listElements.length * listItemWidth, 10)
            });

            listElements.css({
                display: 'inline-block',
                float: 'left',
                width: listItemWidth
            });

            setCssTransforms(0, pos(activeIndex));
        }

        function pos(index) {
            return parseInt(listItemWidth * index, 10);
        }

        function setCssTransforms(duration, translation) {
            if (containerTooSmall) {
                container.scrollLeft(translation);
                translation = 0;
            } else {
                container.scrollLeft(0);
            }

            if ((Modernizr.csstransforms3d || Modernizr.csstransforms) && Modernizr.csstransitions) {
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
                        options.onSlideEnd(activeIndex, listElements.get(activeIndex));
                    });

            } else {
                //list.css('margin-left', -translation + 'px');
                list.stop().animate({ marginLeft: -translation }, duration);

                clearTimeout(marginTimeout);
                marginTimeout = setTimeout(function() {
                    options.onSlideEnd(activeIndex, listElements.get(activeIndex));
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

            if (callback !== undefined) {
                callback();
            }
        }

        // public methods:

        this.slide = function (index) {
            activeIndex = index;
            setCssTransforms(options.speed, pos(index));
        };

        this.getPos = function () {
            return activeIndex;
        };

        this.next = function () {
            if (activeIndex < maxIndex) {
                this.slide(activeIndex + 1);
            }
        };

        this.prev = function () {
            if (activeIndex > 0) {
                this.slide(activeIndex - 1);
            }
        };

    }

    window.Slide = window.Slide || Slide;

})(window);


(function ($) {

    $.widget("ui.carousel", {

        options: {
            autoplayInterval: 3000,
            itemFadeDuration: 500,
            autoplay: false
        },

        itemTemplate: $('<div class="item"><img/></div>'),
        pagerItemTemplate: $('<li><a href="#"></a></li>'),

        _create: function () {
            var self = this;

            // create pager.
            self.$pager = $('<nav><ol></ol></nav>');

            for (var i = 0; i < self.options.items.length; i++) {
                var item = self._getItem(i);
                item.index = i;                

                // add item to pager.
                var $pagerItem = self.pagerItemTemplate.clone();
                var $a = $pagerItem.find('a');
                $a.text(item.index + 1);
                $a.data('item', item);
                
                if (item.Title) {
                    $a.prop('title', item.Title);
                }

                $a.click(function (e) {
                    e.preventDefault();
                    self._onPagerItemClick.call(this, self);
                });
                
                self.$pager.find('ol').append($pagerItem);
            }

            self.element.append(self.$pager);

            self._changeIndex(0);
            
            // start autoplay.
            if (self.options.autoplay) {
                self.autoplay = setInterval(function() {
                    var nextIndex;

                    if (self.currentItem.index == self.options.items.length - 1) {
                        nextIndex = 0;
                    } else {
                        nextIndex = self.currentItem.index + 1;
                    }

                    self._changeIndex(nextIndex);
                }, self.options.autoplayInterval);
            }
        },

        _changeIndex: function (nextIndex) {
            var self = this;

            if (self.currentItem && nextIndex == self.currentItem.index) return;

            // create next item and fade in.
            self._createItem(nextIndex, function(nextItem) {

                nextItem.elem.css('position', 'static');
                self.$pager.before(nextItem.elem);
                nextItem.elem.hide();
                nextItem.elem.fadeIn(self.options.itemFadeDuration);

                if (self.currentItem) {
                    self.currentItem.elem.css('position', 'absolute');
                    self.currentItem.elem.fadeOut(self.options.itemFadeDuration, function() {
                        $(this).hide();
                    });
                }

                // update pager.
                self.$pager.find('a').removeClass('current');
                $(self.$pager.find('a')[nextIndex]).addClass('current');

                self.currentItem = nextItem;
            });
        },

        _createItem: function (index, callback) {
            var self = this;

            var item = self._getItem(index);

            // if an element has already been created for this item, return it.
            if (item.elem) {
                callback(item);
                return;
            }

            // create carousel item.
            var $item = self.itemTemplate.clone();

            // create two-way reference between data item and dom element.
            item.elem = $item;
            $item.data('item', item);

            var $img = $item.find('img');
            $img.load(function () {

                if (item.Uri) {
                    $item.addClass('link');
                    $item.click(function (e) { self._onItemClick.call(this, self); });
                }

                if (item.Title) {
                    $item.prop('title', item.Title);
                }

                callback(item);
            }).prop('src', item.Image);
        },
        
        _getItem: function(index) {
            var self = this;
            
            return self.options.items[index];
        },

        _onItemClick: function (self) {
            var item = $(this).data('item');
            window.location = item.Uri;
        },

        _onPagerItemClick: function (self) {
            if (self.autoplay) {
                window.clearInterval(self.autoplay);
                self.autoplay = 0;
            }

            var item = $(this).data('item');

            self._changeIndex(item.index);
        },

        init: function () {
        },

        _destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments);
        }

    });

})(jQuery);

/*
 * nav.js
 * Sizing and positioning for sub menus
 * Original code: https://github.com/daattali/beautiful-jekyll/blob/master/js/main.js
 */

var nav = {
  init : function() {
    // Ensure nested navbar menus are not longer than the menu header
    var menus = $(".navlinks-container");
    if (menus.length > 0) {
      var navbar = $("#main-navbar");
      var fakeMenuHtml = "<div class='fake-menu' style='display:none;'><a></a></div>";
      navbar.append(fakeMenuHtml);
      var fakeMenu = $(".fake-menu");

      $.each(menus, function(i) {
        var parent = $(menus[i]).find(".navlinks-parent");
        var childrenContainer = $(menus[i]).find(".navlinks-children");
        var children = $(menus[i]).find(".navlinks-children a");
        var words = [];
        $.each(children, function(idx, el) { words = words.concat($(el).text().trim()); });
        var maxwidth = 0;
        $.each(words, function(id, word) {
          fakeMenu.html("<a class='navlinks-parent'>" + word + "</a>");
          var width =  fakeMenu.width();
          if (width > maxwidth) {
            maxwidth = width;
          }
        });
        $(childrenContainer).css('width', maxwidth + 'px');

        // Adjust poistion of child menu when it gets opened
        // https://css-tricks.com/popping-hidden-overflow/
        parent.on('mouseover', function() {
          var pos = parent.position();
          childrenContainer.css({
            left: pos.left,
          });
        });
      });

      fakeMenu.remove();
    }
  },
};

document.addEventListener('DOMContentLoaded', nav.init);

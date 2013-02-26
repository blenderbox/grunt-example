(function($) {
  function init() {
    $('img').click(function() {
      $(this).toggleClass('spin');
    });
  }

  $(init);
}(jQuery));

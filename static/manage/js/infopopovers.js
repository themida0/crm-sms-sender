function infopopovers() {
  init_popover($('.infopopover_onload'), true);
  if(window.innerWidth > 768){
      init_popover($('[data-infopopoveronhover]'), false, 'hover');
  }
  $('.infopopover_onload').each(function () {
    var $this = $(this);
    if($this.parent().is(':visible')){
        $this.popover('show');
    }
    $this.bind('destroyed', function () {
      $this.popover('destroy');
    });
  });
}
function init_popover($els, add_close_btn, trigger_event) {
  var add_close = add_close_btn || false;
  var trigger = trigger_event || 'manual';
  $els.each(function(){
      var $el = $(this);
      var opts = {
        container: 'body',
        placement: window.innerWidth >= 768 ? 'auto right' : 'auto bottom',
        trigger: trigger,
        html: true,
        template: '<div class="popover infopopover' + (add_close ? ' has_close_btn' : '') + '" role="tooltip">' +
        '<div class="arrow"></div><div class="popover-body clearfix"><h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        (add_close ? '<i class="infopopover-close fa fa-times"></i>' : '') +
        '</div></div>'
      };
      var $in_modal = $el.closest('.modal');
      if($in_modal.length){
          opts.container = $in_modal;
      }
      var $in_sidebar = $el.closest('.sidebar-box');
      if($in_sidebar.length){
          opts.container = $in_sidebar;
      }
      $el.popover(opts);
  });
}
(function ($, document) {

  $(function () {

    $(document).on('click', '.infopopover_onclick', function (e) {
//      console.log('test');
      e.stopPropagation();
      var $this = $(this);
      if (!$this.hasClass('hasPopover')) {
        init_popover($this);
        $this.addClass('hasPopover');
      }
      $this.popover('toggle');
    });

    $(document).on('click', '.infopopover-close', function (e) {
      e.stopPropagation();
      var $this = $(this).parents('.popover'),
        $origin = $('.infopopover_onetime[aria-describedby="'+$this.attr('id')+'"]'),
        info_var = $origin.attr('data-id');
      $this.popover('hide');
      $.ajax({
        url: prefix + 'messages?act=hide-infopopover',
        type: 'POST',
        data: 'id=' + info_var,
        dataType: 'json',
        success: function (result) {
        }
      });
    });

    $(document).on('change', ':checkbox[name="infopopover_modal_confirm"]', function (e) {
      e.stopPropagation();
      var $this = $(this),
        state = $this.is(":checked"),
        info_var = $this.attr('data-id');
      $this.popover('hide');
      $this.attr('disabled', true);
      $.ajax({
        url: prefix + 'messages?act=hide-toggle-infopopover&state=' + (state ? 1 : 0),
        type: 'POST',
        data: 'id=' + info_var,
        dataType: 'json',
        success: function (result) {
          $this.attr('disabled', false)
        }
      });
    });

    $('html').on('click', function (e) {
      if (!$(e.target).closest('.infopopover').length && !$(e.target).hasClass('infopopover_onclick')) {
        $('.infopopover:not(.has_close_btn)').popover('hide');
      }
    });

    infopopovers();
  });

})(jQuery, document);
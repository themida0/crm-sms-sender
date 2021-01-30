$(document).ready(function() {
  //  execute array for products and create new table
  var products = [];
  var summ = 0;
  $( ".rauan-product-service-data tbody tr" ).each(function() {
      var tds = $(this).find('td');
      var blackList = /(^Стекло дисплея|^OKA iPhone|^Рамка iPhone)/;
      console.log($(tds[1]).text().trim());
      if(!blackList.test($(tds[1]).text().trim())){
          products.push({title:$(tds[1]).text(), price:$(tds[4]).text()});
          summ += parseInt($(tds[4]).text());
      }
  });
  var newTable = $('.rauan-product-service-content');
  $(newTable).html("");
  products.forEach(function(item, i, arr) {
        $(newTable).append("<div class='rauan-product-item'> <div class='rauan-product-name'>" + item.title + "</div> <div class='rauan-product-price'>" + item.price + " тенге</div> </div>");
    });

  //gather total sum
  //   $('.rauan-product-total-value').html("" + $($(".rauan-product-service-data tfoot tr td")[1]).text() + "тенге");
    $('.rauan-product-total-value').html(" " + summ + "тенге");

  //normalize client phone number
    //function for normalize
    var rauanPhoneNormalize = function (s) {
          var newS = s.replace(/\D/g,'');
          if(newS.length != 11) return s;
          else {
            return "8 (" + newS.substring(1,4) + ") " + newS.substring(4,7) + "-" + newS.substring(7,9) + "-" + newS.substring(9,11)

          }
    };
     var $phone = $("span[data-key='phone']");
     $phone.text(rauanPhoneNormalize($phone.text()));
   //normalize client name
    var name = $("span[data-key='fio']").text();
    console.log(name.length);
    if(name.length > 17){
      $('.rauan-client-name').css('font-size','2.5mm');
    }
  //normalize date
    var rauanMonthNormalize = function (s) {
      var months = ['хуй','январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
      var ans = s;
      months.forEach(function(item, i, arr) {
        if(s.substr(0,3) == item.substr(0,3)) ans = i;
      });
      if(ans < 10) return "0" + String(ans);
      return String(ans);

    };
    var today = $("span[data-key='now']").text();
    var dayParts = today.split(' ');

    $("span[data-key='now']").text((dayParts[0] + "." + rauanMonthNormalize(dayParts[1]) + "." + dayParts[2]));

    //normalize device name
    var deviceName = $("span[data-key='product']").text();
    var arrDeviceName = deviceName.split(' ');
    deviceName = "";
    for (i = 0; i < arrDeviceName.length-2; i++) {
        deviceName += arrDeviceName[i] + " ";
    }
    deviceName = deviceName.substr(0,deviceName.length-1);
    $("span[data-key='product']").text(deviceName);

    //normalize color
    if($("span[data-key='color']").text() == "none"){
      $('.rauan-color-item').css('display','none');
    }

    //normalize appearence
    if($("span[data-key='comment']").text() == "none"){
        $('.rauan-appearance-item').css('display','none');
    }

    //signature position
    var rauanContent = $('.rauan-right-col');
    var rauanContentBottom = $(rauanContent).position().top + $(rauanContent).height();

    var rauanFooter = $('.rauan-page-footer').position().top;

    var rauanMiddle = (rauanFooter - rauanContentBottom - $('.rauan-page-sign').height())/2 + rauanContentBottom;

    $('.rauan-page-sign').css("top",rauanMiddle  + "px");


});
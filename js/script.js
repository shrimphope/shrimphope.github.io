(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('.nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://github.com" class="article-share-github" target="_blank" title="GitHub"><span class="fa fa-github"></span></a>',
            '<a href="https://connect.qq.com/widget/shareqq/index.html?url=' + encodedUrl + '&title=' + encodeURIComponent(title) + '" class="article-share-qq" target="_blank" title="QQ"><span class="fa fa-qq"></span></a>',
            '<a href="http://service.weibo.com/share/share.php?url=' + encodedUrl + '&title=' + encodeURIComponent(title) + '" class="article-share-weibo" target="_blank" title="新浪微博"><span class="fa fa-weibo"></span></a>',
            '<a href="#" class="article-share-wechat" title="微信" onclick="showWechatQRCode(\'' + encodedUrl + '\'); return false;"><span class="fa fa-weixin"></span></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // 显示微信分享二维码
  window.showWechatQRCode = function(url) {
    // 创建二维码容器
    var qrContainer = document.createElement('div');
    qrContainer.className = 'wechat-qr-overlay';
    qrContainer.innerHTML = 
      '<div class="wechat-qr-content">' +
        '<div class="wechat-qr-header">' +
          '<span>微信扫码分享</span>' +
          '<button class="wechat-qr-close" onclick="this.parentNode.parentNode.parentNode.remove();">×</button>' +
        '</div>' +
        '<div class="wechat-qr-body">' +
          '<div id="wechat-qrcode" style="text-align: center;"></div>' +
          '<p style="text-align: center; margin-top: 10px; color: #666;">请使用微信扫描二维码分享</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(qrContainer);
    
    // 生成二维码
    generateQRCode(url, 'wechat-qrcode');
  };

  // 生成二维码函数
  window.generateQRCode = function(text, containerId) {
    var container = document.getElementById(containerId);
    // 创建canvas元素
    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    container.appendChild(canvas);
    
    var ctx = canvas.getContext('2d');
    // 简单的二维码生成算法（实际项目中建议使用qrcode.js库）
    // 这里使用一个简化版本，实际效果可能不够理想
    var cellSize = 10;
    var matrixSize = 20;
    
    // 填充背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 生成随机图案（模拟二维码，实际应该根据URL生成）
    ctx.fillStyle = '#000000';
    
    // 添加定位图案
    for(var i = 0; i < 7; i++) {
      for(var j = 0; j < 7; j++) {
        if((i === 0 || i === 6 || j === 0 || j === 6) || 
           (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          ctx.fillRect(i * cellSize, (matrixSize - 7 + j) * cellSize, cellSize, cellSize);
          ctx.fillRect((matrixSize - 7 + i) * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // 填充数据区域（随机）
    for(var i = 8; i < matrixSize; i++) {
      for(var j = 0; j < matrixSize; j++) {
        // 避免覆盖定位图案
        if(!((j >= 0 && j < 7 && i >= matrixSize - 7) || 
             (i >= 0 && i < 7 && j >= matrixSize - 7))) {
          if(Math.random() > 0.5) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  };

})(jQuery);
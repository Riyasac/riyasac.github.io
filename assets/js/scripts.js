
jQuery(document).ready(function($){
  $('#spanYear').html(new Date().getFullYear());
	
  //set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
	
	initHeadline();
	

	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
		
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
});


+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  function getValue($el) {
    return $el.is('[type="checkbox"]') ? $el.prop('checked')                                     :
           $el.is('[type="radio"]')    ? !!$('[name="' + $el.attr('name') + '"]:checked').length :
                                         $el.val()
  }

  var Validator = function (element, options) {
    this.options    = options
    this.validators = $.extend({}, Validator.VALIDATORS, options.custom)
    this.$element   = $(element)
    this.$btn       = $('button[type="submit"], input[type="submit"]')
                        .filter('[form="' + this.$element.attr('id') + '"]')
                        .add(this.$element.find('input[type="submit"], button[type="submit"]'))

    this.update()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.onInput, this))
    this.$element.on('submit.bs.validator', $.proxy(this.onSubmit, this))
    this.$element.on('reset.bs.validator', $.proxy(this.reset, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        getValue($this) && $this.trigger('input.bs.validator')
      })
    })

    this.$inputs.filter(function () { return getValue($(this)) }).trigger('focusout')

    this.$element.attr('novalidate', true) // disable automatic native validation
    this.toggleSubmit()
  }

  Validator.VERSION = '0.11.5'

  Validator.INPUT_SELECTOR = ':input:not([type="hidden"], [type="submit"], [type="reset"], button)'

  Validator.FOCUS_OFFSET = 20

  Validator.DEFAULTS = {
    delay: 500,
    html: false,
    disable: true,
    focus: true,
    custom: {},
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    },
    feedback: {
      success: 'glyphicon-ok',
      error: 'glyphicon-remove'
    }
  }

  Validator.VALIDATORS = {
    'native': function ($el) {
      var el = $el[0]
      if (el.checkValidity) {
        return !el.checkValidity() && !el.validity.valid && (el.validationMessage || "error!")
      }
    },
    'match': function ($el) {
      var target = $el.data('match')
      return $el.val() !== $(target).val() && Validator.DEFAULTS.errors.match
    },
    'minlength': function ($el) {
      var minlength = $el.data('minlength')
      return $el.val().length < minlength && Validator.DEFAULTS.errors.minlength
    }
  }

  Validator.prototype.update = function () {
    this.$inputs = this.$element.find(Validator.INPUT_SELECTOR)
      .add(this.$element.find('[data-validate="true"]'))
      .not(this.$element.find('[data-validate="false"]'))

    return this
  }

  Validator.prototype.onInput = function (e) {
    var self        = this
    var $el         = $(e.target)
    var deferErrors = e.type !== 'focusout'

    if (!this.$inputs.is($el)) return

    this.validateInput($el, deferErrors).done(function () {
      self.toggleSubmit()
    })
  }

  Validator.prototype.validateInput = function ($el, deferErrors) {
    var value      = getValue($el)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    if ($el.is('[type="radio"]')) $el = this.$element.find('input[name="' + $el.attr('name') + '"]')

    var e = $.Event('validate.bs.validator', {relatedTarget: $el[0]})
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    var self = this

    return this.runValidators($el).done(function (errors) {
      $el.data('bs.validator.errors', errors)

      errors.length
        ? deferErrors ? self.defer($el, self.showErrors) : self.showErrors($el)
        : self.clearErrors($el)

      if (!prevErrors || errors.toString() !== prevErrors.toString()) {
        e = errors.length
          ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
          : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

        self.$element.trigger(e)
      }

      self.toggleSubmit()

      self.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
    })
  }


  Validator.prototype.runValidators = function ($el) {
    var errors   = []
    var deferred = $.Deferred()

    $el.data('bs.validator.deferred') && $el.data('bs.validator.deferred').reject()
    $el.data('bs.validator.deferred', deferred)

    function getValidatorSpecificError(key) {
      return $el.data(key + '-error')
    }

    function getValidityStateError() {
      var validity = $el[0].validity
      return validity.typeMismatch    ? $el.data('type-error')
           : validity.patternMismatch ? $el.data('pattern-error')
           : validity.stepMismatch    ? $el.data('step-error')
           : validity.rangeOverflow   ? $el.data('max-error')
           : validity.rangeUnderflow  ? $el.data('min-error')
           : validity.valueMissing    ? $el.data('required-error')
           :                            null
    }

    function getGenericError() {
      return $el.data('error')
    }

    function getErrorMessage(key) {
      return getValidatorSpecificError(key)
          || getValidityStateError()
          || getGenericError()
    }

    $.each(this.validators, $.proxy(function (key, validator) {
      var error = null
      if ((getValue($el) || $el.attr('required')) &&
          ($el.data(key) || key == 'native') &&
          (error = validator.call(this, $el))) {
         error = getErrorMessage(key) || error
        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    if (!errors.length && getValue($el) && $el.data('remote')) {
      this.defer($el, function () {
        var data = {}
        data[$el.attr('name')] = getValue($el)
        $.get($el.data('remote'), data)
          .fail(function (jqXHR, textStatus, error) { errors.push(getErrorMessage('remote') || error) })
          .always(function () { deferred.resolve(errors)})
      })
    } else deferred.resolve(errors)

    return deferred.promise()
  }

  Validator.prototype.validate = function () {
    var self = this

    $.when(this.$inputs.map(function (el) {
      return self.validateInput($(this), false)
    })).then(function () {
      self.toggleSubmit()
      self.focusError()
    })

    return this
  }

  Validator.prototype.focusError = function () {
    if (!this.options.focus) return

    var $input = this.$element.find(".has-error:first :input")
    if ($input.length === 0) return

    $('html, body').animate({scrollTop: $input.offset().top - Validator.FOCUS_OFFSET}, 250)
    $input.focus()
  }

  Validator.prototype.showErrors = function ($el) {
    var method = this.options.html ? 'html' : 'text'
    var errors = $el.data('bs.validator.errors')
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    if (!errors.length) return

    errors = $('<ul/>')
      .addClass('list-unstyled')
      .append($.map(errors, function (error) { return $('<li/>')[method](error) }))

    $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
    $block.empty().append(errors)
    $group.addClass('has-error has-danger')

    $group.hasClass('has-feedback')
      && $feedback.removeClass(this.options.feedback.success)
      && $feedback.addClass(this.options.feedback.error)
      && $group.removeClass('has-success')
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error has-danger has-success')

    $group.hasClass('has-feedback')
      && $feedback.removeClass(this.options.feedback.error)
      && $feedback.removeClass(this.options.feedback.success)
      && getValue($el)
      && $feedback.addClass(this.options.feedback.success)
      && $group.addClass('has-success')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$inputs.filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      var value = getValue($(this))
      return !(typeof value == "string" ? $.trim(value) : value)
    }

    return !!this.$inputs.filter('[required]').filter(fieldIncomplete).length
  }

  Validator.prototype.onSubmit = function (e) {
    this.validate()
    if (this.isIncomplete() || this.hasErrors()) e.preventDefault()
  }

  Validator.prototype.toggleSubmit = function () {
    if (!this.options.disable) return
    this.$btn.toggleClass('disabled', this.isIncomplete() || this.hasErrors())
  }

  Validator.prototype.defer = function ($el, callback) {
    callback = $.proxy(callback, this, $el)
    if (!this.options.delay) return callback()
    window.clearTimeout($el.data('bs.validator.timeout'))
    $el.data('bs.validator.timeout', window.setTimeout(callback, this.options.delay))
  }

  Validator.prototype.reset = function () {
    this.$element.find('.form-control-feedback')
      .removeClass(this.options.feedback.error)
      .removeClass(this.options.feedback.success)

    this.$inputs
      .removeData(['bs.validator.errors', 'bs.validator.deferred'])
      .each(function () {
        var $this = $(this)
        var timeout = $this.data('bs.validator.timeout')
        window.clearTimeout(timeout) && $this.removeData('bs.validator.timeout')
      })

    this.$element.find('.help-block.with-errors')
      .each(function () {
        var $this = $(this)
        var originalContent = $this.data('bs.validator.originalContent')

        $this
          .removeData('bs.validator.originalContent')
          .html(originalContent)
      })

    this.$btn.removeClass('disabled')

    this.$element.find('.has-error, .has-danger, .has-success').removeClass('has-error has-danger has-success')

    return this
  }

  Validator.prototype.destroy = function () {
    this.reset()

    this.$element
      .removeAttr('novalidate')
      .removeData('bs.validator')
      .off('.bs.validator')

    this.$inputs
      .off('.bs.validator')

    this.options    = null
    this.validators = null
    this.$element   = null
    this.$btn       = null

    return this
  }

  // VALIDATOR PLUGIN DEFINITION
  // ===========================


  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.validator

  $.fn.validator             = Plugin
  $.fn.validator.Constructor = Validator


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      Plugin.call($form, $form.data())
    })
  })

}(jQuery);










// Custom Script here

$(function() {

	"use strict";

	var wind = $(window);



// scrollIt
$.scrollIt({
upKey: 38,                // key code to navigate to the next section
downKey: 40,              // key code to navigate to the previous section
easing: 'swing',          // the easing function for animation
scrollTime: 600,          // how long (in ms) the animation takes
activeClass: 'active',    // class given to the active nav element
onPageChange: null,       // function(pageIndex) that is called when page is changed
topOffset: -80            // offste (in px) for fixed top navigation
});



// navbar scrolling background
wind.on("scroll",function () {

	var bodyScroll = wind.scrollTop(),
	navbar = $(".navbar")

	if(bodyScroll > 100){

		navbar.addClass("nav-scroll");

	}else{

		navbar.removeClass("nav-scroll");
	}
});

// navbar scrolling background
wind.on("scroll",function () {

	var bodyScroll = wind.scrollTop(),
	navLight = $(".nav-light"),
	logo = $(".nav-light .logo> img");

	if(bodyScroll > 100){

		navLight.addClass("nav-scroll");
//logo.attr('src', 'img/favicon/logo-brand.svg');

}else{

	navLight.removeClass("nav-scroll");
//logo.attr('src', 'img/favicon/logo-brand.svg');
}
});


// close navbar-collapse when a  clicked
$(".navbar-nav a").on('click', function () {
	$(".navbar-collapse").removeClass("show");
});


// progress bar
wind.on('scroll', function () {
	$(".skill-progress .progres").each(function () {
		var bottom_of_object = 
		$(this).offset().top + $(this).outerHeight();
		var bottom_of_window = 
		$(window).scrollTop() + $(window).height();
		var myVal = $(this).attr('data-value');
		if(bottom_of_window > bottom_of_object) {
			$(this).css({
				width : myVal
			});
		}
	});
});


// sections background image from data background
var pageSection = $(".bg-img, section");
pageSection.each(function(indx){

	if ($(this).attr("data-background")){
		$(this).css("background-image", "url(" + $(this).data("background") + ")");
	}
});


// magnificPopup
$('.gallery').magnificPopup({
	delegate: '.popimg',
	type: 'image',
	gallery: {
		enabled: true
	}
});


});


// === window When Loading === //

$(window).on("load",function (){

	var wind = $(window);

// Preloader
$(".loading").fadeOut(500);


// stellar
wind.stellar();


// isotope
$('.gallery').isotope({
// options
itemSelector: '.items',
// percentPosition: true,
masonry: {
// use element for option
// columnWidth: '.width2'
}
});

var $gallery = $('.gallery').isotope({
// options
});

// filter items on button click
$('.filtering').on( 'click', 'span', function() {

	var filterValue = $(this).attr('data-filter');

	$gallery.isotope({ filter: filterValue });

});

$('.filtering').on( 'click', 'span', function() {

	$(this).addClass('active').siblings().removeClass('active');

});


// contact form validator
$('#contact-form').validator();

$('#contact-form').on('submit', function (e) {
	if (!e.isDefaultPrevented()) {
		var mail = $('#form_email').val();
		var name = $('#form_name').val();
		var subject = $('#form_subject').val();
		var message = $('#form_message').val();
		Email.send({
			Host: "smtp.gmail.com",
			Username: "developerriyas@gmail.com",
			Password: "lfhjfsldnfmbhmvd",
			To: "developerriyas@gmail.com",
			From: mail,
			Subject: subject,
			Body: message,
		})
		.then(function (message) {
			console.log("mail sent successfully")
		});
		return false;
	}
});

});

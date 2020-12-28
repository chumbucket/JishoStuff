// ==UserScript==
// @name         Jisho stuff
// @namespace    https://chumbucket.github.io/
// @version      0.2
// @description  Jisho extensions
// @author       You
// @match        https://jisho.org/*
// @downloadURL  https://github.com/chumbucket/JishoStuff/raw/main/JishoStuff.user.js
// @updateURL    https://github.com/chumbucket/JishoStuff/raw/main/JishoStuff.user.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const hideFurigana = function() {
		if (location.href.indexOf('%23sentences') == -1) {
			return;
		}
		var styleElement = document.createElement('style');
		styleElement.setAttribute('type', 'text/css');
		styleElement.innerHTML =
			'.furigana{opacity:0!important}'+
			'.furigana:hover{opacity:1!important}'+
			'.english{opacity:0!important}'+
			'.english:hover{opacity:1!important}';
		document.body.appendChild(styleElement);

	};
	hideFurigana();

	const searchSelectedWord = function(e) {
		if (e.keyCode == 13) {
			var selectedWord = window.getSelection().toString();

			if (selectedWord) {
				window.open('https://jisho.org/search/' + selectedWord);
			}
		}
	};
	window.addEventListener('keyup', searchSelectedWord);


	const $ = window.jQuery || null;
	if(!$){
		console.error('TM JishoStuff: jQuery is undefined');
		return;
	}

	const radicalInput = new window.RadicalInput() || null;
	if(!radicalInput){
		console.error('TM JishoStuff: RadicalInput is undefined');
		return;
	}

	let radTable = $('.radical_table');
	let radicals = $('.radical', '.radical_table');

	radTable[0].addEventListener('click', function(evt){
		let rad = $(evt.target);
		if(rad.hasClass('radical')){
			let radindex = radicals.index(rad);
			if(rad.hasClass('selected')){
				$('.search-term').each(function(){
					if(radindex == $(this).data('index')){
						$(this).remove();
					}
				});
			}
		}
	});


	let defaultRadLabels = 
	'一;one,｜;line,丶;dot,ノ;no,乙;second rank,亅;putter,二;two,亠;lid,人;person,⺅;person left,'
	+'𠆢;roof,儿;legs,入;enter,ハ;eight,丷;together,冂;moustache,冖;bracket,冫;cold left,几;table,凵;open box,'
	+'刀;sword,⺉;sword right,力;power,勹;wrap,匕;hi,匚;side box,十;ten,卜;to,卩;fingerprint,厂;cliff,厶;mu,'
	+'又;crotch,マ;ma,九;round,ユ;yu,乃;sharp butt,𠂉;rifle,⻌;motion,口;mouth,囗;big mouth,土;dirt,'
	+'士;samurai,夂;each,夕;evening,大;big,女;woman,子;child,宀;crown,寸;stick,小;small,⺌;mohawk,'
	+'尢;crooked big,尸;corpse,屮;mountain tail,山;mountain,川;river,巛;river flow,工;construction,'
	+'已;self,巾;cloth,干;dry,幺;eazy,广;cave,廴;stretch,廾;letter h,弋;ceremony,弓;bow,ヨ;yo,'
	+'彑;reciprocal,彡;short hair,彳;go left,⺖;heart left,⺘;hand left,⺡;water left,⺨;animal,'
	+'⺾;flower top,⻏;boston right,⻖;boston left,也;scorpion,亡;deceased,及;reach,久;long time,'
	+'⺹;dig,心;heart,戈;spear,戸;door,手;hand,支;branch,攵;director,文;sentence,斗;spice rack,斤;axe,方;direction,'
	+'无;crooked heaven,日;sun,曰;flat sun,月;moon,木;tree,欠;lack,止;stop,歹;death,殳;nurse,比;compare,'
	+'毛;fur,氏;surname,气;steam,水;water,火;fire,⺣;fire bottom,爪;nail,父;father,爻;dos equis,'
	+'爿;left side,片;right side,牛;cow,犬;dog,⺭;ne,王;king,元;origin,井;hashtag,勿;rib,尤;crooked dog,'
	+'五;five,屯;fort,巴;nerd,毋;every,玄;deep,瓦;tile,甘;sweet,生;life,用;use,田;rice field,疋;incorrect,'
	+'疒;sick,癶;tent,白;white,皮;skin,皿;plate,目;eye,矛;beforehand,矢;arrow,石;stone,示;indicate,'
	+'禸;cow goatee,禾;wheat,穴;hole,立;stand,⻂;duck,世;world,巨;giant,冊;books,母;mother,⺲;net,牙;fang,'
	+'瓜;melon,竹;bamboo,米;rice,糸;thread,缶;can,羊;sheep,羽;feather,而;comb,耒;branch tree,耳;ear,'
	+'聿;brush,肉;meat,自;myself,至;climax,臼;mortar,舌;tongue,舟;boat,艮;good,色;color,虍;tiger,虫;bug,'
	+'血;blood,行;go,衣;clothes,西;west,臣;slave,見;see,角;corner,言;say,谷;valley,豆;bean,豕;pig,豸;snake,'
	+'貝;shellfish,赤;red,走;run,足;foot,身;somebody,車;car,辛;spicy,辰;shake,酉;sake,釆;come,'
	+'里;village,舛;dance,麦;barley,金;gold,長;long,門;gate,隶;extend,隹;turkey,雨;rain,青;blue,非;un,奄;big dragon,'
	+'岡;hill,免;excuse,斉;equal,面;surface,革;leather,韭;leek,音;sound,頁;page,風;wind,飛;fly,食;eat,首;neck,香;perfume,'
	+'品;goods,馬;horse,骨;bone,高;high,髟;hair,鬥;broken gate,鬯;herbs,鬲;tripod,鬼;demon,竜;dragon,韋;tanned leather,'
	+'魚;fish,鳥;bird,鹵;salt,鹿;deer,麻;hemp,亀;turtle,啇;drip,黄;yellow,黒;black,黍;millet,黹;sewing,無;nothing,歯;tooth,'
	+'黽;green frog,鼎;kettle,鼓;drum,鼠;mouse,鼻;nose,齊;alike,龠;flute';

	const initRadKeys = function(){
		let savedLabels = window.localStorage ? localStorage.getItem('radLabels') : null;
		let radKeys = {};
		if(!savedLabels){
			let radDef = defaultRadLabels.split(',');
			radDef.forEach(
				function(rad, index) {
					let radk = rad.split(';');
					if (radk.length < 2) {
						return;
					}
					radKeys[radk[1]] = index;
				});
		}else{
			radKeys = JSON.parse(savedLabels);
		}
		return radKeys;
	};

	let radKeys = initRadKeys();
	
	const saveRadLabels = function(){
		if(!window.localStorage){
			return false;
		}
		localStorage.setItem('radLabels', JSON.stringify(radKeys));
	};

	saveRadLabels();

	const liForRadKey = function(key) {
		let tableindex = radKeys[key];
		if (tableindex == 'undefined') {
			return false;
		}
	
		return radicals[tableindex];
	};

	Object.keys(radKeys).forEach(
		function(key){
			let radEl = liForRadKey(key);
		
		
		
			radEl.title = `*${key}`;
			$(radEl).data('label',key);
		});
	$('[title]').tooltip();

	
	const createRadSearch = function() {
		let input = document.createElement('div');
		input.id = 'rad-searchbar';
		input.setAttribute('contentEditable', 'true');
		let showlessdiv = $('.show_less', '#radical_area')[0];
		showlessdiv.insertAdjacentElement('afterend', input);
	
		return input;
	};
	Object.defineProperty(HTMLElement.prototype,'value',{
		get:function(){
			return this.textContent;
		},
		set:function(x){
			this.textContent = x;
		}
	});

	const createEditButton = function(){
		let radTable = $('.radical_table');
		let button = document.createElement('div');
		button.textContent = 'Edit';
		button.setAttribute('class','icon edit-label');
		radTable.prepend(button);
		return button;
	};

	const makeEditOverlay = function(){
		var editContainer = document.createElement('div');
		editContainer.id = 'edit-container';
		$(editContainer).click(function(){
			$(this).css('display','none');
		});
		let editbody = document.createElement('div');
		let bodyHtml = 
			'<div class="rad-text"></div>'+
			'<input class="edit-input">';
			
		editbody.id = 'edit-body';
		$(editbody).click(function(evt){
			evt.stopPropagation();
		});
		$(editbody).append(bodyHtml);
		$(editContainer).append(editbody);

		$(document.body).prepend(editContainer);
		$('.edit-input').data('radindex','');
		$('.edit-input').data('label','');
	};

	const makeRadOverlays = function(){
		$(radicalInput.radicals).each(function(){
			let radoverlay = document.createElement('div');
			radoverlay.setAttribute('class','rad-overlay');
			let me = this;
			$(radoverlay).click(function(){
				$('#edit-container').css('display','flex');
				editRadLabel(me);
			});

			$(this).prepend(radoverlay);
		});
	};

	const editRadLabel = function(rad){
		let radLabel = $(rad).data('label');
		let radIndex = $(radicals).index(rad);
		if(radLabel){
			$('.edit-input').val(radLabel);
		}else{
			$('.edit-input').val('');
		}
		$('.edit-input').data('radindex', radIndex);
		$('.edit-input').data('label', radLabel);
		$('.rad-text').text($(rad).text());
	};

	const showRadOverlays = function(){
		if(editMode){
			$('.rad-overlay').css('display', 'inherit');
		}else{
			$('.rad-overlay').css('display','none');
		}
	};

	const makeSpanWithTerm = function(searchterm) {
		let span = document.createElement('span');
		span.setAttribute('class', 'search-term');
		span.textContent = searchterm[0];
		span = $(span);
		span.attr('data-index', radKeys[searchterm[0]]);
		span.click((function(me){
			return function(){
				let radical = radInfoFromTerm(me.text());
				radicalInput.selected_radicals = radicalInput.selected_radicals.subtract(radical.text);
				if(radicalInput.selected_radicals.length == 0) {
					radicalInput.reset();
				} else {
					radicalInput.getKanji();
				}
				radical.element.removeClass('selected');
				me.remove();
			};
		})(span));
		let resultsarea = $('.results', '#radical_area');
		resultsarea.append(span);
		return span;
	};


	let editMode = false;
	let radSearchBar = createRadSearch();
	let editButton = createEditButton();
	makeRadOverlays();
	makeEditOverlay();

	$(editButton).on('click',function(evt){
		evt.preventDefault();
		if(editMode){
			editMode = false;
		
			$(this).css({'background-color':'white','color':'#222'});
			$('.radical_table').css('background','');
		}else{
			editMode = true;
		
			$(this).css({'background-color':'#555','color':'white'});
			$('.radical_table').css({'background':'none','background-color':'#edf9ff'});
		}
		showRadOverlays();
	
	});

	$('.edit-input').on('keydown',function(e){
		if(e.keyCode == 13){
			if($(this).val() == ''){
				return;
			}
			e.preventDefault();
			let oldLabel = $(this).data('label');
			let newLabel = $(this).val();
			delete radKeys[oldLabel];
			radKeys[newLabel] = $(this).data('radindex');
			$(radicals[radKeys[newLabel]]).data('label',newLabel);
			$(radicals[radKeys[newLabel]]).attr('title',`*${newLabel}`);
			$(radicals[radKeys[newLabel]]).tooltip();
		}
	});


	const buttontoggle = function(_this) {
		return function() {
			if (_this.active) {
				return _this.deactivate();
			} else {
				return _this.activate();
			}
		};
	};

	radicalInput.table.off();
	radicalInput.area.off();
	radicalInput.button.off();
	radicalInput.list.off();
	radicalInput.setupEvents();
	radicalInput.button.on('click', buttontoggle(radicalInput));
	

	const updateOptionsArray = function(terms) {
		if(terms.length == 0){
			return [];
		}
		let optionsarray = [];
		let searchTerm = terms.last();
		Object.keys(radKeys).forEach(
			function(key) {
				if (searchTerm.length == 0){
					return;
				}
				let radTableItem = radInfoFromTerm(key); 
				if (key.indexOf(searchTerm) == 0 && radTableItem.element.hasClass('available')) {
					optionsarray.push(key);
				
				} else {
					return;
				}
			});
		return optionsarray;
	};

	const highlightRadicals = function(arr) {
		if (arr.length == 0) {
			return;
		}
		for (var i = 0; i < arr.length; i++) {
			let radTableItem = liForRadKey(arr[i]);
			radTableItem = $(radTableItem);
			if (radTableItem.hasClass('selected') || !radTableItem.hasClass('available')) {
				continue;
			}
			radTableItem.addClass('selected');
		}
	};
	const clearHighlightRadicals = function(arr) {
		if (arr.length == 0) {
			return;
		}
		for (var i = 0; i < arr.length; i++) {
			let radTableItem = radInfoFromTerm(arr[i]).element;
			let radk = radInfoFromTerm(arr[i]).text;
			if(radicalInput.selected_radicals.indexOf(radk) != -1) {
				continue;
			}
			if (radTableItem.hasClass('selected')){
				radTableItem.removeClass('selected');
			}
		}
	};
	const radInfoFromTerm = function(term){
		let radTableItem = liForRadKey(term);
		if(!radTableItem) {
			return false;
		}
		radTableItem = $(radTableItem);
		let radk = radTableItem.data('radk') || radTableItem.text();
		return {'element':radTableItem,'text':radk};
	};

	const indexOfSearchTermInRadArray = function(term){
		return radicalInput.selected_radicals.indexOf(radInfoFromTerm(term).text);
	};




	let lastAutoCompOpts = [];
	const radSearchInput = function(e) {
		
		let terms = this.value.split(',');
		if (e.keyCode == 13) {
			e.preventDefault();

			clickRadical(terms);
			this.value = '';
			terms = [];
		}
		if (e.keyCode == 188) {
			clickRadical(terms);
			this.value = '';
		}
		
	
		clearHighlightRadicals(lastAutoCompOpts);
		let optionsarray = updateOptionsArray(terms);
		lastAutoCompOpts = optionsarray;
		highlightRadicals(optionsarray);
	};

	radSearchBar.addEventListener('keyup', radSearchInput);
	radSearchBar.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
		}
	});


	const clickRadical = function(search) {
		let searchterms = search;
		searchterms = searchterms.subtract('');
		
		searchterms.forEach(
			function(term) {
				let radical = radInfoFromTerm(term);
				if(!radical) {
					return;
				}
				if (!radical.element.hasClass('available')) {
					return;
				}
				radical.element.addClass('selected');
				if (radicalInput.selected_radicals.indexOf(radical.text) == -1) {
					radicalInput.selected_radicals.push(radical.text);
					makeSpanWithTerm(searchterms);
				}
			}
		);
		if (radicalInput.selected_radicals.length != 0){
			radicalInput.getKanji();
		}
	};

	let globalStyle = document.createElement('style');
	globalStyle.innerHTML = 
	'#rad-searchbar{font-size:22px;background-color:white;outline:none;width:70%;border-radius:3px;'+
	'margin-bottom:10px;margin-top:10px;padding-left:5px;padding-right:5px;}.icon.edit-label{margin:0px;'+
	'padding:0px;padding-top:2px;padding-left:5px;padding-right:5px;float:left;cursor:pointer;'+
	'border-radius:5px;height:30px;}.icon.edit-label:hover{background-color:#555!important;'+
	'color:#fff!important;}#edit-container{width:100%;height:100%;background-color:rgba(0,0,0,0.5);'+
	'position:fixed;z-index:1000;top:0px;left:0px;display:none;align-items:center;justify-content:center;'+
	'}#edit-body{width:100px;height:100px;border-radius:10px;background-color:white;}.rad-text{font-size:70px;'+
	'text-align:center;}.rad-overlay{position:absolute;width:32px;height:32px;margin-left:-2px;'+
	'margin-top:-2px;display:none;}.search-term{background-color:gray;color:white;border-radius:10px;'+
	'padding:5px;cursor:pointer;margin-right:5px;}';
	$('head').append(globalStyle);
})();

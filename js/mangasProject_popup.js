window.onload = function() {

    setTimeout(function() {
        getLastHomePosts();
    }, 1000);
}

function showLoader(data) {
	if(data == "show") {
		//$(".container").prepend('<img class="loader" src="images/loader.gif">');
	} else {
		$(".container img:first").fadeOut("fast").remove();
	}
}

function getLastRecentPosts() {
	var url = "http://mangas.xpg.uol.com.br/Recentes'";
	var query = "select * from html where url='";
	var and_xpath = " and xpath='//div[@id=\"relList\"]/div' limit 10";
	var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);

	var full_query = encodeURIComponent(query + url + and_xpath);
	$.ajax({
		url: "https://query.yahooapis.com/v1/public/yql?q=" + full_query + '&format=json&_nocache=' + cacheBuster,
		dataType: 'jsonp',
		cache: true,
		jsonpCallback: 'callback'
	}).done(function(data) {
	});

	window['callback'] = function(data) {
		var item = "";
		console.log(data.query.results.div);
		for (i = 0; i < data.query.results.div.length; ++i) {
			var actual = data.query.results.div[i];
			item += '<li><div class="itemTitle"><a href="' + actual.span[1].a.href + '" target="' + actual.span[1].a.target + '" >' + actual.span[1].a.span.content + "</a></div></li>";
		}

		$("#divRss").append('<ul class="feedEkList">' + item + "</ul>");
	};
}

function getLastHomePosts() {
	//showLoader('show');

	var url = "http://mangas.xpg.uol.com.br/Home'";
	var query = "select * from html where url='";
	var and_xpath = " and xpath='//div[@class=\"coluna\"][1]'";
	var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);

	var full_query = encodeURIComponent(query + url + and_xpath);
	$.ajax({
		url: "https://query.yahooapis.com/v1/public/yql?q=" + full_query + '&format=json&maxage=3600',
		dataType: 'jsonp',
		//cache: true,
		jsonpCallback: 'callback',
		success: function(data) {
			console.log("success", data);
		}	
	}).done(function(data) {
		console.log("done");
	});

	window['callback'] = function(data) {
		var item = "";
		var image = "";
		console.log(data);

		for (i = 0; i < data.query.results.div.ul.li.length; ++i) {
			var actual = data.query.results.div.ul.li[i];
			if(actual.a.content == " Ver lista completa")  {
				break;
			}
			image = '<div style="padding-right: 10px; float:left;"><img width=60px; height=28px; src="images/mangas_project_logo.png"></img></div>';
			item += '<li>' + image + '<div class="itemTitle"><a href="' + actual.a.href + '" title="' + actual.a.title + '" target="' + actual.a.target + '" >' + actual.a.content + "</a></div>";
			item += '<div class="itemDate">' + actual.a.span + " - Scanlator: <u>" + actual.span.content.replace("|", " ") + "</u></div></li>";
		}

		showLoader('hide');

		$(".container #divRss").
			append('<ul class="feedEkList">' + item + "</ul><p>Clique <a href=\"http://mangas.xpg.uol.com.br/Recentes\" target=\"_blank\">aqui</a> para mais lan&ccedil;amentos<p/>").
			hide().
			slideDown(850);
	};
}
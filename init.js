/**
 * Created by mb on 01/07/2016.
 */

initialTableLoad('twitter');
initialTableLoad('webchat');
initialTableLoad('taxcredits');

d3.json('rltwitter.json', function (err, json) {
	if (err){
		alert("Error loading file");
		console.log("Error loading file");
		return;
	}
	updateTable(json, 'twitter');
});

d3.json('testfile3.json', function (err, json) {
	if (err){
		alert("Error loading file");
		console.log("Error loading file");
		return;
	}
	updateTable(json, 'taxcredits');
});

d3.json('rlwebchat.json', function (err, json) {
	if (err){
		alert("Error loading file");
		console.log("Error loading file");
		return;
	}
	updateTable(json, 'webchat');
});



var twitterData = (function() {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "rltwitter.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var taxcreditData = (function() {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "testfile3.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var webchatData = (function() {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "rlwebchat.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();


$("table").on("click", "td", function() {
	var searchTerm = $(this).text();
	var list = [];
	var options = {
		caseSensitive: false,
		includeScore: false,
		shouldSort: true,
		tokenize: false,
		threshold: 0.52,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		keys: ['ST']
	};
	$('td').each(function(){
		list.push({ST:$(this).text(),
			reference:$(this)
		});
	});

	var fuse = new Fuse(list, options); // "list" is the item array
	var result = fuse.search(searchTerm);

	result.forEach(function(d){
			d.reference.closest('tr').toggleClass("success");
	});

});

$(function(){
	$('#searchButton').click(function() {
		updateTable(taxcreditData, 'taxcredits');
		updateTable(twitterData, 'twitter');
		updateTable(webchatData, 'webchat');
		var searchTerm = $('#searchInput')[0].value;

		if (searchTerm === ''){
			updateTable(taxcreditData, 'taxcredits');
			updateTable(twitterData, 'twitter');
			updateTable(webchatData, 'webchat');
			return;
		}

		var list = [];
		var options = {
			caseSensitive: false,
			includeScore: false,
			shouldSort: true,
			tokenize: true,
			threshold: 0.30,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			keys: ['ST']
		};
		$('td').each(function(){
			list.push({ST:$(this).text(),
				reference:$(this)
			});
		});

		var fuse = new Fuse(list, options); // "list" is the item array
		var result = fuse.search(searchTerm);

		if (result.length > 0){
			$("#searchResult").text("Search Successful").removeClass('hidden').addClass('alert-success');
		}else{
			$("#searchResult").text("Search Unsuccessful").removeClass('hidden').addClass('alert-danger');
		}

		var newTwitterData = [];
		var newWebchatData = [];
		var newTaxCreditsData = [];

		result.forEach(function(d){
			var tableMeta = ($(d.reference).closest('table').eq($(d.reference).index()))[0].id;
			var countMeta = ($(d.reference).closest('td').next())[0].textContent;
			var sentimentMeta = ($(d.reference).find('span:first'))[0].className.match(/(\S+?)$/)[0];
			var searchMeta = {searchTable:tableMeta, searchTerm: d.ST, count:countMeta};
			console.log(sentimentMeta);

			if (sentimentMeta == 'glyphicon-chevron-up'){
				searchMeta.sentiment = 'g'
			}else if (sentimentMeta == 'glyphicon-minus'){
				searchMeta.sentiment = 'n'
			}else if (sentimentMeta == 'glyphicon-chevron-down'){
				searchMeta.sentiment = 'b'
			}


			if (searchMeta.searchTable == 'twittertable'){
				newTwitterData.push({Item:d.ST, Count:countMeta, Sentiment:searchMeta.sentiment});
			}else if (searchMeta.searchTable == 'taxcreditstable'){
				newTaxCreditsData.push({Item:d.ST, Count:countMeta, Sentiment:searchMeta.sentiment });
			}else if (searchMeta.searchTable == 'webchattable'){
				newWebchatData.push({Item:d.ST, Count:countMeta, Sentiment:searchMeta.sentiment});
			}
		});

		function compare(a,b) {
			if (+a.Count > +b.Count)
				return -1;
			if (+a.Count < +b.Count)
				return 1;
			return 0;
		}

		newTaxCreditsData.sort(compare);
		newTwitterData.sort(compare);
		newWebchatData.sort(compare);

		updateTable(newTaxCreditsData, 'taxcredits');
		updateTable(newTwitterData, 'twitter');
		updateTable(newWebchatData, 'webchat');

	});
});

$(function () {
	$("#searchReset").click(function () {
		$("#searchResult").addClass('hidden');
		updateTable(taxcreditData, 'taxcredits');
		updateTable(twitterData, 'twitter');
		updateTable(webchatData, 'webchat');
	});
});


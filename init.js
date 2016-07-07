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
	console.log(json);
	updateTable(json, 'twitter');
});

d3.json('rltaxcredits.json', function (err, json) {
	if (err){
		alert("Error loading file");
		console.log("Error loading file");
		return;
	}
	console.log(json);
	updateTable(json, 'taxcredits');
});

d3.json('rlwebchat.json', function (err, json) {
	if (err){
		alert("Error loading file");
		console.log("Error loading file");
		return;
	}
	console.log(json);
	updateTable(json, 'webchat');
});






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
		var searchTerm = $('#searchInput')[0].value;

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
			$("#searchResult").text("Search successful").addClass('close');
		}else{
			$("#searchResult").text("Search Unsuccessful").addClass('close');
		}

		result.forEach(function(d){
			d.reference.closest('tr').toggleClass("success");
		});
	});
});
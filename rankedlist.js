/**
 * Created by mb on 01/07/2016.
 */


function initialTableLoad(tableId){
	d3.select("#" + tableId)
		.append("table").attr("class", "table table-striped table-hover table-bordered container-margin-top").attr('Id', tableId +'table')
		.append("thead")
		.append("tr").selectAll("th").data(["Item", "Count"]).enter().append("th").text(function(d){return d});;
}

function updateTable(dataSet, tableId){

	d3.select('#' + tableId + 'table').selectAll("tbody").html("");

	var tbody = d3.select('#' + tableId + 'table').append("tbody");
	dataSet.forEach(function(row) {
		var tr = tbody.append("tr");

		tr.append('td').text(row["Item"])
		.append("span")
		.attr("class", function(){
			var sentiment = "";
			if (row["Sentiment"] == "g") sentiment = 'glyphicon glyphicon-chevron-up';
			else if (row["Sentiment"] == "n") sentiment = 'glyphicon glyphicon-minus';
			else if (row["Sentiment"] == "b") sentiment = 'glyphicon glyphicon-chevron-down';
			return 'pull-right ' + sentiment;
		});
		tr.append('td').text(row["Count"]);
	})
}


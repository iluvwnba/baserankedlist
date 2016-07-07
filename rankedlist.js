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
	d3.select('#' + tableId + 'table').append("tbody").selectAll("tr")
			.data(dataSet).enter()
			.append("tr")
			.selectAll("td")
			.data(function(d) {
				return [d.Item, d.Count]
			}).enter()
			.append('td')
			.text(function(d) {
				console.log(d);
				return d;
			});



	/* Set all the cells in columns with THEHEADING in the heading to red */
	columnTh = $("table th:contains('Item')"); // Find the heading with the text THEHEADING
	columnIndex = columnTh.index() + 1; // Get the index & increment by 1 to match nth-child indexing
	$('table tr td:nth-child(' + columnIndex + ')').css("color", "#F00"); // Set all the elements with that index in a tr red


}


/**
 * Created by mb on 11/07/2016.
 */

d3.json("generic.json", function (err, json) {
	if (err) {
		alert("Error loading json");
	}
	mainjson = json;
	createFullChart(mainjson);
});

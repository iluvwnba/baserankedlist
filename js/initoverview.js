/*****************
	Init Code
*****************/

//Load the liquid gauge with the placeholder value of 0 until the JSON file loads.


d3.json("generic.json", function (err, json) {
    if (err) {
        alert("Error loading json");
    }
    mainjson = json;
	  createChart(mainjson);
});


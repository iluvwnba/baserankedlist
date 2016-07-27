var w = 300,
	h = 300;

var colorscale = d3.scale.category10();
//Data
var d = [
	[
		{axis:"Chat Throughput",value:0.59},
		{axis:"Chat Length",value:0.56},
		{axis:"Query Resolution",value:0.42},
		{axis:"Stopped Call",value:0.34},
		{axis:"Knowledge Level",value:0.48},
		{axis:"Customer Satisfaction",value:0.84}
	],
	[
		{axis:"Chat Throughput",value:0.39},
		{axis:"Chat Length",value:0.86},
		{axis:"Query Resolution",value:0.92},
		{axis:"Stopped Call",value:0.34},
		{axis:"Knowledge Level",value:0.48},
		{axis:"Customer Satisfaction",value:0.84}
	]
];

//Options for the Radar chart, other than default
var mycfg = {
	w: w,
	h: h,
	maxValue: 1,
	levels: 10,
	ExtraWidthX: 300
};

//Call function to draw the Radar chart
//Will expect that data is in %'s

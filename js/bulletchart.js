var nullBulletData = [
    {"title":"DMS Count","subtitle":"","ranges":[0,0,0],"measures":[0,0],"markers":[0]}
];

var testBulletData = [
    {"title":"Revenue","subtitle":"US$, in thousands","ranges":[150,225,300],"measures":[220,270],"markers":[250]},
    {"title":"Profit","subtitle":"%","ranges":[20,25,30],"measures":[21,23],"markers":[26]},
    {"title":"Order Size","subtitle":"US$, average","ranges":[350,500,600],"measures":[100,320],"markers":[550]},
    {"title":"New Customers","subtitle":"count","ranges":[1400,2000,2500],"measures":[1000,1650],"markers":[2100]},
    {"title":"Satisfaction","subtitle":"out of 5","ranges":[3.5,4.25,5],"measures":[3.2,4.7],"markers":[4.4]}
];

var bulletMargin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 460 - bulletMargin.left - bulletMargin.right,
    height = 50 - bulletMargin.top - bulletMargin.bottom;

var bulletChart = d3.bullet()
    .width(width)
    .height(height);

var bulletSvg = d3.select("#kcom-dms-wrapper").selectAll("svg")
    .data(nullBulletData)
    .enter().append("svg")
    .attr("class", "bullet")
    .attr("width", width + bulletMargin.left + bulletMargin.right)
    .attr("height", height + bulletMargin.top + bulletMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + bulletMargin.left + "," + bulletMargin.top + ")")
    .call(bulletChart);

var bulletTitle = bulletSvg.append("g")
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + height / 2 + ")");

bulletTitle.append("text")
    .attr("class", "title")
    .text(function(d) { return d.title; });

bulletTitle.append("text")
    .attr("class", "subtitle")
    .attr("dy", "1em")
    .text(function(d) { return d.subtitle; });

/*
d3.selectAll("button").on("click", function() {
    bulletSvg.datum(randomize).call(bulletChart.duration(1000)); // TODO automatic transition
});*/

function loadBulletChartData(data){
    bulletSvg.data(data).call(bulletChart.duration(1000));
}
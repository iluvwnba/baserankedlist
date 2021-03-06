/**
 * Created by mb on 19/07/2016.
 */

/*
 Search functionality
 search and redraw?

 */
var agentData = (function() {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "agentinfo.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

var advisorDMS;

$.getJSON("advisorDMS.json", function(json){ advisorDMS = json});

var agentIds = agentData.advisors.map(function (d) {
	return d.id.toString();
});
var radar = initRadar();

getOverallStats(agentData.advisors);
var filteredData = [];
//on search get searchterm to filter data on

$(function() {
	$('#searchButton').click(function () {
		var searchTerm = $('#searchInput')[0].value;

		filteredData = agentData.advisors.filter(function (d) {
			return d.id == +searchTerm;
		});

		setinfo(filteredData[0]);
		//rebuild vis
		drawRadar(getMeasures(filteredData[0]), true);
		drawSimilarAgents(filteredData[0]);
		createChart(filteredData[0].info.wc);
		drawBulletChart(filteredData[0].id);
	});
	$('#searchInput').keypress(function(e){
		if(e.which == 13){//Enter key pressed
			$('#searchButton').click();//Trigger search button click event
		}
	});

});

$('#searchInput').focus(function() {
	$(this).val('');
});

function bindButton() {
	$(function () {
		$('button.advisor-compare').click(function (e) {
			var compareId = $(e.currentTarget.closest('li')).text().match(/Advisor : (.*?) Compare/)[1];
			var compareData = agentData.advisors.filter(function (d) {
				return d.id == +compareId;
			});
			var wrapper = [];
			wrapper.push(getMeasures(filteredData[0])[0]);
			wrapper.push(getMeasures(compareData[0])[0]);
			drawRadar(wrapper, false);
			drawBulletChart(filteredData[0].id, compareData[0].id);
		})
	});
}


/*
Similar agents init
*/
function drawSimilarAgents(agent){
	var tbody = d3.select('#similar-advisor');
	var rows = tbody.selectAll("li")
			.data(agent.info.similarAgents);

	rows.enter()
			.append("li")
			.attr("class", "list-group-item");

	rows.text(function(d){return 'Advisor : ' + d + ' '});

	rows.append('span').attr('class', 'pull-right')
			.append('button').attr('class', 'btn btn-xs advisor-compare')
			.text('Compare');

	rows.exit().remove();

	bindButton();
}

/*
word cloud init
potentially linked to search
 */

/*
radar diagram init
potentially linked to search
 */



function getMeasures(agent){
	var wrapper =[];
	var stats = [];

	stats.push({axis:'Chat Throughput', value: agent.info.chatsPerDay});
	stats.push({axis:'Chat Length', value: agent.info.avgChatLength});
	stats.push({axis:'Query Resolution', value: agent.info.avgQueryResolved*2/10});
	stats.push({axis:'Stopped Call', value: agent.info.avgWebVsPhone*2/10});
	stats.push({axis:'Knowledge Level', value: agent.info.avgKnowledgeLevel*2/10});
	stats.push({axis:'Customer Satisfaction', value: agent.info.sentimentScore});

	wrapper.push(stats);
	return wrapper;
}

function setinfo(agent){
	$('#agent-info h4').text(agent.id);
}

function initRadar(){
	var mycfg = {
		maxValue: 1,
		levels: 10,
		ExtraWidthX: 200
	};

	var d = [
		[
			{axis:"Chat Throughput",value:1},
			{axis:"Chat Length",value:1},
			{axis:"Query Resolution",value:1},
			{axis:"Stopped Call",value:1},
			{axis:"Knowledge Level",value:1},
			{axis:"Customer Satisfaction",value:1}
		],
		[
			{axis:"Chat Throughput",value:1},
			{axis:"Chat Length",value:1},
			{axis:"Query Resolution",value:1},
			{axis:"Stopped Call",value:1},
			{axis:"Knowledge Level",value:1},
			{axis:"Customer Satisfaction",value:1}
		]
	];

	return RadarChart.init("#advisor-stats", d, mycfg);
}
function drawRadar(d, refresh){
	radar.draw(d, refresh);
}

function drawBulletChart(d,s){
	var comparedAdvisor;
	if(s == null || advisorDMS[s] == undefined) comparedAdvisor = 0;
	else comparedAdvisor = advisorDMS[s];
	var average = 3154;
	var advisorCount;
	if(advisorDMS[d] == undefined) advisorCount = 0;
	else advisorCount = advisorDMS[d];
	var bulletData = [
		{"title":"DMS Count","subtitle":"","ranges":[comparedAdvisor],"measures":[advisorCount],"markers":[average]}
	];
	loadBulletChartData(bulletData);
}

function getOverallStats(agentList){
	var chatLength = agentList.map(function (d) {
		return d.info.avgChatLength;
	});

	var chatsPerDay = agentList.map(function (d) {
		return d.info.chatsPerDay;
	});

	var sentimentScore = agentList.map(function (d) {
		return d.info.sentimentScore;
	});

	var chatLengthInfo = {min:Math.min.apply(Math, chatLength) , max:Math.max.apply(Math, chatLength)};
	var chatsPerDayInfo = {min:Math.min.apply(Math, chatsPerDay) , max:Math.max.apply(Math, chatsPerDay)};
	var sentimentScoreInfo = {min:Math.min.apply(Math, sentimentScore) , max:Math.max.apply(Math, sentimentScore)};

	agentList.map(function (d) {
		d.info.chatsPerDay = (normaliseField(chatsPerDayInfo, d.info.chatsPerDay));
		d.info.avgChatLength= (normaliseField(chatLengthInfo, d.info.avgChatLength));
		d.info.sentimentScore = (normaliseField(sentimentScoreInfo, d.info.sentimentScore));
	});
}

function normaliseField(d, value){
	return (1 - 0)/(d.max-d.min) *(value-d.max)+1;
}

$(function() {
	$( "#searchInput" ).autocomplete({
		source: agentIds
	});
});
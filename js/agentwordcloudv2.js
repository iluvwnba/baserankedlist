//Construct the word cloud's SVG element
var wcSvg = d3.select("#svgg").append("svg")
    .attr("width", 440)
    .attr("height", 400)
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("class", "node"); //set class of graphic element

function createChart(data) {

    var fill = d3.scale.category20();

    /*//Set the height and width to screen height / width
    var width = 440;
    var height = 440;*/

    var fData = d3.nest()
            .key(function(d){return d.name})
            .rollup(function(d){
                return {name: d[0].name, size: d3.sum(d, function(g){return g.size}), type: d[0].sentiment, occurrences: d.map(function(d){return d.usage})};
            }).entries(data);


    fData.forEach(function(d){
        d.name = d.key;
        d.size = d.values.size;
        d.type = d.values.type;
        d.occurrences = d.values.occurrences;
        delete(d.key);
        delete(d.values);
    });

    fData.sort(function(a,b) {
       return parseInt(b.size) - parseInt(a.size);
    });

    fData = fData.slice(0,30);

    var filteredData = fData.filter(function (dataElement) {
     //return dataElement.size != 1;
        return true;
    });

    data = {name: "flare",children: filteredData};


    //parse json string into object (name:string, children:[(name:string, size:number, type:string)])
    root = data;

    var diameter = 400;
    var format = d3.format(",d");


    //Set a scale of colour values (ordinal - order of discrete values)
    var color = d3.scale.ordinal()
            .domain(["g","b","n"])                              //distribute the values in the domain
            .range(["#8ED081", "#D17F50", "#DCE2AA"]);          //across the colours in range - maps 1 to 1


    //Add pack layout
    var bubble = d3.layout.pack()
            .sort(null) //don't sort - circles placed random
            .size([diameter, diameter]) //set available layout size
            .padding(2); //set padding between circles

    //Create an array from json object - [(packageName:String, className:String, value:String, type:String)]
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, type: node.type, occurrences: node.occurrences});
        }

        recurse(null, root);

        return {children: classes};
    }

    //Draw the word cloud
    function draw() {
        var cloudCir = wcSvg.selectAll("g circle")
                    .data(bubble.nodes(classes(root)) //bind the data by parsing json object - add to layout
                    .filter(function(d) { return !d.children; }))
                    .attr("transform", function(d) { return "translate(" + (d.x + width/2 - diameter/2) + "," + (d.y + 50) + ")"; }); //move bubble from top left

        var cloudText = wcSvg.selectAll("g text")
            .data(bubble.nodes(classes(root)) //bind the data by parsing json object - add to layout
                .filter(function(d) { return !d.children; }))
            .attr("transform", function(d) { return "translate(" + (d.x + width/2 - diameter/2) + "," + (d.y + 50) + ")"; }); //move bubble from top left

        //Entering words
        cloudCir.enter()
            .append("circle")
            .attr('r', 0)
            .style("fill", function(d) {  return color(d.type); })
            .append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        cloudText.enter()
            .append("text")
            .style("font-family", "Impact")
            //.style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        //Exiting words
        cloudCir.exit()
            .transition()
            .duration(200)
            .attr("r", 0)
            .remove();

        cloudText.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();

        //Entering and existing words
        cloudCir
            .transition()
                .duration(600)
                .attr('r', function(d) { return d.r; })
                .attr('transform', function(d){
                    return "translate(" + [d.x + 30, d.y] + ")";
                });

        cloudText.transition().duration(600)
                .style("font-size", "10px")
                .attr("transform", function(d) {
                    return "translate(" + [d.x + 30, d.y] + ")";
                })
                .style("fill-opacity", 1)
                .text(function(d) { return d.className; });

        cloudCir.on("mouseover", mouseover);
        cloudText.on("mouseover", mouseover);
        cloudCir.on("mouseout", mouseout);
        cloudText.on("mouseover", mouseover);
    }

    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    function mouseover(d) {
        tooltip.style("visibility", "visible");
        var text = d.className + ": " + d.value;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(text)
            .style("left", (d3.event.pageX)+30 + "px")
            .style("top", (d3.event.pageY) + "px");
    }

    function mouseout(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        var $tooltip = $("#tooltip");
        $tooltip.empty();
    }

    draw();

    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {debugger;
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                //.rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }
}
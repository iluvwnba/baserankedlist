function createFullChart(data){

    var tdata = [];
    data.forEach(function(d){
        d.wc.forEach(function(d){tdata.push(d)});
    });


    var fData = d3.nest()
            .key(function(d){return d.name})
            .rollup(function(d){
                return {name: d[0].name, size: d3.sum(d, function(g){return g.size}), type: d[0].type, occurrences: d.map(function(d){return d.usage})};
            }).entries(tdata);


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

    var filteredData = fData.filter(function (dataElement) {
     //return dataElement.size != 1;
        return true;
    });

    data = {name: "flare",children: filteredData};


    //parse json string into object (name:string, children:[(name:string, size:number, type:string)])
    root = data;


    //Select the div with id=svgg - this will contain the svg
    var container = d3.select("div#svgg");

    //Empty the div container of any contents
    container.html("");

    //Set the height and width to screen height / width
    var width = 1000;
    var height = 1000;


    var diameter = 990;
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


    //Add our svg to the div container
    var svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height) //add viewbox for graphic elements
            .classed("svg-content-responsive", true)
            /*.call(    //Scrolling + zooming in attributes
                    d3.behavior.zoom()
                            .scaleExtent([1,10])
                            .on("zoom", zoom)
            )*/
            .append("g");

    //Add a title to the wordcloud
    var title = svg.append("g")
                    .attr("class", "title")
                .append("text")
                    .attr("class", "title")
                    .attr("x", width / 2)
                    .attr("y", 38)
                    .attr("text-anchor", "middle");

    function zoom() {
        svg.attr("transform", "translate("
                + d3.event.translate
                + ")scale(" + d3.event.scale + ")");
    }

    //Get nodes from svg - empty array
    var node = svg.selectAll(".node")
            .data(bubble.nodes(classes(root)) //bind the data by parsing json object - add to layout
                    .filter(function(d) { return !d.children; }))
            .enter() //add a placeholder for all data
            .append("g")  //append graphic element for every data item
            .attr("class", "node") //set class of graphic element
            .attr("transform", function(d) { return "translate(" + (d.x + width/2 - diameter/2) + "," + (d.y + 50) + ")"; }); //move bubble from top left

    //Add a title to all bubbles - for word and count
    node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); })
    ;

    //Add circle graphic
    node.append("circle")
            .attr("r", function(d) { return d.r; }) //return radius of circle determined by layout, number of bubbles & frequency - max diameter 550
            .style("fill", function(d) {return color(d.type);});

    //Add label to bubble
    node.append("text")
            .attr("dy", ".3em")  //position text relative to y position
            .style("font-family","sans-serif")  //set font family
            .style("text-anchor", "middle")  //set text to center
            .style("font-size", "14px")  //set font size
            .text(function(d) { return d.className.substring(0, d.r / 3); })
    ;  //trim the string so smaller bubbles don't show full label



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
}
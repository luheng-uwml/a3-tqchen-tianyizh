// this is the java script file that works creates the network
// no existing data yet, use TODO to mark things to be done

var width = 860;
var height = 700;

var color = d3.scale.category20();
var force = d3.layout.force()
    .charge( function (d){ if( d.fixed ) return -2000; else return -200; } )
    .linkDistance( 30 )
    .size( [width, height] );

var svg = d3.select("#netgraph").append("svg")
    .attr("width", width)
    .attr("height", height);


//---------tool tips------------
var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset( [-10, 0] )
    .html( function( d ){
        var content = "<span>" + "Director: TODO" + "</span></br></br>";
        content += "<span>" + "Rating: TODO" + "</span>";
        return content;
    } );
svg.call( tooltip )
// show detailed text
var showNodeInfo = function( d, i ){
    tooltip.show(d,i);
};
var hideNodeInfo = function( d, i ){
    tooltip.hide(d,i);
};

//------------------------------------
// user click, mark one node as fixed
//------------------------------------
var dblClickNode = function( d ){
    // reset the other nodes to be false
    nodes = force.nodes()
        .forEach( function (d) { d.fixed = false; } );    
    d.fixed = true;
    d.px = d.x = width / 2;
    d.py = d.y = height / 2;
    force.start();
}

d3.json( "data/miserable.json", function(error, graph) {
    var update = function(){
        force
            .nodes( graph.nodes )
            .links( graph.links )
            .start();

        var link = svg.selectAll(".link")
            .data( graph.links );
        link.exit().remove();
        link = link
            .enter().append("line")
            .attr( "class", "link" );

        var node = svg.selectAll(".node")
            .data( graph.nodes );
        node.exit().remove();
        node = node
            .enter().append("circle")
            .attr( "class", "node" )
            .attr( "r", 5 )
            .style("fill", function(d) { return color( d.group ); })
            .call( force.drag );
               
        // start show the graph
        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            
            node.attr("cx", function(d) { return d.x; } )
                .attr("cy", function(d) { return d.y; } )
        });
                 
        // add event listeners
        node.on("mouseover", showNodeInfo )
            .on("mouseout", hideNodeInfo )
            .on("dblclick", dblClickNode );
    };    
    update();
}); 


window.onload = function() {
    $.ajax({
	url: 'http://127.0.0.1:5000/get_graph',
	data: JSON.stringify({}),
	type: 'POST',
	success: function(response) {
	    //console.log(response);
	    graph = jQuery.parseJSON(response);
	    console.log(graph);
	    build_drawing(graph);
	    onclick(0);
	},
	error: function(error) {
	    console.log(error);
	}
    });
}

function build_drawing (graph)
{
    var pos;

    var width = document.documentElement.clientWidth-32;
    var height = document.documentElement.clientHeight-32;

    // List of colors
    var color = d3.scale.category10();

    var force = d3.layout.force()
	    .charge(graph.charge)
	    .linkDistance(graph.link_distance)
	    .linkStrength(graph.link_strength)
	    .gravity(graph.gravity)
	    .size([width, height])
	    .links(graph.links)
	    .nodes(graph.nodes);

    // Adapts the graph layout to the javascript window's dimensions
    if(graph.pos.length != 0){
	center_and_scale(graph);
    }

    // SVG window
    var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("pointer-events", "all") // Zoom+move management
	    .append('svg:g')
	    .call(d3.behavior.zoom().on("zoom", redraw_on_zoom))
	    .append('svg:g');

    // Zooming
    svg.append('svg:rect')
	.attr('x',      -10000)
	.attr('y',      -10000)
	.attr('width', 2*10000)
	.attr('height',2*10000)
	.attr('fill', 'white');

    var drag_in_progress = false;
    function redraw_on_zoom() {
	if(!drag_in_progress){
	    svg.attr("transform",
		     "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
	}
    }

    // Edges
    var link = svg.selectAll(".link")
	    .data(force.links())
	    .enter().append("path")
	    .attr("class", function(d) { return "link directed"; })
	    .attr("marker-end", function(d) { return "url(#directed)"; })
	    .style("stroke",function(d) { return d.color; })
	    .style("stroke-width", graph.edge_thickness+"px");

    // Loops
    var loops = svg.selectAll(".loop")
	    .data(graph.loops)
	    .enter().append("circle")
	    .attr("class", "link")
	    .attr("r", function(d) { return d.curve; })
	    .style("stroke",function(d) { return d.color; })
	    .style("stroke-width", graph.edge_thickness+"px");

    // Nodes
    var node = svg.selectAll(".node")
	    .data(force.nodes())
	    .enter().append("circle")
	    .attr("class", "node")
	    .attr("name", function(d) { return 'v'+d.name; })
	    .attr("r", graph.vertex_size)
	    .style("fill", function(d) { return color(d.group); })
	    .on('click', function(d) { onclick(d.name)})
	    .call(force.drag()
		  .on('dragstart', function (){ drag_in_progress=true; })
		  .on('dragend'  , function (){ drag_in_progress=false;})
		 )

    node.append("title").text(function(d) { return d.name; });

    // Vertex labels
    if(graph.vertex_labels){

	var v_labels = svg.selectAll(".v_label")
		.data(force.nodes())
		.enter()
		.append("svg:g")
		.attr("class","display");

	v_labels.append("svg:text")
	    .attr("y",-8)
	    .attr("x",30)
	    .attr("class","copcount")
	    .attr("vertex_id", function(d) {return d.name; })
	    .text("1");

	v_labels.append("svg:text")
	    .attr("y",20)
	    .attr("x",30)
	    .attr("class","robcount")
	    .attr("vertex_id", function(d) {return d.name; })
	    .text("1");

	v_labels.append("svg:image")
	    .attr("y",-25)
	    .attr("x",2)
	    .attr("height",25)
	    .attr("width",25)
	    .attr("class","coppic")
	    .attr("xlink:href","pics/cop.png")
	    .attr("vertex_id", function(d) {return d.name; });

	v_labels.append("svg:image")
	    .attr("y",0)
	    .attr("x",3)
	    .attr("height",20)
	    .attr("width",20)
	    .attr("xlink:href","pics/rob.png")
	    .attr("class","robpic")
	    .attr("transform","translate(0,5)")
	    .attr("vertex_id", function(d) {return d.name; });
    }

    // Edge labels
    if(graph.edge_labels){
	var e_labels = svg.selectAll(".e_label")
		.data(force.links())
		.enter()
		.append("svg:text")
		.attr("text-anchor", "middle")
		.text(function(d) { return d.name; })

	var l_labels = svg.selectAll(".l_label")
		.data(graph.loops)
		.enter()
		.append("svg:text")
		.attr("text-anchor", "middle")
		.text(function(d,i) { return graph.loops[i].name; })
    }

    // Arrows, for directed graphs
    if(graph.directed){
	svg.append("svg:defs").selectAll("marker")
	    .data(["directed"])
	    .enter().append("svg:marker")
	    .attr("id", String)
	// viewbox is a rectangle with bottom-left corder (0,-2), width 4 and height 4
	    .attr("viewBox", "0 -2 4 4")
	// This formula took some time ... :-P
	    .attr("refX", Math.ceil(2*Math.sqrt(graph.vertex_size)))
	    .attr("refY", 0)
	    .attr("markerWidth", 4)
	    .attr("markerHeight", 4)
	    .attr("preserveAspectRatio",false)
	    .attr("orient", "auto")
	    .append("svg:path")
	// triangles with endpoints (0,-2), (4,0), (0,2)
	    .attr("d", "M0,-2L4,0L0,2");
    }

    // The function 'line' takes as input a sequence of tuples, and returns a
    // curve interpolating these points.
    var line = d3.svg.line()
	    .interpolate("cardinal")
	    .tension(.2)
	    .x(function(d) {return d.x;})
	    .y(function(d) {return d.y;})

    /////////////////////////////////////////////
    // This is where all movements are defined //
    /////////////////////////////////////////////
    force.on("tick", function() {

	// Position of vertices
	node.attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });

	// Position of edges
	link.attr("d", function(d) {

	    // Straight edges
	    if(d.curve == 0){
		return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;
	    }
	    // Curved edges
	    else {
		p = third_point_of_curved_edge(d.source,d.target,d.curve)
		return line([{'x':d.source.x,'y':d.source.y},
			     {'x':p[0],'y':p[1]},
			     {'x':d.target.x,'y':d.target.y}])
	    }
	});

	// Position of Loops
	if(graph.loops.length!=0){
	    loops
		.attr("cx",function(d) { return force.nodes()[d.source].x; })
		.attr("cy",function(d) { return force.nodes()[d.source].y-d.curve; })
	}

	// Position of vertex labels
	if(graph.vertex_labels){
	    v_labels
	    //.attr("x",function(d) { return d.x; })
	    //.attr("y",function(d) { console.log(d.y); return d.y+30; })
		.attr("transform",function(d) { console.log("translate("+(d.x)+","+d.y+")"); return "translate("+(d.x)+","+d.y+")"; })
	}
	// Position of the edge labels
	if(graph.edge_labels){
	    e_labels
		.attr("x",function(d) { return third_point_of_curved_edge(d.source,d.target,d.curve+3)[0]; })
		.attr("y",function(d) { return third_point_of_curved_edge(d.source,d.target,d.curve+3)[1]; })
	    l_labels
		.attr("x",function(d,i) { return force.nodes()[d.source].x; })
		.attr("y",function(d,i) { return force.nodes()[d.source].y-2*d.curve-1; })
	}
    });

    // Returns the coordinates of a point located at distance d from the
    // barycenter of two points pa, pb.
    function third_point_of_curved_edge(pa,pb,d){
	var dx = pb.x - pa.x,
	    dy = pb.y - pa.y;
	var ox=pa.x,oy=pa.y,dx=pb.x,dy=pb.y;
	var cx=(dx+ox)/2,cy=(dy+oy)/2;
	var ny=-(dx-ox),nx=dy-oy;
	var nn = Math.sqrt(nx*nx+ny*ny)
	return [cx+d*nx/nn,cy+d*ny/nn]
    }

    // Applies an homothety to the points of the graph respecting the
    // aspect ratio, so that the graph takes the whole javascript
    // window and is centered
    function center_and_scale(graph){
	var minx = graph.pos[0][0];
	var maxx = graph.pos[0][0];
	var miny = graph.pos[0][1];
	var maxy = graph.pos[0][1];

	graph.nodes.forEach(function(d, i) {
	    maxx = Math.max(maxx, graph.pos[i][0]);
	    minx = Math.min(minx, graph.pos[i][0]);
	    maxy = Math.max(maxy, graph.pos[i][1]);
	    miny = Math.min(miny, graph.pos[i][1]);

	    var border = 60
	    var xspan = maxx - minx;
	    var yspan = maxy - miny;

	    var scale = Math.min((height-border)/yspan, (width-border)/xspan);
	    var xshift = (width-scale*xspan)/2
	    var yshift = (height-scale*yspan)/2

	    force.nodes().forEach(function(d, i) {
		d.x = scale*(graph.pos[i][0] - minx) + xshift;
		d.y = scale*(graph.pos[i][1] - miny) + yshift;
	    });
	});
    }

    // Starts the automatic force layout
    force.start();
    if(graph.pos.length != 0){
	force.tick();
	force.stop();
	graph.nodes.forEach(function(d, i) {
	    d.fixed=true;
	});
    }
}

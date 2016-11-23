var hey;
function update_data(colors) {
    $("circle").each(function() {
	//console.log("Heyyyyyyy");
	$(this).attr('group',colors[$(this).attr('name')]);
	//console.log($(this)[0].className);
	hey=$(this);
	//console.log(colors[$(this).attr('name')]);
    });
}

      // v_labels.append("svg:text")
      //     .attr("y",8)
      //     .attr("x",30)
      //     .attr("transform","translate(0,5)")
      // 	  .attr("class","copcount")
      // 	  .text("1");
      // v_labels.append("svg:text")
      //     .attr("y",28)
      //     .attr("x",30)
      //     .attr("transform","translate(0,5)")
      // 	  .attr("class","robcount")
      // 	  .text("1");
      // v_labels.append("svg:image")
      //     .attr("y",-5)
      //     .attr("x",2)
      //     .attr("height",25)
      //     .attr("width",25)
      //     .attr("class","coppic")
      // 	  .attr("xlink:href","cop.png")
      // v_labels.append("svg:image")
      //     .attr("y",11)
      //     .attr("x",3)
      //     .attr("height",20)
      //     .attr("width",20)
      // 	  .attr("xlink:href","rob.png")
      //     .attr("class","robpic")
      //     .attr("transform","translate(0,5)");


function update_weights(copweight,robweight) {
    //console.log(copweight);
    $(".copcount,.coppic").each(function () {
	$(this).attr("weight",copweight['v'+$(this).attr('vertex_id')]);
    });
    $(".robcount,.robpic").each(function () {
	$(this).attr("weight",robweight['v'+$(this).attr('vertex_id')]);
    });
    $("text.copcount,text.robcount").each(function () {
	$(this).text($(this).attr('weight'));
    });
    $(".copcount,.coppic,.robcount,.robpic").each(function () {
	if( $(this).attr('weight') != "0"){
	    $(this).css("display","block");
	}
	else{
	    $(this).css("display","none");
	}
    });

}

function onclick (d) {
    //alert("Hey"+d);
    $.ajax({
        url: 'http://127.0.0.1:5000/click_on_node',
        data: JSON.stringify({'node_clicked':d}),
        type: 'POST',
        success: function(response) {
            //console.log(response);
            response = jQuery.parseJSON(response);
            update_data(response['focused']);
            update_weights(response['copweight'],response['robweight']);
            my_redraw();
        },
        error: function(error) {
            console.log(error);
        }
    });
}


var color = d3.scale.category10();

function my_redraw() {
// $("circle").each(function() {
//     console.log("Hey");
//     $("svg g g").append('<text vertical-align="middle" style="display:block;transform-origin:0px 0px 0px;white-space:nowrap;" x="700" y="300">text</text>');
// })

    $("circle").each(function() {
	$(this).css("fill",color($(this).attr('group')));
    });
    $(".display").each(function() {
	$(this).append("<text width=50 height=50>Heyyy</text>");
	console.log("HeyDisplay");
    })
}

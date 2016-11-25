var color = d3.scale.category10();

function update_node_colors(colors) {
    $("circle").each(function() {
	$(this).attr('group',colors[$(this).attr('name')]);
	$(this).css("fill",color($(this).attr('group')));
    });
}

function update_weights(copweight,robweight) {

    $(".copcount,.coppic").each(function () {
	$(this).attr("weight",copweight[$(this).attr('vertex_id')]);
    });
    $(".robcount,.robpic").each(function () {
	$(this).attr("weight",robweight[$(this).attr('vertex_id')]);
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

    $.ajax({
        url: 'http://127.0.0.1:5000/click_on_node',
        data: JSON.stringify({'node_clicked':d}),
        type: 'POST',
        success: function(response) {
            //console.log(response);
            response = jQuery.parseJSON(response);
            update_node_colors(response['focused']);
            update_weights(response['copweight'],response['robweight']);
        },
        error: function(error) {
            console.log(error);
        }
    });
}



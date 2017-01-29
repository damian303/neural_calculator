//var data = {inputs:[{name:'InputA', value:0.25},{name:'InputB',value:0.65},{name:'InputC',value:0.65}], hidden:[{name:"D"}, {name:"E"},{name:"F"}], output:[{name:"G"}],  synapse:[]};

$('#reset').click(function(){d3.select("#neural").html("");neuralise();})
var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"];
$( document ).ready(function() {neuralise()});

function neuralise(){
  var data = {inputs:[], hidden:[], output:[],  synapse:[]};
  var input_amount = +$('#inputs_amount').val();
  var hidden_amount = +$('#hidden_amount').val();
  //var layer_amount = $('#layers_amount').val();
  var output_amount = +$('#outputs_amount').val();
  var build_data = [{id:"inputs", amount:$('#inputs_amount').val()},{id:"hidden", amount:$('#hidden_amount').val()},{id:"output", amount:$('#outputs_amount').val()}];
  var name_i = 0;
  build_data.forEach(function(d){
    for(var i = 0; i < d.amount; i++){
      var name = (d.id=="inputs")?"Input"+alpha[name_i]:alpha[name_i];
      var value = (d.id=="inputs")?Math.random().toFixed(2):0;
      var obj = {name:name, value:+value};
      data[d.id].push(obj)
      name_i++;
    }
  });
  if(neural)neural.remove();
  var n_h = 80;
  var n_w = 100;
  var output_x = 500;
  var output_y = (((data.hidden.length-1) * 180)/2);
  var neural = d3.select("#neural").append("svg").attr("class","chart");
  var defs = neural.append("defs");

  defs.append("marker")
    .attr({
      "id":"arrow",
      "viewBox":"0 -5 10 10",
      "refX":(n_h/2),
      "refY":0,
      "markerWidth":6,
      "markerHeight":6,
      "orient":"auto"
    })
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class","arrowHead");

  var inputs = neural.selectAll("g.input")
    .data(data.inputs)
    .enter()
    .append("g")
    .attr("class", "input")
    .attr("id", function(d){return d.name})
    .attr("transform", function(d,i){return "translate(" + 0 + "," + i*180 + ")"})

  inputs.append("rect")
    .attr("width", n_w)
    .attr("height", n_h)

  inputs.append("text")
    .attr("class", "text")
    .attr("x", 10)
    .attr("y", 30)
    .text(function(d) { return d.name; })

  inputs.append("text")
    .attr("class", "text")
    .attr("x", 10)
    .attr("y", 50)
    .text(function(d) { return d.value; })
    .call(make_editable, 'value')

  var hidden = neural.selectAll("g.hidden")
    .data(data.hidden)
    .enter()
    .append("g")
    .attr("class", "hidden")
    .attr("id", function(d){return d.name})
    .attr("transform", function(d,i){return "translate(" + 300 + "," + i*180 + ")"})

  hidden.append("circle")
    .attr("class","node")
    .attr("cy", n_h/2)
    .attr("r", n_h/2)

  hidden.append("text")
    .attr("class", "text")
    .attr("x", -5)
    .attr("y", (n_h/2)+5)
    .text(function(d) { return d.name; })

  hidden.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("id", function(d){return "out_"+d.name})
    .attr("x", -5)
    .attr("y", (n_h/2)+25)
    .text(function(d) { return d.value; })

var output = neural.selectAll("g.output")
  .data(data.output)
    .enter()
    .append("g")
    .attr("class", "output")
    .attr("id", "output")
    .attr("transform", function(d,i){return "translate(" + output_x + "," + output_y + ")"})

  output.append("circle")
    .attr("class","node")
    .attr("cy", n_h/2)
    .attr("r", n_h/2);

  output.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", (n_h/2)+5)
    .text(function(d){return "output_"+d.name;})

  output.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("id", function(d){return "output_"+d.name;})
    .attr("x", 0)
    .attr("y", (n_h/2)+25)
    .text(function(d){return d.value;})

  var done = false;

  data.inputs.forEach(function(d){
      var t1 = d3.transform(d3.select('#'+d.name).attr("transform"));///.getBoundingClientRect());
      var x1 = t1.translate[0]+n_w, y1 = t1.translate[1]+(n_h/2);
      data.hidden.forEach(function(d_h){
        var t2 = d3.transform(d3.select('#'+d_h.name).attr("transform"));
        var x2 = t2.translate[0], y2 = t2.translate[1]+(n_h/2);
        data.synapse.push({x1:x1,y1:y1,x2:x2,y2:y2, from:d.name, into:d_h.name, type:"hidden_1", value:+d.value, weight:Math.random().toFixed(2)});
        if(!done){
          data.output.forEach(function(d_o){
            data.synapse.push({x1:x2+(n_h/2), y1:y2, from: d_h.name, into:d_o.name, x2:output_x, y2:output_y+(n_h/2), value:0, weight:Math.random().toFixed(2)});
          });
        }
      });
      done = true;
  });

  var synapse = neural.selectAll("g.synapse")
    .data(data.synapse)
    .enter()
    .append("g")

    synapse.append("line")
		.attr("class","arrow")
		.attr("marker-end","url(#arrow)")
		.attr("x1",function(d){return d.x1;})
  	.attr("x2",function(d){return d.x2;})
		.attr("y1",function(d){return d.y1;})
		.attr("y2",function(d){return d.y2;})

    synapse.append("rect")
    .style("stroke", "black")
    .style("fill", "white")
    .attr("x", function(d){return ((d.x1*3)/4)+(d.x2/4)-20})
    .attr("y", function(d){return ((d.y1*3)/4)+(d.y2/4)-16})
    .attr("width", 40)
    .attr("height", 18)

   synapse.append("text")
    .attr("class", "text")
    .attr("id", function(d){return "synapse_"+d.from})
    .attr("text-anchor", "middle")
    .attr("x", function(d){return ((d.x1*3)/4)+(d.x2/4)})
    .attr("y", function(d){return ((d.y1*3)/4)+(d.y2/4)})
    .text(function(d) { return d.weight; })
    .call(make_editable, 'weight')

  hidden.moveToFront();
  output.moveToFront();

//  d3.selectAll(".text").moveToFront();

  calculate();
  function calculate(){
    data.inputs.forEach(function(i){
        data.synapse.forEach(function(s){
          if(s.from==i.name){s.value=i.value};
        });
    })
    data.hidden.forEach(function(h){
      h.value = 0;
      data.synapse.forEach(function(s){
        if(s.into==h.name){
          var temp = h.value+(s.value*s.weight);
          console.log(h.name+" =>  "+h.value +" + ("+s.value+" * "+s.weight+") = "+temp)
          h.value+=(s.value*s.weight);
        };
      });
    })
    data.hidden.forEach(function(h){
      h.value = (1/(1+Math.exp(-(h.value)))).toFixed(3);
      //console.log("Result : "+h.name+" = "+h.value)
      d3.select("#out_"+h.name).text(h.value);
        data.output.forEach(function(o){
          o.value = 0;
          data.synapse.forEach(function(s){

            if(s.into==o.name&&s.from==h.name){
              var temp = o.value+(h.value*s.weight);
              console.log(o.name+" =>  "+o.value +" + ("+h.value+" * "+s.weight+") = "+temp)
              o.value+=(h.value*s.weight);
            };
          });
        });
    });
    data.output.forEach(function(o){
        o.value = (1/(1+Math.exp(-(o.value)))).toFixed(3);
        //console.log("Result : "+o.name+" = "+o.value)
        d3.select("#output_"+o.name).text(o.value);
    })
    console.log("***************************************************")
  }
  function make_editable(d, field)
    {
        this
          .on("mouseover", function() {
            d3.select(this).style("fill", "red");
          })
          .on("mouseout", function() {
            if(d3.select(this).attr("class")=="name")text_color = "white";
            else text_color = "black";
            d3.select(this).style("fill", text_color);
          })
          .on("click", function(d) {
            console.log("Clicked")
            var p = this.parentNode;
            var xy = this.getBoundingClientRect();//.getBBox();
            var p_xy = p.getBoundingClientRect();//.getBBox();

            var w_p = (p_xy.width>100)?p_xy.width:100;
            var el = d3.select(this);
            var p_el = d3.select(p);
            var frm = d3.select("body").append("div").style("position", "absolute");//.attr("class", "editable");

            var inp = frm
                .style("left", xy.left-2+"px")
                .style("top", xy.top+"px")
                .append("xhtml:form")
                        .append("input")
                            .attr("value", function() {
                                this.focus();
                                return d[field];
                            })
                            .attr("style", "width:"+(100)+"px;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function() {
                              console.log("blur")
                                var txt = inp.node().value;
                                d[field] = txt;
                                el
                                    .text(function(d) { return d[field]; });
                                //p_el.select("foreignObject").remove();
                                calculate();
                                frm.remove();
                            })
                            .on("keypress", function() {
                                // IE fix
                                if (!d3.event)
                                    d3.event = window.event;
                                var e = d3.event;
                                if (e.keyCode == 13)
                                {
                                  console.log("enter pressed!!")
                                    if (typeof(e.cancelBubble) !== 'undefined') // IE
                                      e.cancelBubble = true;
                                    if (e.stopPropagation)
                                      e.stopPropagation();
                                    e.preventDefault();
                                    var txt = inp.node().value;
                                    d[field] = txt;
                                    el.text(function(d) { return d[field]; });

                                        inp.remove();//frm.remove();
                                        calculate();
                                        return "done";
                                }
                            });
          });
    }
}
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

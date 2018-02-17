var width = 600;
var height = 600;

var years = d3.scaleOrdinal(d3.schemeCategory10).domain([2015,2016,2017]);
var year_range = [];
var button_state = [];
for (var i = 2015; i<=2017;i++){
  year_range.push(i);
  button_state.push({ key: i, value: 1});
}

var cow_state = "no";
var caste_state = "no";
var religion_state = "no";
var dalit_state = "no";
var muslim_state = "no";
  

var latitude = d3.map();
var longitude = d3.map();
var projection = d3.geoMercator()
          .translate([-1040, 680])
          .scale(900);

  //console.log(projection);

var geoPath = d3.geoPath()
          .projection(projection);
  
var svg = d3.select("svg")
      .attr("width",width)
      .attr("height",height)

var g = svg.append("g")


d3.json("map/india.json", function(error, data){
  var india = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.polygons.geometries
  });

  g.selectAll("path")
          .data(india.features)
          .enter()
          .append("path")
          .attr("class","path")
          .attr("d", geoPath)
          .attr("fill", "yellow")

   d3.csv("csv/violence_data.csv", function(error, data){
              data = data.filter(function(row) {
                return year_range.indexOf( parseInt(row['yy'])) != -1;
              })
              var circles = g.selectAll("circle").data(data)

              circles.enter()
                  .append("circle")
                  .attr("r",5)
                  .attr("fill-opacity",0.7)
                  .on("mouseover", handleMouseOver)
                  .on("mouseout", handleMouseOut)
                  .on("click",handleClick)
                    .attr("cx",function(d){
                    return projection([d.longitude,d.latitude])[0];
                  })
                  .attr("cy",function(d){
                    return projection([d.longitude,d.latitude])[1];
                  })
                  .attr("fill",function(d){
                    return years(d.yy);
                  })
                  .attr("stroke",function(d){
                    return years(d.yy);
                  })
                  

    function handleClick(d,i){
            d3.select(this)
                .attr("fill","white");
            console.log(d)
            d3.select("body").select("p")
                .text(d.summary)
                .style("background-color","white");
              }
    function handleMouseOver(d, i) {
            d3.select(this)
                .attr("fill", "red")
                .attr("r", 10);
              }              
    function handleMouseOut(d, i) {
            d3.select(this)
                .attr("r",5)
                .attr("fill",function(d){
                    return years(d.yy);
                  })
              }
          })

// handling year logic of checkboxes.
year_func = function(){
  choices = [];
  d3.selectAll(".years").each(function(d){
    cb = d3.select(this);
    if(cb.property("checked")){
      choices.push(parseInt(cb.property("value")));
    }
  });
  if(choices.length > 0){
    year_range = choices;
  }
  update();
}
d3.selectAll(".years").on("change",year_func);
// handling year logic of checkboxes.

blah = function(){
  cow_state="no";
  caste_state="no";
  religion_state="no";
  dalit_state="no";
  muslim_state="no";
  d3.selectAll(".checkbox").each(function(d){
    cb = d3.select(this);
    if(cb.property("checked")){
      console.log(cb.property("value"));
      if(cb.property("value")=="cow"){cow_state="yes"}
      if(cb.property("value")=="caste"){caste_state="yes"}
      if(cb.property("value")=="religion"){religion_state="yes"}
      if(cb.property("value")=="dalit"){dalit_state="yes"}
      if(cb.property("value")=="muslim"){muslim_state="yes"}
    }
  });
  update();
}
d3.selectAll(".checkbox").on("change",blah);


function update(){
  d3.selectAll('circle').remove()
  d3.csv("csv/violence_data.csv", function(error, data){
    data = data.filter(function(row) {
      console.log(String(cow_state));
      return year_range.indexOf( parseInt(row['yy'])) != -1;
    })
    if(cow_state == "yes"){data = data.filter(function(row) {
      return row['hatetype_cow'] == cow_state;
      })}
    if(caste_state == "yes"){data = data.filter(function(row) {
      return row['hatetype_caste'] == caste_state;
      })}
    if(religion_state == "yes"){data = data.filter(function(row) {
      return row['hatetype_religion'] == religion_state;
      })}
    if(dalit_state == "yes"){data = data.filter(function(row) {
      return row['identity_dalit'] == dalit_state;
      })}
    if(muslim_state == "yes"){data = data.filter(function(row) {
      return row['identity_muslim'] == muslim_state;
      })}
  
    var circles = g.selectAll("circle").data(data)
    // hatetype_cow, hatetype_caste, hatetype_religion
              circles.enter()
                  .append("circle")
                  .attr("r",5)
                  .attr("fill-opacity",0.7)
                  .on("mouseover", handleMouseOver)
                  .on("mouseout", handleMouseOut)
                  .on("click",handleClick)
                    .attr("cx",function(d){
                    return projection([d.longitude,d.latitude])[0];
                  })
                  .attr("cy",function(d){
                    return projection([d.longitude,d.latitude])[1];
                  })
                  .attr("fill",function(d){
                    return years(d.yy);
                  })
                  .attr("stroke",function(d){
                    return years(d.yy);
                  })
      function handleClick(d,i){
            d3.select(this)
                .attr("fill","white");
            console.log(d)
            d3.select("body").select("p")
                .text(d.summary)
              }
    function handleMouseOver(d, i) {
            d3.select(this)
                .attr("fill", "red")
                .attr("r", 10);
              }              
    function handleMouseOut(d, i) {
            d3.select(this)
                .attr("r",5)
                .attr("fill",function(d){
                    return years(d.yy);
                  })
              }
        })
  }

})

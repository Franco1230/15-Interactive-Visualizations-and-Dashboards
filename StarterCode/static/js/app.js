function init() {
  d3.json('samples.json').then(data => {
    console.log(data);
    let id = "940"
    
    // Filter samples to element 940
    let filtered = data.samples.filter(sample => sample.id === id);
    let y = filtered.map(otus => otus.otu_ids);
    console.log("Mapped otu ids for ID #940: ", y[0].slice(0, 10));
        
    // Get data for bubble graph
    let sample = data.samples.filter(sample => sample.id === id);
    let x_bubble = sample[0].otu_ids;
    let y_bubble = sample[0].sample_values;
    

    // Get data for bar graph
    let x_bar = sample[0].sample_values.slice(0, 10);
    console.log(x_bar);
    let y_bar = y[0].slice(0,10).map(String);
    y_bar = y_bar.map(el => "OTU " + el)
    console.log(y_bar);

    // Data for dropdown list
    let dropdown = data.names;
    var demographic = data.metadata[0];
    console.log(d3.keys(demographic));
    
    // Create horizontal bar graph
    var trace1 = {
      x: x_bar.reverse(),
      y: y_bar.reverse(),
      type: 'bar',
      orientation: 'h'
    };
    var plotdata = [trace1];
    Plotly.newPlot("bar", plotdata);
    
    // Create bubble plot
    var trace2 = {
      x: x_bubble,
      y: y_bubble,
      mode: 'markers',
      marker: {
        size: sample[0].sample_values,
        color: sample[0].sample_values,
        colorscale: [[0, 'rgb(0, 0, 0)'], [1, 'rgb(255, 0, 255)']]
      },
      text: sample[0].otu_labels
    };    
    var plotdata2 = [trace2];
    Plotly.newPlot("bubble", plotdata2);
    
    // Create gauge
    var gdata = [{
      domain: {x: [0, 1], y: [0, 1]},
      value: demographic.wfreq,
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      gauge: {
        bar: {color: "charcoal-grey"}
      },
      mode: "gauge+number"
    }];    
    var layout = { width: 600, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot('gauge', gdata, layout);
    
    // Create dropdown list
    const menu = d3.select("#selDataset");
    dropdown.forEach(item => {
      menu.append("option").attr("value", item).text(item);
    });
    
    // Create "Demographic Info" card
    const meta = d3.select("#sample-metadata");
    Object.keys(demographic).forEach((k) => {
      console.log(k, demographic[k]);
      meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
    });
    
    function optionChanged() {
      let id = d3.event.target.value;
      console.log(id);
      
      const filtered = data.samples.filter(sample => sample.id === id);
      let x_bubble2 = filtered[0].otu_ids;
      let y_bubble2 = filtered[0].sample_values;
      let x_bar = filtered[0].sample_values.slice(0, 10);
      let y_bar = filtered[0].otu_ids.slice(0, 10);
      y_bar = y_bar.map(el => "OTU " + el)
      console.log(y_bar);
      let demo = data.metadata.filter(meta => meta.id === parseInt(id));    
      console.log(demo[0].wfreq);
          // update bubble plot with new id info
          Plotly.restyle('bubble', 'x', [x_bubble2]);
          Plotly.restyle('bubble', 'y', [y_bubble2]);
          // update bar plot with new id info
          Plotly.restyle('bar', 'x', [x_bar.reverse()]);
          Plotly.restyle('bar', 'y', [y_bar.reverse()]);
          // update guage plot with new id info
          Plotly.restyle('gauge', 'value', [demo[0].wfreq]);
          

          
          // update demographic info card with new id info
          d3.select("#sample-metadata").selectAll("p").remove();
          const meta = d3.select("#sample-metadata");
          
          Object.keys(demo[0]).forEach((k) => {
              // meta.append("p").attr("class", "card-text").text(d3.keys(elem));
              console.log(`${k}: ${demo[0][k]}`);
              // d3.select("#sample-metadata").append("p").attr("class", "card-text").text(`${k}: ${demo[k]}`);
              // d3.select("#sample-metadata").append("p").attr("class", "card-text").text(k);
          });

          for (const [k,v] of Object.entries(demo[0])) {
              console.log(`${k}: ${v}`);
              d3.select("#sample-metadata").append("p").attr("class", "card-text").text(`${k}: ${v}`);
          };
          
          
      }

      menu.on("change", optionChanged);
  })
}



init();
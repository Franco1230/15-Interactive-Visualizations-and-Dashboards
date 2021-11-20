// Create function for Dashboard
function init() {
  d3.json("samples.json").then(data => {
    console.log(data);
    
    // Filter to get element 940 as sample
    let id = "940";
    let filteredData = data.samples.filter(sample => sample.id === id);
    let y = filteredData.map(otus => otus.otu_ids);
    console.log(filteredData);
    console.log(filteredData[0].otu_ids);
    console.log("Mapped otu ids for ID #940: ", y[0].slice(0, 10));    
    
    // Data for bar plot
    let sample = data.samples.filter(sample => sample.id === id);
    let x_bar = sample[0].sample_values.slice(0, 10);
    console.log(x_bar);
    let y_bar = y[0].slice(0, 10).map(String);
    y_bar = y_bar.map(el => "OTU " + el);
    console.log(y_bar);
        
    // Data for bubble plot
    let x_bubble = sample[0].otu_ids;
    let y_bubble = sample[0].sample_values;
    
    // Data for dropdown list
    let dropdownList = data.names;
    var demographic = data.metadata[0];
    console.log(d3.keys(demographic));
    
    // Create horizontal bar plot
    var trace1 = {
      x: x_bar.reverse(),
      y: y_bar.reverse(),
      type: "bar",
      marker: {
        color: "purple",
        line: {
          color: "black",
          width: 2
        }
      },
      orientation: "h"
    };
    var barData = [trace1];
    Plotly.newPlot("bar", barData);
    
    // Create bubble plot
    var trace2 = {
      x: x_bubble,
      y: y_bubble,
      mode: "markers",
      marker: {
        size: sample[0].sample_values,
        color: sample[0].sample_values,
        colorscale: [[0, "rgb(90, 100, 110)"], [1, "rgb(50, 0, 60)"]]        
      },
    };
    var bubbleData = [trace2];
    Plotly.newPlot("bubble", bubbleData);

    // Create dropdown list
    const menu = d3.select("#selDataset");
    dropdownList.forEach(item => {
      menu.append("option").attr("value", item).text(item);
    });      
    
    // Create demographic info card
    const meta = d3.select("#sample-metadata");
    Object.keys(demographic).forEach((k) => {
      console.log(k, demographic[k]);
      meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
    });

    // Create gauge plot
    var gaugeData = [{
      domain: {x: [0, 1], y: [0, 1]},
      value: demographic.wfreq,
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      gauge: {bar: {color: "purple"}},
      mode: "gauge+number"}];
    var layout = {width: 458, height: 450, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge", gaugeData, layout);
    
    // Change patient ID
    function optionChanged() {
      let id = d3.event.target.value;
      console.log(id);

      // Update bar plot data
      const filteredData = data.samples.filter(sample => sample.id === id);
      let x_bar2 = filteredData[0].sample_values.slice(0,10);
      let y_bar2 = filteredData[0].otu_ids.slice(0,10);
      y_bar2 = y_bar2.map(el => "OTU " + el)
      console.log(y_bar);

      // Update bubble plot data
      let x_bubble2 = filteredData[0].otu_ids;
      let y_bubble2 = filteredData[0].sample_values;
      
      // Update demographic info card data
      let demo = data.metadata.filter(meta => meta.id === parseInt(id));    
      console.log(demo[0].wfreq);

      // Update bar plot with new data
      Plotly.restyle("bar", "x", [x_bar2.reverse()]);
      Plotly.restyle("bar", "y", [y_bar2.reverse()]);

      // Update bubble plot with new data
      Plotly.restyle("bubble", "x", [x_bubble2]);
      Plotly.restyle("bubble", "y", [y_bubble2]);
      
      // Update guage plot with new data
      Plotly.restyle("gauge", "value", [demo[0].wfreq]);
      
      // Update demographic info card with new data
      d3.select("#sample-metadata").selectAll("p").remove();
      const meta = d3.select("#sample-metadata");
      Object.keys(demo[0]).forEach((k) => {
        console.log(`${k}: ${demo[0][k]}`);
      });      
      for (const [k, v] of Object.entries(demo[0])) {
        console.log(`${k}: ${v}`);
        d3.select("#sample-metadata").append("p").attr("class", "card-text").text(`${k}: ${v}`);
      };
    };
    
    // Activate dropdown list
    menu.on("change", optionChanged);
  });
};

// Activate the function for Dashboard
init();

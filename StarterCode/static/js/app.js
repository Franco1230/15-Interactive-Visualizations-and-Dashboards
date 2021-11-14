function init() {
  d3.json("samples.json").then(data => {
    console.log(data);
    let id = "940";
    
    // Filter to get element 940
    let filtered = data.samples.filter(sample => sample.id === id);
    let y = filtered.map(otus => otus.otu_ids);
    console.log(filtered);
    console.log(filtered[0].otu_ids);
    console.log("Mapped otu ids for ID #940: ", y[0].slice(0, 10));

    let sample = data.samples.filter(sample => sample.id === id);
    
    // Data for bar plot
    let x_bar = sample[0].sample_values.slice(0,10);
    console.log(x_bar);
    let y_bar = y[0].slice(0,10).map(String);
    y_bar = y_bar.map(el => "OTU "+el);
    console.log(y_bar);
        
    // Data for bubble plot
    let x_bubble = sample[0].otu_ids;
    let y_bubble = sample[0].sample_values;
    
    // Data for dropdown list
    let droplist = data.names;
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
          width: 20
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
        colorscale: [[0, "rgb(140, 150, 160)"], [1, "rgb(50, 0, 80)"]]
      },
      text: sample[0].otu_labels
    };
    var bubbleData = [trace2];
    Plotly.newPlot("bubble", bubbleData);
    
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
      
      // Create dropdown list
      const menu = d3.select("#selDataset");
      droplist.forEach(item => {
        menu.append("option").attr("value", item).text(item);
      });
      
      // Create metadata card
      const meta = d3.select("#sample-metadata");
      Object.keys(demographic).forEach((k) => {
        console.log(k, demographic[k]);
        meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
      });
      
      function optionChanged() {
        let id = d3.event.target.value;
        console.log(id);

        const filtered = data.samples.filter(sample => sample.id === id);
        let x_bar2 = filtered[0].sample_values.slice(0,10);
        let y_bar2 = filtered[0].otu_ids.slice(0,10);
        y_bar2 = y_bar2.map(el => "OTU " + el)
        console.log(y_bar);

        let x_bubble2 = filtered[0].otu_ids;
        let y_bubble2 = filtered[0].sample_values;
        
        let demo = data.metadata.filter(meta => meta.id === parseInt(id));    
        console.log(demo[0].wfreq);

        // Update bar plot with new selected info
        Plotly.restyle("bar", "x", [x_bar2.reverse()]);
        Plotly.restyle("bar", "y", [y_bar2.reverse()]);

        // Update bubble plot with new selected info
        Plotly.restyle("bubble", "x", [x_bubble2]);
        Plotly.restyle("bubble", "y", [y_bubble2]);
        
        // Update guage plot with new selected info
        Plotly.restyle("gauge", "value", [demo[0].wfreq]);
        
        // Update demographic info card with new selected info
        d3.select("#sample-metadata").selectAll("p").remove();
        const meta = d3.select("#sample-metadata");
        Object.keys(demo[0]).forEach((k) => {
          console.log(`${k}: ${demo[0][k]}`);
        });

        for (const [k,v] of Object.entries(demo[0])) {
          console.log(`${k}: ${v}`);
          d3.select("#sample-metadata").append("p").attr("class", "card-text").text(`${k}: ${v}`);
        };
      };
      
      menu.on("change", optionChanged);
    });
  };
  
init();
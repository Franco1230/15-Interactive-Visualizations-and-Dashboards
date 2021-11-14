//default
function init() {
  d3.json("./static/js/samples.json").then((data) => {
      console.log(data);
      var sampleDataset = data.samples;
      var namesDataset = data.names;

      //Add all IDs to the dropdown menu
      var dropdownMenu = d3.select("#selDataset");
      var option;
      for (var i = 0; i < namesDataset.length; i++) {
          option = dropdownMenu.append("option").text(namesDataset[i]);
      };

      // Display default charts
      showBars(namesDataset[0]);
      showMeta(namesDataset[0]);
      showBubble(namesDataset[0]);
      showGauge(namesDataset[0])
  })
};

function optionChanged() {
  var name = d3.select("#selDataset").node().value;
  console.log(name);
  showBars(name);
  showMeta(name);
  showBubble(name);
  showGauge(name);
};


//Update demographic info
function showMeta(name) {
  d3.json("./static/js/samples.json").then((data) => {

      var metaset = d3.select("#sample-metadata");

      var panelb = metaset.selectAll("p");

      panelb.remove();

      var intname = parseInt(name);
      var sample = data.metadata.filter(obj => obj.id === intname)[0];
      console.log(sample);
      
      Object.entries(sample).forEach(function([key, value]) {
        var cell = metaset.append("p");
        cell.text(`${key}: ${value}`)})
      })
}; 


function showBars(name) {
  d3.json("./static/js/samples.json").then(data => {
      var sample = data.samples.filter(obj => obj.id == name)[0];

      var barData = [
          {
              y: sample.otu_ids.slice(0, 10).reverse().map(obj => `OTU ${obj}`),
              x: sample.sample_values.slice(0, 10).reverse(),
              text: sample.otu_labels.slice(0, 10).reverse(),
              orientation: 'h',
              type: 'bar'
          }
      ];

      var barLayout = {
          'title': 'Top 10 Bacteria Cultures for OTU ID: ' + name
      };

      Plotly.newPlot("bar", barData, barLayout);
  });
};

function showBubble(name) {
  d3.json("./static/js/samples.json").then(data => {
      var sample = data.samples.filter(obj => obj.id == name)[0];

      var bubbleData = [
          {
              x: sample.otu_ids,
              y: sample.sample_values,
              text: sample.otu_labels,
              mode: "markers",
              marker: {
                  size: sample.sample_values,
                  color: sample.otu_ids,
                  colorscale: "Earth"
              }
          }
      ];

      var bubbleLayout = {
          // "title": "Bubble Chart of Bacteria Culture Sample in OTU ID: " + name,
          "margin": { t: 0 },
          'hovermode': 'closest',
          'xaxis': {title: 'OTU ID ' + name},
          'yaxis': {title: "Sample Values"}
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  })
};

function showGauge(name) {
  d3.json("./static/js/samples.json").then(data => {
      
      var intname = parseInt(name);
      var sample = data.metadata.filter(obj => obj.id === intname)[0];
      console.log(sample.wfreq);

      var data = [
          {
            type: "indicator",
            mode: "gauge+number+delta",
            value: sample.wfreq,
            title: { text: "<b>Belly Bottom Washing Frequency</b><br><span style='font-size:20;'>Scrubs per Week</span><br>", font: { size: 24 }},
            delta: { reference: 5, increasing: { color: "RebeccaPurple" } },
            
            gauge: {
              
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 1], color: "lightblue" },
                { range: [1, 2], color: "royalblue" },
                { range: [2, 3], color: "lightgreen" },
                { range: [3, 4], color: "green" },
                { range: [4, 5], color: "lightgreen" },
                { range: [5, 6], color: "green" },
                { range: [6, 7], color: "lightpink" },
                { range: [7, 8], color: "pink" },
                { range: [8, 9], color: "yellow" },
              ],
              threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 5
              }
            }
          }
        ];
        
        var layout = {
          width:  400,
          height: 400,
          margin: { t: 25, r: 25, l: 25, b: 25 },
          paper_bgcolor: "white",
          font: { color: "darkblue", family: "Arial" }
        };
        
        Plotly.newPlot('gauge', data, layout);
      })};

init();
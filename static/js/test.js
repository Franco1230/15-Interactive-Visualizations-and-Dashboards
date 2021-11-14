// this was original app.js and renamed to test.js since I would have to edit alot.  keeping here to see how i progressed through the coding

d3.json('samples.json').then(data => {
    console.log(data);
    
    // filter samples to element 940
    let filtered = data.samples.filter(sample => sample.id === "940");
    let y = filtered.map(otus => otus.otu_ids);
    console.log("This is the mapped otu ids for ID #940: ",y[0].slice(0,10));
    console.log(filtered[0].otu_ids);
    //  get data for plots
    let sample = data.samples.filter(sample => sample.id === "940");
    let x_bubble = sample[0].otu_ids;
    let y_bubble = sample[0].sample_values;
    let y_bar = y[0].slice(0,10).map(String);
    y_bar = y_bar.map(el => "OTU "+el)
    console.log(y_bar);
    let x_bar = sample[0].sample_values.slice(0,10);
    console.log(x_bar);
    let droplist = data.names;
    var demographic = data.metadata[0];
    console.log(d3.keys(demographic));
    
    // build initial hbar plot
    var trace1 = {
        x: x_bar.reverse(),
        y: y_bar.reverse(),
        type: 'bar',
        orientation: 'h'
    };
    
    var data = [trace1];

    Plotly.newPlot("bar", data);

    // build initial bubble plot
    var trace2 = {
        x: x_bubble,
        y: y_bubble,
        mode: 'markers',
        marker: {
            size: sample[0].sample_values
        }
    };
    
    var data2 = [trace2];

    Plotly.newPlot("bubble", data2);
    // build dropdown list
    const menu = d3.select("#selDataset");

    droplist.forEach(item => {
        menu.append("option").attr("value", item).text(item);
    })

    // build metadata card
    // got solution here: 
    // https://stackoverflow.com/questions/37673454/javascript-iterate-key-value-from-json
    const meta = d3.select("#sample-metadata");
    Object.keys(demographic).forEach((k) => {
        // meta.append("p").attr("class", "card-text").text(d3.keys(elem));
        let info = demographic[k]
        console.log(k, info );
        meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
    })

    // menu.on("change", () => k, demographic[k]
    // updatePlot(data));
});

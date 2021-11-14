function init() {
    d3.json('samples.json').then(data => {
        console.log(data);
        let id = "940"
        // filter samples to element 940
        let filtered = data.samples.filter(sample => sample.id === id);
        let y = filtered.map(otus => otus.otu_ids);
        console.log(filtered);
        console.log("This is the mapped otu ids for ID #940: ",y[0].slice(0,10));
        console.log(filtered[0].otu_ids);
        //  get data for plots
        let sample = data.samples.filter(sample => sample.id === id);
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
        
        var plotdata = [trace1];
    
        Plotly.newPlot("bar", plotdata);
    
        // build initial bubble plot
        var trace2 = {
            x: x_bubble,
            y: y_bubble,
            mode: 'markers',
            marker: {
                size: sample[0].sample_values,
                color: sample[0].sample_values,
                colorscale: [[0, 'rgb(0, 0, 0)'], [1, 'rgb(0, 0, 0)']]
            },
            text: sample[0].otu_labels
        };
        
        var plotdata2 = [trace2];
    
        Plotly.newPlot("bubble", plotdata2);

        // build gauge plot
        var gdata = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: demographic.wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                gauge: {
                    bar: { color: "darkblue" }
                },
                mode: "gauge+number"
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

        Plotly.newPlot('gauge', gdata, layout);
        // build dropdown list
        const menu = d3.select("#selDataset");
    
        droplist.forEach(item => {
            menu.append("option").attr("value", item).text(item);
        })
        // build metadata card
        // got solution here: 
        const meta = d3.select("#sample-metadata");
        Object.keys(demographic).forEach((k) => {
            console.log(k, demographic[k]);
            meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
        });

        function optionChanged() {
            let id = d3.event.target.value;
            //value of dropdown list
            console.log(id);
            const filtered = data.samples.filter(sample => sample.id === id);
            let x_bubble2 = filtered[0].otu_ids;
            let y_bubble2 = filtered[0].sample_values;
            let x_bar = filtered[0].sample_values.slice(0,10);
            let y_bar = filtered[0].otu_ids.slice(0,10);
            y_bar = y_bar.map(el => "OTU "+el)
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
                console.log(`${k}: ${demo[0][k]}`);
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
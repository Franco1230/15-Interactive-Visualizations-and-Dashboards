// this is from the samples json file that I converted to samples.js for practice
console.log("This is from my samples.js file",samples);

// read the json data and test that I can read it and manipulate it
d3.json('samples.json').then(function(data) {
    console.log(data);
    // first set of otu_ids
    console.log("This is the list of OTU ids:",data.samples[0].otu_ids.slice(0,10));
    var otu_ids = data.samples[0].otu_ids;
    var labels = otu_ids.map(String);
    var droplist = data.names;
    console.log("This is the list of names: ", droplist);
    console.log("This is the list of my labels: ", labels);
    // revers sort of otu_ids
    console.log("This is the list of OTU ids descending: ", data.samples[0].otu_ids.slice(0,10).reverse())
    // third set of sample_values
    console.log("This is the list of sample values:",data.samples[3].sample_values.slice(0,10))
    var samples = data.samples[0].sample_values;
    console.log("These are all the samples:",samples);
    var trace1 = {
        x: data.samples[0].sample_values.slice(0,10).reverse(),
        y: ["OTU 1167", "OTU 2859", "OTU 482", "OTU 2264", "OTU 41", "OTU 1189", "OTU 352", "1OTU 89", "OTU 2318", "OTU 1977"].reverse(),
        // y: ['a','b','c','d','e','f','g','h','i','j'].sort((a, b) => {b-a}),
        // y: labels.reverse(),
        text: data.samples[0].otu_labels,
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace1]
    Plotly.newPlot('bar', data);

    // build bubble chart
    var trace2 = {
        x: otu_ids,
        y: samples,
        mode: 'markers',
        // text: data.samples[0].otu_labels,
        marker: {
            size: samples
        }
    };
    var data2 = [trace2]

    Plotly.newPlot('bubble', data2);

    

    const menu = d3.select("#selDataset");
    droplist.forEach(item => {
        // console.log(item);
        menu.append("option").attr("value", item).text(item);
    })

});

// add dropdown options to html
function menuBuilder(arr) {
    
}

console.log(d3.select("#selDataset"));
// handle menu change
d3.select("#selDataset").on("change", function() {
    let el = this;
    console.log(el);
    let id = d3.select(this).attr("id");
    
    console.log(id, d3.event.target.value, this.value);
});


function filterId() {

}
// build test chart (works but not top 10)
// https://www.tutorialspoint.com/top-n-max-value-from-array-of-object-javascript
// for sorting: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// let sam_vals = samples.samples[0].sample_values.slice(0,10).sort((a,b) => {b-a});
// let otus = samples.samples[0].otu_ids.slice(0,10)
// var labels = otus.map(elem => elem.toString());
// console.log("The top ten otu-id's are", otus);
// console.log("The top ten sample values are", sam_vals);
// console.log(labels);



// var trace1 = {
//     x: samples.samples[0].sample_values.slice(0,10).sort((a, b) => {b-a}),
//     y: labels,
//     // y: samples.samples[0].otu_ids.slice(0,10),
//     text: samples.samples[0].otu_labels,
//     type: 'bar',
//     width: [5,5,5,5,5,5,5,5,5,5],
//     orientation: 'h'
// };

// var data = [trace1];

// var layout = {
//     yaxis: {range: labels.length},
// };

// Plotly.newPlot("bar", data)
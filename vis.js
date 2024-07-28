d3.csv("StudentsPerformance.csv").then(function(data) {
    // Parse the data
    data.forEach(d => {
        d["math score"] = +d["math score"];
        d["reading score"] = +d["reading score"];
        d["writing score"] = +d["writing score"];
    });

    // Initial visualization
    createScene1(data);
    createScene2(data);
    createScene3(data);
});


// Compare the 

function createScene1(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scene1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a grouped bar chart for gender-based performance
    const scores = ["math score", "reading score", "writing score"];
    const genders = ["male", "female"];
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const genderScores = genders.map(gender => {
        const filteredData = data.filter(d => d.gender === gender);
        return scores.map(score => {
            return {
                gender: gender,
                score: score,
                average: d3.mean(filteredData, d => d[score])
            };
        });
    }).flat();

    const x0 = d3.scaleBand()
        .domain(scores)
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(genders)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // Add X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    // Add Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Draw the bars
    svg.selectAll(".bars")
        .data(genderScores)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x0(d.score) + x1(d.gender))
        .attr("y", d => y(d.average))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.average))
        .attr("fill", d => color(d.gender));

    // Annotations
    svg.selectAll(".annotation")
        .data(genderScores)
        .enter()
        .append("text")
        .attr("class", "annotation")
        .attr("x", d => x0(d.score) + x1(d.gender) + x1.bandwidth() / 2)
        .attr("y", d => y(d.average) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.average.toFixed(2));
}


// Scene 2 goal: Look at how the different parental backgrounds impact score.
function createScene2(data) {
    const svg = d3.select("#scene2")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    
    // Implementation for Scene 2
}

function createScene3(data) {
    const svg = d3.select("#scene3")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    
    // Implementation for Scene 3
}

function showScene(sceneNumber) {
    d3.selectAll(".chart-container").style("display", "none");
    d3.select("#scene" + sceneNumber).style("display", "block");
}

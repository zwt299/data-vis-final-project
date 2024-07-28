d3.csv("StudentsPerformance.csv").then(function (data) {
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

// Highlighting takeaways
const takeaways = {
    1: "In slide 1, we see the comparison of male and female scores across three different categories: math, reading, and writing. Both gender groups are of a similar size for the sample taken, and these scores are averaged. Highlighting over each bar will reveal more statistical information. However we can see, in aggregate that male students performed best in mathematics, comparatively better than female students. On the contrary, female students had a tendency to do better than male students in both reading and writing as a whole.",
    2: "In slide 2, we see the comparison of different parental education backgrounds across the three exam categories. There are several immediate notabale takeaways. First, with respect to every group, math was the lowest scoring category. Second, among individuals who had parents partially complete high school and those that had parents finish high school, in aggregate those with parents that did not complete high school fared better on all types of exams than students who had parents that completed high school. Interestingly, but perhaps understandably, students that had parents with a higher level of education generally tended to perform better than their peer counterparts (aside from the aforementioned exception). While it is hard to justify this as a causal relationship, it is likely that parents that complete higher levels of education have higher expectations for children in the context of school. Although, it would be reasonable to note that this difference is not as significant across groups as the gender difference highlighted in slide 1. Another interesting takeaway is that this difference is more muted within the math category than the other two. That is, differences in parental education impacted reading and writing scores more than math scores. It is encouraged that you hover over bars to make your own observations aside from these.",
    3: "In slide 3, we see a comparison of scores across different racial/ethnic groups. The dataset anonymizes these to minimize user bias. There seems to be a notable difference between grouops, with group E performing the best in all categories. Interestingly, group E is also the only group to perform better at math than the other two categories. The groups tend to differ quite a bit with respect to race/ethniciy - however this difference is emphasized most based on math performance. This is interesting because for the parental background, differences tended to be minized between groups when looking at math scores.",
}

function showTakeaways(scene) {
    const content = takeaways[scene];
    document.getElementById("takeaway-content").innerText = content;
}



/**
 * First scene objective: compare scores across the two genders performance on the
 * three exam types. Using a grouped bar chart.
 */
function createScene1(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 900 - margin.top - margin.bottom;

    const svg = d3.select("#scene1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Student Performance by Gender and Subject");


    // Create a grouped bar chart for gender-based performance
    const scores = ["math score", "reading score", "writing score"];
    const genders = ["male", "female"];
    const color = d3.scaleOrdinal().domain(genders).range(["#8084ff", "#fd80ff"]);

    const genderScores = genders.map(gender => {
        const filteredData = data.filter(d => d.gender === gender);
        return scores.map(score => {
            const values = filteredData.map(d => d[score]).sort(d3.ascending);
            const mean = d3.mean(values);
            const sd = d3.deviation(values);
            const q1 = d3.quantile(values, 0.25);
            const q3 = d3.quantile(values, 0.75);
            return {
                gender: gender,
                score: score,
                mean: mean,
                sd: sd,
                q1: q1,
                q3: q3,
                count: values.length
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

    // Add Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw the bars
    svg.selectAll(".bars")
        .data(genderScores)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x0(d.score) + x1(d.gender))
        .attr("y", d => y(d.mean))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.mean))
        .attr("fill", d => color(d.gender))
        .on("mouseover", function (event, d) {
            const [x, y] = d3.pointer(event);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Count: ${d.count}<br>Mean: ${d.mean.toFixed(2)}<br>SD: ${d.sd.toFixed(2)}<br>Q1: ${d.q1.toFixed(2)}<br>Q3: ${d.q3.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Annotations
    svg.selectAll(".annotation")
        .data(genderScores)
        .enter()
        .append("text")
        .attr("class", "annotation")
        .attr("x", d => x0(d.score) + x1(d.gender) + x1.bandwidth() / 2)
        .attr("y", d => y(d.mean) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.mean.toFixed(2));

    // Add Legend
    const legend = svg.selectAll(".legend")
        .data(genders)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 5)
        .attr("y", 0)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text(d => d.charAt(0).toUpperCase() + d.slice(1));
}


/**
 * Second scene objective: compare scores across groups with different parental educations.
 */
function createScene2(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 900 - margin.top - margin.bottom;

    const svg = d3.select("#scene2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Student Performance by Parental level of Education");

    const scores = ["math score", "reading score", "writing score"];
    const parentEducationLevels = ["some high school", "high school", "some college", "associate's degree", "bachelor's degree", "master's degree"];
    const color = d3.scaleOrdinal().domain(parentEducationLevels).range(["#FFE770", "#B8FF70", "#70FF88", "#70FFE7", "#70B8FF", "#8870FF"]);
    
    const educationScores = parentEducationLevels.map(level => {
        const filteredData = data.filter(d => d["parental level of education"] === level);
        return scores.map(score => {
            const values = filteredData.map(d => d[score]).sort(d3.ascending);
            const mean = d3.mean(values);
            const sd = d3.deviation(values);
            const q1 = d3.quantile(values, 0.25);
            const q3 = d3.quantile(values, 0.75);
            return {
                level: level,
                score: score,
                mean: mean,
                sd: sd,
                q1: q1,
                q3: q3,
                count: values.length
            };
        });
    }).flat();

    const x0 = d3.scaleBand()
        .domain(scores)
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(parentEducationLevels)
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

    // Add Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw the bars
    svg.selectAll(".bars")
        .data(educationScores)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x0(d.score) + x1(d.level))
        .attr("y", d => y(d.mean))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.mean))
        .attr("fill", d => color(d.level))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Count: ${d.count}<br>Mean: ${d.mean.toFixed(2)}<br>SD: ${d.sd.toFixed(2)}<br>Q1: ${d.q1.toFixed(2)}<br>Q3: ${d.q3.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Annotations
    svg.selectAll(".annotation")
        .data(educationScores)
        .enter()
        .append("text")
        .attr("class", "annotation")
        .attr("x", d => x0(d.score) + x1(d.level) + x1.bandwidth() / 2)
        .attr("y", d => y(d.mean) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.mean.toFixed(2));

    // Add Legend
    const legend = svg.selectAll(".legend")
        .data(parentEducationLevels)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 5)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
}


/**
 * Third scene objective: compare scores across groups with different racial/ethnic background.
 */
function createScene3(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 900 - margin.top - margin.bottom;

    const svg = d3.select("#scene3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Student Performance by Racial/Ethnic Group");

    const scores = ["math score", "reading score", "writing score"];
    const race = ["group A", "group B", "group C", "group D", "group E"];
    const color = d3.scaleOrdinal().domain(race).range(["#B8FF70", "#70FF88", "#70FFE7", "#70B8FF", "#8870FF"]);
    
    const raceScores = race.map(level => {
        const filteredData = data.filter(d => d["race/ethnicity"] === level);
        return scores.map(score => {
            const values = filteredData.map(d => d[score]).sort(d3.ascending);
            const mean = d3.mean(values);
            const sd = d3.deviation(values);
            const q1 = d3.quantile(values, 0.25);
            const q3 = d3.quantile(values, 0.75);
            return {
                level: level,
                score: score,
                mean: mean,
                sd: sd,
                q1: q1,
                q3: q3,
                count: values.length
            };
        });
    }).flat();

    const x0 = d3.scaleBand()
        .domain(scores)
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(race)
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

    // Add Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Draw the bars
    svg.selectAll(".bars")
        .data(raceScores)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x0(d.score) + x1(d.level))
        .attr("y", d => y(d.mean))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.mean))
        .attr("fill", d => color(d.level))
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Count: ${d.count}<br>Mean: ${d.mean.toFixed(2)}<br>SD: ${d.sd.toFixed(2)}<br>Q1: ${d.q1.toFixed(2)}<br>Q3: ${d.q3.toFixed(2)}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Annotations
    svg.selectAll(".annotation")
        .data(raceScores)
        .enter()
        .append("text")
        .attr("class", "annotation")
        .attr("x", d => x0(d.score) + x1(d.level) + x1.bandwidth() / 2)
        .attr("y", d => y(d.mean) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.mean.toFixed(2));

    // Add Legend
    const legend = svg.selectAll(".legend")
        .data(race)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 5)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
}

function showScene(sceneNumber) {
    d3.selectAll(".chart-container").style("display", "none");
    d3.select("#scene" + sceneNumber).style("display", "block");
    showTakeaways(sceneNumber);
}





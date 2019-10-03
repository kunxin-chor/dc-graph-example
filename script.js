/* global queue */
queue()
           // file type        // the relative filepath to the .json file
    .defer(d3.json, "data/transactions.json" ) // load in a file
    .await(function(error, transactionData){
       
       // STEP 1 - create a cross filter
       let transactionCrossFilter = crossfilter(transactionData);
       
       // STEP 2 - Define 'name' to be the x axis
       // Creating a dimension based on the 'name' property of each data point
       let name_dim = transactionCrossFilter.dimension(dc.pluck('name'));
        
        // STEP 3 - Do the grouping
        // "Grouping" --> summarizing each data point
        let total_spend_per_person = name_dim.group().reduceSum(dc.pluck('spend'));
        
        
        // STEP 3B - Process the line graph data
     
        // define parse_date to be a function that can interpert dates in the dd/mm/yyyy format
        let parse_date = d3.time.format("%d/%m/%Y").parse;
        transactionData.forEach(function(d){
          d.date = parse_date(d.date);
        })   
       
        // create a dimension with x axis being the date 
        let date_dim = transactionCrossFilter.dimension(dc.pluck("date"));
     
        let min_date = date_dim.bottom(1)[0].date;
        let max_date = date_dim.top(1)[0].date;
     
        let total_spend_per_day = date_dim.group().reduceSum(dc.pluck('spend'));
        
     
 /*     
          dc.lineChart('#spending-by-day')
         .width(1000)
         .height(300)
         .dimension(date_dim)
         .group(total_spend_per_day)
         .x(d3.time.scale().domain([min_date, max_date]))
          .xAxisLabel("Month")
          .yAxis().ticks(4);
*/

          dc.lineChart("#spending-by-day")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(date_dim)
            .group(total_spend_per_day)
            .transitionDuration(500)
            .x(d3.time.scale().domain([min_date,max_date]))
            .xAxisLabel("Month")
            .yAxis().ticks(4);
 


        // END STEP 3B

        // STEP 4 - Create the barchart
        dc.barChart("#spending-by-person")
                      .width(300)
                      .height(150)
                      .dimension(name_dim)
                      .group(total_spend_per_person)
                      .transitionDuration(250) 
                      .x(d3.scale.ordinal())
                      .xUnits(dc.units.ordinal)
                      .xAxisLabel("Person")
                      .yAxis().ticks(5);
        
          dc.pieChart('#spending-by-person-pie')
                .height(330)
                .radius(90)
                .transitionDuration(1500)
                .dimension(name_dim)
                .group(total_spend_per_person);
        
        // STEP 5 - Draw the barchart
        dc.renderAll();
    })
    
/*
How this will look like in Axios
 axios.get('data/transactions.json')
    .then(function(response){
        
    })
*/
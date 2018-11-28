  // set your channel id here
  var weatherl_id = 254141;  
  var weather_key = '5ZF2L5L6TU079BB0';
  
  var inHouse_id = 265846;  
  var inHouse_key = 'OUL94JOTKEXHAN33';
  
  var inTermostat_id = 623918;  
  var inTermostat_key = '3T4Y8WPUCTZICPZQ';
  
  var single_gauge_size=160; 
  Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
	          '-',(mm>9 ? '' : '0') + mm,
	          '-',(dd>9 ? '' : '0') + dd
	         ].join('');
	};
  Date.prototype.hhmm = function() {	  	  
	  var hh = this.getHours() ; // getMonth() is zero-based
	  var mm = this.getMinutes();

	  return [hh,':',
	          ,(mm>9 ? '' : '0') + mm
	         ].join('');
	};	
  //--------------------------------------------
  // load the google gauge visualization
  google.charts.load('current', {'packages':['gauge']});
  google.setOnLoadCallback(initGauge);
  
  function initGauge() {
	  // global variables
	  var dataTemper,dataHumm;
	  
	  var dataExtTemper,dataExtHumm,dataExtPress ;
	  var dataBalcTemper ;
	  
	  var optionsTemper,optionsHumm,optionsExtTemper,optionsExtHumm;
	  
	  //charts
	  var chart_temper,chart_humm;  
	  var chart_temper_balcon;
	  var chart_temper_ext,chart_humm_ext,chart_press_ext;
	 dataTemper = google.visualization.arrayToDataTable([
       ['Label', 'Value'],
       ['parent', 0],
       ['children', 0],
       ['kitchen', 0]
     ]);        
     dataHumm = google.visualization.arrayToDataTable([
         ['Label', 'Value'],
         ['parent', 0],
         ['children', 0],
         ['kitchen', 0]
       ]);
     dataBalcTemper = google.visualization.arrayToDataTable([
         ['Label', 'Value'],         
         ['Balc', 0],
       ]);
    dataExtTemper = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Ext', 0],
        ['dht', 0],
      ]);
    
    dataExtHumm= google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Ext', 0],
        ['dht', 0],
      ]);

    
    chart_temper = new google.visualization.Gauge(document.getElementById('temper_div'));
    chart_humm = new google.visualization.Gauge(document.getElementById('humm_div'));

    optionsTemper = {width: 3*single_gauge_size, height: single_gauge_size,min:0, max:35,greenFrom:17,greenTo:23, minorTicks: 5};
    optionsHumm = {width: 3*single_gauge_size, height: single_gauge_size,min:0, max:100,greenFrom:40,greenTo:60, minorTicks: 5};
    
    optionsExtTemper = {width: 2*single_gauge_size, height: single_gauge_size,min:-40, max:40, minorTicks: 5};
    optionsExtHumm=Object.assign({}, optionsHumm);
    optionsExtHumm.width= 2*single_gauge_size;    //
    
    chart_temper_balcon = new google.visualization.Gauge(document.getElementById('temper_balcon_div'));
    
    chart_temper_ext = new google.visualization.Gauge(document.getElementById('temper_ext_div'));
    chart_humm_ext = new google.visualization.Gauge(document.getElementById('humm_ext_div'));    
    
    function fill_table_text(id,count){
    	var table = document.getElementById(id);
        var row = table.insertRow();
        for(var n=0;n!=count;n++){
        	var cell = row.insertCell();    
        	cell.innerHTML = "-:-";
        	cell.style.width = single_gauge_size+'px';
        	cell.style.textAlign="right";
        }
    }
    fill_table_text("temper_update_table",6);
    fill_table_text("humm_update_table",5);
    
    // initialize the chart
    function initData(){
        for(var field=1;field<=4;field++){
            $.getJSON('https://api.thingspeak.com/channels/' + inHouse_id + '/fields/' +field+ '/last.json?api_key=' + inHouse_key, function(data) {      
                  displayDataInternal(data);      
             });
        }
        for(var field=1;field<=6;field++){
            $.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/fields/' +field+ '/last.json?api_key=' + weather_key, function(data) {     
                displayDataExternal(data);      
             });
        }
    }
    
    initData(); //request each field
    // display the data
    function updated(tableid,cell,created_at){
    	var cells=document.getElementById(tableid).rows[0].cells
    	var recordDate=new Date(created_at);
    	var today= new Date();
    	if(( today.getDate()==recordDate.getDate())
    		&&(today.getMonth()==recordDate.getMonth()))//print short date
    		cells[cell].innerHTML=recordDate.hhmm();
		else
    		cells[cell].innerHTML=recordDate.yyyymmdd()+" "+recordDate.hhmm();//may some error see last update	
    }
    
    function displayDataInternal(data) {
  	 if(data){  		
  	 		if(data.field1){
  	 			dataTemper.setValue(0, 1, data.field1);
  	 			updated("temper_update_table",2,data.created_at);
  	 		}
  	 		if(data.field2){
  	 			dataHumm.setValue(0, 1, data.field2);
  	 			updated("humm_update_table",2,data.created_at);
  	 		}
  	 		if(data.field3){
  	 			dataTemper.setValue(1, 1, data.field3);
  	 			updated("temper_update_table",3,data.created_at);
  	 		}
  	 		if(data.field4){
  	 			dataHumm.setValue(1, 1, data.field4);
  	 			updated("humm_update_table",3,data.created_at);
  	 		}
  	 	}
      chart_temper.draw(dataTemper, optionsTemper);    
      chart_humm.draw(dataHumm, optionsHumm);    
      }

    function displayDataExternal(data) {	    
  	 if(data){
  	 		if(data.field1){
  	 			dataBalcTemper.setValue(0, 1, data.field1);
  	 			updated("temper_update_table",5,data.created_at);
  	 		}
  	 		if(data.field3){
  	 			dataExtTemper.setValue(0, 1, data.field3);
  	 			updated("temper_update_table",0,data.created_at);
  	 		}
  	 		if(data.field4){
  	 			dataExtHumm.setValue(0, 1, data.field4);
  	 			updated("humm_update_table",0,data.created_at);
  	 		}
  	 		if(data.field5){
  	 			dataExtTemper.setValue(1, 1, data.field5);
  	 			updated("temper_update_table",1,data.created_at);
  	 		}
  	 		if(data.field6){
  	 			dataExtHumm.setValue(1, 1, data.field6);
  	 			updated("humm_update_table",1,data.created_at);
  	 		}
  	 	}
  	  chart_temper_balcon.draw(dataBalcTemper, optionsExtTemper);
  	  chart_temper_ext.draw(dataExtTemper, optionsExtTemper);
  	  chart_humm_ext.draw(dataExtHumm, optionsExtHumm);  	  
  	}
    function displayDataTermostat(data){
   	 if(data){  		
	 		if(data.field1){
	 			dataTemper.setValue(2, 1, data.field1);
	 			updated("temper_update_table",4,data.created_at);
	 		}
	 		if(data.field2){
	 			dataHumm.setValue(2, 1, data.field2);
	 			updated("humm_update_table",4,data.created_at);
	 		}	 		
	 	}
   chart_temper.draw(dataTemper, optionsTemper);    
   chart_humm.draw(dataHumm, optionsHumm);    
    }
    // load the data
    this.loadData= function() {    
      // get the data from thingspeak
      $.getJSON('https://api.thingspeak.com/channels/' + inHouse_id + '/feed/last.json?api_key=' + inHouse_key, function(data) {    	
      	displayDataInternal(data);      
      });
      $.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/feed/last.json?api_key=' + weather_key, function(data) {
      	displayDataExternal(data);
      });
      $.getJSON('https://api.thingspeak.com/channels/' + inTermostat_id + '/feed/last.json?api_key=' + inTermostat_key, function(data) {
        	displayDataTermostat(data);
        });
    };
    this.loadData();
    var obj=this;
    setInterval(obj.loadData(), 6000);
  }


  // CHARts today------------------------------------------------------------
  google.charts.load('current', {'packages':['line','corechart']});
  google.charts.setOnLoadCallback(drawCharts);
  
  function drawCharts(){
	  drawToday(); 
	  drawext_temper_press();
	  drawext_temper_30days();
	  draw_termostat();
  } 
  // CHARts ------------------------------------------------------------
      function drawToday() {
    	  var dataToday;
    	  var chartToday;
    	  var fromDate;
        dataToday =new google.visualization.arrayToDataTable([
          [{label:'yesterday' ,type: 'datetime'}, {label:'yesterday' ,type: 'number'}, {label:'today' ,type: 'number'}],
        ]);
	

        var options = {
          title: 'Temperature',
          curveType: 'function',
          legend: { position: 'top' },
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'Temps (Celsius)'}
          },
          series: {
        	  0:{lineDashStyle: [4, 2]}
          },
          colors: ['navy', 'navy'],
          chartArea: {
              backgroundColor: {
                fill: '#FFFFFF',
              },
            },
          backgroundColor:{
              fill: '#ddd',
          }
        };

        chartToday = new google.visualization.LineChart(document.getElementById('today'));

     
	fromDate = new Date();
	fromDate.setDate(fromDate.getDate() -1);
	fromDate.setMinutes(0);
	fromDate.setSeconds(0);
	
	for(var i=0;i<24;i++){
		var hour=new Date(fromDate);
		hour.setHours(i);
		dataToday.addRow([hour,null,null]);
	}
  	var fromDateStr=fromDate.yyyymmdd();
	$.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/fields/3.json?average=60&timezone=Europe/Kiev&round=1&start='+fromDateStr+'%2000:00:00'+'&api_key=' + weather_key, function(reply) {
		var dayToday=(new Date()).getDate();
		reply.feeds.forEach(function(element) {
			var recordDate=new Date(element.created_at);			
			dataToday.setValue(recordDate.getHours(), (dayToday==recordDate.getDate())?2:1, element.field3)						
		});				
	  chartToday.draw(dataToday, options);
	});
	
		chartToday.draw(dataToday, options);
      }

   // CHARts ext_temper_press------------------------------------------------------------
 
      function drawext_temper_press() {
	     var dayCount=7;     
          var chartDiv = document.getElementById('ext_temper_press');

          var data = new google.visualization.DataTable();
          data.addColumn('datetime', 'Month');
          data.addColumn('number', "Temperature");
          data.addColumn('number', "Pressure");
               
          var classicOptions = {
            title: 'Temperatures and Pressure',
            // Gives each series an axis that matches the vAxes number below.
            series: {
              0: {targetAxisIndex: 0},
              1: {targetAxisIndex: 1}
            },
            vAxes: {
              // Adds titles to each axis.
              0: {title: 'Temps (Celsius)'},
              1: {title: 'Pressure'}
            },
            chartArea: {
                backgroundColor: {
                  fill: '#FFFFFF',                  
                },
              },            
            backgroundColor: {
                fill: '#ddd',                
            }            
          };

    	fromDate = new Date();
    	fromDate.setDate(fromDate.getDate() -dayCount);
    	fromDate.setMinutes(0);
    	fromDate.setSeconds(0);
    	fromDate.setMilliseconds(0);
  		for(var i=0;i<24*dayCount;i++){
  			var hour=new Date(fromDate);
  			hour.setHours(fromDate.getHours()+i);
  			data.addRow([hour,null,null]);
		}
	    var classicChart = new google.visualization.LineChart(chartDiv);
	    classicChart.draw(data, classicOptions);

		$.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/fields/3.json?average=60&timezone=Europe/Kiev&round=1&start='+fromDate.yyyymmdd()+'%2000:00:00'+'&api_key=' + weather_key, function(reply) {
	
			reply.feeds.forEach(function(element) {
				var recordDate=new Date(element.created_at);
				var foundRows = data.getFilteredRows([{column: 0, value: recordDate}]);
				if(foundRows.length){
					data.setValue(foundRows[0], 1, element.field3);
				}
			});
		  classicChart.draw(data, classicOptions);
		});
		$.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/fields/2.json?average=60&timezone=Europe/Kiev&round=1&start='+fromDate.yyyymmdd()+'%2000:00:00'+'&api_key=' + weather_key, function(reply) {
			reply.feeds.forEach(function(element) {
				var recordDate=new Date(element.created_at);
				var foundRows = data.getFilteredRows([{column: 0, value: recordDate}]);
				if(foundRows.length){
					data.setValue(foundRows[0], 2, element.field2);
				}
			});	
		  classicChart.draw(data, classicOptions);
		});
      }
		

   // CHARts ext_temper_30days------------------------------------------------------------
 
      function drawext_temper_30days() {
	     var dayCount=30;
	     fromDate = new Date();
    	 fromDate.setDate(fromDate.getDate() -dayCount);
    	 fromDate.setHours(9);
    	 fromDate.setMinutes(0);
    	 fromDate.setSeconds(0);
    	 fromDate.setMilliseconds(0);
          var chartDiv = document.getElementById('ext_temper_30days');

          var data = new google.visualization.DataTable();
          data.addColumn('date', 'Month');
          data.addColumn('number', "Max Day");
          data.addColumn({type: 'string', role: 'annotation'});
          data.addColumn('number', "Min Night");	 
          data.addColumn({type: 'string', role: 'annotation'});
               
          var classicOptions = {
            title: 'Day/Night Temperatures ['+fromDate.yyyymmdd()+'-> today]',
            colors: ['red', 'navy'],
            legend: { position: 'top' },
            vAxes: {
              // Adds titles to each axis.
              0: {title: 'Temps (Celsius)'}	              
            },            
            chartArea: {
                backgroundColor: {
                  fill: '#FFFFFF',                  
                },
              },            
            backgroundColor: {
                fill: '#ddd',                
            }
              
          };
    	
  		for(var i=0;i<=dayCount;i++){
  			var day=new Date(fromDate);
  			day.setDate(fromDate.getDate()+i);
  			data.addRow([day,null,null,null,null]);
		}
	    var classicChart = new google.visualization.LineChart(chartDiv);
	    classicChart.draw(data, classicOptions);

		$.getJSON('https://api.thingspeak.com/channels/' + weatherl_id + '/fields/3.json?timezone=Europe/Kiev&round=1&start='+fromDate.yyyymmdd()+'%2000:00:00'+'&api_key=' + weather_key, function(reply) {
	  		for(var i=0;i<=dayCount;i++){
	  			var dayBeg=new Date(fromDate);
	  			dayBeg.setDate(fromDate.getDate()+i);
	  			var dayEnd=new Date(dayBeg);
	  			dayEnd.setDate(dayEnd.getDate()+1);
	  			
	  			function checkday(element) {
	  				var recordDate=new Date(element.created_at);
	  				if(recordDate>=dayBeg && recordDate<dayEnd)return true
	  				return false;
	  				}	  			
	  			var dataDay=reply.feeds.filter(checkday).sort(function(a, b){return b.field3 - a.field3});
	  			if(dataDay.length){//if present any elements
	  				data.setValue(i,1,dataDay[0].field3);
	  				data.setValue(i,2,dataDay[0].field3);
	  			    data.setValue(i,3,dataDay[dataDay.length-1].field3);
	  			    data.setValue(i,4,dataDay[dataDay.length-1].field3);	  			  
	  			}
	  			}
		  classicChart.draw(data, classicOptions);
		});		
    }
      
      function draw_termostat() {
 	     var dayCount=7;     
         var chartDiv = document.getElementById('ext_termostat');

       var data = new google.visualization.DataTable();
       data.addColumn('datetime', 'Month');
       data.addColumn('number', "floor");
       data.addColumn('number', "set");
                
       var classicOptions = {
         title: 'termostat',
         // Gives each series an axis that matches the vAxes number below.
         series: {
           0: {targetAxisIndex: 0},
           1: {targetAxisIndex: 0}
         },
         vAxes: {
           // Adds titles to each axis.
           0: {title: 'Temps (Celsius)'}               
         },
         chartArea: {
             backgroundColor: {
               fill: '#FFFFFF',                  
             },
           },            
         backgroundColor: {
             fill: '#ddd',                
         }            
       };

     	fromDate = new Date();
     	fromDate.setDate(fromDate.getDate() -dayCount);
     	fromDate.setMinutes(0);
     	fromDate.setSeconds(0);
     	fromDate.setMilliseconds(0);
//   		for(var i=0;i<24*dayCount;i++){
//   			var hour=new Date(fromDate);
//   			hour.setHours(fromDate.getHours()+i);
//   			data.addRow([hour,null,null]);
// 		}
 	    var classicChart = new google.visualization.LineChart(chartDiv);
 	    //classicChart.draw(data, classicOptions);

 		$.getJSON('https://api.thingspeak.com/channels/' + inTermostat_id + '/feed.json?timezone=Europe/Kiev&round=3&start='+fromDate.yyyymmdd()+'%2000:00:00'+'&api_key=' + inTermostat_key, function(reply) { 	
 			reply.feeds.forEach(function(element) {
 				var recordDate=new Date(element.created_at); 				
 				data.addRow([recordDate,Number(element.field3),Number(element.field4)]);
 			});
 		  classicChart.draw(data, classicOptions);
 		});
       }

define([
            'jquery',
            'underscore',
            'api/SplunkVisualizationBase',
            'api/SplunkVisualizationUtils',
			'performance_analysis',
			'moment'
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            SplunkVisualizationUtils
        ) {
  
    return SplunkVisualizationBase.extend({
 
        initialize: function() {
            // Save this.$el for convenience
            this.$el = $(this.el);
            // Add a css selector class
            this.$el.addClass('performance_analysis');
        },
 
        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                count: 10000
            });
    },
	
	formatData: function(data, config) {
    
		// Check for an empty data object
		if(data.rows.length < 1){
			return false;
		}
		// We need a minimum of 3 fields returned
		if(data.fields.length < 3){
			throw new SplunkVisualizationBase.VisualizationError("Missing values. Please include the following fields in your search query: name, value, result");
		}
		
		//Make sure we have the following: _time, name, value, result
		var i = 0;
		var allFieldsThere = true
		for(i=0; i<data.fields.length; i++){
			if(data.fields[i].name!="_time" && data.fields[i].name!="name" && data.fields[i].name!="value" && data.fields[i].name!="result"){
				allFieldsThere = false;
			}
		}
		
		// Check for invalid data
		if(!allFieldsThere){
			throw new SplunkVisualizationBase.VisualizationError('Missing values. Please include the following fields in your search query: name, value, result');
		}
		return data;
	},
 
 
 

 
	 /**
	 * To be called from the visualization's click handler, after computing the
	 * correct time range from the target of the click.
	 *
	 * @param earliestTime - the lower bound of the time range,
	 *          can be an ISO-8601 timestamp or an epoch time in seconds.
	 * @param latestTime - the upper bound of the time range,
	 *          can be an ISO-8601 timestamp or an epoch time in seconds.
	 * @param browserEvent - the original browser event that caused the drilldown
	 *
	 * example usage:
	 *
	 * this.drilldownToTimeRange('1981-08-18T00:00:00.000-07:00', '1981-08-19T00:00:00.000-07:00', e);
	 */
	drilldownToTimeRange: function(earliestTime, latestTime, browserEvent) {
		this.drilldown({
			earliest: earliestTime,
			latest: latestTime
		}, browserEvent);
	},
 
 
	updateView: function(data, config) {
		// Return if no data
        if (!data) {
            return;
        }
       
        // Assign datum to the data object returned from formatData
        if (!data.meta.done) return;
		//	return;

        // Clear the div
        this.$el.empty();
 
		//this.$el.class="transaction_analysis";
		
		//var trans_analysis = require("performance_analysis");
		const { performance_analysis, item, time_bucket } = require('performance_analysis');
		
		// Get Config parameters:
		var granularity = parseFloat(config[this.getPropertyNamespaceInfo().propertyNamespace + 'granularity']) || 15;
		var okColour = config[this.getPropertyNamespaceInfo().propertyNamespace + 'okColour'] || "#78B24A";
		var warningColour = config[this.getPropertyNamespaceInfo().propertyNamespace + 'warningColour'] || "#E0C135";
		var criticalColour = config[this.getPropertyNamespaceInfo().propertyNamespace + 'criticalColour'] || "#DD0000";
		var noDataColour = config[this.getPropertyNamespaceInfo().propertyNamespace + 'noDataColour'] || "#5EBFC6";		
		var warningThreshold = parseFloat(config[this.getPropertyNamespaceInfo().propertyNamespace + 'warningThreshold']) || 8;
		var criticalThreshold = parseFloat(config[this.getPropertyNamespaceInfo().propertyNamespace + 'criticalThreshold']) || 12;
		var timeFormat = config[this.getPropertyNamespaceInfo().propertyNamespace + "timeFormat"] || "h:mm A";
		var downTimeStart = parseFloat(config[this.getPropertyNamespaceInfo().propertyNamespace + "downTimeStart"]) || 0;
		var downTimeEnd = parseFloat(config[this.getPropertyNamespaceInfo().propertyNamespace + "downTimeEnd"]) || 0;
		var showLegend = config[this.getPropertyNamespaceInfo().propertyNamespace + showLegend] || true;
		
		// Now load the visualisation
		var perfAnalysisVis = new performance_analysis(granularity, warningThreshold, criticalThreshold, downTimeStart,downTimeEnd,timeFormat,showLegend);
		
		perfAnalysisVis.set_colours(okColour,warningColour,criticalColour,noDataColour);
		var vizObj = this
		perfAnalysisVis.setData(data);
		this.$el.html(perfAnalysisVis.getHTML());
		var cells = document.getElementsByClassName("jds_ta_clickable");
		var i = 0;
		
		for(i=0;i<cells.length;i++){
			cells[i].onclick = function(){vizObj.drilldownToTimeRange(this.getAttribute("start_time"), this.getAttribute("end_time"), event);}
			cells[i].className.replace(/jds_ta_clickable/,'');
		}
    }
    });
});




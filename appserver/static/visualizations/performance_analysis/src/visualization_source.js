define([
		'jquery',
		'underscore',
		'api/SplunkVisualizationBase',
		'api/SplunkVisualizationUtils',
		'splunkjs/mvc',
		'performance_analysis',
		'moment',
		'tooltip',
	],
	function (
		$,
		_,
		SplunkVisualizationBase,
		SplunkVisualizationUtils,
		mvc) {

	return SplunkVisualizationBase.extend({

		initialize: function () {
			// Save this.$el for convenience
			this.$el = $(this.el);
			// Add a css selector class
			this.$el.addClass('performance_analysis');
		},

		getInitialDataParams: function () {
			return ({
				outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
				count: 10000
			});
		},

		formatData: function (data, config) {

			// Check for an empty data object
			if (data.rows.length < 1) {
				return false;
			}
			// We need a minimum of 3 fields returned
			if (data.fields.length < 3) {
				throw new SplunkVisualizationBase.VisualizationError("Missing values. Please include the following fields in your search query: name, value, status");
			}

			//Make sure we have the following: _time, name, value, status
			var i = 0;
			var hasName = false;
			var hasTime = false;
			var hasStatus = false;
			var hasValue = false;
			for (i = 0; i < data.fields.length; i++) {
				if (data.fields[i].name == "_time")
					hasTime = true;
				if (data.fields[i].name == "status")
					hasStatus = true;
				if (data.fields[i].name == "value")
					hasValue = true;
				if (data.fields[i].name == "name")
					hasName = true;
			}

			// Check for invalid data
			if (!(hasTime && hasStatus && hasValue && hasName)) {
				throw new SplunkVisualizationBase.VisualizationError('Missing values. Please include the following fields in your search query: name, value, status. E.g. ...| table _time, name, value, status, threshold_warning, threshold_critical');
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
		drilldownToTimeRange: function (earliestTime, latestTime, browserEvent) {
			this.drilldown({
				earliest: earliestTime,
				latest: latestTime
			}, browserEvent);
		},

		drilldownToTimeRangeAndCategory: function(earliestTime, latestTime, categoryName, categoryValue, browserEvent) {
			var data = {};
			data[categoryName] = categoryValue;

			this.drilldown({
				action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
				data: data,
				earliest: earliestTime,
				latest: latestTime
			}, browserEvent);
		},
		
		setTokens: function(aTokens){
			for (var key in aTokens) {
				this._setToken(key, aTokens[key]);
			}
		},
		
		_setToken : function(name, value) {
			var defaultTokenModel = mvc.Components.get('default');
			if (defaultTokenModel) {
				defaultTokenModel.set(name, value);
			}
			var submittedTokenModel = mvc.Components.get('submitted');
			if (submittedTokenModel) {
				submittedTokenModel.set(name, value);
			}
		},
		
		
		updateView: function (data, config) {
			// Return if no data
			if (!data) {
				return;
			}

			// Assign datum to the data object returned from formatData
			if (!data.meta.done)
				return;
			//	return;

			// Clear the div
			this.$el.empty();

			//this.$el.class="transaction_analysis";

			//var trans_analysis = require("performance_analysis");
			const performance_analysis = require('performance_analysis');
			const Tooltip = require('tooltip');
			var tip = Tooltip();

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
			var showLegend = config[this.getPropertyNamespaceInfo().propertyNamespace + "showLegend"] || true;
			var showStatusAsText = config[this.getPropertyNamespaceInfo().propertyNamespace + "showStatusAsText"] || true;
			// Get Token names
			var tokenName = config[this.getPropertyNamespaceInfo().propertyNamespace + 'tokenName'] || "pa_name";
			var tokenEarliest = config[this.getPropertyNamespaceInfo().propertyNamespace + 'tokenName'] || "pa_earliest";
			var tokenLatest = config[this.getPropertyNamespaceInfo().propertyNamespace + 'tokenName'] || "pa_latest";
			// Now load the visualisation
			var perfAnalysisVis = new performance_analysis.performance_analysis(granularity, warningThreshold, criticalThreshold, downTimeStart, downTimeEnd, timeFormat, showLegend, showStatusAsText);

			perfAnalysisVis.set_colours(okColour, warningColour, criticalColour, noDataColour);
			var vizObj = this
				perfAnalysisVis.setData(data);
			this.$el.html(perfAnalysisVis.getHTML());
			var cells = document.getElementsByClassName("jds_ta_clickable");
			var i = 0;
			
			for (i = 0; i < cells.length; i++) {
				tokenName +="";
			
			/*	cells[i].onclick = function () {
					//vizObj.drilldownToTimeRange(this.getAttribute("start_time"), this.getAttribute("end_time"), event);
					var tokens={tokenName: this.getAttribute("value"), tokenEarliest:this.getAttribute("start_time"), tokenLatest:this.getAttribute("end_time")};
					vizObj.setTokens(tokens);
					vizObj.drilldownToTimeRangeAndCategory(this.getAttribute("start_time"), this.getAttribute("end_time"),this.getAttribute("category"),this.getAttribute("value"), event);
				}
			*/	
				//----------------------
				
				var eventData = {
					tokenName: this.getAttribute("value"),
					tokenEarliest: this.getAttribute("start_time"),
					tokenLatest: this.getAttribute('end_time')
				};

				$('.jds_ta_clickable').on("click", eventData, function(e){
						vizObj.setTokens(eventData);
						vizObj.drilldownToTimeRangeAndCategory(this.getAttribute("start_time"), this.getAttribute("end_time"),this.getAttribute("category"),this.getAttribute("value"), event);
					return false;
				});
								//----------------------
				
				
				
				cells[i].className.replace(/jds_ta_clickable/, '');
			}
			//$('[data-toggle="tooltip"]').tooltip();
		}
	});
});

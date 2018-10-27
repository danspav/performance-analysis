Daniel Spavin
daniel@spavin.net

# Version Support #
7.2, 7.1, 7.0, 6.6

# What does the app do? #
The Performance Analysis Visualization allows you to compare two related metrics over time in a tabular format. Use cases include comparing your infrastructure and application health, showing performance and availability of synthetic monitoring scripts, and tracking build status vs code commits over time. This app provides a visualization that you can use in your own apps and dashboards. 

# Who is this app for? #
- This app is for anyone who wants to show how two related metrics vary over time in a tablular format.


# How does the app work? #
- This app provides a visualization that you can use in your own apps and dashboards.
- To use it in your dashboards, simply install the app, and create a search that provides the following fields: _time, name, value, status


# Usecases for the Performance Analysis Visualization: #
1. Displaying both infrastructure and application health over time
2. Showing both performance and availability of transactions from a selenium script (Application Performance Monitoring)
3. Monitoring Application health and exceptions over the past day or week
4. Tracking the number of code commits vs build status over time


### The following fields can be used in the search: ###
- _time (required): the time field for the events.
- name (required): The label for each row of the table. This usually represents the server name.
- value (required): The numeric value of the primary metric - e.g. CPU %. This will determine the colour of the cells.
- status (required): This represents the secondary metric - e.g. Application health. Status is used to create the icon or numeric value. Can be textual: GREEN / AMBER / RED, or numeric: 12.22. If you don't want to show a status, you can set this to "" (...| eval staus="" |...)
- warning_threshold (optional): This value determines when the cell background color changes from GREEN to AMBER. You can set a different warning_threshold for each name, or use the default settings.
- critical_threshold (optional): This value determines when the cell background color changes from AMBER to RED. You can set a different critical_threshold for each name, or use the default settings.



### Example Search ###
index=_internal earliest = -24h@h group=*| rename group as name, date_second as value, date_minute as status | table _time, name, value, status

A sample data set is included with the app:

| inputlookup sample-data.csv

# Release Notes #
## v 1.0.0 ##
- Initial version
- Works with dark mode in Splunk 7.2
- Tested in IE, Firefox, Chrome, and Edge


# Possible Issues #
- No issues have been raised. If you have a bug report, please contact daniel@spavin.net


# Privacy and Legal #
- No  personally identifiable information is logged or obtained in any way through this visualizaton.



# For support #
- Send email to daniel@spavin.net
- Support is not guaranteed and will be provided on a best effort basis.
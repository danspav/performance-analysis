cd /opt/splunk/etc/apps/performance_analysis
git pull
cd appserver/static/visualizations/performance_analysis
npm run build
/opt/splunk/bin/splunk restart


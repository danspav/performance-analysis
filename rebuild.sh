#!/bin/bash
export SPLUNK_HOME=/splunk
export GIT_HOME=/splunk/git
export APP_DIR_NAME=performance-analysis
export SPLUNK_APP_DIR_NAME=performance-analysis
export SPLUNK_VIZ_DIR_NAME=performance_analysis

 bump=`cat $SPLUNK_HOME/var/run/splunk/push-version.txt`
 echo "Current version: $bump"
 let bump++
 echo -n $bump > $SPLUNK_HOME/var/run/splunk/push-version.txt
 echo "New version:  $bump"

cd $GIT_HOME/$APP_DIR_NAME
# git pull
cd $GIT_HOME/$APP_DIR_NAME/appserver/static/visualizations/$SPLUNK_VIZ_DIR_NAME
npm run build
rm -rf $SPLUNK_HOME/etc/apps/$SPLUNK_APP_DIR_NAME
mkdir $SPLUNK_HOME/etc/apps/$SPLUNK_APP_DIR_NAME
cp -R $GIT_HOME/$APP_DIR_NAME/* $SPLUNK_HOME/etc/apps/$SPLUNK_APP_DIR_NAME
# chown -R splunk:splunk /opt/splunk
#/opt/splunk/bin/splunk restart
cd $GIT_HOME/$APP_DIR_NAME
python3 ./restart.py

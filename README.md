ks-notify : send out notifications based on Kickstarter backer/pledge levels.

Note: this does not run automatically. It is designed to run from cron or another periodic tool. It's up to you to not abuse Kickstarter by checking too frequently.

To install:

* npm install
* copy config/sample.js to config/index.js
* edit config/index.js and set your Kickstarter and Slack information
* Add a crontab entry to run periodically: node ksnotify.js


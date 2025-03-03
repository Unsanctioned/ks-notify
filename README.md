ks-notify : send out notifications based on Kickstarter backer/pledge levels.

Note: this does not run automatically. It is designed to run from cron or another periodic tool. It's up to you to not abuse Kickstarter by checking too frequently.

To install:

* npm install
* copy config/sample.js to config/index.js
* edit config/index.js and set your Kickstarter and Slack information
* Add a crontab entry to run periodically: node ksnotify.js

Setting up your Slack webhook:

* Go to your Slack administrative webpage (https://<workspace>.slack.com/admin
* Select the "Configure Apps" option in the left-side menu
* Select "Custom Integrations"
* Click on "Incoming WebHooks"
* Click the "Add to Slack" button
* Choose your settings and Save Settings. The channel and username that you select can be changed in the configuration (above).
* Copy the Webhook URL
* Enter the Webhook URL into your index.json configuration file


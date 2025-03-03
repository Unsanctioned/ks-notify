const request  = require('request'),
      jsonfile = require('jsonfile'),
      fs       = require('fs'),
      numeral  = require('numeral'),
      config   = require('./config');

const STATUS_FILE='/tmp/' + config.projectName.replace('/', '_') + '.status.json';

function post_slack_message(msg, backers, pledged) {
	if (!msg)
	{
		return;
	}
	msg = msg.replace('${BACKERS}', backers);
	msg = msg.replace('${PLEDGED}', pledged);

	// use webhook
	let webhook_payload = {
		'text': msg,
		'username': config.slack.username,
		'channel': config.slack.channel,
		'icon_emoji': config.slack.iconEmoji
	};
	request.post({url: config.slack.webhook_url, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(webhook_payload)}, function(error, response, body) {
		if (!error) {
			if (response.statusCode != 200) {
				console.log(`Response headers: ${JSON.stringify(response.headers)}`);
				console.log(`Response body: ${response.body}`);
			} else {
				console.log(`Slack status response: ${response.statusCode} ${response.statusMessage}`);
			}
		} else {
			console.log(`Slack posting error: ${error}`);
		}

	});
}

function post_notifications(pledgeMessage, backerMessage, backers, pledged) {
	if (pledgeMessage != '') {
		post_slack_message(pledgeMessage, backers, pledged);
	}
	if (backerMessage) {
		post_slack_message(backerMessage, backers, pledged);
	}
}

function process_response(status, body) {
	var project = body.project;
	if (project.id == config.projectId) {
		var pledgeUpdateMessage = '';
		var backerUpdateMessage = '';
		var idx = 0;
		var pledged_currency = numeral(project.pledged).format('$0,0.00'); // TODO: currency symbol based on currency code
		for (idx in config.backerTargets) {
			var backer_target = config.backerTargets[idx];
			if (project.backers_count >= backer_target.count && status.backers < backer_target.count) {
				//console.log("Hit backer target at " + project.backers_count + " for target " + backer_target.count);
				status.backers = project.backers_count;
				backerUpdateMessage = (backer_target.message == 'DEFAULT') ? config.slack.message : backer_target.message;
			} else {
				// Ignored - less than target count or already triggered
			}
		}
		for (idx in config.pledgeTargets) {
			var pledge_target = config.pledgeTargets[idx];
			if (project.pledged >= pledge_target.amount && status.pledged < pledge_target.amount) {
				//console.log("Hit pledge target at " + project.pledged + " for target " + pledge_target.amount);
				status.pledged = project.pledged;
				pledgeUpdateMessage = (pledge_target.message == 'DEFAULT') ? config.slack.message : pledge_target.message;
			} else {
							// Ignored - less than target amount or already triggered
			}
		}
		if (pledgeUpdateMessage != '' || backerUpdateMessage != '') {
			// send out pledge target update
			jsonfile.writeFile(STATUS_FILE, status, function(err) {
				if (err) {
					// error writing status file
					console.log('ERROR: failed to save status file');
				} else {
					post_notifications(pledgeUpdateMessage, backerUpdateMessage, project.backers_count, pledged_currency);
				}
			});
		}
	} else {
		// Ignore project that isn't the one we're watching
	}
}

function check(status) {
	var ksURL=`https://www.kickstarter.com/projects/${config.projectName}/stats.json?v=1`;
	//console.log(`Requesting from ${ksURL}`);
	let headers={
		'Pragma': 'no-cache',
		'Cache-Control': 'no-cache',
		'Dnt': 1,
	};
	request({ 'url': ksURL, 'method' : 'GET', 'headers': headers, 'json': true }, function (error, response, body) {
		if (!error) {
			if (response.statusCode == 200) {
				process_response(status, body);
			} else {
				console.log(`Error retrieving project stats from Kickstarter. Status ${response.statusCode} ${response.statusMessage}`);
				console.log(`Reponse headers: ${JSON.stringify(response.headers)}`);
				console.log(`Reponse body: ${response.body}`);
			}
		} else {
			console.log(`Error requesting data from Kickstarter: ${error}`);
		}
	});
}

function main() {
	fs.access(STATUS_FILE, fs.R_OK, (err) => {
		if (err) {
			//console.log("No status file - creating " + STATUS_FILE);
			// file doesn't exist
			obj = {'backers' : 0, 'pledged' : 0};
			jsonfile.writeFile(STATUS_FILE, obj, function(err) {
				if (err) {
					// error writing status file
					console.log(`ERROR: failed to save status file: ${err}`);
				} else {
					check(obj);
				}
			});
		} else {
			jsonfile.readFile(STATUS_FILE, function(err, obj) {
				if (err) {
					console.log('ERROR: failed to read status file');
				} else {
					check(obj);
				}
			});
		}
	});
}

main();


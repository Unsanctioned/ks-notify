const request  = require('request'),
      jsonfile = require('jsonfile'),
      fs       = require('fs'),
      config   = require('./config');

const STATUS_FILE='/tmp/' + config.projectName + '.status.json';
const STATUS_MESSAGE=config.slack.message || ':tophat: Kickstarter update: ${BACKERS} backers, $${PLEDGED} pledged!'

function post_slack_message(backers, pledged) {
	var msg = STATUS_MESSAGE.replace('${BACKERS}', backers);
	msg = msg.replace('${PLEDGED}', pledged);
	request.post('https://slack.com/api/chat.postMessage', {form:{'token':config.slack.token,'channel':config.slack.channel,'text':msg, 'as_user':false, 'username':config.slack.username, 'icon_emoji':config.iconEmoje}}, function(error, response, body) {
	});
}

function check(status) {
	var ksURL='https://www.kickstarter.com/projects/search.json?search=&term=' + config.projectName;
	request({ 'url': ksURL, 'method' : 'GET', 'json' : true }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			for (var projectIdx in body.projects) {
				var project = body.projects[projectIdx];
				if (project.id == config.projectId) {
					var sendUpdate = false;
					var idx = 0;
					for (idx in config.backerTargets) {
						var backer_target = config.backerTargets[idx];
						if (project.backers_count >= backer_target && status.backers < backer_target) {
							console.log("Hit backer target at " + project.backers_count + " for target " + backer_target);
							status.backers = project.backers_count;
							sendUpdate = true;
						} else {
							// Ignored - less than target count or already triggered
						}
					}
					for (idx in config.pledgeTargets) {
						var pledge_target = config.pledgeTargets[idx];
						if (project.pledged >= pledge_target && status.pledged < pledge_target) {
							console.log("Hit pledge target at " + project.pledged + " for target " + pledge_target);
							status.pledged = project.pledged;
							sendUpdate = true;
						} else {
							// Ignored - less than target amount or already triggered
						}
					}
					if (sendUpdate) {
						jsonfile.writeFile(STATUS_FILE, status, function(err) {
							if (err) {
								// error writing status file
								console.log('ERROR: failed to save status file');
							} else {
								post_slack_message(project.backers_count, project.pledged);
							}
						});
					}
				} else {
					// Ignore project that isn't the one we're watching
				}
			}
		} else if (error) {
			console.log("KS error was " + error);
		} else {
			console.log("KS status was " + response.statusCode);
		}
	});
}

function main() {
	fs.access(STATUS_FILE, fs.R_OK, (err) => {
		if (err) {
			console.log("No status file - creating " + STATUS_FILE);
			// file doesn't exist
			obj = {'backers' : 0, 'pledged' : 0};
			jsonfile.writeFile(STATUS_FILE, obj, function(err) {
				if (err) {
					// error writing status file
					console.log('ERROR: failed to save status file');
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


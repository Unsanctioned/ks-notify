const request  = require('request'),
      jsonfile = require('jsonfile'),
      fs       = require('fs'),
      numeral  = require('numeral'),
      config   = require('./config');

const STATUS_FILE='/tmp/' + config.projectName + '.status.json';

function get_slack_channel_id(channel_name, callback) {
	request.post('https://slack.com/api/channels.list', {form:{'token':config.slack.token,'exclude_archived':1}, json:true}, function(error, response, body) {
		if (error) {
			callback(error);
		} else if (response.statusCode != 200) {
			callback('Unable to retrieve channel');
		} else if (body.ok != true) {
			callback(body.error);
		} else {
			for (var idx in body.channels) {
				var channel = body.channels[idx];
				if (channel.name == channel_name) {
					callback(null, channel.id);
					return;
				}
			}
			callback('Channel not found');
		}
	});
}

function post_slack_message(backers, pledged) {
	if (!config.slack.message)
	{
		return;
	}
	var msg = config.slack.message.replace('${BACKERS}', backers);
	msg = msg.replace('${PLEDGED}', pledged);
	get_slack_channel_id(config.slack.channel, function(err, channel_id) {
		if (err) {
			console.log('Failed to retrieve slack channel: ' + err);
		} else {
			request.post('https://slack.com/api/chat.postMessage', {form:{'token':config.slack.token,'channel':channel_id,'text':msg, 'as_user':false, 'username':config.slack.username, 'icon_emoji':config.iconEmoji}}, function(error, response, body) {
			});
		}
	});
}

function set_slack_channel_topic(backers, pledged) {
	if (!config.slack.topic)
	{
		return;
	}
	var msg = config.slack.topic.replace('${BACKERS}', backers);
	msg = msg.replace('${PLEDGED}', pledged);
	get_slack_channel_id(config.slack.channel, function(err, channel_id) {
		if (err) {
			console.log('Failed to retrieve slack channel: ' + err);
		} else {
			request.post('https://slack.com/api/channels.setTopic', {form:{'token':config.slack.token,'channel':channel_id,'topic':msg}}, function(error, response, body) {
				if (error) {
					console.log('ERROR: failed to set slack topic: ' + error);
				} else if (response.statusCode != 200) {
					console.log('ERROR: failed to set slakc topic: ' + body);
				}
			});
		}
	});
}

function post_notifications(backers, pledged) {
	post_slack_message(backers, pledged);
	set_slack_channel_topic(backers, pledged);
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
							//console.log("Hit backer target at " + project.backers_count + " for target " + backer_target);
							status.backers = project.backers_count;
							sendUpdate = true;
						} else {
							// Ignored - less than target count or already triggered
						}
					}
					for (idx in config.pledgeTargets) {
						var pledge_target = config.pledgeTargets[idx];
						if (project.pledged >= pledge_target && status.pledged < pledge_target) {
							//console.log("Hit pledge target at " + project.pledged + " for target " + pledge_target);
							status.pledged = project.pledged;
							sendUpdate = true;
						} else {
							// Ignored - less than target amount or already triggered
						}
					}
					var pledged_currency = numeral(project.pledged).format('$0,0.00'); // TODO: currency symbol based on currency code
					if (sendUpdate) {
						jsonfile.writeFile(STATUS_FILE, status, function(err) {
							if (err) {
								// error writing status file
								console.log('ERROR: failed to save status file');
							} else {
								post_notifications(project.backers_count, pledged_currency);
							}
						});
					} else if (config.slack.alwaysUpdateTopic) {
						set_slack_channel_topic(project.backers_count, pledged_currency);
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
			//console.log("No status file - creating " + STATUS_FILE);
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


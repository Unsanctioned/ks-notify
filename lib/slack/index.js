// Slack interfaces

let slack = module.exports = {};

const request  = require('request'),
      config   = require('../../config');

slack.post_with_token = function(msg) {
	if (!msg) {
		return;
	}

	if (!config.slack.token) {
		console.log('ERROR: missing slack.token in configuration');
		return;
	}

	//slack.get_channel(config.slack.channel, function(err, channel_id) {
	//	if (err) {
	//		console.log('Failed to retrieve slack channel: ' + err);
	//	} else {
	console.log('POST to https://slack.com/api.chat.postMessage');
			request.post('https://slack.com/api/chat.postMessage', {form:{'token':config.slack.token,'channel':config.slack.channel,'text':msg, 'username':config.slack.username, 'icon_emoji':config.slack.iconEmoji}}, function(error, response, body) {
				if (error) {
					console.log(`Slack chat.postMessage error: ${error}`);
				} else if (response.statusCode != 200) {
					console.log(`Bad slack response: ${response.statusCode} ${response.statusMessage}`);
					console.log(`Headers ${JSON.stringify(response.headers)}`);
					console.log(`Body: ${response.body}`);
				} else if (!response.body.ok) {
					console.log(`Slack non-success response: ${response.body}`);
				}

			});
	//	}
	//});
}

slack.post_message = function(msg) {
	if (!msg) {
		return;
	}

	if (config.slack.webhook_url) {
		slack.post_webhook(msg);
	} else if (config.slack.token) {
		slack.post_with_token(msg);
	}
}

slack.post_webhook = function(msg) {
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

slack.get_channel = function(channel_name, callback) {
	if (!config.slack.token) {
		callback('Missing slack.token in configuration');
	}
	request.post('https://slack.com/api/conversations.list', {form:{'token':config.slack.token,'exclude_archived':1}, json:true}, function(error, response, body) {
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

slack.set_channel_topic = function(topic) {
	if (!topic) {
		return;
	}
	if (!config.slack.token) {
		console.log('ERROR: missing slack token. Cannot set channel topics');
	}
	slack.get_channel(config.slack.channel, function(err, channel_id) {
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


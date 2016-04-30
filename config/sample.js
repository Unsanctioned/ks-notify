config = module.exports = {

	// Kickstarter project name (lowercase with - instead of space, generally)
	projectName: 'my-project-name'',
	// Kickstarter project ID
	projectId: 000000000,
	slack: {
		// The channel that should receive notifications / topic updates
		channel: 'crowdfunding',
		// Slack web API token
		token: 'xoxp-your-token-here',
		// Name of the bot that posts messages
		username: 'KSBOT',
		// Message text to post when a trigger level is hit - blank for no message
		message: 'Kickstarter update: ${BACKERS} backers and ${PLEDGED} pledged!',
		// emoji to use as the bot's icon
		iconEmoji: ':tophat:',
		// Topic text - if blank, topic is not set
		topic: 'Campaign: ${BACKERS} backers, ${PLEDGED} pledged!',
		// Is the topic updated on every run (false = updated when a target is hit)
		alwaysUpdateTopic: false
	},
	// pledge targets for notifications
	pledgeTargets: [
		{amount: 10000.00, message: 'DEFAULT'},
		{amount: 25000.00, message: 'DEFAULT'},
		{amount: 50000.00},
		{amount: 100000.00, message: 'Kickstarter update: ${PLEDGED} pledged!', topic: 'Campaign: ${BACKERS} backers, ${PLEDGED} pledged'},
		{amount: 150000.00, message: 'DEFAULT'},
		{amount: 200000.00, message: 'DEFAULT'},
		{amount: 500000.00, message: 'DEFAULT'},
		{amount: 1000000.00, message: 'FUNDED! ${PLEDGED} pledged, ${BACKERS} backers!', topic: 'CAMPAIGN FUNDED!!!'}
	],
	// backer targets for notifications
	backerTargets: [
		{count: 100, message: 'Backer update: ${BACKERS}'},
		{count: 1000, message: 'Backer update: ${BACKERS}'},
		{count: 10000, message: 'Backer update: ${BACKERS}'},
		{count: 100000 message: 'Backer update: ${BACKERS}', topic: 'DEFAULT'}
	]
}

const Twitter = require("./src/twitter");
const ConfigServer = require("./src/configServer");

const botUserId = process.env["bot_user_id"];
const startConfig = require("./startConfig.json");

const processTweet = async (tweet) => {
  const tweetId = tweet?.id_str;
  const tweetText = tweet?.text;
  const tweetUserId = tweet?.user?.id_str;
  const tweetUserName = tweet?.user?.screen_name;

  console.log("got tweet from", tweetUserName, " : ", tweetText);

  if (tweetUserId === botUserId) {
    // don't process tweets from the bot itself
    return;
  }

  try {
    const runConfig = ConfigServer.getRunConfig();
    const startDateDiff = new Date(runConfig?.startTime) - new Date();
    const endDateDiff = new Date(runConfig?.endTime) - new Date();

    if (runConfig?.enabled === false || startDateDiff > 0 || endDateDiff < 0) {
      return;
    }
  } catch (error) {
    console.log("error reading config, assuming active");
  }

  if (tweetText) {
    // process text and determine if the bot has to reply
    // ...

    // implement maybe a throttled queue here if we get too many tweets
    await Twitter.replyToTweet(tweetId, startConfig.reply);
  }
};

ConfigServer.runConfigServer();

function start() {
  try {
    Twitter.listenToStream(startConfig.monitorTracks, (tweet) => {
      try {
        processTweet(tweet);
      } catch (error) {
        // ideally must send an alert to the maintainers
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
    start();
  }
}

start();

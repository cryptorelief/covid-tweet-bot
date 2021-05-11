const fs = require("fs");
const Twitter = require("./src/twitter");

const botUserId = process.env["bot_user_id"];
const startConfig = require("./startConfig.json");

const processTweet = async (tweet) => {
  const tweetId = tweet?.id_str;
  const tweetText = tweet?.text;
  const tweetUserId = tweet?.user?.id_str;

  console.log("got tweet", tweetUserId);

  if (tweetUserId === botUserId) {
    // don't process tweets from the bot itself
    return;
  }

  try {
    const raw = fs.readFileSync("./runConfig.json").toString();
    const runConfig = JSON.parse(raw);
    const dateDiff = new Date(runConfig?.startTime) - new Date();
    if (runConfig?.enabled === false || dateDiff > 0) {
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

Twitter.listenToStream(startConfig.monitorTracks, (tweet) => {
  try {
    processTweet(tweet);
  } catch (error) {
    // ideally must send an alert to the maintainers
    console.error(error);
  }
});

const Twit = require("twit");

const creds = {
  consumer_key: process.env["consumer_key"],
  access_token: process.env["access_token"],
  consumer_secret: process.env["consumer_secret"],
  access_token_secret: process.env["access_token_secret"],
};

const botUserId = process.env["bot_user_id"];

const twitter = new Twit(creds);

const replyToTweet = async (parentTweetId, replyText) => {
  return twitter.post("statuses/update", {
    status: replyText,
    in_reply_to_status_id: parentTweetId,
    auto_populate_reply_metadata: true,
  });
};

const twitterStream = twitter.stream("statuses/filter", {
  track: ["@IntrobotAI", "#IntrobotAI"], // any relavant words, hashtags, mentions
});

const processTweet = async (tweet) => {
  const tweetId = tweet?.id_str;
  const tweetUser = tweet?.user?.screen_name;
  const tweetText = tweet?.text;

  if (tweetText && tweetUser !== botUserId) {
    // process text and determine if the bot has to reply
    // ...

    // implement maybe a throttled queue here if we get too many tweets
    await replyToTweet(
      tweetId,
      `Hello ${tweetUser}, visit https://covidcitizens.org for more`
    );
  }
};

twitterStream.on("tweet", processTweet);

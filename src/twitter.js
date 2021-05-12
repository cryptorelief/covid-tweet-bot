const Twit = require("twit");

const creds = {
  consumer_key: process.env["consumer_key"],
  access_token: process.env["access_token"],
  consumer_secret: process.env["consumer_secret"],
  access_token_secret: process.env["access_token_secret"],
};

const twitterInstance = new Twit(creds);

/**
 * retpy to a tweet
 *
 * @param {string} parentTweetId
 * @param {string} replyText
 */
const replyToTweet = async (parentTweetId, replyText) => {
  console.log("replying to tweetId", parentTweetId, "with", replyText);

  twitterInstance.post("statuses/update", {
    status: replyText,
    in_reply_to_status_id: parentTweetId,
    auto_populate_reply_metadata: true,
  });
};

/**
 * listen to a given tweet stream
 *
 * @param {string[]} track
 * @param {() => void} cb
 */
const listenToStream = (track, cb) => {
  const twitterStream = twitterInstance.stream("statuses/filter", { track });

  twitterStream.on("connect", () => {
    console.log("stream - ", track);
    console.log("connecting ...");
  });

  twitterStream.on("connected", () => {
    console.log("stream - ", track);
    console.log("connected");
  });

  twitterStream.on("tweet", cb);
};

module.exports = {
  replyToTweet,
  listenToStream,
  twitterInstance,
};

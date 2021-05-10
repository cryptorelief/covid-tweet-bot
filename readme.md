# twitter bot

A twitter bot to monitor and repy to help with the COVID-19 pandemic in India.

## setup

setup an `.env` file and source it (or just set environment variables directly with)

```bash
export bot_user_id="<id>"
export consumer_key="<key>"
export consumer_secret="<secret>"
export access_token="<token>"
export access_token_secret="<secret>"
```

## start

run `yarn start`

## configs

1. `runConfig.json`

This file is read before replying to tweets

2. `startConfig.json`

This file is read when the script loads up

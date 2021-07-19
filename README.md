# Hack the 6ix Discord Bot

This bot is a companion to the Hack the 6ix backend (https://github.com/hack-the-6ix/hackthe6ix-backend).

## Setup

Populate all the values in `.env.template` and save it to a file called `.env`. You will need to generate an API key on the backend with at least the `organizer` grant.

You will also need to configure any mappings you want for backend -> Discord roles. See `data/rolesmap.json.template` for an example. Note that you can specify arbitrary roles on the backend so you are not limited just by the backend permissions roles.

Before you run the bot, you must invite it to your guild, with the `bot` and `applications.commands` grants.
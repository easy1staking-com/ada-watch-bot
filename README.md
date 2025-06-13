# Ada Watch BOT

Ada Watch Bot is a cross-platform bot available on both Telegram and Discord. 
It allows you to monitor Cardano wallets activity, track DeFi loans on Liqwid Finance, and manage Collateralized Debt Positions (CDPs) 
on Indigo Protocol—all from your favorite chat platform.

Ada Watch Bot is compatible with [Ada Handle](https://handle.me/), meaning that, anywhere you can use a Cardano wallet address, you can also use an Ada Handle.

## How to Access Ada Watch Bot

You can use Ada Watch Bot on both Telegram and Discord:

### Telegram

Simply follow this link to start chatting with the bot: [t.me/AdaWatchBot](t.me/AdaWatchBot)

### Discord

To start interacting with Ada Watch Bot on Discord, follow these steps:

* Open Discord and click the Discover button in the sidebar.
![00-discover.png](resources/images/discord/00-discover.png)

* Go to the Apps section. 
![01-apps.png](resources/images/discord/01-apps.png)

* Search for "Ada Watch". 
![02-search-for-ada-watch.png](resources/images/discord/02-search-for-ada-watch.png)

* Select the Ada Watch Bot from the results and follow the prompts to add or launch the bot in your server or direct messages.
![03-select-ada-watch.png](resources/images/discord/03-select-ada-watch.png)

* Add Ada Watch to your Apps 
![05-add-ada-watch-to-apps.png](resources/images/discord/05-add-ada-watch-to-apps.png)

* Authorize app.

## How does it work?

Ada Watch allows users to add up to 20 Cardano wallet addresses to a watchlist. Every time an inbound or outbound transaction occurs on any of the watched addresses, 
the bot sends a notification to the user.

There are a number of transaction types that the bot can monitor, including:
* Generic transactions 
* AdaMatic transactions (https://adamatic.xyz/)
* FluidTokens Aquarium transactions (https://aquarium.fluidtokens.com/)

Should a wallet also be used for DeFi loans on Liqwid Finance, the bot will also notify the user of any current Liqwid Finance loan or Indigo Protocol CDP.

### Notifications

Ada Watch Bot monitors Liqwid and Indigo onchain activity, particularly around token price updates and interest accruals.

Should the relevant health metric of a loan or CDP owned by any of the user's watched addresses cross a threshold of interest, the bot will automatically send a notification to the user.

## Commands (Discord & Telegram)

The following commands are available in both the Discord and Telegram versions of Ada Watch Bot:

| Command           | Description                                                               |
|-------------------|---------------------------------------------------------------------------|
| `/add address`    | Adds an Address to the watchlist                                          |
| `/remove address` | Removes an Address from the check list                                    |
| `/check`          | Checks the status for all the loans and CDPs owned by user's wallets      |
| `/check address`  | Checks the status for all the loans and CDPs owned by the specific wallet |
| `/list`           | Lists all the addresses in the watch list                                 |
| `/help`           | Shows you an help message                                                 |

These commands work the same way on both platforms, ensuring a consistent experience whether you use Discord or Telegram.

## Commands Telegram Specific

Coming soon, but user can issue the `/commands` command to retrieve a list of available commands along with their description.

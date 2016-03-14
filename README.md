

#Intro

This is an SDK that allows you to build games that are Betable Canvas compliant, meaning that they can be added the to Betable Games library and be played at https://betable.com

If you are new to all of this the best place to start is [here](example/)

#Starting from scratch

* Download the SDK [:inbox_tray:](https://github.com/betable/betable-canvas-sdk/releases/download/0.1.0/release.zip)
* Create a folder to house your game
* Create an index.html file in your game folder
* Make sure to set your redirect URI to "https://localhost:8888/authorize"
* Add this to your index.html

```HTML
    <script src="/betable.js"></script>
    <script>
        var betable = Betable("<YOUR CLIENT ID>")
        if (betable.authorized) {
            //Start the game
        } else {
            betable.authorize("https://localhost:8888/authorize")
        }
    </script>
```

* Create your manifest.js

```JS
    module.exports = {
       client_id: "<YOUR CLIENT ID>"
     , client_secret: "<YOUR CLIENT ID>"
    }
```

* Start the test server

```bash
    node /path/to/SDK/server.js
```

* Go to `http://localhost:8888`

Boom you have a canvas ready betable game.

#Running on your own server

**It is worth noting that because you can only load static files and XHRs and off domain scripts are not allowed, there is not a large reason to run your own server** If you require xhr, please contact us at [developers@betable.com](mailto:developers@betable.com?Subject=Requesting%20permission%20for%20offsite%20XHR%20and%20Script%20loading%20on%20betable%20canvas&Body=State%20which%20calls%20you%20need%20and%20why...)

The only difference from above and running your own server is that you can set your redirect URI to whatever you want and then you will have to handle the oauth flow on your server. When you have completed the oauth flow, you need to redirect to your index page and pass in the access token like so 

    http://yourdomain.com/your/index/path.html?access_token=<access_token>

Your authorization endpoint will be called one of 2 ways. Either with a `code` or a `client_user_id`. If its called with a `code`, then you need to make a request for an access_token. You can find out how to do that [here](https://developers.betable.com/docs/api/#authentication). If you receive a `client_user_id` then you need to request an unbacked token (a demo token). You can find out how to do that [here](https://developers.betable.com/docs/api/features/#unbacked-bets).

##Using the testing harness to test your game in an iframe

###1. Setup a separate domain to test cookies

Either modifiy or create this file:
Windows: `\WINDOWS\system32\drivers\etc\hosts`
Mac: `/etc/hosts\`

Add this line:

```
127.0.0.1   betablegames.com
```

###2. Add the 2 attached files to the web directory of your app

###3. Run the testing server (and potentially installing node if you haven't already)

If you don't have node installed, first install node.

Then run this command:

```
node server.js
```

From the web directory

###4. Visit [http://localhost:8080/test](http://localhost:8080/test)

###5. Test all functionality:
* all the outside betable chrome calls like deposit and play or real will show up in the console
* demo mode can be tested by adding ?demoMode=true (like so http://localhost:8080/test?demoMode=true)
* doesn't work in safari atm, but I'm working on it (gotta save and load the cookies like betable.com does).

#Demo Mode

All apps need to support demo mode, but besides clearly displaying that the player is in demo mode, you do not need to make many considerations for it. Simply put, in demo mode, the user is not making real bets, and all of their money is coming out of a demo wallet.

##Things to know about demo mode

* Calls to `bet` and `creditBet` will work the same as in non demo mode.
* Calls to `wallet` will seem to work the same but will actually be referencing a non existent demo wallet, it will be debited and credited correctly when `bet` and `creditBet` are called.
* Calls to `account` in demo mode will return a null user.
* The token you have in demo mode will not allow you to make a real bet even if you tried.
* You must have a button in demo mode that allows the user to play in non-demo mode.

#API Calls

####`bet(gameID, data, callback, errback)`

This call allows you to make a bet on a game. The `gameID` is the game you wish to make a bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`creditBet(gameID, creditGameID, data, callback, errback)`

This call allows you to make a bet on a game. The `gameID` is the game that the credits were recieved on. The `creditGameID` is the game that the credits will be bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`unbackedBet(gameID, data, callback, errback)`

This call allows you to make a bet on a game that will not result in any exchange of money, you can user this when you wish to represent a bet in your game that the user has not committed to spending any money on. The `gameID` is the game you wish to make a bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`unbackedCreditBet(gameID, creditGameID, data, callback, errback)`

This call allows you to make a bet on a game that will not result in any exchange of money, you can user this when you wish to represent a bet in your game that the user has not committed to spending any money on. The `gameID` is the game that the credits were recieved on. The `creditGameID` is the game that the credits will be bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`canIGamble(callback, errback)`

It is not necessary for you to check if a user can gamble. All of our systems protect against users trying to gamble and deposit in jurisdictions where it is not allowed. You may however want to display a message to user's that try to access your game from outside of a legal gambling jurisdiction before they try and bet or deposit. To check their current gambling eligibility, make this call.

This call checks the geolocation of the user and responds with whether the user can gamble or not. The callback will be called with an object that contains the data about whether they can gamble. It will look like this:

```
{
  country: "United States",
  country_code: "US",
  can_gamble: false
}
```

The important bit of this is the can_gamble field. If it is true then they are in a jurisdiction where they can gamble.

#Chrome Calls

`betable.chrome(action, params)`

If you want to make a call to the betable chrome (for depositing, withdrawing, redeeming a promo, etc) you can simply make a call to the betable object called chrome.

##Modes

How different modes work with the chrome:

**Fullscreen and Canvas**

Most of these will be handled by a drop down modal. With exception for support, redeem and promotions, which will redirect away from the game to new pages

**Standalone**

In standalone mode, when a chrome call is made, the app will do a full page redirect to the betable page. **We are currently working to make this more configurable to support popup windows**.

##Actions

It is only required that you implement the `deposit` action and the `wallet` action.

###Window Actions

Actions that open a window in the canvas container

####`deposit`

This will allow the user to deposit more money.

####`wallet`

This will allow users to see their recent transactions, as well as state their current wallet balance.

####`redeem`

This will allow users to redeem a dev-signed promotion. You must pass the promotion in as a parameter

####`withdraw`

This will take the user to the withdraw request page, where they can request to withdraw money from their betable wallet.

####`support`

This will take the user to the FAQ page with a link to contact our customer support.

####`promotions`

This will take the user to the promotion wall so they can see which promotions they are currently eligible for

###Utility Actions

####`refresh`

This will refresh the game inside the iframe correctly making sure that the access token and params are preserved.

##Storing Data on the Client

DO NOT USE COOKIES DIRECTLY. The game will be iframed in safari which doesn't allow iframes of a different domain to store cookies.

To store, read, and delete data use the following methods

####`storeInfo(name, value)`

Stores the value `value` under the name `name`

####`readInfo(name)`

Returns the value stored under `name`

####`deleteInfo(name)`

Deletes the value stored under `name`

####`canStoreCookies()`

Returns a boolean that tells whether the current window hosting the game can store cookies or not.

##Sessions

####`heartbeat()`

This will notifiy the canvas container that the users is still playing. It is called automatically on all bets and creditBets. If the user is inactive for 15 minutes their session will expire.



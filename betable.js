;
(function () {
/*
 * Copyright (c) 2012, Betable Limited
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Betable Limited nor the names of its contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL BETABLE LIMITED BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


window.Betable = function Betable(clientID, search_options) {
    var _accessToken
    this.init = function () {
        this.authorized = false
        this.clientID = clientID
        this.mode = Betable.Mode.StandAlone
        this.storedInfo = {}
        this.endpoint = Betable.betableAPIURL
		this.parentURL = Betable.betableURL
		this.setupWithLocation(window.location, search_options)
    }
    this.setupWithLocation = function Betable_setupWithLocation(loc, searchOptions) {
        var parts = loc.search.substr(1).split('&')
          , search = {}
          , part
          , keyvalue
          , key
          , value
        for (var i=0,l=parts.length; i < l; i++) {
            part = parts[i]
            keyvalue = part.split('=')
            key = keyvalue[0]
            value = keyvalue[1]
            search[key]=decodeURIComponent(value)
        }

        if(this.mode === Betable.Mode.StandAlone) {
            //Override default behaviour with searchOptions
            searchOptions = searchOptions || {}
            for(var so in searchOptions) {
                search[so] = searchOptions[so]
            }
        }

        _accessToken = search.accessToken
        this.demoMode = search.demoMode == 'true'
        if (search.fullscreen == 'true') {
            this.mode = Betable.Mode.FullScreen
        } else if (search.canvas == 'true') {
            this.mode = Betable.Mode.Canvas
        }
        if (_accessToken || this.mode != Betable.Mode.StandAlone) {
            this.authorized = true
        }
        this._demoWallet = {
            real: {
                balance: search.init_balance || '10000.00'
              , currency: 'GBP'
              , economy: 'real'
              , credits: {}
            },
            sandbox: {
                balance: search.init_balance || '10000.00'
              , currency: 'GBP'
              , economy: 'sandbox'
              , credits: {}
            }
        }
        this.manifest = search.manifest
		if (search._parentURL) {
			this.parentURL = search._parentURL
		}
        if (search.storedInfo) {
            console.log("[Store All Info]")
            console.log('    [this]',this)
            this.storedInfo = JSON.parse(search.storedInfo)
            console.log('    [info]', this.storedInfo)
        }
    }

    this.accessToken = function () {
        return _accessToken
    }

    this.url = function Betable_url(path, params) {
        params = params || {}
        params.manifest = this.manifest
        var paramList = []
        for (var key in params) {
            paramList.push(key +'='+ encodeURIComponent(params[key]))
        }
        return Betable.betableURL + '/' + path + '?' + paramList.join('&')
    }

    this.popup = function Betable_popup(url) {
        var iframe = "<iframe style='position: fixed; top:10px; left:10px; right:10px; bottom:10px; z-index:10000;' name='betable-popup' class='betable-popup' src="+url+"></iframe>"
          , closeButton = "<div style='position:fixed; width:10px; height:10px; top:5px; right:5px; color:#CB3332' onclick='__betablePopupClose' style = class='betable-close'>×</div>"
          , popup = this.popup =  document.createElement("div")
        popup.innerHTML = iframe + closeButton
        document.getElementsByTagName('body')[0].appendChild(popup)
        window.__betablePopupClose = function () {
            window.__betablePopupClose = null
            popup.parentNode.removeChild(popup)
        }
    }

    this.authorize = function Betable_authorize(redirectURI, client_user_id) {
        if(this.mode != Betable.Mode.StandAlone) {
            alert("Error: You can only call authorize in Stand Alone mode")
        } else if (this.demoMode) {
            client_user_id = client_user_id || (Math.random()+1).toString(36).substr(-20,20)
            window.location = redirectURI+'?client_user_id='+client_user_id
        } else {
            window.location = this.url('track', {
                action: 'authorize'
              , client_id: this.clientID
              , redirect_uri: redirectURI
              , response_type: 'code'
            })
        }
    }

    this.chrome = function betable_chrome(action, params) {
        params = params || {}
        switch(this.mode) {
            case Betable.Mode.StandAlone:
                params.action = action
                window.location = this.url('track', params)
                break
            case Betable.Mode.FullScreen:
            case Betable.Mode.Canvas:
                params.action = action
                parent.window.postMessage(JSON.stringify(params), this.parentURL)
                break
            default:
                 throw "SDK in unknown mode"
        }
    }

    //Betable API Helper methods
    var _settleDemoWallet = function Betable__settleDemoWallet(wager, betData, economy, creditGame) {
        //credit wallet
          var balance = this._demoWallet[economy].balance
          , newBalance = Betable.Decimal.add(balance, betData.payout)
          , credits = this._demoWallet[economy].credits
          , creditBalance
          , newCreditBalance
          , wallet
        this._demoWallet[economy].balance = newBalance
        for (var game in betData.credits) {
            credits[game] = Betable.Decimal.add(credits[game], betData.credits[game])
        }
        //debit wallet
        if (creditGame) {
            wallet = this._demoWallet[economy].credits
            wallet[creditGame] = Betable.Decimal.sub(wallet[creditGame], wager)
        } else {
            wallet = this._demoWallet[economy]
            wallet.balance = Betable.Decimal.sub(wallet.balance, wager)
        }
    }

    var _requestDemoWallet = function Betable__requestDemoWallet(games, callback) {
        var self = this
        setTimeout(function () {
            var outputWallet = {}
              , newEconomy
              , oldEconomy
            for (var economy in self._demoWallet) {
                outputWallet[economy] = newEconomy = {}
                oldEconomy = self._demoWallet[economy]
                for (var info in oldEconomy) {
                    if (info != 'credits') {
                        newEconomy[info] = oldEconomy[info]
                    }
                }
                if (games && games.length) {
                    newEconomy.credits = {}
                    for (var i=0, len = games.length, game; i < len; i++) {
                        game = games[i]
                        newEconomy.credits[game] = oldEconomy.credits[game] || '0.00'
                    }
                }
            }
            callback(outputWallet)
        }, 0)
    }

    //Betable API Methods
    this.account = function Betable_account(callback, errback) {
        this.api('GET', '/account', void 0, callback, errback)
    }

    this.bet = function Betable_bet(gameID, data, callback, errback) {
        this.heartbeat()
        if (this.demoMode) {
            var wager = data.wager
              , economy = data.economy              
              , balance = this._demoWallet[economy].balance

            if (wager === undefined && data.wagers) {
                wager = 0
                for (var i=0,l=data.wagers.length; i<l; i++) {
                    wager += parseFloat(data.wagers[i].wager)
                }
                wager = wager.toFixed(2)
            }
            if (parseFloat(wager) > parseFloat(balance)) {
                setTimeout(function () {
                    errback({error: "insufficient_funds"})
                }, 0)
            }
            delete data.economy
            delete data.currency
            var self = this
            this.unbackedBet(gameID, data, function(betData) {
                _settleDemoWallet.call(self, wager, betData, economy)
                callback(betData)
            }, errback)
        } else {
            this.api(
                'POST'
              , '/games/' + gameID + '/bet'
              , data
              , callback
              , errback
              , true
            )
        }
    }

    this.betCredits = function Betable_betCredits(gameID, creditGameID, data, callback, errback) {
        this.heartbeat()
        if (this.demoMode) {
            var economy = data.economy
              , wager = data.wager
              , balance = this._demoWallet[economy].credits[creditGameID]
            if (parseFloat(wager) > parseFloat(balance)) {
                setTimeout(function () {
                    errback({error: "insufficient_funds"})
                }, 0)
            }
            delete data.economy
            delete data.currency

            var self = this
            this.unbackedCreditBet(gameID, creditGameID, data, function(betData) {
                _settleDemoWallet.call(self, wager, betData, economy, creditGameID)
                callback(betData)
            }, errback)
        } else {
            this.bet(gameID +'/'+ creditGameID, data, callback, errback)
        }
    }

    this.unbackedBet = function Betable_unbackedBet(gameID, data, callback, errback) {
        this.heartbeat()
        this.api(
            'POST'
          , '/games/' + gameID + '/unbacked-bet'
          , data
          , callback
          , errback
        )
    }

    this.unbackedBetCredits = function Betable_unbackedBetCredits(gameID, creditGameID, options, callback, errback) {
        this.heartbeat()
        this.unbackedBet(gameID +'/'+ creditGameID, data, callback, errback)
    }

    this.heartbeat = function Betable_heartbeat() {
        if (this.mode == Betable.Mode.Canvas) {
            parent.window.postMessage(JSON.stringify({action: 'heartbeat'}), this.parentURL)
        }
    }

    this.wallet = function Betable_wallet(games, callback, errback) {
        if (this.demoMode) {
            _requestDemoWallet.call(this, games, callback)
        } else {
            var data = {}
            games = games || []
            if (!(games instanceof Array)) {
                games = [games]
            }
            data.games = games.join(',')
            this.api('GET', '/account/wallet', data, callback, errback)
        }
    }

    this.canIGamble = function Betable_canIGamble(callback, errback) {
        var self = this
        this.api('GET', '/can-i-gamble', null, function(data) {
            if (self.demoMode) {
                data.can_gamble = true
            }
            callback(data)
        }, errback)
    }

    //Cookies

    this.storeInfo = function Betable_storeInfo(name, value) {
        this.storedInfo[name] = value
        var params = {action: 'storeInfo', info: this.storedInfo}
        parent.window.postMessage(JSON.stringify(params), this.parentURL)
    }
    this.readInfo = function Betable_readInfo(name) {
        return this.storedInfo[name]
    }
    this.deleteInfo = function Betable_deleteInfo(name) {
        delete this.storedInfo[name]
        var params = {action: 'storeInfo', info: this.storedInfo}
        parent.window.postMessage(JSON.stringify(params), this.parentURL)
    }

    this.canStoreCookies = function Betable_canStoreCookies() {
        var is_safari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1
          , is_ios = /iphone|ipod|ipad/.test(navigator.userAgent.toLowerCase())
          , is_iframe = top.location != self.location
          , is_cookie_limited = (is_safari || is_ios) && is_iframe
        return !is_cookie_limited
    }

    //Utilities

    this.api = function Betable_api(
        method
      , path
      , body
      , callback
      , errback
    ) {
        if (this.authorized && !_accessToken) {
            this.onAuthorize(function () {
                _api(this.endpoint, method, path + '?access_token=' + _accessToken, body, callback, errback)
            })
        } else {
            _api(this.endpoint, method, path + '?access_token=' + _accessToken, body, callback, errback)
        }
    }

    var _api = function Betable__api(
        endpoint
      , method
      , path
      , body
      , callback
      , errback
      , includeContentType
    ) {
        var xhr = function() {
            try { return new XDomainRequest() } catch (e) {}
            try { return new XMLHttpRequest() } catch (e) {}
            try { return new ActiveXObject('Msxml2.XMLHTTP.6.0') } catch (e) {}
            try { return new ActiveXObject('Msxml2.XMLHTTP.3.0') } catch (e) {}
            try { return new ActiveXObject('Microsoft.XMLHTTP') } catch (e) {}
            throw new Error('no XMLHttpRequest')
        }()
        var path = endpoint + path
          , is_xdr = typeof XDomainRequest === 'function'
          , xhr_args = [method, path]

        if ('GET' === method && body) {
            Object.keys(body).forEach(function(key) {
                xhr_args[1] += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
            })
        }

        if(!is_xdr)            xhr_args.push(true)
        if(includeContentType) xhr_args[1] = xhr_args[1] + '&content_type=application/json'

        xhr.open.apply(xhr, xhr_args)

        if(is_xdr) {
            xhr.onload = function() { callback(JSON.parse(xhr.responseText)) }
            xhr.onerror = xhr.ontimeout = function() { errback(JSON.parse(xhr.responseText)) }
            xhr.onprogress = function() {}
        } else {
            xhr.onreadystatechange = function Betable_account_onreadystatechange() {
                if (4 === xhr.readyState) {
                    var response = JSON.parse(xhr.responseText)
                    if (400 > xhr.status) {
                        callback(response,xhr)
                    } else {
                        errback(response)
                    }
                }
            }
        }
        if ('POST' === method && body) {
            if(!is_xdr) xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8')
            xhr.send(JSON.stringify(body))
        } else {
            xhr.send()
        }
    }
    this.init()
}

Betable.betableURL = 'https://betable.com'
//Betable.betableURL = 'http://players.dev.betable.com:8080'
Betable.betableAPIURL = "https://api.betable.com/1.0"
//Betable.betableAPIURL = "http://localhost:8020"

Betable.Mode = {
    FullScreen: 'fullscreen'
  , StandAlone: 'standalone'
  , Canvas: 'canvas'
}

Betable.Decimal = (function(){
    function toi(s) {
        return +s.replace('.', '')
    }
    function toa(i) {
        var s = i.toString()
        if (s.length < 3) {
            if (s < 0) {
                s = "-" + ("00"+(-s)).slice(-3)
            } else {
                s = ("00"+s).slice(-3)
            }
        }
        return s.replace(/(\d\d)$/, ".$1")
    }

    return {
        add: function add(a, b) {
            return toa(toi(a) + toi(b))
        },
        sub: function sub(a, b) {
            return toa(toi(a) - toi(b))
        }
    }
})()

})();


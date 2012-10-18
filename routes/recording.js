if (process.env.DROPBOX == 'YES' && TINY_CONFIG.dropbox && TINY_CONFIG.dropbox.key) {
  
  var request = require('request')
    , Dropbox = require('dropbox')
    , fs = require('fs');

  var dbClient = new Dropbox.Client({
    key: TINY_CONFIG.dropbox.key,
    sandbox: true,
    token: process.env.DROPBOX_USER_TOKEN,
    tokenSecret: process.env.DROPBOX_USER_SECRET
  });


  var simpleDriver = {
    url: function() {
      return "";
    },

    doAuthorize: function(authUrl, token, tokenSecret, callback) {
      console.log("Visit the following in a browser, then press Enter\n" + authUrl + "\n");

      var onEnterKey = function() {
        process.stdin.removeListener("data", onEnterKey);
        callback(token);
      }

      process.stdin.addListener("data", onEnterKey);
      process.stdin.resume();
    }
  };

  dbClient.authDriver(simpleDriver);
  dbClient.authenticate(function(error, client) {
    console.log(error, client);
  });


  exports.recorded = function (req, res, next) {
    var fileId = Math.floor(Math.random() * 1000000000);

    request({
      method: 'GET',
      uri: req.body.RecordingUrl + '.mp3'
    },function (error, response, body) {
      if (error) return next(error);
      res.json({ok: true});

      dbClient.writeFile(new Date().toISOString() + ".mp3", response.toString(), function (error, stat) {
        if (error) {
          console.log(error);
        } else {
          console.log(stat);
        }
      });
    });
  }

} else {
  exports.recorded = function () {};
}
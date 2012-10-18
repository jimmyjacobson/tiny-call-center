var request = require('request')
  , dropbox = require('dropbox')
  , fs = require('fs');


exports.recorded = function (req, res, next) {
  if (TINY_CONFIG.dropbox && TINY_CONFIG.dropbox.key) {
    var fileId = Math.floor(Math.random() * 1000000000);

    var dbClient = new Dropbox.Client({
      key: TINY_CONFIG.dropbox.key, sandbox: true
    });

    request({
      method: 'GET',
      uri: req.body.RecordingUrl + '.mp3'
    },function (error, response, body) {
      if (error) return next(error);
      res.json({ok: true});

      dbClient.writeFile(new Date().toISOString() + ".mp3", response, function (error, stat) {
        if (error) {
          console.log(error);
        } else {
          console.log(stat);
        }
      });
    });
  }
}

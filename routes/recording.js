var request = require('request')
  , Dropbox = require('dropbox')
  , fs = require('fs');


var dbClient = new Dropbox.Client({
  key: TINY_CONFIG.dropbox.key, sandbox: true
});

// dbClient.authDriver(new Dropbox.Drivers.NodeServer(8191));


if (TINY_CONFIG.dropbox && TINY_CONFIG.dropbox.key) {

  exports.recorded = function (req, res, next) {
    var fileId = Math.floor(Math.random() * 1000000000);

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

} else {
  exports.recorded = function () {};
}
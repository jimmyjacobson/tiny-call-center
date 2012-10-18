if (process.env.DROPBOX == 'YES' && TINY_CONFIG.dropbox && TINY_CONFIG.dropbox.key) {
  
  var request = require('request')
    , url = require('url')
    , http = require('http')
    , DropboxClient = require('dropbox-node').DropboxClient
    , fs = require('fs');


  var dropbox = new DropboxClient(
    process.env.DROPBOX_APP_KEY,
    process.env.DROPBOX_APP_SECRET,
    process.env.DROPBOX_USER_TOKEN,
    process.env.DROPBOX_USER_SECRET, {
      sandbox: true
    }
  );

  exports.created = function (req, res, next) {
    var fileId = Math.floor(Math.random() * 1000000000);

    console.log(req.body.RecordingUrl + '.mp3');

    var parsedURL = url.parse(req.body.RecordingUrl + '.mp3');


    var req = http.request({
      method: 'GET',
      host: parsedURL.host,
      path: parsedURL.pathname
    }, function (res) {
      var temp = '/tmp/' + new Date().toISOString() + '.mp3';

      var stream = fs.createWriteStream(temp);
      res.pipe(stream);

      res.on('end', function () {
        dropbox.putFile(temp, 'voicemail-' + new Date().toISOString() + ".mp3", function (error, stat) {
          if (error) {
            console.log(error);
          } else {
            console.log(stat);
          }
        });
      });
    });

    req.end();
  }

} else {
  exports.created = function () {};
}
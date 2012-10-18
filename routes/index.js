
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.call = function(req, res) {
  var theMessage = 'Thank you for calling ' + TINY_CONFIG.companyName + ' ';
  var baseURL = req.headers.host + req.host;
  var optionsString = '&Options[0]=' + baseURL + '/twilio/call';
  for (var i = 0; i < TINY_CONFIG.options.length; ++i) {
    //only allow 9 options
    if (i > 9) {
      i = TINY_CONFIG.options.length;
    } else {
      theMessage += TINY_CONFIG.options[i].say;
      theMessage += ' press ' + (i + 1) + ' ';
      var tempURL = baseURL + '/twilio/option?id=' + i;
      tempURL = escape(tempURL);
      optionsString += '&Options[' + i + ']=' + tempURL;
    }
  }
  theMessage += 'To hear these options again, press 0';
  theMessage = theMessage.replace(/\ /g, "+");
  res.redirect('http://twimlets.com/menu?Message=' + theMessage + optionsString);
};

exports.randomSay = function(req, res) {
  res.contentType('text/xml');
  var theOption = TINY_CONFIG.options[req.body.optionNum];
  var theResponse = theOption.respondWith[Math.floor(Math.random()*theOption.respondWith.length)];
  var responseVerb;
  if (theResponse.match('http') !== null && (theResponse.search(".mp3") > 0 ||
    theResponse.search(".wav"))) {
    responseVerb = 'Play';
  } else {
    responseVerb = 'Say';
  }
    
  res.render('randomSay', { 'responseVerb': responseVerb,
                            'response' : theResponse
  });
};


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.call = function(req, res) {
  var welcomeMessage = 'Thank you for calling ' + TINY_CONFIG.companyName + ' ';
  var theMessage = '';
  for (var i = 0; i < TINY_CONFIG.options.length; ++i) {
    //only allow 9 options
    if (i > 9) {
      i = TINY_CONFIG.options.length;
    } else {
      theMessage += TINY_CONFIG.options[i].say;
      theMessage += ' press ' + (i + 1) + '. ';
    }
  }
  theMessage += 'To hear these options again, press 0';
  res.contentType('text/xml');
  res.render('call', {optionsMessage: theMessage,
                      'welcomeMessage': welcomeMessage});
};

exports.option = function(req,res) {
  if (req.body.Digits > 0) {
    var theOption = TINY_CONFIG.options[req.body.Digits - 1];
    if (theOption.hasOwnProperty('route')) {
      res.header('Location', '/twilio/route');
      res.send('', 302);
      //res.redirect('/twilio/route');
    } else if (theOption.hasOwnProperty('respondWith')) {
      res.header('Location', '/twilio/random-say?optionNum=' + (req.body.Digits - 1));
      res.send('', 302);
      //res.redirect('/twilio/random-say?optionNum=' + (req.body.Digits - 1));
    } else {
      res.render('noOption');
    }
  } else {
    res.render('noOption');
  }
};

exports.routeCall = function(req, res) {
  var phoneNumbers = Object.keys(TINY_CONFIG.numbers);
  var numbersToCall = new Array();
  var baseURL = req.protocol + '://' + req.host;
  var numbersString = '';
  if (phoneNumbers.length > 5) {
    for (var i = 0; i < 5; ++i) {
      var theNum = Math.floor(Math.random()*phoneNumbers.length);
      numbersToCall.push(phoneNumbers[theNum]);
      numbersString += 'PhoneNumbers[' + i + ']=' + phoneNumbers[theNum] + '&';
      phoneNumbers.splice(theNum, 1);
    }
  } else {
    for (var i = 0; i < phoneNumbers.length; ++i) {
      numbersToCall.push(phoneNumbers[i]);
      numbersString += 'PhoneNumbers[' + i + ']=' + phoneNumbers[i] + '&';
    }
  }
  var messageString = TINY_CONFIG.confirmCallMessage.replace(/\ /g,"%20");
  res.redirect('http://twimlets.com/simulring?' + numbersString + 'Message=' + messageString 
     + '&FailUrl=' + baseURL + '/twilio/recording');
  //res.render('routeCall', { numbers: numbersToCall });
};

exports.randomSay = function(req, res) {
  res.contentType('text/xml');
  var theOption = TINY_CONFIG.options[req.query.optionNum];
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

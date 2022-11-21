const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function (req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'you must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  //get user
  admin
    .auth()
    .getUser(phone)
    .then((userRecord) => {
      //generate random code
      const code = Math.floor(Math.random() * 8999 + 1000);

      //to: who made the request
      //from: accounts twilio phone number
      twilio.messages.create(
        {
          body: 'your code is: ' + code,
          to: phone,
          from: '+13465344802'
        },
        (err) => {
          //callback
          if (err) {
            return res.status(422).send(err);
          }
          //save to database - 'users' collection -> (phone number)
          // - code
          // - codeValid (whether code is valid)
          admin
            .database()
            .ref('users/' + phone)
            .update({ code: code, codeValid: true }, () => {
              res.send({ success: true });
            });
        }
      );
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    });
};

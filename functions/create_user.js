const admin = require('firebase-admin');

// req.body js object containing all the data that was passed to this function when user called it
module.exports = (req, res) => {
  //verify user provided a phone
  if (!req.body.phone) {
    return res.status(422).send({ error: 'input' });
  }

  //format the phone number to remove dashes and parens
  const phone = String(req.body.phone).replace(/[^\d+]/g, ''); //anything not a digit will be replaced with ""

  //create a new user account using that phone number (async), firebase returns a
  admin
    .auth()
    .createUser({ uid: phone })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      return res.status(422).send({ error: err });
    });

  //respond to the user request, saying the account was made
};

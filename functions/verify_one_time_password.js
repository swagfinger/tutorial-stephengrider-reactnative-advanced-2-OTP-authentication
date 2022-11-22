const admin = require('firebase-admin');

module.exports = function (req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ err: 'phone and code must be provided' });
  }

  //scrubbing of values (validation)
  const phone = String(req.body.phone).replace(/[^\d+]/g, '');
  const code = parseInt(req.body.code);

  //fetch user from db / fetch code associated with user
  admin
    .auth()
    .getUser(phone)
    .then(async () => {
      const ref = admin.database().ref(`users/${phone}`);
      //get snapshot of data in database
      await ref.once('value', (snapshot) => {
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'code not valid' });
        }

        //if code is correct, make the codeValid=false
        ref.update({ codeValid: false });

        //with authentication sign-in method Anonymous,
        //- createCustomToken takes id of a user and generates a JWT for that user(async)
        //we used phone number as id, hence why we pass phone as argument
        admin
          .auth()
          .createCustomToken(phone) //create JWT
          .then((token) => res.send({ token: token }));
      });
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    });
};

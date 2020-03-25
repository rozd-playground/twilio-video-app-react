import * as functions from 'firebase-functions';
import * as twilio from 'twilio';
import * as cors from 'cors';

const MAX_ALLOWED_SESSION_DURATION = 14400;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const token = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(403).send('Forbidden!');
    return;
  }

  cors({origin: true})(req, res, () => {
    const { identity, roomName } = req.query;
    const config = functions.config();
    const tkn = new twilio.jwt.AccessToken(config.twilio.account, config.twilio.api_key, config.twilio.secret, {
      ttl: MAX_ALLOWED_SESSION_DURATION,
      identity: identity
    });
    const videoGrant = new twilio.jwt.AccessToken.VideoGrant({ room: roomName });
    tkn.addGrant(videoGrant);
    res.send(tkn.toJwt());
    console.log(`issued token for ${identity} in room ${roomName}`);
  });

});

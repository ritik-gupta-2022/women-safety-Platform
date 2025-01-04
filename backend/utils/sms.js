// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from"twilio"; // Or, for ESM: import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();  // This loads the variables from .env file
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage(url) {
  const message = await client.messages.create({
    body: `I'm in DANGER , Please help I'm sharing my location. Location URL:${url}`,
    from: "+17542191114",
    to: "+917007215662",
  });

  console.log(message.body);
}

export default createMessage;

export async function createCall() {
  client.calls
  .create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+917007215662',
    from: '+17542191114', 
  })
  .then(call => console.log(`Call initiated with SID: ${call.sid}`))
  .catch(error => console.error(error));

}
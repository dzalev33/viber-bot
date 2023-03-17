const ViberBot = require('viber-bot').Bot,
  BotEvents = require('viber-bot').Events,
  TextMessage = require('viber-bot').Message.Text,
  express = require('express');
const app = express();

// if (!process.env.BOT_ACCOUNT_TOKEN) {
//   console.log('Could not find bot account token key.');
//   return;
// }
// if (!process.env.EXPOSE_URL) {
//   console.log('Could not find exposing url');
//   return;
// }

const bot = new ViberBot({
  authToken:'50ae53fb49a7e4df-be3a44ea4035ad6-b74326b08da78cad',
  name: "Seljak",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});
bot.on(BotEvents.SUBSCRIBED, response => {
  response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me anything.`));
});
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  response.send(new TextMessage(`Куро да ми јајш`));
});
const port = process.env.PORT || 3000;
app.use("/viber/webhook", bot.middleware());
app.listen(port, () => {
  console.log(`Application running on port: ${port}`);
  bot.setWebhook(`https://7d3c-62-162-179-165.eu.ngrok.io/viber/webhook`).catch(error => {
    console.log('Can not set webhook on following server. Is it running?');
    console.error(error);
    process.exit(1);
  });
});
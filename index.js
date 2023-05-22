const ViberBot  = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const bot = new ViberBot({
    authToken:'50ae53fb49a7e4df-be3a44ea4035ad6-b74326b08da78cad',
    name: "Seljak",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png"
});

bot.on(BotEvents.SUBSCRIBED, response => {
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me anything.`));
});

bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    try {
        // Fetch the website HTML
        const websiteHtml = await axios.get('https://www.mylpg.eu/stations/macedonia/prices/');

        // Parse HTML and extract the gas prices
        const $ = cheerio.load(websiteHtml.data);
        let gasPrices = '';

        $('tr').each((index, element) => {
            const disel = $(element).find('td:nth-child(3)').text();
            const benzin = $(element).find('td:nth-child(2)').text();
            if(disel && benzin) {
                gasPrices += `Benzin: ${benzin}, Dizel: ${disel}\n`;
            }
        });

        // Create a message
        const msg = new TextMessage(`Current gas prices are: \n${gasPrices}`);

        // Send the message to the user
        response.send(msg);
    } catch (error) {
        console.error(error);
        response.send(new TextMessage(`Sorry, I couldn't fetch the gas prices at the moment.`));
    }
});

const port = process.env.PORT || 3000;

app.use("/viber/webhook", bot.middleware());

app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
    bot.setWebhook(`https://viber-bot-2l7c.onrender.com/viber/webhook`).catch(error => {
        console.log('Can not set webhook on following server. Is it running?');
        console.error(error);
        process.exit(1);
    });
});

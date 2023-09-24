const { App } = require('@slack/bolt');
const { time } = require('console');
const { OpenAI } = require('openai');
require('dotenv').config();



//OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_TOKEN, 
});

// Slack App configuration
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

//SLACK COMMAND
app.command("/question", async({command, ack, client})=>{
    await ack();
    const question_message = await client.chat.postMessage({text:`:hourglass: *Generating Your Answer* - [Your Input: ${command.text}]`, channel:command.channel_id})
    const answer = await question(command.text)

    const timestamp = question_message.ts;

    await client.chat.update({
      channel:command.channel_id,
      ts: timestamp,
      text:`*Answer Generated* - ${answer}`
    });
});


// This code is for v4 of the openai package: npmjs.com/package/openai
async function question(prompt) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: `${prompt}`,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["/n"],
  });
    console.log("Response: ",response )
    return response.choices[0].text;
}

(async () => {
    // Start your app
    await app.start();
  
    console.log('Bot is running!');
  })();
const readline = require('readline');
const utils = require("./utils")
const { chatWithAgent } = require('./agent');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 MCP Agent ready. Type your question.');
  let systemPrompt = await utils.readFile("data/prompt.txt");
  const messages = [{ role: 'system', content: systemPrompt}];

  while (true) {
    const input = await new Promise(resolve => rl.question('\n💬 You: ', resolve));

    if ((input.toLowerCase() === 'exit') || (input == "")) {
      console.log('👋 Bye!');
      process.exit(0);
    }

    messages.push({ role: 'user', content: input });

    const reply = await chatWithAgent(messages);
    messages.push(reply);

    // console.log('\n🤖 Assistant:', reply);
    console.log('» ', reply.content)
  }
}

main();

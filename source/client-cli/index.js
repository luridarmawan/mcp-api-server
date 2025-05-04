const readline = require('readline');
const { chatWithAgent } = require('./agent');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 MCP Agent ready. Type your question.');
  const messages = [{ role: 'system', content: 'You are an assistant who can use MCP server plugins to help answer questions.' }];

  while (true) {
    const input = await new Promise(resolve => rl.question('\n💬 You: ', resolve));

    if (input.toLowerCase() === 'exit') {
      console.log('👋 Bye!');
      process.exit(0);
    }

    messages.push({ role: 'user', content: input });

    const reply = await chatWithAgent(messages);

    console.log('\n🤖 Assistant:', reply);
  }
}

main();

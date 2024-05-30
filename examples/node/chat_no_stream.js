import Ollama from "../../dist/node/index.js";

async function setup() {
  const ollama = new Ollama({
    url: "http://127.0.0.1:11434/api/",
    model: "llama3",
  });

  // Chat request is a non-streaming version of chat
  const response = await ollama.chat_request([
    { role: "system", content: "You are the best llama." },
    { role: "user", content: "Tell me a joke about llamas and AI." },
  ]);
  console.log("Response received:", response);
  console.log(response.message.content)
}

setup();

import Ollama from "../../../dist/browser/index.js";

async function main() {
  const ollama = new Ollama({
    url: "http://127.0.0.1:11434/api/",
    model: "llama3",
  });

  const response = await ollama.chat_request([
    { role: "system", content: "You are the best llama." },
    { role: "user", content: "Tell me a joke about llamas and AI." },
  ]);
  console.log("Response received:", response);
  console.log(response.message.content);
}
main();

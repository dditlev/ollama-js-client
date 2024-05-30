import Ollama from "../../../dist/browser/index.js";

async function main() {
  const ollama = new Ollama({
    url: "http://127.0.0.1:11434/api/",
    model: "llama3",
  });
  const response = await ollama.prompt(
    "Hello tell me about something very specific but completly random."
  );
  console.log(response);
  const next_response = await ollama.prompt("Elaborate on that.");
  console.log(next_response);
}
main();

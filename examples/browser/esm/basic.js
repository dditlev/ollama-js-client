import Ollama from '../../../dist/browser/index.js';

async function main() {
    const ollama = new Ollama({
        url:"http://127.0.0.1:11434/api/",
        model:"llama2",
    });
    const response = await ollama.prompt("Hello tell me about something very specific but completly random.")
    console.log(response);
    const next_response = await ollama.prompt("Elaborate on that.")
    console.log(next_response);
}
main();

// curl -X POST http://localhost:11434/api/generate -d '{
//   "model": "llama2",
//   "prompt":"Why is the sky blue?"
// }'

// false && fetch("http://127.0.0.1:11434/api/generate", {
//     method: "POST",
//     body: JSON.stringify({
//         model: "llama2",
//         prompt: "Why is the sky blue?",
//         stream:false
//         })
//     })
//     .then(response => response.json())
//     .then(data => console.log(data));
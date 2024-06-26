import Ollama from '../../dist/node/index.js';

async function main() {
    const ollama = new Ollama({
        url:"http://127.0.0.1:11434/api/",
        model:"llama3",
    });
    
    const response = await ollama.prompt("Hello tell me about something very specific but completly random.")
    console.log(response.response);

    const next_response = await ollama.prompt("Elaborate on that.")
    console.log(next_response.response);
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
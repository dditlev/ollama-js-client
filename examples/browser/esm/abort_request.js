import Ollama from '../../../dist/browser/index.js';

async function main() {
    const ollama = new Ollama({
        url:"http://127.0.0.1:11434/api/",
        model:"llama3",
    });
    const responded = []
    const response = await ollama.prompt_stream("Hello tell me about something very specific but completly random.",(error,response) => {
        console.log(response);

        if (responded.length > 10) {
            console.log("aborting")
            ollama.stop();
            return
        }

        if (error) {
            console.log(error);
        }
        else if (response.done) {
            console.log("DONE!")
        }
        else {
            responded.push(response);
        }
    })
    console.log("response is",response)
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
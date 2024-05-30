import Ollama from '../../../dist/browser/index.js';

async function setup() {
    const ollama = new Ollama({
        url:"http://127.0.0.1:11434/api/",
        model:"llama3",
        verbose:true,
        options:{
            temperature:1,
            top_p:0.9,
            top_k:5,
        }
    });
    const response = await ollama.prompt("Hello tell me about something very specific but completly random.")
    console.log(response.response);
    const next_response = await ollama.prompt("Elaborate on that.")
    console.log(next_response.response);
}
setup();
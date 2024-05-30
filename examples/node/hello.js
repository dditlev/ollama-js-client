import Ollama from '../../dist/node/index.js';

async function main() {
    const ollama = new Ollama({
        url:"http://127.0.0.1:11434/api/",
        model:"llama3",
    });
    
    const response = await ollama.prompt("Hello!")
    console.log(response.response);
}
main();

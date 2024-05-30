import Ollama from '../../dist/node/index.js';

async function setup() {
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
setup();
import Ollama from '../../../dist/browser/index.js';

async function main() {
    const ollama = new Ollama({
        url: "http://127.0.0.1:11434/api/",
        model: "llama2",
        // Add headers or other initialization parameters if necessary
    });

    let responses = [];

    // Call prompt_stream with your prompt and a callback function
    ollama.prompt_stream("Hello, world!", (error, response) => {
        if (error) {
            console.error("Error occurred:", error);
            return;
        }

        console.log("Response received:", response);

        // If there's a valid response and it's not done yet, accumulate it
        if (response && !response.done) {
            console.log("Response chunk received:", response.response);
            responses.push(response.response);
        }
        
        // When done, process the accumulated response
        if (response && response.done) {
            console.log("Final response:", responses.join(""));
            console.log("Stream completed.");
            // Handle the final response or perform any cleanup if necessary
        }
    });
}

main();
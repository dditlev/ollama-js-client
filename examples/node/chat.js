import Ollama from "../../dist/node/index.js";

async function setup() {
  const ollama = new Ollama({
    url: "http://127.0.0.1:11434/api/",
    model: "llama3",
    // Add headers or other initialization parameters if necessary
  });

  let responses = [];

  // Chat is a stream that takes an array of messages and a callback function
  ollama.chat(
    [
      { role: "system", content: "You are the best llama." },
      { role: "user", content: "Tell me a joke about llamas and AI." },
    ],
    (error, response) => {
      if (error) {
        console.error("Error occurred:", error);
        return;
      }

      console.log("Response received:", response);

      // If there's a valid response and it's not done yet, accumulate the response content
      if (response && !response.done) {
        console.log("Response chunk received:", response.message.content);
        responses.push(response.message.content);
      }

      // When done, process the accumulated response into a single message
      if (response && response.done) {
        console.log("Stream completed.");

        // Merge the response message with the accumulated responses
        const merged_response_message = Object.assign({}, response, {
          message: {
            role: "assistant",
            content: responses.join("") + response.message.content,
          },
        });

        console.log("Final response:", merged_response_message);

        // Add this message back to the chat history to continue the conversation
        console.log("Assistant message:", merged_response_message.message);
      }
    }
  );
}

setup();

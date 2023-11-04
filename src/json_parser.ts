export default function JSONparser(inputString: string): string | any[] | Record<string, any> {
    // First, try to parse the entire input string as JSON
    try {
        return JSON.parse(inputString);
    } catch (err) {
        // If the input isn't valid JSON, then proceed with the bracket counting method
        const startIndex = inputString.search(/[\[{]/);
        if (startIndex === -1) {
            console.log('No JSON found in the string');
            return inputString; // No JSON found
        }

        let openBrackets = 0;
        let jsonCandidate = '';
        for (let i = startIndex; i < inputString.length; i++) {
            jsonCandidate += inputString[i];
            if (inputString[i] === '{' || inputString[i] === '[') {
                openBrackets++;
            } else if (inputString[i] === '}' || inputString[i] === ']') {
                openBrackets--;
            }

            // If the count of open and close brackets matches, try to parse
            if (openBrackets === 0) {
                try {
                    return JSON.parse(jsonCandidate);
                } catch (parseErr) {
                    console.log('Invalid JSON');
                    break; // JSON was not valid, exit the loop
                }
            }
        }

        // If we reach this point, JSON was not closed properly or was invalid
        console.log('The provided string cannot be parsed into JSON.');
        return inputString;
    }
}

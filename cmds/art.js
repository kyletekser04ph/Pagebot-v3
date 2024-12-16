const axios = require('axios');
const cooldown = require('../utils/cooldown'); // Import cooldown module

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'art',  // Command name
  description: 'generates an image based on a prompt',  // Description
  usage: 'art [prompt]',  // Usage
  author: 'KALIX AO [API BY JOSH]',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Sanitize the prompt (crucial for security)
    const sanitizedPrompt = sanitizePrompt(args.join(' '));
    if (!sanitizedPrompt) {
      await sendMessage(senderId, { text: 'Missing or invalid prompt, use only alphanumeric characters and spaces.' }, pageAccessToken);
      return;
    }

    const prompt = sanitizedPrompt;
    const apiUrl = `https://joshweb.click/api/art?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt


      // Check cooldown for the senderId
      if (cooldown.checkCooldown(senderId, 25)) {
        await sendMessage(senderId, { text: 'Please wait 25 seconds before using this command again.' }, pageAccessToken);
        return; // Exit if sender is on cooldown
      }
      
      
    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image...' }, pageAccessToken);

    try {
      // Send the generated image to the user as an attachment
      const response = await axios.get(apiUrl, {
        responseType: 'stream'
      });

      // Check if the API call was successful
      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Stream the image as an attachment instead of saving it locally
     await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  // URL of the generated image
          }
        }
      }, pageAccessToken);

        // Importantly, add the sender to the cooldown after successful execution.
        await cooldown.addCooldown(senderId, 25);


    } catch (error) {
      console.error('Error generating image:', error);

      //Handle specific error types for better feedback
      if (error.response && error.response.status === 400) { // Example handling for bad request
          await sendMessage(senderId, {
              text: 'Invalid prompt. Please use a valid prompt.'
          }, pageAccessToken);
      } else {
          await sendMessage(senderId, {
              text: 'An error occurred while generating the image. Please try again later.'
          }, pageAccessToken);
      }
    }
  }
};

// Helper function for sanitizing the prompt
function sanitizePrompt(prompt) {
  // Basic sanitization:  Only alphanumeric characters and spaces
  return /^[a-zA-Z0-9\s]+$/.test(prompt) ? prompt : null;
}

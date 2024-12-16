const axios = require('axios');

module.exports = {
	name: 'bing',
	description:
		'Generate and send images directly from Bing based on your prompt.',
	author: 'KALIX AO [API BY JEROME]',
	async execute(senderId, args, pageAccessToken, sendMessage) {
		if (args.length === 0) {
			return sendMessage(
				senderId,
				{text: 'Please provide a prompt. Example: /bing dog'},
				pageAccessToken,
			);
		}

		const prompt = args.join(' ');

		// Use a more robust error handling approach
		try {
			// Validate the prompt (optional, but recommended)
			if (prompt.length < 3) {
				return sendMessage(
					senderId,
					{text: 'Prompt must be at least 3 characters long.'},
					pageAccessToken,
				);
			}

			sendMessage(
				senderId,
				{text: `Generating image...`},
				pageAccessToken,
			);

			const apiUrl = `https://jerome-web.onrender.com/service/api/bing?prompt=${encodeURIComponent(
				prompt,
			)}`;
			const response = await axios.get(apiUrl, {timeout: 60000}); // Add timeout

			if (response.status >= 200 && response.status < 300) {
				// Check for successful response status codes
				const data = response.data;
				if (
					data.success &&
					Array.isArray(data.result) &&
					data.result.length > 0
				) {
					const imageMessages = data.result
						.slice(0, 4)
						.map(imageUrl => ({
							attachment: {
								type: 'image',
								payload: {
									url: imageUrl,
									is_reusable: true,
								},
							},
						}));

					for (const imageMessage of imageMessages) {
						await sendMessage(
							senderId,
							imageMessage,
							pageAccessToken,
						);
					}
				} else {
					// Provide more specific error message
					let errorMessage =
						'Sorry, no images were found for "' + prompt + '".';
					if (data.error) {
						errorMessage = 'Error: ' + data.error;
					}
					sendMessage(
						senderId,
						{text: errorMessage},
						pageAccessToken,
					);
				}
			} else {
				console.error(
					`Error fetching Bing images (HTTP status ${response.status}):`,
					response.data,
				);
				sendMessage(
					senderId,
					{
						text: 'Sorry, there was an error processing your request.',
					},
					pageAccessToken,
				);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Better error handling for axios errors
				const axiosError = error;
				console.error(
					'Error fetching Bing images:',
					axiosError.message,
					axiosError.response?.data,
				); // Check for response data

				// Check if it was a timeout error
				if (error.code === 'ECONNABORTED') {
					sendMessage(
						senderId,
						{text: 'Request timed out. Please try again.'},
						pageAccessToken,
					);
				} else {
					sendMessage(
						senderId,
						{
							text: 'Sorry, there was an error processing your request.',
						},
						pageAccessToken,
					);
				}
			} else {
				console.error('Error fetching Bing images (General):', error);
				sendMessage(
					senderId,
					{text: 'Sorry, there was an unexpected error.'},
					pageAccessToken,
				);
			}
		}
	},
};

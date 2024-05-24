/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Queue consumer: a Worker that can consume from a
 * Queue: https://developers.cloudflare.com/queues/get-started/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async queue(batch, env) {
		for (const message of batch.messages) {
			const email = message.body.email;
			const application = message.body;

			try {
				const value = await env.KV.get(email);
				let existingApplications;
				if (value) {
					existingApplications = JSON.parse(value);
				} else {
					existingApplications = [];
				}
				existingApplications.push(application);
				await env.KV.put(email, JSON.stringify(existingApplications));
			} catch (error) {
				console.error('Error processing message:', error);
				// Re-queue or send to failure queue based on your chosen approach
				return Promise.reject(error);
			}
		}
		return Promise.resolve(); // Indicate successful processing of all messages
	},
};

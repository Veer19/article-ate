// Create the container div for our app
const container = document.createElement("div");
container.id = "article-assistant-root";
document.body.appendChild(container);

// Example API call
async function queryAPI() {
	const response = await fetch("https://your-nextjs-app.com/api/query", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			/* your data */
		}),
	});
	return await response.json();
}

// Load your Next.js app
const script = document.createElement("script");
script.src = chrome.runtime.getURL("_next/static/chunks/main.js");
document.body.appendChild(script);

// Add extension-specific permissions to manifest.json

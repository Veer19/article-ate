import { HfInference } from "@huggingface/inference";
const HUGGINGFACE_API_KEY = "";

const fetchEmbeddings = async () => {
	const text = "lucknow is the best city in india";

	const inference = new HfInference("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");

	const result = await inference.featureExtraction({
		model: "sentence-transformers/all-MiniLM-L6-v2",
		inputs: text,
	});
	console.log(result);
};

fetchEmbeddings();

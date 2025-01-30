# ChatPDF - Web Content Summarizer

A Next.js application that summarizes web content and provides an interactive chat interface using Azure OpenAI.

## Setup

1. Create an Azure OpenAI resource in your Azure account
2. Deploy a GPT-3.5 Turbo model in your Azure OpenAI resource
3. Create a `.env.local` file with the following variables:

```env
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=your_model_deployment_name
```

## Features

- Web content summarization using Azure OpenAI
- Interactive chat interface for asking questions about the content
- Cost-effective implementation using GPT-3.5 Turbo
- Smart content extraction focusing on main article content
- Efficient token usage with text length limits

## Implementation Details

The application uses Azure OpenAI Service with the following optimizations for cost and performance:

1. Uses GPT-3.5 Turbo instead of GPT-4 for better cost efficiency
2. Limits input text length to 6000 characters to control token usage
3. Uses lower temperature (0.3) for summaries to get more focused results
4. Sets token limits on responses to control costs
5. Implements smart content extraction to focus on relevant text

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Azure OpenAI Cost Optimization

The implementation includes several optimizations to keep costs low:

1. **Model Selection**: Uses GPT-3.5 Turbo which is significantly cheaper than GPT-4 while still providing good quality summaries
2. **Token Management**: 
   - Limits input text length
   - Sets maximum output tokens
   - Removes irrelevant content before processing
3. **Temperature Settings**:
   - Lower temperature (0.3) for summaries to reduce token usage
   - Moderate temperature (0.5) for chat to balance creativity and efficiency
4. **Content Preprocessing**:
   - Removes navigation, headers, footers, and other non-content elements
   - Focuses on main article content to reduce unnecessary token usage

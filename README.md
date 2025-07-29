# cocoTA
my first github repository

## Setup Instructions

This application requires a Supabase project with an Edge Function deployed. To set up:

1. **Connect to Supabase**: Click the "Connect to Supabase" button in the top right corner of the interface

2. **Deploy the Edge Function**: After connecting, you need to deploy the `analyze-homework` Edge Function to your Supabase project using the Supabase CLI:
   ```bash
   supabase functions deploy analyze-homework
   ```

3. **Set up OpenAI API Key**: The Edge Function requires an OpenAI API key. Set it as a secret in your Supabase project:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```

## Troubleshooting

- **"Not Found" Error**: This means the Edge Function hasn't been deployed to your Supabase project yet
- **"Supabase configuration missing"**: Click the "Connect to Supabase" button to set up your project connection
- **Analysis fails**: Ensure your OpenAI API key is properly set as a Supabase secret
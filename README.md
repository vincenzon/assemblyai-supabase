# assemblyai-supabase

Example Supabase webhook handler for AssemblyAI transcriptions

## Setup

- Assembly AI python client

```
pip install assemblyai
```

- Supabase edge function setup

```
npx supabase init
npx supabase login
npx supabase link
npx supabase functions new assembly-ai-webhook
```

- Create and populate `supabase/functions/assembly-ai-webhook/.env`

```
ASSEMBLY_AI_SHARED_SECRET=<User defined>
```

- Write the webhook

```
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (request) => {
  let status = 500;
  try {
    const body = await request.json();
    const headers = await request.headers;
    const secret = headers.get("x-shared-secret");

    if (secret !== Deno.env.get("ASSEMBLY_AI_SHARED_SECRET")) {
      console.log(`Invalid shared secret`);
      status = 401;
    } else {
      console.log(`Received: ${JSON.stringify(body)}`);
      status = 200;
    }
  } catch (e) {
    console.log(e);
  } finally {
    return new Response(JSON.stringify({}), { status });
  }
});
```

- Deploy webhook

```
npx supabase secrets set --env-file supabase/functions/assembly-ai-webhook/.env
npx supabase functions deploy --no-verify-jwt assembly-ai-webhook
```

- Get the webhook url from the Supabase dashboard
  https://<project-id>.supabase.co/functions/v1/assembly-ai-webhook

- Run the transcription using this url

```
#!/usr/bin/python3
import os
import assemblyai as aai

aai.settings.api_key = os.environ.get('ASSEMBLY_AI_KEY')

webhookUrl = os.environ.get('SUPABASE_ASSEMBLY_AI_WEBHOOK')
sharedSecret = os.environ.get('AAI_SHARED_SECRET')

audioUrl = "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3"

config = aai.TranscriptionConfig().set_webhook(webhookUrl, "x-shared-secret", sharedSecret)

aai.Transcriber().submit(audioUrl, config)
```

- See the webhook invocation in the Supabase dashboard

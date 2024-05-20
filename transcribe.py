#!/usr/bin/python3
import os
import assemblyai as aai

aai.settings.api_key = os.environ.get('ASSEMBLY_AI_KEY')

webhookUrl = os.environ.get('SUPABASE_ASSEMBLY_AI_WEBHOOK')
sharedSecret = os.environ.get('AAI_SHARED_SECRET')

audioUrl = "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3"

config = aai.TranscriptionConfig().set_webhook(webhookUrl, "x-shared-secret", sharedSecret)

aai.Transcriber().submit(audioUrl, config)
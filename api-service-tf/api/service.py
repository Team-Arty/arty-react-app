import os
import asyncio
from fastapi import FastAPI, File, Query, APIRouter
from starlette.middleware.cors import CORSMiddleware
from api import model_gru
from api import model_art
from tempfile import TemporaryDirectory
from google.cloud import texttospeech
import uuid
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

image_dir = "persistent-folder"
router = APIRouter()
# Instantiates a client
client = texttospeech.TextToSpeechClient()

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def get_index():
    return {
        "message": "Welcome to the API Service"
    }

@app.post("/predict")
async def predict(
        file: bytes = File(...)
):
    print("predict file:", len(file), type(file))

    # Save the image
    
    image_path = os.path.join(os.getcwd(),'api','persistent-folder', 'test.png')
    with open(image_path, "wb") as output:
        output.write(file)

    get_prediction_gru = model_gru.predict_GRU(image_path)
    get_prediction_art = model_art.predict_ART(image_path)
    print(get_prediction_gru)
    print(get_prediction_gru)
    print("---------------")

    return {
        "caption_gru": get_prediction_gru,
        "caption_art":get_prediction_art
    }


@app.post("/text2audio")
async def text2audio(json_obj: dict):
    print(print(json_obj))

    output_dir = "outputs"
    os.makedirs(output_dir, exist_ok=True)

    # Generate a unique id
    file_id = uuid.uuid1()
    file_path = os.path.join(output_dir, str(file_id)+".mp3")

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=json_obj["text"])

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # Save the response's audio_content which is binary.
    with open(file_path, "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file', file_path)

    return {
        "audio_path": file_path,
        "text": json_obj["text"]
    }


@app.get("/get_audio_data")
async def get_audio_data(
        path: str = Query(..., description="Audio path")
):
    print(path)
    return FileResponse(path, media_type="audio/mp3")
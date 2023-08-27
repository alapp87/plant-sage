import os
import logging
import json
import requests
import base64
from typing import Annotated

import openai

from fastapi import FastAPI, File, Response, status

from google.cloud import secretmanager

log = logging.getLogger(__name__)

app = FastAPI()

_plantid_api_key = None


@app.on_event("startup")
def startup():
    project_id = os.environ.get("PROJECT_ID")
    openai_api_key_secret_id = os.environ.get(
        "OPENAI_API_KEY_SECRET_ID", "OPENAI_API_KEY"
    )
    plantid_api_key_secret_id = os.environ.get(
        "PLANTID_API_KEY_SECRET_ID", "PLANTID_API_KEY"
    )
    log_level = os.environ.get("LOG_LEVEL", "INFO")

    logging.basicConfig(level=log_level)

    set_openai_api_key(project_id, openai_api_key_secret_id)
    set_plantid_api_key(project_id, plantid_api_key_secret_id)


@app.post("/identify", status_code=status.HTTP_200_OK)
def identify(image: Annotated[bytes, File()], response: Response):
    if not image:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"status": "error", "message": "Image is required"}

    try:
        log.info("About to identify plant by image...")
        plant_species = _identify_plant(image)
        return {"plant_species": plant_species}
    except Exception as e:
        log.error("An unexpected error occurred identifying plant.", exc_info=True)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": "Internal server error"}


@app.get("/generate/info/care", status_code=status.HTTP_200_OK)
def generate_info_and_care_routine(plant_species: str, response: Response):
    if not plant_species:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"status": "error", "message": "plant_species param is required"}

    try:
        log.info("About to generate info and care routine for %s...", plant_species)

        messages = _initialize_messages(plant_species)
        return _generate_info_and_care_routine(messages)
    except Exception as e:
        log.error("An unexpected error occurred generating plant info.", exc_info=True)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"status": "error", "message": "Internal server error"}


def _identify_plant(image: bytes) -> list[dict]:
    plant_species = []

    image_b64 = base64.encodebytes(image).decode("utf-8")
    images = [f"data:image/jpg;base64,{image_b64}"]

    headers = {"Api-Key": _plantid_api_key, "Content-Type": "application/json"}
    data = {"images": images}
    response = requests.post(
        "https://plant.id/api/v3/identification", headers=headers, data=json.dumps(data)
    )

    plant_id_data = response.json()
    log.info("Retrieved plant id data :: %s", plant_id_data)

    suggestions = plant_id_data["result"]["classification"]["suggestions"]
    if len(suggestions) > 0:
        for suggestion in suggestions:
            name = suggestion["name"]
            probability = suggestion["probability"]

            log.info("Suggestion name :: %s", name)
            log.info("Suggestion probability :: %s", probability)

            plant_species.append({"name": name, "probability": probability})

    log.info("Determined plant species :: %s", plant_species)

    return plant_species


def set_openai_api_key(project_id, secret_id: str) -> None:
    if not openai.api_key or openai.api_key == "":
        log.info("Setting OpenAI API key...")
        openai.api_key = access_secret_version(project_id, secret_id)


def set_plantid_api_key(project_id, secret_id: str) -> None:
    global _plantid_api_key
    if not _plantid_api_key or _plantid_api_key == "":
        log.info("Setting PlantID API key...")
        _plantid_api_key = access_secret_version(project_id, secret_id)


def _initialize_messages(plant_species) -> list:
    return [
        {
            "role": "system",
            "content": """You are a helpful plant expert and plant care routine generating assistant.
        You should provide general information and a care routine for the given plant name in the prompt.
        Return a JSON object that follows this format: {"info": <general_information>, "care_routine": <care_routine_as_json_object>}""",
        },
        {
            "role": "user",
            "content": f"Provide general information and a care routine for the plant species: {plant_species}",
        },
    ]


def _generate_info_and_care_routine(messages: list[dict]) -> dict:
    resp = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    return json.loads(resp["choices"][0]["message"]["content"])


def access_secret_version(project_id, secret_id, version_id="latest"):
    log.info("Retrieving secret %s :: version %s", secret_id, version_id)

    # Create the Secret Manager client.
    client = secretmanager.SecretManagerServiceClient()

    # Build the resource name of the secret version.
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"

    # Access the secret version.
    response = client.access_secret_version(name=name)

    # Return the decoded payload.
    return response.payload.data.decode("UTF-8")

# Plant Sage

This is a FastAPI application designed to identify plants from images using the PlantID API and generate plant care information using OpenAI's GPT-3.5 Turbo model.

## Getting Started

To run the application locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up your environment variables. Create a `.env` file in the project directory and add the following variables:

   ```env
   PROJECT_ID=your_project_id
   OPENAI_API_KEY_SECRET_ID=your_openai_api_key_secret_id
   PLANTID_API_KEY_SECRET_ID=your_plantid_api_key_secret_id
   LOG_LEVEL=INFO
   ```

   Replace `your_project_id`, `your_openai_api_key_secret_id`, and `your_plantid_api_key_secret_id` with your actual values.

4. Run the FastAPI application:

   ```bash
   uvicorn app:app --reload
   ```

## Endpoints

### `POST /identify`

This endpoint allows you to identify a plant from an image. Send a POST request with a `multipart/form-data` file upload containing the image. The response will contain the identified plant species.

Example using `curl`:

```bash
curl -X POST -F "image=@path/to/your/image.jpg" http://localhost:8000/identify
```

### `GET /generate/info/care`

This endpoint generates information and a care routine for a specific plant species. Send a GET request with the `plant_species` parameter set to the target plant species. The response will provide general information and care instructions for the specified plant.

Example using `curl`:

```bash
curl "http://localhost:8000/generate/info/care?plant_species=Rose"
```

## Configuration

Ensure you have set up the necessary secrets in Google Cloud Secret Manager:

- `OPENAI_API_KEY`: Your OpenAI API key.
- `PLANTID_API_KEY`: Your PlantID API key.

## Dependencies

- Python 3.8+
- FastAPI
- openai
- google-cloud-secretmanager
- requests
- base64

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note:** This README assumes you have experience with FastAPI, environment variables, and working with APIs. Make sure to replace placeholder values with your actual data.

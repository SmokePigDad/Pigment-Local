import os
import requests
import urllib.parse
from flask import Flask, jsonify, send_from_directory
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
print("Flask App Initialized.")


@app.route('/models')
def get_models():
    API_KEY = os.getenv('POLLINATIONS_API_KEY')

    base_models = [
        {"name": "flux", "description": "High-quality image generation.", "is_default": True},
        {"name": "turbo", "description": "A very fast image generation model."}
    ]

    print(f"[API /models] Request received. Key Found: {'Yes' if API_KEY else 'No'}")

    if API_KEY:
        print("[API /models] API Key found. Adding 'gptimage' to the model list.")
        premium_models = [
            {"name": "gptimage", "description": "Premium model with advanced features."}
        ]
        final_models = premium_models + base_models
    else:
        print("[API /models] No API Key found. Returning public models only.")
        final_models = base_models
    
    return jsonify(final_models)


@app.route('/inspire')
def inspire_prompt():
    API_KEY = os.getenv('POLLINATIONS_API_KEY')
    print(f"[API /inspire] Request received. Key Found: {'Yes' if API_KEY else 'No'}")
    base_prompt_instruction = "Generate a highly artistic and imaginative image prompt. Ensure the description is vivid, creative, and detailed enough to inspire unique artwork. Provide only the image prompt without any introductory or concluding comments."
    encoded_instruction = urllib.parse.quote(base_prompt_instruction)
    url = f"https://text.pollinations.ai/{encoded_instruction}"
    params = {"temperature": 0.9}
    headers = {}
    if API_KEY:
        params['model'] = 'openai-large'
        headers['Authorization'] = f'Bearer {API_KEY}'
    else:
        params['model'] = 'openai'
    try:
        response = requests.get(url, params=params, headers=headers, timeout=15)
        response.raise_for_status()
        return jsonify({"prompt": response.text})
    except requests.exceptions.RequestException as e:
        print(f"[API /inspire] Error calling Pollinations Text API: {e}")
        return jsonify({"error": "Failed to fetch prompt from Pollinations API"}), 500


@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    print("-----------------------------------------------------")
    print("🎨 Pigment with Pollinations.AI")
    print("Starting Flask server on http://127.0.0.1:8888")
    print("Stop the server with CTRL+C")
    print("-----------------------------------------------------")
    app.run(debug=True, port=8888)
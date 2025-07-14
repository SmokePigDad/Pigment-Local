# 🎨 Pigment with Pollinations.AI

A user-friendly web interface for generating beautiful AI art using the powerful and accessible Pollinations.AI API. Pigment provides a simple yet robust control panel to create stunning images by choosing from various models, art styles, and generation settings.



## About The Project

Pigment is designed to be a clean, intuitive, and feature-rich front-end for the Pollinations.AI image generation service. It serves as both a practical tool for artists and creators and a comprehensive example of how to integrate the Pollinations API into a web application.

The entire application runs locally, communicating directly with the Pollinations API. It's built with a lightweight Python Flask backend and a dynamic Vanilla JavaScript front-end, making it easy to run, understand, and extend.

---

## ✨ Features

Pigment comes packed with features to give you creative control over your AI image generations:

*   **🤖 Dynamic Model Loading**: Fetches available AI models directly from the backend, with support for premium models if an API key is provided.
*   **🎨 Extensive Art Style Library**: Choose from a curated list of over 200 distinct art styles to instantly transform your prompts.
*   **🎲 "Inspire Me" Prompt Generator**: Feeling stuck? Get a random, creative prompt suggestion with a single click.
*   **⚙️ Batch Generation Mode**: Generate one image for every single art style in the library from a single prompt, perfect for exploration.
*   **🖼️ Interactive Image Gallery**:
    *   View all generated images in a clean, responsive grid.
    *   ❤️ **Favorite System**: Mark your best creations and download them separately.
    *   📥 **Download All/Favorites**: Easily download all generated images or just your favorites as a ZIP file.
    *   🗑️ **Clear Gallery**: Start fresh by clearing all images and canceling any ongoing generation.
*   **🔧 Fine-Tuned Controls**:
    *   Select the number of images to generate.
    *   Choose from various standard image aspect ratios.
    *   Toggle private generation, watermark removal, and automatic prompt enhancement.
    *   Enable transparent backgrounds (for supported models like `gptimage`).
*   **🔄 Real-time Progress**: A visual progress bar and status text keep you updated on the generation process.
*   **🚀 Lightweight & Local**: Runs entirely on your local machine with no complex dependencies.

---

## 🚀 Getting Started

Follow these instructions to get Pigment up and running on your local machine.

### Prerequisites

*   Python 3.8 or higher
*   Git for cloning the repository

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/SmokePigDad/pigment-pollinations.git
    cd pigment-local
    ```

2.  **Create a Virtual Environment:**
    It is highly recommended to use a virtual environment to manage project dependencies cleanly and avoid conflicts with other Python projects.

    ```sh
    python -m venv venv
    ```

3.  **Activate the Virtual Environment:**
    You must activate the environment in your terminal session before installing dependencies.

    *   **On Windows:**
        ```sh
        .\venv\Scripts\activate
        ```
    *   **On macOS & Linux:**
        ```sh
        source venv/bin/activate
        ```
    Your terminal prompt should now be prefixed with `(venv)`.

4.  **Install Dependencies:**
    Install all the required Python packages from the `requirements.txt` file.

    ```sh
    pip install -r requirements.txt
    ```

5.  **Configure Environment Variables (Optional but Recommended):**
    The app uses a `.env` file to manage API keys.

    *   Create a `.env` file in the project root by copying the example file:
        ```sh
        # On Windows (Command Prompt)
        copy .env.example .env

        # On macOS/Linux
        cp .env.example .env
        ```
    *   Open the newly created `.env` file and add your Pollinations.AI API key. If you don't have one, you can get it from the [Pollinations Website](https://pollinations.ai/).
        ```
        POLLINATIONS_API_KEY="your_api_key_here"
        ```
    > **Note:** While the app works without an API key, providing one unlocks premium models (like `gptimage`), advanced features like transparent backgrounds, and higher-quality "Inspire Me" prompts.

---

## 🖥️ Usage

Once the setup is complete, you can run the Flask server.

```sh
python server.py
```

This will start the web server. You will see output in your terminal like this:

```
-----------------------------------------------------
🎨Pigment with Pollinations.AI
Starting Flask server on http://127.0.0.1:8888
Stop the server with CTRL+C
-----------------------------------------------------
```

Now, open your web browser and navigate to:
**[http://127.0.0.1:8888](http://127.0.0.1:8888)**

You should see the Pigment interface, ready for you to start generating images!

---

## A Huge Thank You to Pollinations.AI 🙏

This project would not be possible without **Pollinations.AI**.

In a landscape where access to powerful generative AI often sits behind significant paywalls, Pollinations.AI stands out by providing **free, public access** to high-quality image and text generation models. This commitment to open access empowers developers, artists, and hobbyists to experiment, learn, and create without financial barriers.

Pigment is a testament to what can be built on top of such a fantastic, developer-friendly platform. We strongly encourage you to visit their website, explore their documentation, and consider supporting their mission.

*   **[Pollinations Website](https://pollinations.ai)**
*   **[API Documentation](https://docs.pollinations.ai)**
*   **[GitHub](https://github.com/pollinations)**

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
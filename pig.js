/**
 * Pollinations Art Generator — Main client JS logic
 */

// --- Step 1: Fetch and populate image models from Pollinations API ---
async function fetchModelsAndPopulate() {
  console.log("[DEBUG] fetchModelsAndPopulate called. DOM readyState:", document.readyState);
  const dropdown = document.getElementById('model');
  const modelInfo = document.getElementById('model-info');
  if (!dropdown) {
    console.error("[DEBUG] 'model' select not found in DOM!");
    return;
  }
  if (!modelInfo) {
    console.error("[DEBUG] 'model-info' div not found in DOM!");
  }
  dropdown.innerHTML = `<option value="loading" disabled>Loading models...</option>`;
  try {
    const resp = await fetch('https://image.pollinations.ai/models');
    console.log("[DEBUG] API fetch status:", resp && resp.status);
    if (!resp.ok) throw new Error('Failed to fetch models');
    const models = await resp.json();
    console.log("[DEBUG] Models from API:", models);
    dropdown.innerHTML = "";
    if (models.includes("flux")) {
      dropdown.innerHTML += `<option value="flux" selected>flux (Default)</option>`;
    }
    for (const m of models) {
      if (m === "flux") continue;
      dropdown.innerHTML += `<option value="${m}">${m}</option>`;
    }
    if(modelInfo) {
      modelInfo.innerHTML = `<p>Select a model to see its description</p>`;
    }
  } catch (err) {
    dropdown.innerHTML = `<option value="flux" selected>flux (Default)</option>`;
    if(modelInfo) {
      modelInfo.innerHTML = '<p style="color:red;">Unable to fetch model list, loaded default only.</p>';
    }
    console.error("fetchModelsAndPopulate: error fetching models", err);
  }
}
// Mapping of available art styles and their descriptions for prompt building.
// This should match the artStyles variable from pig.html.
const artStyles = {
  "Ukiyo-e": "Ukiyo-e style, Japanese woodblock print, flat colors, bold outlines, in the style of Hokusai, in the style of Hiroshige, Edo period Japan",
  "Photorealism": "photorealistic, hyper-detailed, high-resolution photograph, 8k, sharp focus, meticulously detailed, shot on a Hasselblad camera",
  "Hyperrealism": "hyperrealistic, intense detail, emotive, narrative scene, flawless texture, cinematic lighting, in the style of Ron Mueck, in the style of Chuck Close",
  "Digital Art": "digital painting, concept art, trending on ArtStation, CGI, 3D render, Unreal Engine 5, Octane render, VFX, made in ZBrush",
  "Abstract Expressionism": "abstract expressionist painting, gestural brushstrokes, drip painting, non-representational, chaotic energy, large-scale canvas, in the style of Jackson Pollock, in the style of Willem de Kooning",
  "Art Deco": "Art Deco style, geometric patterns, streamlined, symmetrical design, gold and black, zigzags, stylized, 1920s glamour",
  "Art Nouveau": "Art Nouveau style, organic forms, flowing lines, whiplash curves, stylized floral patterns, elegant, in the style of Alphonse Mucha, in the style of Gustav Klimt",
  "Baroque": "Baroque painting, dramatic lighting, chiaroscuro, tenebrism, intense emotion, opulent, rich, deep colors, in the style of Caravaggio, in the style of Rembrandt",
  "Bauhaus": "Bauhaus style, minimalist design, geometric abstraction, primary colors (red, yellow, blue), clean lines, functionalism, sans-serif typography",
  "Cubism": "Cubist painting, fragmented, geometric shapes, multiple perspectives, abstracted forms, monochromatic palette, in the style of Pablo Picasso, in the style of Georges Braque",
  "Expressionism": "Expressionist painting, distorted for emotional effect, swirling brushstrokes, vivid, non-naturalistic colors, angst-ridden, in the style of Edvard Munch, in the style of Kirchner",
  "Fauvism": "Fauvist painting, wild brushwork, intense, non-naturalistic colors, vibrant palette, painterly, in the style of Henri Matisse, in the style of André Derain",
  "Impressionism": "Impressionist painting, visible brushstrokes, dappled light, soft focus, en plein air, focus on light and atmosphere, in the style of Claude Monet, in the style of Renoir",
  "Minimalism": "minimalist, extreme simplicity, monochromatic, clean lines, negative space, uncluttered, geometric abstraction, in the style of Donald Judd",
  "Pop Art": "Pop Art style, bold, bright colors, Ben-Day dots, silkscreen print, comic book style, mass culture, in the style of Andy Warhol, in the style of Roy Lichtenstein",
  "Renaissance": "Renaissance painting, classical realism, sfumato, linear perspective, mythological scene, in the style of Leonardo da Vinci, in the style of Raphael",
  "Romanticism": "Romanticist painting, dramatic landscape, awe-inspiring nature, sublime, emotional intensity, stormy seas, ancient ruins, in the style of J.M.W. Turner, in the style of Caspar David Friedrich",
  "Surrealism": "Surrealist painting, dream-like, bizarre, uncanny, illogical juxtaposition, melting objects, subconscious imagery, in the style of Salvador Dalí, in the style of René Magritte",
  "Street Art": "street art, graffiti mural, stencil art, spray paint on a brick wall, urban art, political commentary, in the style of Banksy, in the style of Shepard Fairey",
  "Graffiti": "graffiti style, bold colors, spray paint, street culture, mural art, wildstyle, tags",
  "Dadaism": "Dadaist art, anti-art, absurd, collage, readymade, nonsensical, avant-garde, in the style of Duchamp, Hannah Höch",
  "Constructivism": "Constructivist art, geometric shapes, abstraction, minimal color palette, industrial motifs, in the style of El Lissitzky, Aleksandr Rodchenko",
  "Futurism": "Futurist style, speed, dynamic movement, mechanization, multiple exposure, diagonal lines, in the style of Umberto Boccioni",
  "Synthwave": "Synthwave style, 1980s, neon colors, retro-futuristic, gridlines, outrun, vapor, cyberpunk",
  "Vaporwave": "Vaporwave art, pastel gradients, 80s/90s computer graphics, Greek statues, surreal, glitch art, nostalgia, lo-fi",
  "Cyberpunk": "Cyberpunk, neon lights, advanced tech, dystopian, megacity, rainy, in the style of Blade Runner, Ghost in the Shell",
  "Pixel Art": "pixel art, 8-bit, retro game, blocky, highly stylized, low resolution",
  "Low Poly": "low poly art, faceted shapes, minimal polygons, stylized 3D, geometric, Unity/Blender style",
  "Watercolor": "Watercolor painting, soft edges, transparent layers, diffused, delicate, hand-painted",
  "Oil Painting": "Oil painting, thick brushstrokes, impasto, rich texture, vibrant color, in the style of Van Gogh",
  "Ink Drawing": "ink drawing, pen and ink, fine lines, crosshatching, monochrome, black and white, detailed",
  "Charcoal Sketch": "charcoal sketch, grayscale, rough, expressive, heavy shading",
  "Comic Book": "comic book style, bold lines, flat coloring, speech bubbles, superhero, halftone dots",
  "Anime": "anime style, Japanese animation, large expressive eyes, clean linework, vibrant, in the style of Studio Ghibli",
  "Manga": "manga style, black and white, Japanese comic, screentone, high contrast, action lines",
  "Concept Art": "concept art, detailed, imaginative, fantasy, cinematic, game art, digital painting",
  "Steampunk": "steampunk style, Victorian era, gears, steam technology, brown/copper palette, alternate history",
  "Gothic": "Gothic art, dark, dramatic, arches, medieval, stained glass, moody lighting",
  "Art Brut": "art brut, outsider art, raw, self-taught, unrefined, expressive, Jean Dubuffet",
  "Dreamlike": "dreamlike, ethereal, soft focus, surreal, atmospheric, mysterious",
  "Pop Surrealism": "pop surrealism, lowbrow art, playful, bizarre, candy colors, in the style of Mark Ryden",
  "Children's Book": "children's book illustration, whimsical, bright colors, friendly characters, playful, hand-drawn",
  "Photobash": "photobash, digitally manipulated photo collage, surreal, concept art approach",
  "Disney": "Disney style, cartoon, friendly, classic animation, family-friendly, iconic characters",
  "Studio Ghibli": "Studio Ghibli, soft colors, lush backgrounds, whimsical, magical realism, in the style of Miyazaki"
};

/**
 * Returns prompt with art style suffix when style is non-empty and present in artStyles
 * @param {string} basePrompt
 * @param {string} artStyle
 * @returns {string}
 */
function buildPrompt(basePrompt, artStyle) {
  if (artStyle && artStyles[artStyle]) {
    return `${basePrompt}, ${artStyles[artStyle]}`;
  }
  return basePrompt;
}
// Clear gallery and reset status/progress
document.getElementById('clear-btn').onclick = function () {
  document.getElementById('gallery').innerHTML = "";
  document.getElementById('progress-bar').style.width = "0%";
  document.getElementById('progress-text').textContent = "Ready to generate";
  document.getElementById('status-message').textContent = "";
  window.isGenerating = false;
};
function randomSeed() {
  return Math.floor(Math.random() * 899999999) + 100000000; // 9-digit random
}

/**
 * Main: Generate images based on UI controls
 */
async function handleGenerateClicked() {
  if (window.isGenerating) return; // prevent double click
  window.isGenerating = true;

  // --- Grab all UI values ---
  const promptElem = document.getElementById('prompt');
  const basePrompt = promptElem.value.trim();
  const count = Number(document.getElementById('count').value);
  const size = (document.getElementById('size').value || "1024,1024").split(',');
  const width = Number(size[0]);
  const height = Number(size[1]);
  const modelDropdown = document.getElementById('model');
  const selectedModel = modelDropdown.value;
  const styleDropdown = document.getElementById('style');
  const selectedStyle = styleDropdown.value;
  const nologo = document.getElementById('nologo').checked;
  const priv = document.getElementById('private').checked;
  const enhance = document.getElementById('enhance').checked;
  const transparent = document.getElementById('transparent').checked;
  const batchMode = document.getElementById('mode-artstyle-batch').checked;

  // Gallery, progress UI
  const gallery = document.getElementById('gallery');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const statusMessage = document.getElementById('status-message');
  gallery.innerHTML = "";
  progressBar.style.width = "0%";
  progressText.textContent = "Starting generation...";
  statusMessage.textContent = "";

  // --- Build batch queue ---
  let queue = [];
  if (batchMode) {
    // Use a fixed random seed for all art styles in batch mode
    const batchSeed = randomSeed();
    for (const style in artStyles) {
      if (!style.trim()) continue; // skip empty or placeholder
      queue.push({
        prompt: buildPrompt(basePrompt, style),
        model: selectedModel,
        style,
        width, height,
        seed: batchSeed,
        nologo, priv, enhance, transparent
      });
    }
  } else {
    // Generate 'count' images for selected model/style, each with random seed
    for (let i = 0; i < count; ++i) {
      queue.push({
        prompt: buildPrompt(basePrompt, selectedStyle),
        model: selectedModel,
        width, height,
        seed: randomSeed(),
        nologo, priv, enhance, transparent
      });
    }
  }

  // --- Sequential image generation, 1/sec rate limiting ---
  let completed = 0;
  for (const task of queue) {
    progressText.textContent = `Generating image ${completed + 1} of ${queue.length} (${task.model})...`;
    progressBar.style.width = `${((completed + 1) / queue.length) * 100}%`;

    // Compose API URL
    const params = new URLSearchParams({
      width: task.width,
      height: task.height,
      seed: task.seed,
      model: task.model,
      // Advanced
      ...(task.nologo ? { nologo: "true" } : {}),
      ...(task.priv ? { private: "true" } : {}),
      ...(task.enhance ? { enhance: "true" } : {}),
      ...(task.transparent ? { transparent: "true" } : {}),
      // add "referrer": custom if desired
    });
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(task.prompt)}?${params}`;

    // Fetch image (blob)
    // --- Card Container
    let card = document.createElement('div');
    card.className = "image-card";

    // --- Art Style Title
    let styleTitle = document.createElement('div');
    styleTitle.className = "image-style";
    styleTitle.innerText = (typeof task.style !== "undefined" && task.style)
      ? task.style
      : (selectedStyle || "Default");
    card.appendChild(styleTitle);

    // --- Image Container with Placeholder & Image
    let imgCont = document.createElement('div');
    imgCont.className = "image-container";
    // Placeholder
    let placeholder = document.createElement('div');
    placeholder.className = "image-placeholder";
    placeholder.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      <span>Generating...</span>
    `;
    imgCont.appendChild(placeholder);
    // Real Image
    let imgElem = document.createElement('img');
    imgElem.className = "generated-image";
    imgElem.alt = `AI output, model: ${task.model}, style: ${(task.style || selectedStyle)}, seed: ${task.seed}`;
    imgCont.appendChild(imgElem);
    card.appendChild(imgCont);

    // --- Action Buttons (View & Download)
    let actions = document.createElement('div');
    actions.className = "image-actions";
    // View button
    let viewBtn = document.createElement('button');
    viewBtn.className = "action-btn";
    viewBtn.innerHTML = `<i class="fas fa-eye"></i> View`;
    viewBtn.onclick = () => {
      if (imgElem.src) window.open(imgElem.src, '_blank');
    };
    actions.appendChild(viewBtn);
    // Download button
    let dlBtn = document.createElement('button');
    dlBtn.className = "action-btn";
    dlBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
    dlBtn.onclick = () => {
      if (imgElem.src) {
        const a = document.createElement("a");
        a.href = imgElem.src;
        a.download = `pollinations_${(task.style || selectedStyle)}_${task.model}_${task.seed}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    actions.appendChild(dlBtn);
    card.appendChild(actions);
    // Attach to gallery
    gallery.appendChild(card);

    try {
      console.log(`[GEN] Fetching for style="${task.style || selectedStyle}" with url:`, url);
      const resp = await fetch(url);
      if (!resp.ok) {
        let respText = '';
        try { respText = await resp.text(); } catch {}
        console.error(`[GEN] API error: ${resp.status} ${resp.statusText}`, respText);
        throw new Error(`API error: ${resp.status} ${resp.statusText}\n${respText}`);
      }
      let blob;
      try { blob = await resp.blob(); } catch(err) {
        console.error("[GEN] Blob error:", err);
        throw new Error("Blob conversion failed");
      }
      if (!blob || (!blob.type.startsWith("image") && blob.size < 2048)) {
        let body = "[not available]";
        try { body = await resp.text(); } catch {}
        console.error("[GEN] Non-image response", blob && blob.type, body);
        throw new Error(`Non-image API response (${blob && blob.type}): ${body}`);
      }
      const src = URL.createObjectURL(blob);
      imgElem.src = src;
      card.classList.add('image-loaded');
    } catch (e) {
      imgElem.alt = "Error loading image";
      imgElem.title = "Failed to load";
      placeholder.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span style="color:#f44336">Error: ${e&&e.message?e.message:e}</span>`;
    }
    await new Promise(res => setTimeout(res, 1100)); // 1.1s delay, just over the API limit
    completed++;
  }
  progressBar.style.width = "100%";
  progressText.textContent = `Done. Generated ${queue.length} images.`;
  window.isGenerating = false;
}

document.getElementById('generate-btn').onclick = handleGenerateClicked;
/**
 * Call model fetch after DOM ready, or immediately if DOM is already loaded.
 */
function setupModelFetch() {
  console.log("[DEBUG] setupModelFetch called. DOM readyState:", document.readyState);
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => {
      console.log("[DEBUG] DOMContentLoaded event");
      fetchModelsAndPopulate();
    });
  } else {
    fetchModelsAndPopulate();
  }
}
setupModelFetch();

function showTutorialOverlay(stepsArr) {
  // ...code...
}
// ...rest of JS code from lines 381 to 600...
// --- CONTINUED: JS extracted from pig.html lines 601-851 ---

// (Place after previous block; keep all function and global variable declarations as per snippet)
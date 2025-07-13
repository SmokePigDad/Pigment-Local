# Pollinations Art Batch Generator — Engineering TODO

## 1. Frontend: UI/Controls
- [ ] Text prompt input (base/seed prompt for all generations)
- [ ] Number of images per style/model (make configurable for batch mode)
- [ ] Image size selector
- [ ] Advanced settings (nologo, transparent, private, enhance, etc.)
- [ ] “Batch mode:” (checkbox) — generate for each available art model

## 2. Models/Styles
- [ ] On load or on generate, fetch available models from https://image.pollinations.ai/models API endpoint for real-time list
- [ ] Maintain or map art style/description strings for prompt construction

## 3. Image Generation Sequence
- [ ] Batch mode ON:
    - For each model, generate N images (each with unique random seed)
    - Append style description if needed; use same prompt
    - 1 request per second (min) — API rate limit
- [ ] Batch mode OFF:
    - Use selected model/style; create N images as requested

## 4. API Request Logic
- [ ] Compose requests as 
      `https://image.pollinations.ai/prompt/{encoded_prompt}?model={model}&width={w}&height={h}&seed={random}`
    - Attach advanced args as needed
- [ ] Show progress (bar, percentage, status)
- [ ] Handle errors, allow batch to continue
- [ ] Display gallery: image, download, style/model information

## 5. UI State Feedback
- [ ] Disable controls while generating
- [ ] Show progress/current image/model
- [ ] “Clear All” button for output

## 6. Edge Cases
- [ ] Strictly wait at least 1s (1000ms) between requests to avoid API rate limiting
- [ ] If limit is hit, pause/inform user, retry after timeout
- [ ] Disallow generating “None” style in batch mode unless instructed

## 7. Refactor
- [ ] Move all image/queue logic to pig.js; pig.html should only bootstrap/init
- [ ] Organize: `fetchModels`, `buildPrompt`, `queueBatchGeneration`, `handleProgress`, `renderGalleryItem`

## 8. Testing
- [ ] Try many prompts, image counts, batch & non-batch for full coverage
- [ ] Verify no limit violations

## 9. (Optional)
- [ ] User-selectable images-per-style in batch mode
- [ ] “Download all” option

---

_Last revised: 2025-07-13_

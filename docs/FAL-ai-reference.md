# Wan-2.1 First-Last-Frame-to-Video

> Wan-2.1 flf2v generates dynamic videos by intelligently bridging a given first frame to a desired end frame through smooth, coherent motion sequences.


## Overview

- **Endpoint**: `https://fal.run/fal-ai/wan-flf2v`
- **Model ID**: `fal-ai/wan-flf2v`
- **Category**: image-to-video
- **Kind**: inference
**Tags**: image to video, motion



## API Information

This model can be used via our HTTP API or more conveniently via our client libraries.
See the input and output schema below, as well as the usage examples.


### Input Schema

The API accepts the following input parameters:


- **`prompt`** (`string`, _required_):
  The text prompt to guide video generation.
  - Examples: "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales."

- **`negative_prompt`** (`string`, _optional_):
  Negative prompt for video generation. Default value: `"bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards"`
  - Default: `"bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards"`
  - Examples: "bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards"

- **`start_image_url`** (`string`, _required_):
  URL of the starting image. If the input image does not match the chosen aspect ratio, it is resized and center cropped.
  - Examples: "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png"

- **`end_image_url`** (`string`, _required_):
  URL of the ending image. If the input image does not match the chosen aspect ratio, it is resized and center cropped.
  - Examples: "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png"

- **`num_frames`** (`integer`, _optional_):
  Number of frames to generate. Must be between 81 to 100 (inclusive). If the number of frames is greater than 81, the video will be generated with 1.25x more billing units. Default value: `81`
  - Default: `81`
  - Range: `81` to `100`

- **`frames_per_second`** (`integer`, _optional_):
  Frames per second of the generated video. Must be between 5 to 24. Default value: `16`
  - Default: `16`
  - Range: `5` to `24`

- **`seed`** (`integer`, _optional_):
  Random seed for reproducibility. If None, a random seed is chosen.

- **`resolution`** (`ResolutionEnum`, _optional_):
  Resolution of the generated video (480p or 720p). 480p is 0.5 billing units, and 720p is 1 billing unit. Default value: `"720p"`
  - Default: `"720p"`
  - Options: `"480p"`, `"720p"`

- **`num_inference_steps`** (`integer`, _optional_):
  Number of inference steps for sampling. Higher values give better quality but take longer. Default value: `30`
  - Default: `30`
  - Range: `2` to `40`

- **`guide_scale`** (`float`, _optional_):
  Classifier-free guidance scale. Higher values give better adherence to the prompt but may decrease quality. Default value: `5`
  - Default: `5`
  - Range: `1` to `10`

- **`shift`** (`float`, _optional_):
  Shift parameter for video generation. Default value: `5`
  - Default: `5`
  - Range: `1` to `10`

- **`enable_safety_checker`** (`boolean`, _optional_):
  If set to true, the safety checker will be enabled.
  - Default: `false`
  - Examples: true

- **`enable_prompt_expansion`** (`boolean`, _optional_):
  Whether to enable prompt expansion.
  - Default: `false`
  - Examples: false

- **`acceleration`** (`AccelerationEnum`, _optional_):
  Acceleration level to use. The more acceleration, the faster the generation, but with lower quality. The recommended value is 'regular'. Default value: `"regular"`
  - Default: `"regular"`
  - Options: `"none"`, `"regular"`
  - Examples: "regular"

- **`aspect_ratio`** (`AspectRatioEnum`, _optional_):
  Aspect ratio of the generated video. If 'auto', the aspect ratio will be determined automatically based on the input image. Default value: `"auto"`
  - Default: `"auto"`
  - Options: `"auto"`, `"16:9"`, `"9:16"`, `"1:1"`



**Required Parameters Example**:

```json
{
  "prompt": "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales.",
  "start_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png",
  "end_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png"
}
```

**Full Example**:

```json
{
  "prompt": "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales.",
  "negative_prompt": "bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards",
  "start_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png",
  "end_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png",
  "num_frames": 81,
  "frames_per_second": 16,
  "resolution": "720p",
  "num_inference_steps": 30,
  "guide_scale": 5,
  "shift": 5,
  "enable_safety_checker": true,
  "enable_prompt_expansion": false,
  "acceleration": "regular",
  "aspect_ratio": "auto"
}
```


### Output Schema

The API returns the following output format:

- **`video`** (`File`, _required_):
  The generated video file.
  - Examples: {"url":"https://storage.googleapis.com/falserverless/example_outputs/flf2v.mp4"}

- **`seed`** (`integer`, _required_):
  The seed used for generation.



**Example Response**:

```json
{
  "video": {
    "url": "https://storage.googleapis.com/falserverless/example_outputs/flf2v.mp4"
  }
}
```


## Usage Examples

### cURL

```bash
curl --request POST \
  --url https://fal.run/fal-ai/wan-flf2v \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{
     "prompt": "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales.",
     "start_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png",
     "end_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png"
   }'
```

### Python

Ensure you have the Python client installed:

```bash
pip install fal-client
```

Then use the API client to make requests:

```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/wan-flf2v",
    arguments={
        "prompt": "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales.",
        "start_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png",
        "end_image_url": "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png"
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
```

### JavaScript

Ensure you have the JavaScript client installed:

```bash
npm install --save @fal-ai/client
```

Then use the API client to make requests:

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/wan-flf2v", {
  input: {
    prompt: "A tabby cat is confidely strolling toward the camera, when it spins and with a flash of magic reveals itself to be a cat-dragon hybrid with glistening amber scales.",
    start_image_url: "https://storage.googleapis.com/falserverless/web-examples/wan_flf/first_frame.png",
    end_image_url: "https://storage.googleapis.com/falserverless/web-examples/wan_flf/last_frame.png"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```


## Additional Resources

### Documentation

- [Model Playground](https://fal.ai/models/fal-ai/wan-flf2v)
- [API Documentation](https://fal.ai/models/fal-ai/wan-flf2v/api)
- [OpenAPI Schema](https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/wan-flf2v)

### fal.ai Platform

- [Platform Documentation](https://docs.fal.ai)
- [Python Client](https://docs.fal.ai/clients/python)
- [JavaScript Client](https://docs.fal.ai/clients/javascript)
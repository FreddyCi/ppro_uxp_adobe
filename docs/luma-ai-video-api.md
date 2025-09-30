Video Generation
Suggest Edits
Authentication
Get a key from https://lumalabs.ai/dream-machine/api/keys
Use the key as Bearer token to call any of the API endpoints

Authorization: Bearer <luma_api_key>
Models
name	model param
Ray 2 Flash	ray-flash-2
Ray 2	ray-2
Ray 1.6	ray-1-6
API Reference
Open

Ray 2 Text to Video
sh

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "an old lady laughing underwater, wearing a scuba diving suit",
  "model": "ray-2",
  "resolution": "720p",
  "duration": "5s"
}
'
Resolution can be 540p, 720p, 1080, 4k

Ray 2 Image to Video
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "A tiger walking in snow",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    }
  }
}
'
How to use concepts
cURL

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "a car",
  "model": "ray-2",
  "resolution": "720p",
  "duration": "5s",
  "concepts": [
  	{
    	"key": "dolly_zoom"
    }
  ]
}
'
We have this new /concepts/list api one can hit to get list of concepts available

https://api.lumalabs.ai/dream-machine/v1/generations/concepts/list

Text to Video
shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "an old lady laughing underwater, wearing a scuba diving suit",
  "model": "ray-2"
}
'
Downloading a video
Shell

curl -o video.mp4 https://example.com/video.mp4
With loop, aspect ratio
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "an old lady laughing underwater, wearing a scuba diving suit",
  "model": "ray-2",
  "aspect_ratio": "16:9",
  "loop": true
}
'

Image to Video
☁️
Image URL

You should upload and use your own cdn image urls, currently this is the only way to pass an image

With start frame
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "A tiger walking in snow",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    }
  }
}
'
With start frame, loop, aspect ratio
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "A tiger walking in snow",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    }
  },
  "loop": false,
  "aspect_ratio": "16:9"
}
'
With ending frame
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "A tiger walking in snow",
  "model": "ray-2",
  "keyframes": {
    "frame1": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    }
  },
  "loop": false,
  "aspect_ratio": "16:9"
}
'
With start and end keyframes
Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "A tiger walking in snow",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
    	"type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg",
    },
    "frame1": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg",
    }
  },
  "loop": false,
  "aspect_ratio": "16:9"
}
'
Extend Video
Extend video
Extend is currently supported only for generated videos. Please make sure the generation is in completed state before passing it

Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "The tiger rolls around",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
'
Reverse extend video
Generate video leading up to the provided video.

Extend is currently supported only for generated videos. Please make sure the generation is in completed state before passing it

Python

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "The tiger rolls around",
  "model": "ray-2",
  "keyframes": {
    "frame1": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
'
Extend a video with an end-frame
Extend is currently supported only for generated videos. Please make sure the generation is in completed state before passing it

Python

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "The tiger rolls around",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "frame1": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    }
  }
}
'
Reverse extend a video with a start-frame
Extend is currently supported only for generated videos. Please make sure the generation is in completed state before passing it

Python

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "The tiger rolls around",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "image",
      "url": "https://storage.cdn-luma.com/dream_machine/7e4fe07f-1dfd-4921-bc97-4bcf5adea39a/video_0_thumb.jpg"
    },
    "frame1": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
'
Interpolate between 2 videos
Interpolate is currently supported only for generated videos. Please make sure the generation is in completed state before passing it

Python

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "The tiger rolls around",
  "model": "ray-2",
  "keyframes": {
    "frame0": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "frame1": {
      "type": "generation",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
'
Generations
Get generation with id
Shell

curl --request GET \
     --url https://api.lumalabs.ai/dream-machine/v1/generations/123e4567-e89b-12d3-a456-426614174000 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx'
List all generations
Shell

curl --request GET \
     --url 'https://api.lumalabs.ai/dream-machine/v1/generations?limit=10&offset=10' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx'
Delete generation
Shell

curl --request DELETE \
     --url https://api.lumalabs.ai/dream-machine/v1/generations/123e4567-e89b-12d3-a456-426614174000 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx'
Camera Motions
📘
How to use camera motion

Just add the camera motion value as part of prompt itself

Get all supported camera motions
Shell

curl --request GET \
     --url https://api.lumalabs.ai/dream-machine/v1/generations/camera_motion/list \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx'
How to use camera motion
Camera is controlled by language in Dream Machine. You can find supported camera moves by calling the Camera Motions endpoint. This will return an array of supported camera motion strings (like "camera orbit left") which can be used in prompts. In addition to these exact strings, syntactically similar phrases also work, though there can be mismatches sometimes.

Example Response
Shell

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "state": "completed",
  "failure_reason": null,
  "created_at": "2023-06-01T12:00:00Z",
  "assets": {
    "video": "https://example.com/video.mp4"
  },
  "version": "v1.6",
  "request": {
    "prompt": "A serene lake surrounded by mountains at sunset",
    "aspect_ratio": "16:9",
    "loop": true,
    "keyframes": {
      "frame0": {
        "type": "image",
        "url": "https://example.com/image.jpg"
      },
      "frame1": {
        "type": "generation",
        "id": "123e4567-e89b-12d3-a456-426614174000"
      }
    }
  }
}

How to get a callback when generation has an update
It will get status updates (dreaming/completed/failed)
It will also get the video url as part of it when completed
It's a POST endpoint you can pass, and request body will have the generation object in it
It expected to be called multiple times for a status
If the endpoint returns a status code other than 200, it will be retried max 3 times with 100ms delay and the request has a 5s timeout
example

Shell

curl --request POST \
     --url https://api.lumalabs.ai/dream-machine/v1/generations \
     --header 'accept: application/json' \
     --header 'authorization: Bearer luma-xxxx' \
     --header 'content-type: application/json' \
     --data '
{
  "prompt": "an old lady laughing underwater, wearing a scuba diving suit",
  "callback_url": "<your_api_endpoint_here>"
}
'
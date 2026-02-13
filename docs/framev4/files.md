# Copy file

POST https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/copy
Content-Type: application/json

Copy file. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/copy

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Copy file
  version: endpoint_files.copy
paths:
  /v4/accounts/{account_id}/files/{file_id}/copy:
    post:
      operationId: copy
      summary: Copy file
      description: >-
        Copy file. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: copy_metadata
          in: query
          description: Whether to copy metadata values along with the file
          required: false
          schema:
            type: boolean
            default: false
        - name: copy_comments
          in: query
          description: Which comments to copy along with the file
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdFilesFileIdCopyPostParametersCopyComments
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileCopyResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: File params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FileCopyParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    V4AccountsAccountIdFilesFileIdCopyPostParametersCopyComments:
      type: string
      enum:
        - value: none
        - value: internal
        - value: public
        - value: all
      default: none
    FileCopyParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder ID. Defaults to file parent ID.
    FileCopyParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileCopyParamsData'
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    FileStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    File:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File ID
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileCopyResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/File'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.copy("9cdbd799-7086-4ad6-a675-ec8df30e1aeb", "08e9b3de-241f-47f3-8969-ef27133837c8", {
        data: {
            parentId: "2e426fe0-f965-4594-8b2b-b4dff1dc00ec",
        },
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.copy(
    account_id="9cdbd799-7086-4ad6-a675-ec8df30e1aeb",
    file_id="08e9b3de-241f-47f3-8969-ef27133837c8",
    data={
        "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy"

	payload := strings.NewReader("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy', [
  'body' => '{
  "data": {
    "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/9cdbd799-7086-4ad6-a675-ec8df30e1aeb/files/08e9b3de-241f-47f3-8969-ef27133837c8/copy")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Create file (local upload)

POST https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/files/local_upload
Content-Type: application/json

Create new file under parent folder through local upload. <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/create-local-upload

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create file (local upload)
  version: endpoint_files.createLocalUpload
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/files/local_upload:
    post:
      operationId: create-local-upload
      summary: Create file (local upload)
      description: >-
        Create new file under parent folder through local upload. <br>Rate
        Limits: 5 calls per 1 second(s) per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: folder_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileWithUploadUrlsResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: Request body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FileCreateLocalUploadParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FileCreateLocalUploadParamsData:
      type: object
      properties:
        file_size:
          type: integer
          description: File size in bytes (up to 5TB)
        name:
          type: string
          description: File name
      required:
        - file_size
        - name
    FileCreateLocalUploadParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileCreateLocalUploadParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    FileStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    UploadUrl:
      type: object
      properties:
        size:
          type: integer
          description: Upload chunk size
        url:
          type: string
          description: >-
            S3 presigned URL. Client should make a PUT request to this URL that
            includes the "x-amz-acl: private" header along with the file or file
            chunk data.
      required:
        - size
        - url
    FileWithUploadUrls:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File ID
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileStatus'
        upload_urls:
          type: array
          items:
            $ref: '#/components/schemas/UploadUrl'
          description: >-
            File upload URLs. Number of URLs returned will vary depending on the
            file size.
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileWithUploadUrlsResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileWithUploadUrls'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.createLocalUpload("4d4128a3-c251-4ef2-8e25-5adfb4a1b29c", "3de81fac-fc9d-49c7-841e-976b39dd2198", {
        data: {
            fileSize: 1137444,
            name: "asset.png",
        },
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.create_local_upload(
    account_id="4d4128a3-c251-4ef2-8e25-5adfb4a1b29c",
    folder_id="3de81fac-fc9d-49c7-841e-976b39dd2198",
    data={
        "file_size": 1137444,
        "name": "asset.png"
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload"

	payload := strings.NewReader("{\n  \"data\": {\n    \"file_size\": 1137444,\n    \"name\": \"asset.png\"\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"file_size\": 1137444,\n    \"name\": \"asset.png\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"file_size\": 1137444,\n    \"name\": \"asset.png\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload', [
  'body' => '{
  "data": {
    "file_size": 1137444,
    "name": "asset.png"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"file_size\": 1137444,\n    \"name\": \"asset.png\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "file_size": 1137444,
    "name": "asset.png"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/4d4128a3-c251-4ef2-8e25-5adfb4a1b29c/folders/3de81fac-fc9d-49c7-841e-976b39dd2198/files/local_upload")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Create file (remote upload)

POST https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/files/remote_upload
Content-Type: application/json

Create new file under parent folder through remote upload. <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/create-remote-upload

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create file (remote upload)
  version: endpoint_files.createRemoteUpload
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/files/remote_upload:
    post:
      operationId: create-remote-upload
      summary: Create file (remote upload)
      description: >-
        Create new file under parent folder through remote upload. <br>Rate
        Limits: 5 calls per 1 second(s) per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: folder_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '202':
          description: Accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileRemoteUploadResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: Request body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FileCreateRemoteUploadParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FileCreateRemoteUploadParamsData:
      type: object
      properties:
        name:
          type: string
          description: File name
        source_url:
          type: string
          description: Source URL - Initiates a remote upload from the provided URL
      required:
        - name
        - source_url
    FileCreateRemoteUploadParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileCreateRemoteUploadParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    FileStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    File:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File ID
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileRemoteUploadResponseLinks:
      type: object
      properties: {}
    FileRemoteUploadResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/File'
        links:
          $ref: '#/components/schemas/FileRemoteUploadResponseLinks'
          description: Link to asset operation status
      required:
        - data
        - links

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.createRemoteUpload("c15818da-eac4-4f81-85c2-f0b163018cdc", "a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f", {
        data: {
            name: "asset.png",
            sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png",
        },
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.create_remote_upload(
    account_id="c15818da-eac4-4f81-85c2-f0b163018cdc",
    folder_id="a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f",
    data={
        "name": "asset.png",
        "source_url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png"
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"asset.png\",\n    \"source_url\": \"https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png\"\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"asset.png\",\n    \"source_url\": \"https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"asset.png\",\n    \"source_url\": \"https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload', [
  'body' => '{
  "data": {
    "name": "asset.png",
    "source_url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"asset.png\",\n    \"source_url\": \"https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "name": "asset.png",
    "source_url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.png"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/c15818da-eac4-4f81-85c2-f0b163018cdc/folders/a17dc58c-fdd9-4cd5-8d86-4b45a0bcc03f/files/remote_upload")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "POST"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Delete file

DELETE https://api.frame.io/v4/accounts/{account_id}/files/{file_id}

Delete file by ID. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete file
  version: endpoint_files.delete
paths:
  /v4/accounts/{account_id}/files/{file_id}:
    delete:
      operationId: delete
      summary: Delete file
      description: >-
        Delete file by ID. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '204':
          description: No Content
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Files_delete_Response_204'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
components:
  schemas:
    UUID:
      type: string
      format: uuid
    Files_delete_Response_204:
      type: object
      properties: {}

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.delete("9276d54a-0d3b-42a2-8591-0fa6027771eb", "7b334a6c-a9ed-4586-bfc6-6cebe4323b79");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.delete(
    account_id="9276d54a-0d3b-42a2-8591-0fa6027771eb",
    file_id="7b334a6c-a9ed-4586-bfc6-6cebe4323b79"
)

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79"

	req, _ := http.NewRequest("DELETE", url, nil)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/9276d54a-0d3b-42a2-8591-0fa6027771eb/files/7b334a6c-a9ed-4586-bfc6-6cebe4323b79")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "DELETE"

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# List files

GET https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/files

List files in a given folder. <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List files
  version: endpoint_files.list
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/files:
    get:
      operationId: list
      summary: List files
      description: >-
        List files in a given folder. <br>Rate Limits: 5 calls per 1 second(s)
        per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: folder_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: include
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdFilesGetParametersInclude
        - name: sort
          in: query
          description: Sort files by query params
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdFilesGetParametersSort
        - name: after
          in: query
          description: >
            Opaque Cursor query param for requests returning paginated results.

            <br/>

            NOTE: this value is auto-generated and included as part of links
            from a previous response. It is not intended to be human readable.
          required: false
          schema:
            $ref: '#/components/schemas/RequestAfterOpaqueCursor'
        - name: page_size
          in: query
          description: ''
          required: false
          schema:
            $ref: '#/components/schemas/RequestPageSize'
        - name: include_total_count
          in: query
          description: ''
          required: false
          schema:
            $ref: '#/components/schemas/IncludeTotalCount'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AssetsWithIncludesResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
components:
  schemas:
    UUID:
      type: string
      format: uuid
    V4AccountsAccountIdFoldersFolderIdFilesGetParametersInclude:
      type: string
      enum:
        - value: media_links
        - value: media_links.original
        - value: media_links.thumbnail
        - value: media_links.thumbnail_high_quality
        - value: media_links.video_h264_180
        - value: media_links.high_quality
        - value: media_links.efficient
        - value: creator
        - value: project
        - value: project.owner
        - value: metadata
    V4AccountsAccountIdFoldersFolderIdFilesGetParametersSort:
      type: string
      enum:
        - value: name_asc
        - value: created_at_asc
        - value: updated_at_asc
        - value: file_size_asc
        - value: name_desc
        - value: created_at_desc
        - value: updated_at_desc
        - value: file_size_desc
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    User:
      type: object
      properties:
        active:
          type:
            - boolean
            - 'null'
          description: User active status
        adobe_user_id:
          type:
            - string
            - 'null'
          description: Adobe user ID
        avatar_url:
          type:
            - string
            - 'null'
          description: User avatar image url
        email:
          type: string
          description: User email
        id:
          type:
            - string
            - 'null'
          description: User ID - can be null for invited users with no frame account
        name:
          type:
            - string
            - 'null'
          description: User name
      required:
        - active
        - avatar_url
        - email
        - id
        - name
    FieldValueCommonFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: users
        - value: date
        - value: users
        - value: user_multi
        - value: user_single
    SelectOption:
      type: object
      properties:
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
          description: Option ID
      required:
        - display_name
        - id
    UserValueType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserValue:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id or Account User Group Id
        type:
          $ref: '#/components/schemas/UserValueType'
      required:
        - id
        - type
    MultiUserValueMemberOptionsType:
      type: string
      enum:
        - value: custom
        - value: all_project_members
    SingleUserValueMemberOptionsType:
      type: string
      enum:
        - value: custom
        - value: all_project_members
    MetadataField:
      oneOf:
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
              format: datetime
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: date variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: long_text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - number
                - 'null'
              format: double
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: number variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - integer
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: rating variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            field_options:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
            value:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: select variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            field_options:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
            value:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: select_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - boolean
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: toggle variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with custom member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/MultiUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: user_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with costum member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/SingleUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: user_single variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with custom member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/MultiUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: users variant
      discriminator:
        propertyName: field_type
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
    ProjectWithIncludes:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Project ID
        name:
          type: string
          description: Project Name
        restricted:
          type: boolean
          description: Whether the project is restricted or not
        root_folder_id:
          type: string
          format: uuid
          description: Root Folder ID
        status:
          $ref: '#/components/schemas/ProjectStatus'
          description: Project Status
        storage:
          type: integer
          default: 0
          description: Storage Usage
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
        view_url:
          type: string
          description: URL to view the project in the Frame.io web application
        workspace_id:
          type: string
          format: uuid
          description: Workspace ID
        description:
          type:
            - string
            - 'null'
          description: Project Description
        owner:
          $ref: '#/components/schemas/User'
      required:
        - created_at
        - id
        - name
        - root_folder_id
        - status
        - storage
        - updated_at
        - view_url
        - workspace_id
        - description
    AssetCommonWithIncludesType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    MediaLinkCommon:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
      required:
        - download_url
    OriginalMediaLink:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
        inline_url:
          type:
            - string
            - 'null'
          description: >
            URL to view the media file in a web browser in its original
            resolution and media type.<br>

            HTTP response headers will include Content-Disposition =
            'inline;filename=<filename>'.<br>
      required:
        - download_url
        - inline_url
    RenditionMediaLink:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
        url:
          type:
            - string
            - 'null'
          description: >
            URL to transcoded media that won't include any Content-Disposition
            header in the response.<br>

            Watermarks may be applied as per Account settings and User
            permissions.<br>

            Media content may be streamed (e.g. when watermarks are required).
            Clients may issue a

            HEAD request to determine whether Content-Length and/or
            Accept-Ranges headers are present in order

            to determine whether the content can be downloaded in parallel
            chunks.
      required:
        - download_url
        - url
    MediaLinksCollection:
      type: object
      properties:
        efficient:
          $ref: '#/components/schemas/MediaLinkCommon'
        high_quality:
          $ref: '#/components/schemas/MediaLinkCommon'
        original:
          $ref: '#/components/schemas/OriginalMediaLink'
        thumbnail:
          $ref: '#/components/schemas/RenditionMediaLink'
        thumbnail_high_quality:
          $ref: '#/components/schemas/RenditionMediaLink'
        video_h264_180:
          $ref: '#/components/schemas/RenditionMediaLink'
    FileWithIncludesStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    FileWithIncludes:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        creator:
          $ref: '#/components/schemas/User'
        id:
          type: string
          format: uuid
          description: File ID
        metadata:
          type: array
          items:
            $ref: '#/components/schemas/MetadataField'
          description: File attributes
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project:
          $ref: '#/components/schemas/ProjectWithIncludes'
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_links:
          $ref: '#/components/schemas/MediaLinksCollection'
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileWithIncludesStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    AssetWithIncludes:
      oneOf:
        - type: object
          properties:
            type:
              $ref: '#/components/schemas/AssetCommonWithIncludesType'
            created_at:
              type: string
              format: date-time
              description: Creation timestamp
            creator:
              $ref: '#/components/schemas/User'
            id:
              type: string
              format: uuid
              description: File ID
            metadata:
              type: array
              items:
                $ref: '#/components/schemas/MetadataField'
              description: File attributes
            name:
              type: string
              description: File Name
            parent_id:
              type:
                - string
                - 'null'
              format: uuid
              description: Parent Folder or Version Stack ID
            project:
              $ref: '#/components/schemas/ProjectWithIncludes'
            project_id:
              type: string
              format: uuid
              description: Project ID
            updated_at:
              type: string
              format: date-time
              description: Update timestamp
            view_url:
              type: string
              description: URL to view the asset in the Frame.io web application
            file_size:
              type: integer
              description: File size in bytes
            media_links:
              $ref: '#/components/schemas/MediaLinksCollection'
            media_type:
              type: string
              description: File media type
            status:
              $ref: '#/components/schemas/FileWithIncludesStatus'
          required:
            - type
            - created_at
            - id
            - name
            - parent_id
            - project_id
            - updated_at
            - view_url
            - file_size
            - media_type
            - status
          description: file variant
        - type: object
          properties:
            type:
              $ref: '#/components/schemas/AssetCommonWithIncludesType'
            created_at:
              type: string
              format: date-time
              description: Creation timestamp
            creator:
              $ref: '#/components/schemas/User'
            id:
              type: string
              format: uuid
              description: Folder ID
            metadata:
              type: array
              items:
                $ref: '#/components/schemas/MetadataField'
              description: File attributes
            name:
              type: string
              description: Folder Name
            parent_id:
              type:
                - string
                - 'null'
              format: uuid
              description: Parent Folder ID
            project:
              $ref: '#/components/schemas/ProjectWithIncludes'
            project_id:
              type: string
              format: uuid
              description: Project ID
            updated_at:
              type: string
              format: date-time
              description: Update timestamp
            view_url:
              type: string
              description: URL to view the asset in the Frame.io web application
            cover_file_id:
              type:
                - string
                - 'null'
              format: uuid
              description: Cover asset ID
          required:
            - type
            - created_at
            - id
            - name
            - parent_id
            - project_id
            - updated_at
            - view_url
            - cover_file_id
          description: folder variant
        - type: object
          properties:
            type:
              $ref: '#/components/schemas/AssetCommonWithIncludesType'
            created_at:
              type: string
              format: date-time
              description: Creation timestamp
            creator:
              $ref: '#/components/schemas/User'
            id:
              type: string
              format: uuid
              description: Version Stack ID
            metadata:
              type: array
              items:
                $ref: '#/components/schemas/MetadataField'
              description: File attributes
            name:
              type: string
              description: Version Stack Name
            parent_id:
              type:
                - string
                - 'null'
              format: uuid
              description: Parent Folder ID
            project:
              $ref: '#/components/schemas/ProjectWithIncludes'
            project_id:
              type: string
              format: uuid
              description: Project ID
            updated_at:
              type: string
              format: date-time
              description: Update timestamp
            view_url:
              type: string
              description: URL to view the asset in the Frame.io web application
            head_version:
              $ref: '#/components/schemas/FileWithIncludes'
          required:
            - type
            - created_at
            - id
            - name
            - parent_id
            - project_id
            - updated_at
            - view_url
            - head_version
          description: version_stack variant
      discriminator:
        propertyName: type
    Links:
      type: object
      properties:
        next:
          type:
            - string
            - 'null'
          description: >
            "Link to next page of data.

            <br/>

            This link is the request path with the addition of the `after` query
            parameter to fetch the next page of results.

            Optional query parameters `page_size` and `include_total_count` are
            supported when paginating data."
      required:
        - next
    AssetsWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/AssetWithIncludes'
          description: Assets
        links:
          $ref: '#/components/schemas/Links'
        total_count:
          type:
            - integer
            - 'null'
          description: Total count
      required:
        - data
        - links

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.list("f511e089-7c3a-4f39-8c2a-c233f105e106", "7709c285-2fe7-4dfe-b074-45d2a6d72103", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.list(
    account_id="f511e089-7c3a-4f39-8c2a-c233f105e106",
    folder_id="7709c285-2fe7-4dfe-b074-45d2a6d72103"
)

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files"

	req, _ := http.NewRequest("GET", url, nil)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f511e089-7c3a-4f39-8c2a-c233f105e106/folders/7709c285-2fe7-4dfe-b074-45d2a6d72103/files")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Move file

PATCH https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/move
Content-Type: application/json

Move file to a folder or version_stack. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/move

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Move file
  version: endpoint_files.move
paths:
  /v4/accounts/{account_id}/files/{file_id}/move:
    patch:
      operationId: move
      summary: Move file
      description: >-
        Move file to a folder or version_stack. <br>Rate Limits: 100 calls per
        1.00 minute(s) per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: Request body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FileMoveParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FileMoveParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder or version stack ID
    FileMoveParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileMoveParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    FileStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    File:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File ID
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/File'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.move("12f66bcf-de85-43b0-a15b-ddc25a329611", "acab0ddf-789e-44c5-91c4-909a7959ffba", {
        data: {
            parentId: "2e426fe0-f965-4594-8b2b-b4dff1dc00ec",
        },
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.move(
    account_id="12f66bcf-de85-43b0-a15b-ddc25a329611",
    file_id="acab0ddf-789e-44c5-91c4-909a7959ffba",
    data={
        "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move"

	payload := strings.NewReader("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")

	req, _ := http.NewRequest("PATCH", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move', [
  'body' => '{
  "data": {
    "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/12f66bcf-de85-43b0-a15b-ddc25a329611/files/acab0ddf-789e-44c5-91c4-909a7959ffba/move")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "PATCH"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Show file

GET https://api.frame.io/v4/accounts/{account_id}/files/{file_id}

Show file details.
<br>
Use the `include` query parameter to selectively include additional properties in the response.
<br>
Note: if you include `media_links.original` and the user does not have permission to download the file
then this endpoint will respond with a `403 Forbidden` error. If the content is inaccessible because
watermarking is required for this user and isn't supported by the requested media_links, then the request will
succeed but the unsupported media links will be set to null.
Similarly, if a requested transcode link does not exist for a particular file (e.g. including
`media_links.video_h264_180` on a static image file) or transoding process hasn't completed
(i.e. the file's `status` is "uploaded" rather than "transcoded"), then the link will also be set to null in
the response payload. In short, the client must handle null media links gracefully.
<br>Rate Limits: 5 calls per 1 second(s) per account_user


Reference: https://next.developer.frame.io/platform/api-reference/files/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show file
  version: endpoint_files.show
paths:
  /v4/accounts/{account_id}/files/{file_id}:
    get:
      operationId: show
      summary: Show file
      description: >
        Show file details.

        <br>

        Use the `include` query parameter to selectively include additional
        properties in the response.

        <br>

        Note: if you include `media_links.original` and the user does not have
        permission to download the file

        then this endpoint will respond with a `403 Forbidden` error. If the
        content is inaccessible because

        watermarking is required for this user and isn't supported by the
        requested media_links, then the request will

        succeed but the unsupported media links will be set to null.

        Similarly, if a requested transcode link does not exist for a particular
        file (e.g. including

        `media_links.video_h264_180` on a static image file) or transoding
        process hasn't completed

        (i.e. the file's `status` is "uploaded" rather than "transcoded"), then
        the link will also be set to null in

        the response payload. In short, the client must handle null media links
        gracefully.

        <br>Rate Limits: 5 calls per 1 second(s) per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: include
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdFilesFileIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileWithIncludesResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
components:
  schemas:
    UUID:
      type: string
      format: uuid
    V4AccountsAccountIdFilesFileIdGetParametersInclude:
      type: string
      enum:
        - value: media_links
        - value: media_links.original
        - value: media_links.thumbnail
        - value: media_links.thumbnail_high_quality
        - value: media_links.video_h264_180
        - value: media_links.high_quality
        - value: media_links.efficient
        - value: creator
        - value: project
        - value: project.owner
        - value: metadata
    User:
      type: object
      properties:
        active:
          type:
            - boolean
            - 'null'
          description: User active status
        adobe_user_id:
          type:
            - string
            - 'null'
          description: Adobe user ID
        avatar_url:
          type:
            - string
            - 'null'
          description: User avatar image url
        email:
          type: string
          description: User email
        id:
          type:
            - string
            - 'null'
          description: User ID - can be null for invited users with no frame account
        name:
          type:
            - string
            - 'null'
          description: User name
      required:
        - active
        - avatar_url
        - email
        - id
        - name
    FieldValueCommonFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: users
        - value: date
        - value: users
        - value: user_multi
        - value: user_single
    SelectOption:
      type: object
      properties:
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
          description: Option ID
      required:
        - display_name
        - id
    UserValueType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserValue:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id or Account User Group Id
        type:
          $ref: '#/components/schemas/UserValueType'
      required:
        - id
        - type
    MultiUserValueMemberOptionsType:
      type: string
      enum:
        - value: custom
        - value: all_project_members
    SingleUserValueMemberOptionsType:
      type: string
      enum:
        - value: custom
        - value: all_project_members
    MetadataField:
      oneOf:
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
              format: datetime
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: date variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: long_text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - number
                - 'null'
              format: double
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: number variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - integer
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: rating variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            field_options:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
            value:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: select variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            field_options:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
            value:
              type: array
              items:
                $ref: '#/components/schemas/SelectOption'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: select_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - string
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            value:
              type:
                - boolean
                - 'null'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: toggle variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with custom member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/MultiUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: user_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with costum member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/SingleUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: user_single variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/FieldValueCommonFieldType'
              description: Field type
            field_definition_id:
              type: string
              format: uuid
              description: Field definition ID
            field_definition_name:
              type: string
              description: Field definition name
            mutable:
              type: boolean
              description: Metadata mutability. System field values cannot be updated.
            custom_members:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
              description: >-
                Populated with custom member options only if
                `member_options_type` is set to 'custom'.
            member_options_type:
              $ref: '#/components/schemas/MultiUserValueMemberOptionsType'
            value:
              type: array
              items:
                $ref: '#/components/schemas/UserValue'
          required:
            - field_type
            - field_definition_id
            - field_definition_name
            - mutable
            - value
          description: users variant
      discriminator:
        propertyName: field_type
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
    ProjectWithIncludes:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Project ID
        name:
          type: string
          description: Project Name
        restricted:
          type: boolean
          description: Whether the project is restricted or not
        root_folder_id:
          type: string
          format: uuid
          description: Root Folder ID
        status:
          $ref: '#/components/schemas/ProjectStatus'
          description: Project Status
        storage:
          type: integer
          default: 0
          description: Storage Usage
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
        view_url:
          type: string
          description: URL to view the project in the Frame.io web application
        workspace_id:
          type: string
          format: uuid
          description: Workspace ID
        description:
          type:
            - string
            - 'null'
          description: Project Description
        owner:
          $ref: '#/components/schemas/User'
      required:
        - created_at
        - id
        - name
        - root_folder_id
        - status
        - storage
        - updated_at
        - view_url
        - workspace_id
        - description
    AssetCommonWithIncludesType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    MediaLinkCommon:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
      required:
        - download_url
    OriginalMediaLink:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
        inline_url:
          type:
            - string
            - 'null'
          description: >
            URL to view the media file in a web browser in its original
            resolution and media type.<br>

            HTTP response headers will include Content-Disposition =
            'inline;filename=<filename>'.<br>
      required:
        - download_url
        - inline_url
    RenditionMediaLink:
      type: object
      properties:
        download_url:
          type:
            - string
            - 'null'
          description: >
            URL to download the media file.<br>

            HTTP response headers will include Content-Disposition =
            'attachment;filename=<filename>'.<br>

            Watermarks may be applied for transcode links as per Account
            settings and User permissions.<br>
        url:
          type:
            - string
            - 'null'
          description: >
            URL to transcoded media that won't include any Content-Disposition
            header in the response.<br>

            Watermarks may be applied as per Account settings and User
            permissions.<br>

            Media content may be streamed (e.g. when watermarks are required).
            Clients may issue a

            HEAD request to determine whether Content-Length and/or
            Accept-Ranges headers are present in order

            to determine whether the content can be downloaded in parallel
            chunks.
      required:
        - download_url
        - url
    MediaLinksCollection:
      type: object
      properties:
        efficient:
          $ref: '#/components/schemas/MediaLinkCommon'
        high_quality:
          $ref: '#/components/schemas/MediaLinkCommon'
        original:
          $ref: '#/components/schemas/OriginalMediaLink'
        thumbnail:
          $ref: '#/components/schemas/RenditionMediaLink'
        thumbnail_high_quality:
          $ref: '#/components/schemas/RenditionMediaLink'
        video_h264_180:
          $ref: '#/components/schemas/RenditionMediaLink'
    FileWithIncludesStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    FileWithIncludes:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        creator:
          $ref: '#/components/schemas/User'
        id:
          type: string
          format: uuid
          description: File ID
        metadata:
          type: array
          items:
            $ref: '#/components/schemas/MetadataField'
          description: File attributes
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project:
          $ref: '#/components/schemas/ProjectWithIncludes'
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_links:
          $ref: '#/components/schemas/MediaLinksCollection'
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileWithIncludesStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileWithIncludes'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.show("72b8e2cd-7c47-45b0-8e96-cbd8df29ac94", "d13fd083-4c6a-4942-a813-cbb581bb1782", {
        include: "media_links",
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.show(
    account_id="72b8e2cd-7c47-45b0-8e96-cbd8df29ac94",
    file_id="d13fd083-4c6a-4942-a813-cbb581bb1782",
    include="media_links"
)

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links"

	req, _ := http.NewRequest("GET", url, nil)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/72b8e2cd-7c47-45b0-8e96-cbd8df29ac94/files/d13fd083-4c6a-4942-a813-cbb581bb1782?include=media_links")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Show file upload status

GET https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/status

Show file upload status details. <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/show-file-upload-status

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show file upload status
  version: endpoint_files.showFileUploadStatus
paths:
  /v4/accounts/{account_id}/files/{file_id}/status:
    get:
      operationId: show-file-upload-status
      summary: Show file upload status
      description: >-
        Show file upload status details. <br>Rate Limits: 5 calls per 1
        second(s) per account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileUploadStatusResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FileUploadStatus:
      type: object
      properties:
        filetype:
          type: string
          description: File type
        id:
          type: string
          format: uuid
          description: File ID
        upload_complete:
          type: boolean
          description: Indicates if upload is complete
        upload_completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Timestamp when the asset was successfully uploaded
        upload_failed:
          type: boolean
          description: Indicates if upload failed
        uploaded_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Timestamp when the operation started
      required:
        - filetype
        - id
        - upload_complete
        - upload_completed_at
        - upload_failed
        - uploaded_at
    FileUploadStatusResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileUploadStatus'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.showFileUploadStatus("51c8f343-0682-4a62-b941-9f736fd8f4c3", "9b7779b3-b4f4-499a-a75f-8eacb5232a8c");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.show_file_upload_status(
    account_id="51c8f343-0682-4a62-b941-9f736fd8f4c3",
    file_id="9b7779b3-b4f4-499a-a75f-8eacb5232a8c"
)

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status"

	req, _ := http.NewRequest("GET", url, nil)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/51c8f343-0682-4a62-b941-9f736fd8f4c3/files/9b7779b3-b4f4-499a-a75f-8eacb5232a8c/status")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```

# Update file

PATCH https://api.frame.io/v4/accounts/{account_id}/files/{file_id}
Content-Type: application/json

Update file details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/files/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update file
  version: endpoint_files.update
paths:
  /v4/accounts/{account_id}/files/{file_id}:
    patch:
      operationId: update
      summary: Update file
      description: >-
        Update file details. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_files
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: file_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FileResponse'
        '400':
          description: Bad request
          content: {}
        '401':
          description: Unauthorized
          content: {}
        '403':
          description: Forbidden
          content: {}
        '404':
          description: Not found
          content: {}
        '409':
          description: Conflict
          content: {}
        '422':
          description: Unprocessable entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: File params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FileUpdateParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FileUpdateParamsData:
      type: object
      properties:
        name:
          type: string
          description: File name
    FileUpdateParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FileUpdateParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    FileStatus:
      type: string
      enum:
        - value: created
        - value: transcoded
        - value: uploaded
    File:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File ID
        name:
          type: string
          description: File Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder or Version Stack ID
        project_id:
          type: string
          format: uuid
          description: Project ID
        type:
          $ref: '#/components/schemas/AssetCommonType'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        view_url:
          type: string
          description: URL to view the asset in the Frame.io web application
        file_size:
          type: integer
          description: File size in bytes
        media_type:
          type: string
          description: File media type
        status:
          $ref: '#/components/schemas/FileStatus'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - file_size
        - media_type
        - status
    FileResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/File'
      required:
        - data

```

## SDK Code Examples

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.files.update("086cebbe-1174-45ff-9852-87c5f165aa22", "1be1d7fd-4b60-4a24-bfb6-78a1f8269c52", {
        data: {
            name: "asset.png",
        },
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.files.update(
    account_id="086cebbe-1174-45ff-9852-87c5f165aa22",
    file_id="1be1d7fd-4b60-4a24-bfb6-78a1f8269c52",
    data={
        "name": "asset.png"
    }
)

```

```go
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"asset.png\"\n  }\n}")

	req, _ := http.NewRequest("PATCH", url, payload)

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}
```

```ruby
require 'uri'
require 'net/http'

url = URI("https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"asset.png\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"asset.png\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52', [
  'body' => '{
  "data": {
    "name": "asset.png"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"asset.png\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["name": "asset.png"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/086cebbe-1174-45ff-9852-87c5f165aa22/files/1be1d7fd-4b60-4a24-bfb6-78a1f8269c52")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "PATCH"
request.allHTTPHeaderFields = headers
request.httpBody = postData as Data

let session = URLSession.shared
let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
  if (error != nil) {
    print(error as Any)
  } else {
    let httpResponse = response as? HTTPURLResponse
    print(httpResponse)
  }
})

dataTask.resume()
```


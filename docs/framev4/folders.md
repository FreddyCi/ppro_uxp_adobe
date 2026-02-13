# Copy folder

POST https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/copy
Content-Type: application/json

Copy folder. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/copy

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Copy folder
  version: endpoint_folders.copy
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/copy:
    post:
      operationId: copy
      summary: Copy folder
      description: >-
        Copy folder. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_folders
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
        - name: copy_metadata
          in: query
          description: Whether to copy metadata values along with the folder
          required: false
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FolderCopyResponse'
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
        description: Folder params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FolderCopyParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FolderCopyParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder ID. Defaults to folder parent ID.
    FolderCopyParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FolderCopyParamsData'
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    Folder:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File, Folder, or Version Stack ID
        name:
          type: string
          description: File or folder Name
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
        cover_file_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Cover asset ID
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - cover_file_id
    FolderCopyResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Folder'
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
    await client.folders.copy("807dc1e3-c1e8-422e-82f1-11e39b903481", "1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1", {
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

client.folders.copy(
    account_id="807dc1e3-c1e8-422e-82f1-11e39b903481",
    folder_id="1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1",
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

	url := "https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy"

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

url = URI("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy', [
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
var client = new RestClient("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy");
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")! as URL,
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

```typescript
import { FrameioClient } from "frameio";

async function main() {
    const client = new FrameioClient({
        environment: "https://api.frame.io",
    });
    await client.folders.copy("807dc1e3-c1e8-422e-82f1-11e39b903481", "1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1", {
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

client.folders.copy(
    account_id="807dc1e3-c1e8-422e-82f1-11e39b903481",
    folder_id="1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1",
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

	url := "https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy"

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

url = URI("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy', [
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
var client = new RestClient("https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy");
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/807dc1e3-c1e8-422e-82f1-11e39b903481/folders/1fb9c3f7-4ac4-4d02-85fc-d8d62ab49ff1/copy")! as URL,
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

# Delete folder

DELETE https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}

Delete folder by id. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete folder
  version: endpoint_folders.delete
paths:
  /v4/accounts/{account_id}/folders/{folder_id}:
    delete:
      operationId: delete
      summary: Delete folder
      description: >-
        Delete folder by id. <br>Rate Limits: 60 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_folders
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
        '204':
          description: No Content
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Folders_delete_Response_204'
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
    Folders_delete_Response_204:
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
    await client.folders.delete("f49ec7df-6d0c-4736-9904-c791e5b843b7", "0b7a546e-a155-459d-81e7-bd7a98a3f279");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.folders.delete(
    account_id="f49ec7df-6d0c-4736-9904-c791e5b843b7",
    folder_id="0b7a546e-a155-459d-81e7-bd7a98a3f279"
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

	url := "https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279"

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

url = URI("https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f49ec7df-6d0c-4736-9904-c791e5b843b7/folders/0b7a546e-a155-459d-81e7-bd7a98a3f279")! as URL,
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

# List folder children

GET https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/children

List the children in the given folder.
<br>
Use the `include` query parameter to selectively include additional properties in the response.
<br>
Note: if you include `media_links.original` and the user does not have permission to download files
in the corresponding project, then this endpoint will respond with a `403 Forbidden` error.
If the content is inaccessible because watermarking is required for this user and isn't supported by
the requested media_links, then the request will succeed but the unsupported media links will be set to null.
Similarly, if a requested transcode link does not exist for a particular file (e.g. including
`media_links.video_h264_180` on a static image file) or transoding process hasn't finished
(i.e. the file's `status` is "uploaded" rather than "transcoded"), then the a media link will also be set to
null in the response payload. In short, the client must handle null media links gracefully.
<br>Rate Limits: 100 calls per 1.00 minute(s) per account_user


Reference: https://next.developer.frame.io/platform/api-reference/folders/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List folder children
  version: endpoint_folders.index
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/children:
    get:
      operationId: index
      summary: List folder children
      description: >
        List the children in the given folder.

        <br>

        Use the `include` query parameter to selectively include additional
        properties in the response.

        <br>

        Note: if you include `media_links.original` and the user does not have
        permission to download files

        in the corresponding project, then this endpoint will respond with a
        `403 Forbidden` error.

        If the content is inaccessible because watermarking is required for this
        user and isn't supported by

        the requested media_links, then the request will succeed but the
        unsupported media links will be set to null.

        Similarly, if a requested transcode link does not exist for a particular
        file (e.g. including

        `media_links.video_h264_180` on a static image file) or transoding
        process hasn't finished

        (i.e. the file's `status` is "uploaded" rather than "transcoded"), then
        the a media link will also be set to

        null in the response payload. In short, the client must handle null
        media links gracefully.

        <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_folders
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
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdChildrenGetParametersInclude
        - name: type
          in: query
          description: ''
          required: false
          schema:
            $ref: '#/components/schemas/ChildrenType'
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
    V4AccountsAccountIdFoldersFolderIdChildrenGetParametersInclude:
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
    ChildrenType:
      type: string
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
    await client.folders.index("291ed7af-fd94-4038-8323-3f7f51cc1dbb", "1038fbbb-4275-477f-bf04-5229526a3171", {
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

client.folders.index(
    account_id="291ed7af-fd94-4038-8323-3f7f51cc1dbb",
    folder_id="1038fbbb-4275-477f-bf04-5229526a3171",
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

	url := "https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links"

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

url = URI("https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/291ed7af-fd94-4038-8323-3f7f51cc1dbb/folders/1038fbbb-4275-477f-bf04-5229526a3171/children?include=media_links")! as URL,
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

# List folders

GET https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/folders

List folders in a given folder. <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List folders
  version: endpoint_folders.list
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/folders:
    get:
      operationId: list
      summary: List folders
      description: >-
        List folders in a given folder. <br>Rate Limits: 5 calls per 1 second(s)
        per account_user
      tags:
        - - subpackage_folders
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
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdFoldersGetParametersInclude
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
                $ref: '#/components/schemas/FoldersWithIncludesResponse'
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
    V4AccountsAccountIdFoldersFolderIdFoldersGetParametersInclude:
      type: string
      enum:
        - value: creator
        - value: project
        - value: metadata
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
    FolderWithIncludes:
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
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
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
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - cover_file_id
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
    FoldersWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/FolderWithIncludes'
          description: Folders
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
    await client.folders.list("ed30645f-291a-4f2e-ba88-2220bc84851c", "91429afe-d17f-4a7a-866c-e236a78f4d54", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.folders.list(
    account_id="ed30645f-291a-4f2e-ba88-2220bc84851c",
    folder_id="91429afe-d17f-4a7a-866c-e236a78f4d54"
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

	url := "https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders"

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

url = URI("https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/ed30645f-291a-4f2e-ba88-2220bc84851c/folders/91429afe-d17f-4a7a-866c-e236a78f4d54/folders")! as URL,
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

# Move folder

PATCH https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/move
Content-Type: application/json

Move folder to a folder. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/move

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Move folder
  version: endpoint_folders.move
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/move:
    patch:
      operationId: move
      summary: Move folder
      description: >-
        Move folder to a folder. <br>Rate Limits: 10 calls per 1.00 minute(s)
        per account_user
      tags:
        - - subpackage_folders
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
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FolderResponse'
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
              $ref: '#/components/schemas/FolderMoveParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FolderMoveParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder ID
    FolderMoveParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FolderMoveParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    Folder:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File, Folder, or Version Stack ID
        name:
          type: string
          description: File or folder Name
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
        cover_file_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Cover asset ID
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - cover_file_id
    FolderResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Folder'
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
    await client.folders.move("d3e80885-f338-40bb-b8b7-3a2e93a43367", "74b95c33-4585-4477-8b16-76a383ac557a", {
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

client.folders.move(
    account_id="d3e80885-f338-40bb-b8b7-3a2e93a43367",
    folder_id="74b95c33-4585-4477-8b16-76a383ac557a",
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

	url := "https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move"

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

url = URI("https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move', [
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
var client = new RestClient("https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move");
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/d3e80885-f338-40bb-b8b7-3a2e93a43367/folders/74b95c33-4585-4477-8b16-76a383ac557a/move")! as URL,
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

# Show folder

GET https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}

Show folder details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show folder
  version: endpoint_folders.show
paths:
  /v4/accounts/{account_id}/folders/{folder_id}:
    get:
      operationId: show
      summary: Show folder
      description: >-
        Show folder details. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_folders
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
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FolderWithIncludesResponse'
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
    V4AccountsAccountIdFoldersFolderIdGetParametersInclude:
      type: string
      enum:
        - value: creator
        - value: project
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
    FolderWithIncludes:
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
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
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
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - cover_file_id
    FolderWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FolderWithIncludes'
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
    await client.folders.show("aa3da9f6-1552-42b3-9cfc-a717a9b02695", "452810e2-f333-4e84-b87a-3a1cb2d9f406", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.folders.show(
    account_id="aa3da9f6-1552-42b3-9cfc-a717a9b02695",
    folder_id="452810e2-f333-4e84-b87a-3a1cb2d9f406"
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

	url := "https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406"

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

url = URI("https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/aa3da9f6-1552-42b3-9cfc-a717a9b02695/folders/452810e2-f333-4e84-b87a-3a1cb2d9f406")! as URL,
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

# Update folder

PATCH https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}
Content-Type: application/json

Update folder details. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/folders/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update folder
  version: endpoint_folders.update
paths:
  /v4/accounts/{account_id}/folders/{folder_id}:
    patch:
      operationId: update
      summary: Update folder
      description: >-
        Update folder details. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_folders
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
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FolderResponse'
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
        description: Folder update params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FolderUpdateParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    FolderUpdateParamsData:
      type: object
      properties:
        name:
          type: string
          description: Folder name
    FolderUpdateParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FolderUpdateParamsData'
      required:
        - data
    AssetCommonType:
      type: string
      enum:
        - value: file
        - value: folder
        - value: version_stack
    Folder:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: File, Folder, or Version Stack ID
        name:
          type: string
          description: File or folder Name
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
        cover_file_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Cover asset ID
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - cover_file_id
    FolderResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Folder'
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
    await client.folders.update("01a61e58-4ccc-4397-9377-1c58c3c2ae81", "586d0eb4-c28b-427a-b728-8e6545ed0a22", {
        data: {
            name: "Folder name",
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

client.folders.update(
    account_id="01a61e58-4ccc-4397-9377-1c58c3c2ae81",
    folder_id="586d0eb4-c28b-427a-b728-8e6545ed0a22",
    data={
        "name": "Folder name"
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

	url := "https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"Folder name\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"Folder name\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"Folder name\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22', [
  'body' => '{
  "data": {
    "name": "Folder name"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"Folder name\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["name": "Folder name"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/01a61e58-4ccc-4397-9377-1c58c3c2ae81/folders/586d0eb4-c28b-427a-b728-8e6545ed0a22")! as URL,
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


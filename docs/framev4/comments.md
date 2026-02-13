# Create comment

POST https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/comments
Content-Type: application/json

Create a comment on a file. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/comments/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create comment
  version: endpoint_comments.create
paths:
  /v4/accounts/{account_id}/files/{file_id}/comments:
    post:
      operationId: create
      summary: Create comment
      description: >-
        Create a comment on a file. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_comments
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
        - name: timestamp_as_timecode
          in: query
          description: ''
          required: false
          schema:
            type: boolean
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CommentResponse'
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
        description: Comment params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCommentParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    TimeStamp:
      oneOf:
        - type: string
          format: HH:MM:SS:FF
        - type: integer
    CreateCommentParamsData:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
          description: >-
            JSON geometry for on-screen drawings. Allowed for document, image,
            video, or stream file types. JSON must be stringified.
        completed:
          type:
            - boolean
            - 'null'
          description: Comment completion status
        page:
          type:
            - integer
            - 'null'
          description: Document page. Only allowed when file type is a pdf document
        text:
          type: string
          description: Comment text (required)
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
      required:
        - text
    CreateCommentParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/CreateCommentParamsData'
      required:
        - data
    Comment:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
    CommentResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Comment'
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
    await client.comments.create("e8d519fa-2020-44ef-a9c7-f4ec523ed346", "68b7d127-0001-4a08-8643-0fb0bfe85e7a", {
        data: {
            text: "This is great!",
            annotation: "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
            completed: false,
            page: 4,
            timestamp: "00:00:02:12",
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

client.comments.create(
    account_id="e8d519fa-2020-44ef-a9c7-f4ec523ed346",
    file_id="68b7d127-0001-4a08-8643-0fb0bfe85e7a",
    data={
        "text": "This is great!",
        "annotation": "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
        "completed": False,
        "page": 4,
        "timestamp": "00:00:02:12"
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

	url := "https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments"

	payload := strings.NewReader("{\n  \"data\": {\n    \"text\": \"This is great!\",\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"timestamp\": \"00:00:02:12\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"text\": \"This is great!\",\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"timestamp\": \"00:00:02:12\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"text\": \"This is great!\",\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"timestamp\": \"00:00:02:12\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments', [
  'body' => '{
  "data": {
    "text": "This is great!",
    "annotation": "[{\\"tool\\":\\"rect\\",\\"color\\":\\"#F22237\\",\\"size\\":8,\\"x\\":0.277726001863933,\\"y\\":0.12909555568499534,\\"w\\":0.3153168321877913,\\"h\\":0.5308131407269339,\\"ix\\":0.277726001863933,\\"iy\\":0.12909555568499534,\\"radius\\":8}]",
    "completed": false,
    "page": 4,
    "timestamp": "00:00:02:12"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"text\": \"This is great!\",\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"timestamp\": \"00:00:02:12\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "text": "This is great!",
    "annotation": "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
    "completed": false,
    "page": 4,
    "timestamp": "00:00:02:12"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/e8d519fa-2020-44ef-a9c7-f4ec523ed346/files/68b7d127-0001-4a08-8643-0fb0bfe85e7a/comments")! as URL,
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

# Delete comment

DELETE https://api.frame.io/v4/accounts/{account_id}/comments/{comment_id}

Delete comment from an asset. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/comments/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete comment
  version: endpoint_comments.delete
paths:
  /v4/accounts/{account_id}/comments/{comment_id}:
    delete:
      operationId: delete
      summary: Delete comment
      description: >-
        Delete comment from an asset. <br>Rate Limits: 60 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_comments
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: comment_id
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
                $ref: '#/components/schemas/Comments_delete_Response_204'
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
    Comments_delete_Response_204:
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
    await client.comments.delete("e892a243-361a-4bcb-9dc0-c9f3367bd6cc", "9b857f7c-bf57-45b6-b7c8-c2f8e393ae43");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.comments.delete(
    account_id="e892a243-361a-4bcb-9dc0-c9f3367bd6cc",
    comment_id="9b857f7c-bf57-45b6-b7c8-c2f8e393ae43"
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

	url := "https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43"

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

url = URI("https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/e892a243-361a-4bcb-9dc0-c9f3367bd6cc/comments/9b857f7c-bf57-45b6-b7c8-c2f8e393ae43")! as URL,
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

# List comments

GET https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/comments

List comments on a given asset. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/comments/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List comments
  version: endpoint_comments.index
paths:
  /v4/accounts/{account_id}/files/{file_id}/comments:
    get:
      operationId: index
      summary: List comments
      description: >-
        List comments on a given asset. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_comments
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
        - name: timestamp_as_timecode
          in: query
          description: ''
          required: false
          schema:
            type: boolean
        - name: include
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdFilesFileIdCommentsGetParametersInclude
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
                $ref: '#/components/schemas/CommentsWithIncludesResponse'
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
    V4AccountsAccountIdFilesFileIdCommentsGetParametersInclude:
      type: string
      enum:
        - value: owner
        - value: replies
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    TimeStamp:
      oneOf:
        - type: string
          format: HH:MM:SS:FF
        - type: integer
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
    Comment:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
    CommentWithIncludes:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        owner:
          $ref: '#/components/schemas/User'
        replies:
          type: array
          items:
            $ref: '#/components/schemas/Comment'
          description: Replies
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
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
    CommentsWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/CommentWithIncludes'
          description: Comments
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
    await client.comments.index("fdef1f82-489f-495a-9196-189d0477e7d1", "e83bdb39-6ffd-47c7-af9a-7a522cea7dd6", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.comments.index(
    account_id="fdef1f82-489f-495a-9196-189d0477e7d1",
    file_id="e83bdb39-6ffd-47c7-af9a-7a522cea7dd6"
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

	url := "https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments"

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

url = URI("https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/fdef1f82-489f-495a-9196-189d0477e7d1/files/e83bdb39-6ffd-47c7-af9a-7a522cea7dd6/comments")! as URL,
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

# Show comment

GET https://api.frame.io/v4/accounts/{account_id}/comments/{comment_id}

Show a single comment on a file. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/comments/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show comment
  version: endpoint_comments.show
paths:
  /v4/accounts/{account_id}/comments/{comment_id}:
    get:
      operationId: show
      summary: Show comment
      description: >-
        Show a single comment on a file. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_comments
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: comment_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: timestamp_as_timecode
          in: query
          description: ''
          required: false
          schema:
            type: boolean
        - name: include
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdCommentsCommentIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CommentWithIncludesResponse'
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
    V4AccountsAccountIdCommentsCommentIdGetParametersInclude:
      type: string
      enum:
        - value: owner
        - value: replies
    TimeStamp:
      oneOf:
        - type: string
          format: HH:MM:SS:FF
        - type: integer
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
    Comment:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
    CommentWithIncludes:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        owner:
          $ref: '#/components/schemas/User'
        replies:
          type: array
          items:
            $ref: '#/components/schemas/Comment'
          description: Replies
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
    CommentWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/CommentWithIncludes'
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
    await client.comments.show("0f05e065-4d47-4120-930d-ea6ff544be73", "e4aabcb6-6fd4-466e-b857-e6847ded5540", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.comments.show(
    account_id="0f05e065-4d47-4120-930d-ea6ff544be73",
    comment_id="e4aabcb6-6fd4-466e-b857-e6847ded5540"
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

	url := "https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540"

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

url = URI("https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/0f05e065-4d47-4120-930d-ea6ff544be73/comments/e4aabcb6-6fd4-466e-b857-e6847ded5540")! as URL,
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

# Update comment

PATCH https://api.frame.io/v4/accounts/{account_id}/comments/{comment_id}
Content-Type: application/json

Update comment on given asset. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/comments/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update comment
  version: endpoint_comments.update
paths:
  /v4/accounts/{account_id}/comments/{comment_id}:
    patch:
      operationId: update
      summary: Update comment
      description: >-
        Update comment on given asset. <br>Rate Limits: 10 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_comments
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: comment_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: timestamp_as_timecode
          in: query
          description: ''
          required: false
          schema:
            type: boolean
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CommentResponse'
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
        description: Comment params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCommentParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    TimeStamp:
      oneOf:
        - type: string
          format: HH:MM:SS:FF
        - type: integer
    UpdateCommentParamsData:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
          description: >-
            JSON geometry for on-screen drawings. Allowed for document, image,
            video, or stream file types. JSON must be stringified.
        completed:
          type:
            - boolean
            - 'null'
          description: Comment completion status
        page:
          type:
            - integer
            - 'null'
          description: Document page. Only allowed when file type is a pdf document
        text:
          type: string
          description: Comment text
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
    UpdateCommentParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/UpdateCommentParamsData'
      required:
        - data
    Comment:
      type: object
      properties:
        annotation:
          type:
            - string
            - 'null'
        completed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Completion timestamp
        completer_id:
          type:
            - string
            - 'null'
          format: uuid
          description: ID of user who marked the comment as completed
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        file_id:
          type: string
          format: uuid
          description: File ID
        id:
          type: string
          format: uuid
          description: Comment ID
        page:
          type:
            - integer
            - 'null'
          description: Document page
        text:
          type: string
          description: Comment text
        text_edited_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Text edited timestamp
        timestamp:
          $ref: '#/components/schemas/TimeStamp'
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - annotation
        - completed_at
        - completer_id
        - created_at
        - file_id
        - id
        - page
        - text
        - text_edited_at
        - timestamp
        - updated_at
    CommentResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Comment'
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
    await client.comments.update("81bdb874-c6c6-48f2-ba77-70cecf242088", "418f1ac9-97b1-4f14-9dde-6e31242452d2", {
        data: {
            annotation: "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
            completed: false,
            page: 4,
            text: "This is great!",
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

client.comments.update(
    account_id="81bdb874-c6c6-48f2-ba77-70cecf242088",
    comment_id="418f1ac9-97b1-4f14-9dde-6e31242452d2",
    data={
        "annotation": "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
        "completed": False,
        "page": 4,
        "text": "This is great!"
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

	url := "https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2"

	payload := strings.NewReader("{\n  \"data\": {\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"text\": \"This is great!\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"text\": \"This is great!\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"text\": \"This is great!\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2', [
  'body' => '{
  "data": {
    "annotation": "[{\\"tool\\":\\"rect\\",\\"color\\":\\"#F22237\\",\\"size\\":8,\\"x\\":0.277726001863933,\\"y\\":0.12909555568499534,\\"w\\":0.3153168321877913,\\"h\\":0.5308131407269339,\\"ix\\":0.277726001863933,\\"iy\\":0.12909555568499534,\\"radius\\":8}]",
    "completed": false,
    "page": 4,
    "text": "This is great!"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"annotation\": \"[{\\\"tool\\\":\\\"rect\\\",\\\"color\\\":\\\"#F22237\\\",\\\"size\\\":8,\\\"x\\\":0.277726001863933,\\\"y\\\":0.12909555568499534,\\\"w\\\":0.3153168321877913,\\\"h\\\":0.5308131407269339,\\\"ix\\\":0.277726001863933,\\\"iy\\\":0.12909555568499534,\\\"radius\\\":8}]\",\n    \"completed\": false,\n    \"page\": 4,\n    \"text\": \"This is great!\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "annotation": "[{\"tool\":\"rect\",\"color\":\"#F22237\",\"size\":8,\"x\":0.277726001863933,\"y\":0.12909555568499534,\"w\":0.3153168321877913,\"h\":0.5308131407269339,\"ix\":0.277726001863933,\"iy\":0.12909555568499534,\"radius\":8}]",
    "completed": false,
    "page": 4,
    "text": "This is great!"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/81bdb874-c6c6-48f2-ba77-70cecf242088/comments/418f1ac9-97b1-4f14-9dde-6e31242452d2")! as URL,
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
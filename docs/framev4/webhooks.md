# Create webhook

POST https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks
Content-Type: application/json

Creates a single webhook with secret.<br/><br/>Valid events:<p><code>
file.created, file.deleted, file.ready, file.updated, file.upload.completed, file.versioned, file.copied, folder.created, folder.deleted, folder.updated, folder.copied, comment.completed, comment.created, comment.deleted, comment.uncompleted, comment.updated, customfield.created, customfield.updated, customfield.deleted, metadata.value.updated, project.created, project.deleted, project.updated, collection.created, collection.updated, collection.deleted, share.created, share.updated, share.deleted, share.viewed
</code>
</p>. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/webhooks/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create webhook
  version: endpoint_webhooks.create
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks:
    post:
      operationId: create
      summary: Create webhook
      description: >-
        Creates a single webhook with secret.<br/><br/>Valid events:<p><code>

        file.created, file.deleted, file.ready, file.updated,
        file.upload.completed, file.versioned, file.copied, folder.created,
        folder.deleted, folder.updated, folder.copied, comment.completed,
        comment.created, comment.deleted, comment.uncompleted, comment.updated,
        customfield.created, customfield.updated, customfield.deleted,
        metadata.value.updated, project.created, project.deleted,
        project.updated, collection.created, collection.updated,
        collection.deleted, share.created, share.updated, share.deleted,
        share.viewed

        </code>

        </p>. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_webhooks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: workspace_id
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
                $ref: '#/components/schemas/WebhookCreateResponse'
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
        description: Webhook params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WebhookCreateParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    WebhookEvents:
      type: array
      items:
        type: string
    WebhookCreateParamsData:
      type: object
      properties:
        events:
          $ref: '#/components/schemas/WebhookEvents'
        name:
          type: string
        url:
          type: string
          description: URL where `event` is sent
      required:
        - events
        - name
        - url
    WebhookCreateParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WebhookCreateParamsData'
      required:
        - data
    WebhookCreateResponseData:
      type: object
      properties:
        active:
          type: boolean
          description: Webhook active status
        created_at:
          type: string
          format: date-time
        events:
          $ref: '#/components/schemas/WebhookEvents'
        id:
          type: string
          format: uuid
          description: Webhook ID
        name:
          type: string
          description: Webhook Name
        updated_at:
          type: string
          format: date-time
        url:
          type: string
        workspace_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Workspace ID
        secret:
          type: string
          description: >-
            Secret used to validate webhook requests. Make sure to store your
            secret. You won’t be able to see it again!
      required:
        - created_at
        - events
        - id
        - name
        - updated_at
        - url
        - secret
    WebhookCreateResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WebhookCreateResponseData'
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
    await client.webhooks.create("3589c46f-0af8-4ca0-b202-a0cb313db61d", "650ea7fa-98c2-456d-b48b-230b98557194", {
        data: {
            events: [
                "file.created",
                "file.deleted",
                "file.ready",
                "file.updated",
                "file.upload.completed",
                "file.versioned",
                "file.copied",
                "folder.created",
                "folder.deleted",
                "folder.updated",
                "folder.copied",
                "comment.completed",
                "comment.created",
                "comment.deleted",
                "comment.uncompleted",
                "comment.updated",
                "customfield.created",
                "customfield.updated",
                "customfield.deleted",
                "metadata.value.updated",
                "project.created",
                "project.deleted",
                "project.updated",
                "collection.created",
                "collection.updated",
                "collection.deleted",
                "share.created",
                "share.updated",
                "share.deleted",
                "share.viewed",
            ],
            name: "New Webhook",
            url: "https://url.example.com",
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

client.webhooks.create(
    account_id="3589c46f-0af8-4ca0-b202-a0cb313db61d",
    workspace_id="650ea7fa-98c2-456d-b48b-230b98557194",
    data={
        "events": [
            "file.created",
            "file.deleted",
            "file.ready",
            "file.updated",
            "file.upload.completed",
            "file.versioned",
            "file.copied",
            "folder.created",
            "folder.deleted",
            "folder.updated",
            "folder.copied",
            "comment.completed",
            "comment.created",
            "comment.deleted",
            "comment.uncompleted",
            "comment.updated",
            "customfield.created",
            "customfield.updated",
            "customfield.deleted",
            "metadata.value.updated",
            "project.created",
            "project.deleted",
            "project.updated",
            "collection.created",
            "collection.updated",
            "collection.deleted",
            "share.created",
            "share.updated",
            "share.deleted",
            "share.viewed"
        ],
        "name": "New Webhook",
        "url": "https://url.example.com"
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

	url := "https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks"

	payload := strings.NewReader("{\n  \"data\": {\n    \"events\": [\n      \"file.created\",\n      \"file.deleted\",\n      \"file.ready\",\n      \"file.updated\",\n      \"file.upload.completed\",\n      \"file.versioned\",\n      \"file.copied\",\n      \"folder.created\",\n      \"folder.deleted\",\n      \"folder.updated\",\n      \"folder.copied\",\n      \"comment.completed\",\n      \"comment.created\",\n      \"comment.deleted\",\n      \"comment.uncompleted\",\n      \"comment.updated\",\n      \"customfield.created\",\n      \"customfield.updated\",\n      \"customfield.deleted\",\n      \"metadata.value.updated\",\n      \"project.created\",\n      \"project.deleted\",\n      \"project.updated\",\n      \"collection.created\",\n      \"collection.updated\",\n      \"collection.deleted\",\n      \"share.created\",\n      \"share.updated\",\n      \"share.deleted\",\n      \"share.viewed\"\n    ],\n    \"name\": \"New Webhook\",\n    \"url\": \"https://url.example.com\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"events\": [\n      \"file.created\",\n      \"file.deleted\",\n      \"file.ready\",\n      \"file.updated\",\n      \"file.upload.completed\",\n      \"file.versioned\",\n      \"file.copied\",\n      \"folder.created\",\n      \"folder.deleted\",\n      \"folder.updated\",\n      \"folder.copied\",\n      \"comment.completed\",\n      \"comment.created\",\n      \"comment.deleted\",\n      \"comment.uncompleted\",\n      \"comment.updated\",\n      \"customfield.created\",\n      \"customfield.updated\",\n      \"customfield.deleted\",\n      \"metadata.value.updated\",\n      \"project.created\",\n      \"project.deleted\",\n      \"project.updated\",\n      \"collection.created\",\n      \"collection.updated\",\n      \"collection.deleted\",\n      \"share.created\",\n      \"share.updated\",\n      \"share.deleted\",\n      \"share.viewed\"\n    ],\n    \"name\": \"New Webhook\",\n    \"url\": \"https://url.example.com\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"events\": [\n      \"file.created\",\n      \"file.deleted\",\n      \"file.ready\",\n      \"file.updated\",\n      \"file.upload.completed\",\n      \"file.versioned\",\n      \"file.copied\",\n      \"folder.created\",\n      \"folder.deleted\",\n      \"folder.updated\",\n      \"folder.copied\",\n      \"comment.completed\",\n      \"comment.created\",\n      \"comment.deleted\",\n      \"comment.uncompleted\",\n      \"comment.updated\",\n      \"customfield.created\",\n      \"customfield.updated\",\n      \"customfield.deleted\",\n      \"metadata.value.updated\",\n      \"project.created\",\n      \"project.deleted\",\n      \"project.updated\",\n      \"collection.created\",\n      \"collection.updated\",\n      \"collection.deleted\",\n      \"share.created\",\n      \"share.updated\",\n      \"share.deleted\",\n      \"share.viewed\"\n    ],\n    \"name\": \"New Webhook\",\n    \"url\": \"https://url.example.com\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks', [
  'body' => '{
  "data": {
    "events": [
      "file.created",
      "file.deleted",
      "file.ready",
      "file.updated",
      "file.upload.completed",
      "file.versioned",
      "file.copied",
      "folder.created",
      "folder.deleted",
      "folder.updated",
      "folder.copied",
      "comment.completed",
      "comment.created",
      "comment.deleted",
      "comment.uncompleted",
      "comment.updated",
      "customfield.created",
      "customfield.updated",
      "customfield.deleted",
      "metadata.value.updated",
      "project.created",
      "project.deleted",
      "project.updated",
      "collection.created",
      "collection.updated",
      "collection.deleted",
      "share.created",
      "share.updated",
      "share.deleted",
      "share.viewed"
    ],
    "name": "New Webhook",
    "url": "https://url.example.com"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"events\": [\n      \"file.created\",\n      \"file.deleted\",\n      \"file.ready\",\n      \"file.updated\",\n      \"file.upload.completed\",\n      \"file.versioned\",\n      \"file.copied\",\n      \"folder.created\",\n      \"folder.deleted\",\n      \"folder.updated\",\n      \"folder.copied\",\n      \"comment.completed\",\n      \"comment.created\",\n      \"comment.deleted\",\n      \"comment.uncompleted\",\n      \"comment.updated\",\n      \"customfield.created\",\n      \"customfield.updated\",\n      \"customfield.deleted\",\n      \"metadata.value.updated\",\n      \"project.created\",\n      \"project.deleted\",\n      \"project.updated\",\n      \"collection.created\",\n      \"collection.updated\",\n      \"collection.deleted\",\n      \"share.created\",\n      \"share.updated\",\n      \"share.deleted\",\n      \"share.viewed\"\n    ],\n    \"name\": \"New Webhook\",\n    \"url\": \"https://url.example.com\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "events": ["file.created", "file.deleted", "file.ready", "file.updated", "file.upload.completed", "file.versioned", "file.copied", "folder.created", "folder.deleted", "folder.updated", "folder.copied", "comment.completed", "comment.created", "comment.deleted", "comment.uncompleted", "comment.updated", "customfield.created", "customfield.updated", "customfield.deleted", "metadata.value.updated", "project.created", "project.deleted", "project.updated", "collection.created", "collection.updated", "collection.deleted", "share.created", "share.updated", "share.deleted", "share.viewed"],
    "name": "New Webhook",
    "url": "https://url.example.com"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/3589c46f-0af8-4ca0-b202-a0cb313db61d/workspaces/650ea7fa-98c2-456d-b48b-230b98557194/webhooks")! as URL,
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

# Delete webhook

DELETE https://api.frame.io/v4/accounts/{account_id}/webhooks/{webhook_id}

Delete a webhook. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/webhooks/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete webhook
  version: endpoint_webhooks.delete
paths:
  /v4/accounts/{account_id}/webhooks/{webhook_id}:
    delete:
      operationId: delete
      summary: Delete webhook
      description: >-
        Delete a webhook. <br>Rate Limits: 60 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_webhooks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: webhook_id
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
                $ref: '#/components/schemas/Webhooks_delete_Response_204'
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
    Webhooks_delete_Response_204:
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
    await client.webhooks.delete("5a32897d-21fc-4c6c-bde5-719d44fc806a", "74066854-c33d-4b56-ab4a-dadaf10ec8a5");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.webhooks.delete(
    account_id="5a32897d-21fc-4c6c-bde5-719d44fc806a",
    webhook_id="74066854-c33d-4b56-ab4a-dadaf10ec8a5"
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

	url := "https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5"

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

url = URI("https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/5a32897d-21fc-4c6c-bde5-719d44fc806a/webhooks/74066854-c33d-4b56-ab4a-dadaf10ec8a5")! as URL,
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

# List webhooks

GET https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks

List webhooks for the given workspace. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/webhooks/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List webhooks
  version: endpoint_webhooks.index
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}/webhooks:
    get:
      operationId: index
      summary: List webhooks
      description: >-
        List webhooks for the given workspace. <br>Rate Limits: 100 calls per
        1.00 minute(s) per account_user
      tags:
        - - subpackage_webhooks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: workspace_id
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
              #/components/schemas/V4AccountsAccountIdWorkspacesWorkspaceIdWebhooksGetParametersInclude
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
                $ref: '#/components/schemas/WebhooksWithIncludesResponse'
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
    V4AccountsAccountIdWorkspacesWorkspaceIdWebhooksGetParametersInclude:
      type: string
      enum:
        - value: creator
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    WebhookEvents:
      type: array
      items:
        type: string
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
    WebhookWithIncludes:
      type: object
      properties:
        active:
          type: boolean
          description: Webhook active status
        created_at:
          type: string
          format: date-time
        events:
          $ref: '#/components/schemas/WebhookEvents'
        id:
          type: string
          format: uuid
          description: Webhook ID
        name:
          type: string
          description: Webhook Name
        updated_at:
          type: string
          format: date-time
        url:
          type: string
        workspace_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Workspace ID
        creator:
          $ref: '#/components/schemas/User'
      required:
        - created_at
        - events
        - id
        - name
        - updated_at
        - url
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
    WebhooksWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/WebhookWithIncludes'
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
    await client.webhooks.index("499a7e90-6fe7-4dc1-8af0-c7afc523e842", "4ec70a09-b4dd-4153-90dd-e0502e3a6d91", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.webhooks.index(
    account_id="499a7e90-6fe7-4dc1-8af0-c7afc523e842",
    workspace_id="4ec70a09-b4dd-4153-90dd-e0502e3a6d91"
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

	url := "https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks"

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

url = URI("https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/499a7e90-6fe7-4dc1-8af0-c7afc523e842/workspaces/4ec70a09-b4dd-4153-90dd-e0502e3a6d91/webhooks")! as URL,
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

# Show webhook

GET https://api.frame.io/v4/accounts/{account_id}/webhooks/{webhook_id}

Show webhook details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/webhooks/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show webhook
  version: endpoint_webhooks.show
paths:
  /v4/accounts/{account_id}/webhooks/{webhook_id}:
    get:
      operationId: show
      summary: Show webhook
      description: >-
        Show webhook details. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_webhooks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: webhook_id
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
              #/components/schemas/V4AccountsAccountIdWebhooksWebhookIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebhookWithIncludesResponse'
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
    V4AccountsAccountIdWebhooksWebhookIdGetParametersInclude:
      type: string
      enum:
        - value: creator
    WebhookEvents:
      type: array
      items:
        type: string
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
    WebhookWithIncludes:
      type: object
      properties:
        active:
          type: boolean
          description: Webhook active status
        created_at:
          type: string
          format: date-time
        events:
          $ref: '#/components/schemas/WebhookEvents'
        id:
          type: string
          format: uuid
          description: Webhook ID
        name:
          type: string
          description: Webhook Name
        updated_at:
          type: string
          format: date-time
        url:
          type: string
        workspace_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Workspace ID
        creator:
          $ref: '#/components/schemas/User'
      required:
        - created_at
        - events
        - id
        - name
        - updated_at
        - url
    WebhookWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WebhookWithIncludes'
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
    await client.webhooks.show("be9ed462-d00f-4912-997b-bf917023033f", "4d700ad6-6971-438e-9a97-ad94f9c00e36", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.webhooks.show(
    account_id="be9ed462-d00f-4912-997b-bf917023033f",
    webhook_id="4d700ad6-6971-438e-9a97-ad94f9c00e36"
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

	url := "https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36"

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

url = URI("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")! as URL,
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

# Show webhook

GET https://api.frame.io/v4/accounts/{account_id}/webhooks/{webhook_id}

Show webhook details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/webhooks/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show webhook
  version: endpoint_webhooks.show
paths:
  /v4/accounts/{account_id}/webhooks/{webhook_id}:
    get:
      operationId: show
      summary: Show webhook
      description: >-
        Show webhook details. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_webhooks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: webhook_id
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
              #/components/schemas/V4AccountsAccountIdWebhooksWebhookIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebhookWithIncludesResponse'
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
    V4AccountsAccountIdWebhooksWebhookIdGetParametersInclude:
      type: string
      enum:
        - value: creator
    WebhookEvents:
      type: array
      items:
        type: string
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
    WebhookWithIncludes:
      type: object
      properties:
        active:
          type: boolean
          description: Webhook active status
        created_at:
          type: string
          format: date-time
        events:
          $ref: '#/components/schemas/WebhookEvents'
        id:
          type: string
          format: uuid
          description: Webhook ID
        name:
          type: string
          description: Webhook Name
        updated_at:
          type: string
          format: date-time
        url:
          type: string
        workspace_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Workspace ID
        creator:
          $ref: '#/components/schemas/User'
      required:
        - created_at
        - events
        - id
        - name
        - updated_at
        - url
    WebhookWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WebhookWithIncludes'
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
    await client.webhooks.show("be9ed462-d00f-4912-997b-bf917023033f", "4d700ad6-6971-438e-9a97-ad94f9c00e36", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.webhooks.show(
    account_id="be9ed462-d00f-4912-997b-bf917023033f",
    webhook_id="4d700ad6-6971-438e-9a97-ad94f9c00e36"
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

	url := "https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36"

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

url = URI("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/be9ed462-d00f-4912-997b-bf917023033f/webhooks/4d700ad6-6971-438e-9a97-ad94f9c00e36")! as URL,
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
# Create workspace

POST https://api.frame.io/v4/accounts/{account_id}/workspaces
Content-Type: application/json

Create workspace from an account. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/workspaces/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create workspace
  version: endpoint_workspaces.create
paths:
  /v4/accounts/{account_id}/workspaces:
    post:
      operationId: create
      summary: Create workspace
      description: >-
        Create workspace from an account. <br>Rate Limits: 10 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_workspaces
      parameters:
        - name: account_id
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
                $ref: '#/components/schemas/WorkspaceResponse'
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
        description: Workspace params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkspaceParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    WorkspaceParamsData:
      type: object
      properties:
        name:
          type: string
          description: Workspace Name
    WorkspaceParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WorkspaceParamsData'
      required:
        - data
    Workspace:
      type: object
      properties:
        account_id:
          type: string
          format: uuid
          description: Account ID
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Workspace ID
        name:
          type: string
          description: Workspace Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - account_id
        - created_at
        - id
        - name
        - updated_at
    WorkspaceResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Workspace'
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
    await client.workspaces.create("b8e750d1-6a3f-4254-b161-a21406ca7b91", {
        data: {
            name: "My Workspace",
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

client.workspaces.create(
    account_id="b8e750d1-6a3f-4254-b161-a21406ca7b91",
    data={
        "name": "My Workspace"
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

	url := "https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces', [
  'body' => '{
  "data": {
    "name": "My Workspace"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["name": "My Workspace"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/b8e750d1-6a3f-4254-b161-a21406ca7b91/workspaces")! as URL,
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

# Delete workspace

DELETE https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}

Delete workspace from account. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/workspaces/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete workspace
  version: endpoint_workspaces.delete
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}:
    delete:
      operationId: delete
      summary: Delete workspace
      description: >-
        Delete workspace from account. <br>Rate Limits: 60 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_workspaces
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
        '204':
          description: No Content
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Workspaces_delete_Response_204'
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
    Workspaces_delete_Response_204:
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
    await client.workspaces.delete("6536c2a0-f7fb-4106-98d7-80a703665bae", "82899df1-c4a5-41da-8115-f51dd0521cd2");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.workspaces.delete(
    account_id="6536c2a0-f7fb-4106-98d7-80a703665bae",
    workspace_id="82899df1-c4a5-41da-8115-f51dd0521cd2"
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

	url := "https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2"

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

url = URI("https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/6536c2a0-f7fb-4106-98d7-80a703665bae/workspaces/82899df1-c4a5-41da-8115-f51dd0521cd2")! as URL,
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

# List workspaces

GET https://api.frame.io/v4/accounts/{account_id}/workspaces

List workspaces for a given account. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/workspaces/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List workspaces
  version: endpoint_workspaces.index
paths:
  /v4/accounts/{account_id}/workspaces:
    get:
      operationId: index
      summary: List workspaces
      description: >-
        List workspaces for a given account. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_workspaces
      parameters:
        - name: account_id
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
              #/components/schemas/V4AccountsAccountIdWorkspacesGetParametersInclude
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
                $ref: '#/components/schemas/WorkspacesWithIncludesResponse'
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
    V4AccountsAccountIdWorkspacesGetParametersInclude:
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
    WorkspaceWithIncludes:
      type: object
      properties:
        account_id:
          type: string
          format: uuid
          description: Account ID
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Workspace ID
        name:
          type: string
          description: Workspace Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
        creator:
          $ref: '#/components/schemas/User'
      required:
        - account_id
        - created_at
        - id
        - name
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
    WorkspacesWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/WorkspaceWithIncludes'
          description: Workspaces
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
    await client.workspaces.index("851cd4bc-3e8b-40a3-9074-4df23f26ef32", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.workspaces.index(
    account_id="851cd4bc-3e8b-40a3-9074-4df23f26ef32"
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

	url := "https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces"

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

url = URI("https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/851cd4bc-3e8b-40a3-9074-4df23f26ef32/workspaces")! as URL,
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

# Show workspace

GET https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}

Show workspace details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/workspaces/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show workspace
  version: endpoint_workspaces.show
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}:
    get:
      operationId: show
      summary: Show workspace
      description: >-
        Show workspace details. <br>Rate Limits: 100 calls per 1.00 minute(s)
        per account_user
      tags:
        - - subpackage_workspaces
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
              #/components/schemas/V4AccountsAccountIdWorkspacesWorkspaceIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkspaceWithIncludesResponse'
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
    V4AccountsAccountIdWorkspacesWorkspaceIdGetParametersInclude:
      type: string
      enum:
        - value: creator
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
    WorkspaceWithIncludes:
      type: object
      properties:
        account_id:
          type: string
          format: uuid
          description: Account ID
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Workspace ID
        name:
          type: string
          description: Workspace Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
        creator:
          $ref: '#/components/schemas/User'
      required:
        - account_id
        - created_at
        - id
        - name
        - updated_at
    WorkspaceWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WorkspaceWithIncludes'
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
    await client.workspaces.show("93f78522-8ecd-4663-9818-b34842e19f63", "90433bde-8811-4885-b98b-2bc29a659b4b", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.workspaces.show(
    account_id="93f78522-8ecd-4663-9818-b34842e19f63",
    workspace_id="90433bde-8811-4885-b98b-2bc29a659b4b"
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

	url := "https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b"

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

url = URI("https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/93f78522-8ecd-4663-9818-b34842e19f63/workspaces/90433bde-8811-4885-b98b-2bc29a659b4b")! as URL,
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

# Update workspace

PATCH https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}
Content-Type: application/json

Update a workspace. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/workspaces/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update workspace
  version: endpoint_workspaces.update
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}:
    patch:
      operationId: update
      summary: Update workspace
      description: >-
        Update a workspace. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_workspaces
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
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkspaceResponse'
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
        description: Workspace params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorkspaceParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    WorkspaceParamsData:
      type: object
      properties:
        name:
          type: string
          description: Workspace Name
    WorkspaceParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/WorkspaceParamsData'
      required:
        - data
    Workspace:
      type: object
      properties:
        account_id:
          type: string
          format: uuid
          description: Account ID
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        id:
          type: string
          format: uuid
          description: Workspace ID
        name:
          type: string
          description: Workspace Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - account_id
        - created_at
        - id
        - name
        - updated_at
    WorkspaceResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Workspace'
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
    await client.workspaces.update("d42edf41-4cf0-4fea-a692-43cb9b952247", "e7ae5c55-190f-495a-adbe-2cd8cdfbb813", {
        data: {
            name: "My Workspace",
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

client.workspaces.update(
    account_id="d42edf41-4cf0-4fea-a692-43cb9b952247",
    workspace_id="e7ae5c55-190f-495a-adbe-2cd8cdfbb813",
    data={
        "name": "My Workspace"
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

	url := "https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813', [
  'body' => '{
  "data": {
    "name": "My Workspace"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"My Workspace\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["name": "My Workspace"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/d42edf41-4cf0-4fea-a692-43cb9b952247/workspaces/e7ae5c55-190f-495a-adbe-2cd8cdfbb813")! as URL,
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
# Create project

POST https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/projects
Content-Type: application/json

Create project in a given workspace. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/projects/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create project
  version: endpoint_projects.create
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}/projects:
    post:
      operationId: create
      summary: Create project
      description: >-
        Create project in a given workspace. <br>Rate Limits: 10 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_projects
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
                $ref: '#/components/schemas/ProjectResponse'
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
        description: Project params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProjectParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    ProjectParamsData:
      type: object
      properties:
        name:
          type: string
          description: Project Name
        restricted:
          type: boolean
          description: Whether the project is restricted or not
      required:
        - name
    ProjectParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/ProjectParamsData'
      required:
        - data
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
    Project:
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
    ProjectResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Project'
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
    await client.projects.create("ed4ee1ea-04b7-4a08-8f4b-d381425072c7", "9b27b275-83a9-41ff-ac4c-39605fda2c24", {
        data: {
            name: "Project Name",
            restricted: true,
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

client.projects.create(
    account_id="ed4ee1ea-04b7-4a08-8f4b-d381425072c7",
    workspace_id="9b27b275-83a9-41ff-ac4c-39605fda2c24",
    data={
        "name": "Project Name",
        "restricted": True
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

	url := "https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects', [
  'body' => '{
  "data": {
    "name": "Project Name",
    "restricted": true
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "name": "Project Name",
    "restricted": true
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/ed4ee1ea-04b7-4a08-8f4b-d381425072c7/workspaces/9b27b275-83a9-41ff-ac4c-39605fda2c24/projects")! as URL,
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

# Delete project

DELETE https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}

Delete a project. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/projects/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete project
  version: endpoint_projects.delete
paths:
  /v4/accounts/{account_id}/projects/{project_id}:
    delete:
      operationId: delete
      summary: Delete project
      description: >-
        Delete a project. <br>Rate Limits: 60 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_projects
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: project_id
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
                $ref: '#/components/schemas/Projects_delete_Response_204'
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
    Projects_delete_Response_204:
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
    await client.projects.delete("3e6088f0-4e70-405b-bf03-8ff3a36181c5", "2dc92f21-0035-4089-b79b-3f435a81edbb");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.projects.delete(
    account_id="3e6088f0-4e70-405b-bf03-8ff3a36181c5",
    project_id="2dc92f21-0035-4089-b79b-3f435a81edbb"
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

	url := "https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb"

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

url = URI("https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/3e6088f0-4e70-405b-bf03-8ff3a36181c5/projects/2dc92f21-0035-4089-b79b-3f435a81edbb")! as URL,
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

# List projects

GET https://api.frame.io/v4/accounts/{account_id}/workspaces/{workspace_id}/projects

List projects in a given workspace. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/projects/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List projects
  version: endpoint_projects.index
paths:
  /v4/accounts/{account_id}/workspaces/{workspace_id}/projects:
    get:
      operationId: index
      summary: List projects
      description: >-
        List projects in a given workspace. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_projects
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
              #/components/schemas/V4AccountsAccountIdWorkspacesWorkspaceIdProjectsGetParametersInclude
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
                $ref: '#/components/schemas/ProjectsWithIncludesResponse'
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
    V4AccountsAccountIdWorkspacesWorkspaceIdProjectsGetParametersInclude:
      type: string
      enum:
        - value: owner
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
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
    ProjectsWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/ProjectWithIncludes'
          description: Projects
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
    await client.projects.index("d743b48f-d1f6-4188-bc60-31f69cc8a63f", "3b166a24-fba3-475f-8223-e6df42698884", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.projects.index(
    account_id="d743b48f-d1f6-4188-bc60-31f69cc8a63f",
    workspace_id="3b166a24-fba3-475f-8223-e6df42698884"
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

	url := "https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects"

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

url = URI("https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/d743b48f-d1f6-4188-bc60-31f69cc8a63f/workspaces/3b166a24-fba3-475f-8223-e6df42698884/projects")! as URL,
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

# Show project

GET https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}

Show project details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/projects/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show project
  version: endpoint_projects.show
paths:
  /v4/accounts/{account_id}/projects/{project_id}:
    get:
      operationId: show
      summary: Show project
      description: >-
        Show project details. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_projects
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: project_id
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
              #/components/schemas/V4AccountsAccountIdProjectsProjectIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectWithIncludesResponse'
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
    V4AccountsAccountIdProjectsProjectIdGetParametersInclude:
      type: string
      enum:
        - value: owner
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
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
    ProjectWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/ProjectWithIncludes'
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
    await client.projects.show("f2b2133b-3ea2-4a61-a429-0ce85c5a5de8", "ce05ce2c-6c73-4e51-b3a4-775e18f783c7", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.projects.show(
    account_id="f2b2133b-3ea2-4a61-a429-0ce85c5a5de8",
    project_id="ce05ce2c-6c73-4e51-b3a4-775e18f783c7"
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

	url := "https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7"

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

url = URI("https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f2b2133b-3ea2-4a61-a429-0ce85c5a5de8/projects/ce05ce2c-6c73-4e51-b3a4-775e18f783c7")! as URL,
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

# Update project

PATCH https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}
Content-Type: application/json

Update project details. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/projects/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update project
  version: endpoint_projects.update
paths:
  /v4/accounts/{account_id}/projects/{project_id}:
    patch:
      operationId: update
      summary: Update project
      description: >-
        Update project details. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_projects
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: project_id
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
                $ref: '#/components/schemas/ProjectResponse'
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
        description: Project params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProjectUpdateParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    ProjectUpdateParamsDataStatus:
      type: string
      enum:
        - value: active
        - value: inactive
    ProjectUpdateParamsData:
      type: object
      properties:
        name:
          type: string
          description: Project Name
        restricted:
          type: boolean
          description: Whether the project is restricted or not
        status:
          $ref: '#/components/schemas/ProjectUpdateParamsDataStatus'
          description: Project Status
    ProjectUpdateParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/ProjectUpdateParamsData'
      required:
        - data
    ProjectStatus:
      type: string
      enum:
        - value: active
        - value: inactive
    Project:
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
    ProjectResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Project'
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
    await client.projects.update("601abb40-5fe3-43c5-9c73-9149cab5ca11", "bd63e031-0a98-4544-bbd6-1754242779e2", {
        data: {
            name: "Project Name",
            restricted: true,
            status: "active",
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

client.projects.update(
    account_id="601abb40-5fe3-43c5-9c73-9149cab5ca11",
    project_id="bd63e031-0a98-4544-bbd6-1754242779e2",
    data={
        "name": "Project Name",
        "restricted": True,
        "status": "active"
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

	url := "https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2"

	payload := strings.NewReader("{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true,\n    \"status\": \"active\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true,\n    \"status\": \"active\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true,\n    \"status\": \"active\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2', [
  'body' => '{
  "data": {
    "name": "Project Name",
    "restricted": true,
    "status": "active"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"name\": \"Project Name\",\n    \"restricted\": true,\n    \"status\": \"active\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "name": "Project Name",
    "restricted": true,
    "status": "active"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/601abb40-5fe3-43c5-9c73-9149cab5ca11/projects/bd63e031-0a98-4544-bbd6-1754242779e2")! as URL,
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
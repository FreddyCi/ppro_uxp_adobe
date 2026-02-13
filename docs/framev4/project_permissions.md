# List project user roles

GET https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/users

List user roles for a given project. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/project-permissions/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List project user roles
  version: endpoint_projectPermissions.index
paths:
  /v4/accounts/{account_id}/projects/{project_id}/users:
    get:
      operationId: index
      summary: List project user roles
      description: >-
        List user roles for a given project. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_projectPermissions
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
        - name: include_deactivated
          in: query
          description: >-
            Supports including deactivated users in the response. Default is
            false.
          required: false
          schema:
            type: boolean
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
                $ref: '#/components/schemas/UserRolesResponse'
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
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    UserRoleRole:
      type: string
      enum:
        - value: full_access
        - value: editor
        - value: edit_only
        - value: commenter
        - value: viewer
        - value: admin
        - value: owner
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
    UserRole:
      type: object
      properties:
        role:
          $ref: '#/components/schemas/UserRoleRole'
        user:
          $ref: '#/components/schemas/User'
      required:
        - role
        - user
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
    UserRolesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/UserRole'
          description: User Roles
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
    await client.projectPermissions.index("7b5916fe-db2a-40e4-ac73-440c28c23a2a", "101b453f-602d-4be8-89ce-9f61052342fe", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.project_permissions.index(
    account_id="7b5916fe-db2a-40e4-ac73-440c28c23a2a",
    project_id="101b453f-602d-4be8-89ce-9f61052342fe"
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

	url := "https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users"

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

url = URI("https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/7b5916fe-db2a-40e4-ac73-440c28c23a2a/projects/101b453f-602d-4be8-89ce-9f61052342fe/users")! as URL,
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

# Remove a user from a given project

DELETE https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/users/{user_id}

Remove a user from a given project. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/project-permissions/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Remove a user from a given project
  version: endpoint_projectPermissions.delete
paths:
  /v4/accounts/{account_id}/projects/{project_id}/users/{user_id}:
    delete:
      operationId: delete
      summary: Remove a user from a given project
      description: >-
        Remove a user from a given project. <br>Rate Limits: 60 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_projectPermissions
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
        - name: user_id
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
                $ref: '#/components/schemas/Project Permissions_delete_Response_204'
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
    Project Permissions_delete_Response_204:
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
    await client.projectPermissions.delete("c8065f7d-2ca5-41c5-9443-c3632dc68487", "624a97ca-6d14-4901-ae24-ab4ce5345d55", "7d6b231b-e5f7-4a9c-b151-b89ef556e2d7");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.project_permissions.delete(
    account_id="c8065f7d-2ca5-41c5-9443-c3632dc68487",
    project_id="624a97ca-6d14-4901-ae24-ab4ce5345d55",
    user_id="7d6b231b-e5f7-4a9c-b151-b89ef556e2d7"
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

	url := "https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7"

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

url = URI("https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/c8065f7d-2ca5-41c5-9443-c3632dc68487/projects/624a97ca-6d14-4901-ae24-ab4ce5345d55/users/7d6b231b-e5f7-4a9c-b151-b89ef556e2d7")! as URL,
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

# Update user roles for the given project

PATCH https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/users/{user_id}
Content-Type: application/json

Update user roles for the given project if the user is already added to the project. If the user is
    not added to the project, the user will be added with the given role. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/project-permissions/project-user-roles-update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update user roles for the given project
  version: endpoint_projectPermissions.project_user_roles.update
paths:
  /v4/accounts/{account_id}/projects/{project_id}/users/{user_id}:
    patch:
      operationId: project-user-roles-update
      summary: Update user roles for the given project
      description: >-
        Update user roles for the given project if the user is already added to
        the project. If the user is
            not added to the project, the user will be added with the given role. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_projectPermissions
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
        - name: user_id
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
                $ref: '#/components/schemas/UpdateUserRolesResponse'
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
        description: Update user roles params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRolesParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    UpdateUserRolesParamsDataRole:
      type: string
      enum:
        - value: full_access
        - value: editor
        - value: edit_only
        - value: commenter
        - value: viewer
    UpdateUserRolesParamsData:
      type: object
      properties:
        role:
          $ref: '#/components/schemas/UpdateUserRolesParamsDataRole'
      required:
        - role
    UpdateUserRolesParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/UpdateUserRolesParamsData'
      required:
        - data
    UpdateUserRolesResponseDataRole:
      type: string
      enum:
        - value: full_access
        - value: editor
        - value: edit_only
        - value: commenter
        - value: viewer
    UpdateUserRolesResponseData:
      type: object
      properties:
        role:
          $ref: '#/components/schemas/UpdateUserRolesResponseDataRole'
    UpdateUserRolesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/UpdateUserRolesResponseData'
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
    await client.projectPermissions.projectUserRolesUpdate("2063baa5-aa77-4d46-84c1-ba1920faab28", "61d5c0cb-ebbb-4a91-adac-7be96bde01c4", "acfdeab9-4486-48ca-a4dc-3787054991f4", {
        data: {
            role: "editor",
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

client.project_permissions.project_user_roles_update(
    account_id="2063baa5-aa77-4d46-84c1-ba1920faab28",
    project_id="61d5c0cb-ebbb-4a91-adac-7be96bde01c4",
    user_id="acfdeab9-4486-48ca-a4dc-3787054991f4",
    data={
        "role": "editor"
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

	url := "https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4"

	payload := strings.NewReader("{\n  \"data\": {\n    \"role\": \"editor\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"role\": \"editor\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"role\": \"editor\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4', [
  'body' => '{
  "data": {
    "role": "editor"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"role\": \"editor\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["role": "editor"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/2063baa5-aa77-4d46-84c1-ba1920faab28/projects/61d5c0cb-ebbb-4a91-adac-7be96bde01c4/users/acfdeab9-4486-48ca-a4dc-3787054991f4")! as URL,
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
# Add new asset to share

POST https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}/assets
Content-Type: application/json

Add new asset share. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/add-asset

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Add new asset to share
  version: endpoint_shares.addAsset
paths:
  /v4/accounts/{account_id}/shares/{share_id}/assets:
    post:
      operationId: add-asset
      summary: Add new asset to share
      description: >-
        Add new asset share. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/AddAssetResponse'
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
        description: Add asset body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddAssetParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    AddAssetParamsData:
      type: object
      properties:
        asset_id:
          type: string
          format: uuid
          description: ID for asset to be added
      required:
        - asset_id
    AddAssetParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/AddAssetParamsData'
      required:
        - data
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    AddAssetResponseData:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        asset_added:
          type: string
          format: uuid
          description: ID for asset added
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
        - asset_added
    AddAssetResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/AddAssetResponseData'
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
    await client.shares.addAsset("9ce489f0-5263-4093-aae1-f4af7e3663cc", "260c2ab6-02b0-4e66-91a1-9e38e56c4b03", {
        data: {
            assetId: "2b272853-e4b3-46ee-8bd0-e345444ddf46",
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

client.shares.add_asset(
    account_id="9ce489f0-5263-4093-aae1-f4af7e3663cc",
    share_id="260c2ab6-02b0-4e66-91a1-9e38e56c4b03",
    data={
        "asset_id": "2b272853-e4b3-46ee-8bd0-e345444ddf46"
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

	url := "https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets"

	payload := strings.NewReader("{\n  \"data\": {\n    \"asset_id\": \"2b272853-e4b3-46ee-8bd0-e345444ddf46\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"asset_id\": \"2b272853-e4b3-46ee-8bd0-e345444ddf46\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"asset_id\": \"2b272853-e4b3-46ee-8bd0-e345444ddf46\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets', [
  'body' => '{
  "data": {
    "asset_id": "2b272853-e4b3-46ee-8bd0-e345444ddf46"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"asset_id\": \"2b272853-e4b3-46ee-8bd0-e345444ddf46\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["asset_id": "2b272853-e4b3-46ee-8bd0-e345444ddf46"]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/9ce489f0-5263-4093-aae1-f4af7e3663cc/shares/260c2ab6-02b0-4e66-91a1-9e38e56c4b03/assets")! as URL,
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

# Add reviewers to secure share

POST https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}/reviewers
Content-Type: application/json

Add reviewers to secure share by three identifier types: `adobe_user_id`, `email`, and `user_id`.
<br>
A request can only include one identifier type parameter.
<br>
`email` is the only identifier able to add reviewers to a Share who don't have a Frame account member on the account where the Share belongs.
<br>Rate Limits: 10 calls per 1.00 minute(s) per account_user


Reference: https://next.developer.frame.io/platform/api-reference/shares/add-reviewers

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Add reviewers to secure share
  version: endpoint_shares.addReviewers
paths:
  /v4/accounts/{account_id}/shares/{share_id}/reviewers:
    post:
      operationId: add-reviewers
      summary: Add reviewers to secure share
      description: >
        Add reviewers to secure share by three identifier types:
        `adobe_user_id`, `email`, and `user_id`.

        <br>

        A request can only include one identifier type parameter.

        <br>

        `email` is the only identifier able to add reviewers to a Share who
        don't have a Frame account member on the account where the Share
        belongs.

        <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/Shares_addReviewers_Response_204'
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
        description: Add reviewers to share body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddReviewersToShareParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    Email:
      type: string
    AddReviewersToShareParamsDataReviewers:
      type: object
      properties:
        adobe_user_ids:
          type: array
          items:
            type: string
          description: Adobe User IDs
        emails:
          type: array
          items:
            $ref: '#/components/schemas/Email'
          description: Email Addresses
        user_ids:
          type: array
          items:
            $ref: '#/components/schemas/UUID'
          description: User IDs
    AddReviewersToShareParamsData:
      type: object
      properties:
        message:
          type: string
          description: Message for notification content
        reviewers:
          $ref: '#/components/schemas/AddReviewersToShareParamsDataReviewers'
      required:
        - message
        - reviewers
    AddReviewersToShareParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/AddReviewersToShareParamsData'
      required:
        - data
    Shares_addReviewers_Response_204:
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
    await client.shares.addReviewers("f061e36d-f177-46ae-864c-f78205a8adbc", "678199e9-0976-40b0-a0e8-808c512fb966", {
        data: {
            message: "Please join my share!",
            reviewers: {
                emails: [
                    "email1@domain.com",
                    "email2@domain.com",
                ],
            },
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

client.shares.add_reviewers(
    account_id="f061e36d-f177-46ae-864c-f78205a8adbc",
    share_id="678199e9-0976-40b0-a0e8-808c512fb966",
    data={
        "message": "Please join my share!",
        "reviewers": {
            "emails": [
                "email1@domain.com",
                "email2@domain.com"
            ]
        }
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

	url := "https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers"

	payload := strings.NewReader("{\n  \"data\": {\n    \"message\": \"Please join my share!\",\n    \"reviewers\": {\n      \"emails\": [\n        \"email1@domain.com\",\n        \"email2@domain.com\"\n      ]\n    }\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"message\": \"Please join my share!\",\n    \"reviewers\": {\n      \"emails\": [\n        \"email1@domain.com\",\n        \"email2@domain.com\"\n      ]\n    }\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"message\": \"Please join my share!\",\n    \"reviewers\": {\n      \"emails\": [\n        \"email1@domain.com\",\n        \"email2@domain.com\"\n      ]\n    }\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers', [
  'body' => '{
  "data": {
    "message": "Please join my share!",
    "reviewers": {
      "emails": [
        "email1@domain.com",
        "email2@domain.com"
      ]
    }
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"message\": \"Please join my share!\",\n    \"reviewers\": {\n      \"emails\": [\n        \"email1@domain.com\",\n        \"email2@domain.com\"\n      ]\n    }\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "message": "Please join my share!",
    "reviewers": ["emails": ["email1@domain.com", "email2@domain.com"]]
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f061e36d-f177-46ae-864c-f78205a8adbc/shares/678199e9-0976-40b0-a0e8-808c512fb966/reviewers")! as URL,
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

# Create share

POST https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/shares
Content-Type: application/json

Create share. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create share
  version: endpoint_shares.create
paths:
  /v4/accounts/{account_id}/projects/{project_id}/shares:
    post:
      operationId: create
      summary: Create share
      description: >-
        Create share. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
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
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ShareResponse'
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
        description: Share params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateShareParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    AssetShareParamsAccess:
      type: string
      enum:
        - value: public
        - value: secure
    AssetShareParamsType:
      type: string
      enum:
        - value: asset
    AssetShareParams:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/AssetShareParamsAccess'
        asset_ids:
          type: array
          items:
            type: string
            format: uuid
          description: Asset IDs (File, folder, and/or version stack IDs)
        description:
          type:
            - string
            - 'null'
          description: 'Share description - NOTE: Requires feature custom_branded_shares'
        downloading_enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        name:
          type: string
          description: >-
            Share Name (must include at least one non-whitespace character and
            no line breaks)
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        type:
          $ref: '#/components/schemas/AssetShareParamsType'
          description: Entity type
      required:
        - access
        - name
        - type
    CreateShareParamsData:
      oneOf:
        - $ref: '#/components/schemas/AssetShareParams'
    CreateShareParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/CreateShareParamsData'
      required:
        - data
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    Share:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
    ShareResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Share'
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
    await client.shares.create("9e914ced-8695-4a2b-8c4f-8a13541d6bcf", "f34a452f-a7c9-47f0-9997-9dc208b84a85", {
        data: {
            type: "asset",
            access: "public",
            assetIds: [
                "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
                "59398733-93c6-403b-b84d-4225e3468b05",
            ],
            downloadingEnabled: true,
            expiration: new Date("2026-01-26T20:35:55.140364Z"),
            name: "Share Name",
            passphrase: "as!dfj39sd(*",
        },
    });
}
main();

```

```python
from frameio import Frameio
from datetime import datetime

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.create(
    account_id="9e914ced-8695-4a2b-8c4f-8a13541d6bcf",
    project_id="f34a452f-a7c9-47f0-9997-9dc208b84a85",
    data={
        "type": "asset",
        "access": "public",
        "asset_ids": [
            "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
            "59398733-93c6-403b-b84d-4225e3468b05"
        ],
        "downloading_enabled": True,
        "expiration": datetime.fromisoformat("2026-01-26T20:35:55.140364Z"),
        "name": "Share Name",
        "passphrase": "as!dfj39sd(*"
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

	url := "https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares"

	payload := strings.NewReader("{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares', [
  'body' => '{
  "data": {
    "access": "public",
    "asset_ids": [
      "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
      "59398733-93c6-403b-b84d-4225e3468b05"
    ],
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*",
    "type": "asset"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "access": "public",
    "asset_ids": ["8d7fbbc2-543b-43a4-b85b-c8789fe95ff5", "59398733-93c6-403b-b84d-4225e3468b05"],
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*",
    "type": "asset"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")! as URL,
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

# Create share

POST https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/shares
Content-Type: application/json

Create share. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create share
  version: endpoint_shares.create
paths:
  /v4/accounts/{account_id}/projects/{project_id}/shares:
    post:
      operationId: create
      summary: Create share
      description: >-
        Create share. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
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
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ShareResponse'
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
        description: Share params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateShareParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    AssetShareParamsAccess:
      type: string
      enum:
        - value: public
        - value: secure
    AssetShareParamsType:
      type: string
      enum:
        - value: asset
    AssetShareParams:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/AssetShareParamsAccess'
        asset_ids:
          type: array
          items:
            type: string
            format: uuid
          description: Asset IDs (File, folder, and/or version stack IDs)
        description:
          type:
            - string
            - 'null'
          description: 'Share description - NOTE: Requires feature custom_branded_shares'
        downloading_enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        name:
          type: string
          description: >-
            Share Name (must include at least one non-whitespace character and
            no line breaks)
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        type:
          $ref: '#/components/schemas/AssetShareParamsType'
          description: Entity type
      required:
        - access
        - name
        - type
    CreateShareParamsData:
      oneOf:
        - $ref: '#/components/schemas/AssetShareParams'
    CreateShareParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/CreateShareParamsData'
      required:
        - data
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    Share:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
    ShareResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Share'
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
    await client.shares.create("9e914ced-8695-4a2b-8c4f-8a13541d6bcf", "f34a452f-a7c9-47f0-9997-9dc208b84a85", {
        data: {
            type: "asset",
            access: "public",
            assetIds: [
                "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
                "59398733-93c6-403b-b84d-4225e3468b05",
            ],
            downloadingEnabled: true,
            expiration: new Date("2026-01-26T20:35:55.140364Z"),
            name: "Share Name",
            passphrase: "as!dfj39sd(*",
        },
    });
}
main();

```

```python
from frameio import Frameio
from datetime import datetime

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.create(
    account_id="9e914ced-8695-4a2b-8c4f-8a13541d6bcf",
    project_id="f34a452f-a7c9-47f0-9997-9dc208b84a85",
    data={
        "type": "asset",
        "access": "public",
        "asset_ids": [
            "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
            "59398733-93c6-403b-b84d-4225e3468b05"
        ],
        "downloading_enabled": True,
        "expiration": datetime.fromisoformat("2026-01-26T20:35:55.140364Z"),
        "name": "Share Name",
        "passphrase": "as!dfj39sd(*"
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

	url := "https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares"

	payload := strings.NewReader("{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares', [
  'body' => '{
  "data": {
    "access": "public",
    "asset_ids": [
      "8d7fbbc2-543b-43a4-b85b-c8789fe95ff5",
      "59398733-93c6-403b-b84d-4225e3468b05"
    ],
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*",
    "type": "asset"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"access\": \"public\",\n    \"asset_ids\": [\n      \"8d7fbbc2-543b-43a4-b85b-c8789fe95ff5\",\n      \"59398733-93c6-403b-b84d-4225e3468b05\"\n    ],\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\",\n    \"type\": \"asset\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "access": "public",
    "asset_ids": ["8d7fbbc2-543b-43a4-b85b-c8789fe95ff5", "59398733-93c6-403b-b84d-4225e3468b05"],
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*",
    "type": "asset"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/9e914ced-8695-4a2b-8c4f-8a13541d6bcf/projects/f34a452f-a7c9-47f0-9997-9dc208b84a85/shares")! as URL,
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

# Delete share

DELETE https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}

Delete a share. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete share
  version: endpoint_shares.delete
paths:
  /v4/accounts/{account_id}/shares/{share_id}:
    delete:
      operationId: delete
      summary: Delete share
      description: >-
        Delete a share. <br>Rate Limits: 60 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/Shares_delete_Response_204'
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
    Shares_delete_Response_204:
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
    await client.shares.delete("152cbb0c-de6e-4a0e-bd59-387e1e54b721", "9a0fbd6b-85a3-4d59-9e09-604ff707bd86");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.delete(
    account_id="152cbb0c-de6e-4a0e-bd59-387e1e54b721",
    share_id="9a0fbd6b-85a3-4d59-9e09-604ff707bd86"
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

	url := "https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86"

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

url = URI("https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/152cbb0c-de6e-4a0e-bd59-387e1e54b721/shares/9a0fbd6b-85a3-4d59-9e09-604ff707bd86")! as URL,
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

# List share reviewers

GET https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}/reviewers

List share reviewers. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/list-reviewers

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List share reviewers
  version: endpoint_shares.listReviewers
paths:
  /v4/accounts/{account_id}/shares/{share_id}/reviewers:
    get:
      operationId: list-reviewers
      summary: List share reviewers
      description: >-
        List share reviewers. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
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
                $ref: '#/components/schemas/ShareReviewersResponse'
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
    ShareReviewersResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
          description: Share reviewer details
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
    await client.shares.listReviewers("aafb2a8b-5a89-4bfd-b021-18709509d350", "bf13e577-8d47-46e7-9373-e77061928437", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.list_reviewers(
    account_id="aafb2a8b-5a89-4bfd-b021-18709509d350",
    share_id="bf13e577-8d47-46e7-9373-e77061928437"
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

	url := "https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers"

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

url = URI("https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/aafb2a8b-5a89-4bfd-b021-18709509d350/shares/bf13e577-8d47-46e7-9373-e77061928437/reviewers")! as URL,
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

# List shares

GET https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/shares

List shares on a project. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List shares
  version: endpoint_shares.index
paths:
  /v4/accounts/{account_id}/projects/{project_id}/shares:
    get:
      operationId: index
      summary: List shares
      description: >-
        List shares on a project. <br>Rate Limits: 100 calls per 1.00 minute(s)
        per account_user
      tags:
        - - subpackage_shares
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
                $ref: '#/components/schemas/SharesResponse'
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
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    Share:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
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
    SharesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Share'
          description: Shares
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
    await client.shares.index("f792d422-cd64-4b07-a2ac-2c78ce8717cc", "42257bfc-503b-4784-8dea-2857e64fa458", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.index(
    account_id="f792d422-cd64-4b07-a2ac-2c78ce8717cc",
    project_id="42257bfc-503b-4784-8dea-2857e64fa458"
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

	url := "https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares"

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

url = URI("https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f792d422-cd64-4b07-a2ac-2c78ce8717cc/projects/42257bfc-503b-4784-8dea-2857e64fa458/shares")! as URL,
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

# Remove asset from share

DELETE https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}/assets/{asset_id}

Remove an asset currently in the share from that share. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/remove-asset

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Remove asset from share
  version: endpoint_shares.removeAsset
paths:
  /v4/accounts/{account_id}/shares/{share_id}/assets/{asset_id}:
    delete:
      operationId: remove-asset
      summary: Remove asset from share
      description: >-
        Remove an asset currently in the share from that share. <br>Rate Limits:
        10 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: asset_id
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
                $ref: '#/components/schemas/RemoveAssetResponse'
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
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    RemoveAssetResponseData:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        asset_removed:
          type: string
          format: uuid
          description: ID for asset added
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
        - asset_removed
    RemoveAssetResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/RemoveAssetResponseData'
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
    await client.shares.removeAsset("fa5822d2-5ee1-418c-800f-0183b80ac0f1", "c4980e11-0425-4bb1-ac3c-833f87d8deb0", "25f75ad3-f119-4b89-8aca-c8e0015d43ff");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.remove_asset(
    account_id="fa5822d2-5ee1-418c-800f-0183b80ac0f1",
    share_id="c4980e11-0425-4bb1-ac3c-833f87d8deb0",
    asset_id="25f75ad3-f119-4b89-8aca-c8e0015d43ff"
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

	url := "https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff"

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

url = URI("https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/fa5822d2-5ee1-418c-800f-0183b80ac0f1/shares/c4980e11-0425-4bb1-ac3c-833f87d8deb0/assets/25f75ad3-f119-4b89-8aca-c8e0015d43ff")! as URL,
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

# Removes reviewers from secure share

DELETE https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}/reviewers
Content-Type: application/json

Removes reviewers from secure Share by three identifier types: `adobe_user_id`, `email`, and `user_id`.
<br>
A request can only include one identifier type parameter.
<br>Rate Limits: 10 calls per 1.00 minute(s) per account_user


Reference: https://next.developer.frame.io/platform/api-reference/shares/remove-reviewers

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Removes reviewers from secure share
  version: endpoint_shares.removeReviewers
paths:
  /v4/accounts/{account_id}/shares/{share_id}/reviewers:
    delete:
      operationId: remove-reviewers
      summary: Removes reviewers from secure share
      description: >
        Removes reviewers from secure Share by three identifier types:
        `adobe_user_id`, `email`, and `user_id`.

        <br>

        A request can only include one identifier type parameter.

        <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/Shares_removeReviewers_Response_204'
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
              $ref: '#/components/schemas/RemoveReviewerParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    Email:
      type: string
    RemoveReviewerParamsDataReviewers:
      type: object
      properties:
        adobe_user_ids:
          type: array
          items:
            type: string
          description: List of Adobe user IDs to be removed
        emails:
          type: array
          items:
            $ref: '#/components/schemas/Email'
          description: Email Addresses
        user_ids:
          type: array
          items:
            $ref: '#/components/schemas/UUID'
          description: User IDs
    RemoveReviewerParamsData:
      type: object
      properties:
        reviewers:
          $ref: '#/components/schemas/RemoveReviewerParamsDataReviewers'
      required:
        - reviewers
    RemoveReviewerParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/RemoveReviewerParamsData'
      required:
        - data
    Shares_removeReviewers_Response_204:
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
    await client.shares.removeReviewers("a6419457-f0d3-4c25-a951-ceb6267dd2e0", "2a6eff1e-8091-4445-9670-0f15c53157d2", {
        data: {
            reviewers: {
                adobeUserIds: [
                    "2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e",
                ],
            },
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

client.shares.remove_reviewers(
    account_id="a6419457-f0d3-4c25-a951-ceb6267dd2e0",
    share_id="2a6eff1e-8091-4445-9670-0f15c53157d2",
    data={
        "reviewers": {
            "adobe_user_ids": [
                "2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e"
            ]
        }
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

	url := "https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers"

	payload := strings.NewReader("{\n  \"data\": {\n    \"reviewers\": {\n      \"adobe_user_ids\": [\n        \"2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e\"\n      ]\n    }\n  }\n}")

	req, _ := http.NewRequest("DELETE", url, payload)

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

url = URI("https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"reviewers\": {\n      \"adobe_user_ids\": [\n        \"2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e\"\n      ]\n    }\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"reviewers\": {\n      \"adobe_user_ids\": [\n        \"2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e\"\n      ]\n    }\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers', [
  'body' => '{
  "data": {
    "reviewers": {
      "adobe_user_ids": [
        "2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e"
      ]
    }
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers");
var request = new RestRequest(Method.DELETE);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"reviewers\": {\n      \"adobe_user_ids\": [\n        \"2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e\"\n      ]\n    }\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["reviewers": ["adobe_user_ids": ["2A3C1A3D66C621B20A494021@176719f5667c82b4499999.e"]]]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/a6419457-f0d3-4c25-a951-ceb6267dd2e0/shares/2a6eff1e-8091-4445-9670-0f15c53157d2/reviewers")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "DELETE"
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

# Show Share

GET https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}

Show a single Share. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show Share
  version: endpoint_shares.show
paths:
  /v4/accounts/{account_id}/shares/{share_id}:
    get:
      operationId: show
      summary: Show Share
      description: >-
        Show a single Share. <br>Rate Limits: 100 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/ShareResponse'
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
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    Share:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
    ShareResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Share'
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
    await client.shares.show("ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec", "969a1e39-c34c-4efd-8a2e-9bdcae9c192b");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.show(
    account_id="ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec",
    share_id="969a1e39-c34c-4efd-8a2e-9bdcae9c192b"
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

	url := "https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b"

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

url = URI("https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/ef7eb071-1d6d-4bcd-b0ae-0d1dbaadfcec/shares/969a1e39-c34c-4efd-8a2e-9bdcae9c192b")! as URL,
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

# Update share

PATCH https://api.frame.io/v4/accounts/{account_id}/shares/{share_id}
Content-Type: application/json

Update share. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/shares/update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update share
  version: endpoint_shares.update
paths:
  /v4/accounts/{account_id}/shares/{share_id}:
    patch:
      operationId: update
      summary: Update share
      description: >-
        Update share. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_shares
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: share_id
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
                $ref: '#/components/schemas/ShareResponse'
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
        description: Share params body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateShareParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    UpdateShareParamsDataAccess:
      type: string
      enum:
        - value: public
        - value: secure
    UpdateShareParamsData:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/UpdateShareParamsDataAccess'
        description:
          type:
            - string
            - 'null'
          description: 'Share description - NOTE: Requires feature custom_branded_shares'
        downloading_enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        name:
          type:
            - string
            - 'null'
          description: >-
            Share Name (must include at least one non-whitespace character and
            no line breaks)
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
    UpdateShareParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/UpdateShareParamsData'
      required:
        - data
    ShareAccess:
      type: string
      enum:
        - value: public
        - value: secure
    Share:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/ShareAccess'
        collection_id:
          type: string
          format: uuid
          description: Collection ID
        commenting_enabled:
          type: boolean
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        description:
          type:
            - string
            - 'null'
          description: Share description
        downloading_enabled:
          type: boolean
        enabled:
          type: boolean
        expiration:
          type:
            - string
            - 'null'
          format: date-time
          description: Expiration timestamp
        id:
          type: string
          format: uuid
          description: Share ID
        last_viewed_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Last viewed timestamp
        name:
          type:
            - string
            - 'null'
          description: Share name
        passphrase:
          type:
            - string
            - 'null'
          description: >-
            Passphrase to access share, if passphrase is required and not given
            it will be generated
        short_url:
          type:
            - string
            - 'null'
          description: Share URL
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
      required:
        - access
        - collection_id
        - commenting_enabled
        - created_at
        - description
        - downloading_enabled
        - enabled
        - expiration
        - id
        - last_viewed_at
        - name
        - short_url
        - updated_at
    ShareResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/Share'
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
    await client.shares.update("05e45ec3-106d-4619-b018-f7499fc795b2", "16e4255f-7783-4f7f-8336-6ff9fa4c266e", {
        data: {
            access: "public",
            description: "A descriptive summary of the share",
            downloadingEnabled: true,
            expiration: new Date("2026-01-26T20:35:55.140364Z"),
            name: "Share Name",
            passphrase: "as!dfj39sd(*",
        },
    });
}
main();

```

```python
from frameio import Frameio
from datetime import datetime

client = Frameio(
    base_url="https://api.frame.io"
)

client.shares.update(
    account_id="05e45ec3-106d-4619-b018-f7499fc795b2",
    share_id="16e4255f-7783-4f7f-8336-6ff9fa4c266e",
    data={
        "access": "public",
        "description": "A descriptive summary of the share",
        "downloading_enabled": True,
        "expiration": datetime.fromisoformat("2026-01-26T20:35:55.140364Z"),
        "name": "Share Name",
        "passphrase": "as!dfj39sd(*"
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

	url := "https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e"

	payload := strings.NewReader("{\n  \"data\": {\n    \"access\": \"public\",\n    \"description\": \"A descriptive summary of the share\",\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"access\": \"public\",\n    \"description\": \"A descriptive summary of the share\",\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"access\": \"public\",\n    \"description\": \"A descriptive summary of the share\",\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e', [
  'body' => '{
  "data": {
    "access": "public",
    "description": "A descriptive summary of the share",
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"access\": \"public\",\n    \"description\": \"A descriptive summary of the share\",\n    \"downloading_enabled\": true,\n    \"expiration\": \"2026-01-26T20:35:55.140364Z\",\n    \"name\": \"Share Name\",\n    \"passphrase\": \"as!dfj39sd(*\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "access": "public",
    "description": "A descriptive summary of the share",
    "downloading_enabled": true,
    "expiration": "2026-01-26T20:35:55.140364Z",
    "name": "Share Name",
    "passphrase": "as!dfj39sd(*"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/05e45ec3-106d-4619-b018-f7499fc795b2/shares/16e4255f-7783-4f7f-8336-6ff9fa4c266e")! as URL,
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
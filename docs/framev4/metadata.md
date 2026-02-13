# Show metadata

GET https://api.frame.io/v4/accounts/{account_id}/files/{file_id}/metadata

Show the metadata of a file. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show metadata
  version: endpoint_metadata.show
paths:
  /v4/accounts/{account_id}/files/{file_id}/metadata:
    get:
      operationId: show
      summary: Show metadata
      description: >-
        Show the metadata of a file. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_metadata
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
        - name: show_null
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
                $ref: '#/components/schemas/MetadataResponse'
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
    MetadataWithDefinition:
      type: object
      properties:
        file_id:
          type: string
          format: uuid
          description: File ID
        metadata:
          type: array
          items:
            $ref: '#/components/schemas/MetadataField'
          description: Metadata fields values
      required:
        - file_id
        - metadata
    MetadataResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/MetadataWithDefinition'
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
    await client.metadata.show("788847fd-e28a-4939-8358-5a99ccaa1fc5", "3e383a45-84c5-487c-8daf-19dd14323683", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.metadata.show(
    account_id="788847fd-e28a-4939-8358-5a99ccaa1fc5",
    file_id="3e383a45-84c5-487c-8daf-19dd14323683"
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

	url := "https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata"

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

url = URI("https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/788847fd-e28a-4939-8358-5a99ccaa1fc5/files/3e383a45-84c5-487c-8daf-19dd14323683/metadata")! as URL,
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

# Update metadata across multiple files

PATCH https://api.frame.io/v4/accounts/{account_id}/projects/{project_id}/metadata/values
Content-Type: application/json

Update metadata values across multiple files. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata/bulk-update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update metadata across multiple files
  version: endpoint_metadata.bulkUpdate
paths:
  /v4/accounts/{account_id}/projects/{project_id}/metadata/values:
    patch:
      operationId: bulk-update
      summary: Update metadata across multiple files
      description: >-
        Update metadata values across multiple files. <br>Rate Limits: 10 calls
        per 1.00 minute(s) per account_user
      tags:
        - - subpackage_metadata
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
                $ref: '#/components/schemas/Metadata_bulkUpdate_Response_204'
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
              $ref: '#/components/schemas/BulkUpdateMetadataParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    BulkUpdateMetadataParamsDataValuesItems:
      type: object
      properties:
        field_definition_id:
          type: string
          format: uuid
        value:
          description: Any type
      required:
        - field_definition_id
        - value
    BulkUpdateMetadataParamsData:
      type: object
      properties:
        file_ids:
          type: array
          items:
            $ref: '#/components/schemas/UUID'
          description: Files for bulk updates
        values:
          type: array
          items:
            $ref: '#/components/schemas/BulkUpdateMetadataParamsDataValuesItems'
          description: >-
            Metadata field and value mapping params. 

            Note: Select and MultiSelect field values should be passed as lists,
            eg: [<uuid>]. Users and MultiUser values should be passed as lists
            formatted as follows: [{id: <user_id>, type: "user"}, {id:
            <user_group_id>, type: "account_user_group"}
      required:
        - file_ids
        - values
    BulkUpdateMetadataParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/BulkUpdateMetadataParamsData'
      required:
        - data
    Metadata_bulkUpdate_Response_204:
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
    await client.metadata.bulkUpdate("ab7ea8a4-3881-4f22-96c4-3497f7fd6c40", "7e9492e5-d41b-419e-aef3-d82c8166a4ab", {
        data: {
            fileIds: [
                "ffa8b46c-edd6-4c6f-9525-55361d4b21a5",
                "e1330ea0-c8ac-43ce-bd68-1a4505481985",
            ],
            values: [
                {
                    fieldDefinitionId: "340b2dcf-3986-4e1c-8727-4722b746b9ed",
                    value: [
                        {
                            id: "58704c22-8e3d-4ca4-953c-a6d632c2c29a",
                            type: "user",
                        },
                        {
                            id: "c833a8fa-55d8-483d-84c3-86ed065a3e55",
                            type: "account_user_group",
                        },
                    ],
                },
            ],
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

client.metadata.bulk_update(
    account_id="ab7ea8a4-3881-4f22-96c4-3497f7fd6c40",
    project_id="7e9492e5-d41b-419e-aef3-d82c8166a4ab",
    data={
        "file_ids": [
            "ffa8b46c-edd6-4c6f-9525-55361d4b21a5",
            "e1330ea0-c8ac-43ce-bd68-1a4505481985"
        ],
        "values": [
            {
                "field_definition_id": "340b2dcf-3986-4e1c-8727-4722b746b9ed",
                "value": [
                    {
                        "id": "58704c22-8e3d-4ca4-953c-a6d632c2c29a",
                        "type": "user",
                    },
                    {
                        "id": "c833a8fa-55d8-483d-84c3-86ed065a3e55",
                        "type": "account_user_group",
                    },
                ]
            }
        ]
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

	url := "https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values"

	payload := strings.NewReader("{\n  \"data\": {\n    \"file_ids\": [\n      \"ffa8b46c-edd6-4c6f-9525-55361d4b21a5\",\n      \"e1330ea0-c8ac-43ce-bd68-1a4505481985\"\n    ],\n    \"values\": [\n      {\n        \"field_definition_id\": \"340b2dcf-3986-4e1c-8727-4722b746b9ed\",\n        \"value\": [\n          {\n            \"id\": \"58704c22-8e3d-4ca4-953c-a6d632c2c29a\",\n            \"type\": \"user\"\n          },\n          {\n            \"id\": \"c833a8fa-55d8-483d-84c3-86ed065a3e55\",\n            \"type\": \"account_user_group\"\n          }\n        ]\n      }\n    ]\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"file_ids\": [\n      \"ffa8b46c-edd6-4c6f-9525-55361d4b21a5\",\n      \"e1330ea0-c8ac-43ce-bd68-1a4505481985\"\n    ],\n    \"values\": [\n      {\n        \"field_definition_id\": \"340b2dcf-3986-4e1c-8727-4722b746b9ed\",\n        \"value\": [\n          {\n            \"id\": \"58704c22-8e3d-4ca4-953c-a6d632c2c29a\",\n            \"type\": \"user\"\n          },\n          {\n            \"id\": \"c833a8fa-55d8-483d-84c3-86ed065a3e55\",\n            \"type\": \"account_user_group\"\n          }\n        ]\n      }\n    ]\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"file_ids\": [\n      \"ffa8b46c-edd6-4c6f-9525-55361d4b21a5\",\n      \"e1330ea0-c8ac-43ce-bd68-1a4505481985\"\n    ],\n    \"values\": [\n      {\n        \"field_definition_id\": \"340b2dcf-3986-4e1c-8727-4722b746b9ed\",\n        \"value\": [\n          {\n            \"id\": \"58704c22-8e3d-4ca4-953c-a6d632c2c29a\",\n            \"type\": \"user\"\n          },\n          {\n            \"id\": \"c833a8fa-55d8-483d-84c3-86ed065a3e55\",\n            \"type\": \"account_user_group\"\n          }\n        ]\n      }\n    ]\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values', [
  'body' => '{
  "data": {
    "file_ids": [
      "ffa8b46c-edd6-4c6f-9525-55361d4b21a5",
      "e1330ea0-c8ac-43ce-bd68-1a4505481985"
    ],
    "values": [
      {
        "field_definition_id": "340b2dcf-3986-4e1c-8727-4722b746b9ed",
        "value": [
          {
            "id": "58704c22-8e3d-4ca4-953c-a6d632c2c29a",
            "type": "user"
          },
          {
            "id": "c833a8fa-55d8-483d-84c3-86ed065a3e55",
            "type": "account_user_group"
          }
        ]
      }
    ]
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"file_ids\": [\n      \"ffa8b46c-edd6-4c6f-9525-55361d4b21a5\",\n      \"e1330ea0-c8ac-43ce-bd68-1a4505481985\"\n    ],\n    \"values\": [\n      {\n        \"field_definition_id\": \"340b2dcf-3986-4e1c-8727-4722b746b9ed\",\n        \"value\": [\n          {\n            \"id\": \"58704c22-8e3d-4ca4-953c-a6d632c2c29a\",\n            \"type\": \"user\"\n          },\n          {\n            \"id\": \"c833a8fa-55d8-483d-84c3-86ed065a3e55\",\n            \"type\": \"account_user_group\"\n          }\n        ]\n      }\n    ]\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "file_ids": ["ffa8b46c-edd6-4c6f-9525-55361d4b21a5", "e1330ea0-c8ac-43ce-bd68-1a4505481985"],
    "values": [
      [
        "field_definition_id": "340b2dcf-3986-4e1c-8727-4722b746b9ed",
        "value": [
          [
            "id": "58704c22-8e3d-4ca4-953c-a6d632c2c29a",
            "type": "user"
          ],
          [
            "id": "c833a8fa-55d8-483d-84c3-86ed065a3e55",
            "type": "account_user_group"
          ]
        ]
      ]
    ]
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/ab7ea8a4-3881-4f22-96c4-3497f7fd6c40/projects/7e9492e5-d41b-419e-aef3-d82c8166a4ab/metadata/values")! as URL,
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

# Create account level field definitions

POST https://api.frame.io/v4/accounts/{account_id}/metadata/field_definitions
Content-Type: application/json

Create account level field definitions. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata-fields/metadata-field-definitions-create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create account level field definitions
  version: endpoint_metadataFields.metadata.field_definitions.create
paths:
  /v4/accounts/{account_id}/metadata/field_definitions:
    post:
      operationId: metadata-field-definitions-create
      summary: Create account level field definitions
      description: >-
        Create account level field definitions. <br>Rate Limits: 10 calls per
        1.00 minute(s) per account_user
      tags:
        - - subpackage_metadataFields
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
                $ref: '#/components/schemas/FieldDefinitionResponse'
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
              $ref: '#/components/schemas/CreateFieldDefinitionParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    TextDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    TextDefinitionParams:
      type: object
      properties:
        field_type:
          $ref: '#/components/schemas/TextDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_type
        - name
    LongTextDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    LongTextDefinitionParams:
      type: object
      properties:
        field_type:
          $ref: '#/components/schemas/LongTextDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_type
        - name
    RatingDefinitionParamsFieldConfigurationStyle:
      type: string
      enum:
        - value: star
        - value: heart
        - value: thumbs_up
    RatingDefinitionParamsFieldConfiguration:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `style` icon symbols. ex: #fbd400'
        max_value:
          type: integer
        style:
          $ref: '#/components/schemas/RatingDefinitionParamsFieldConfigurationStyle'
          description: Field type
      required:
        - max_value
    RatingDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    RatingDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/RatingDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/RatingDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    NumberDefinitionParamsFieldConfigurationNumberFormat:
      type: string
      enum:
        - value: bitrate
        - value: bits
        - value: duration
        - value: framerate
        - value: frequency
        - value: storage
        - value: timecode
    NumberDefinitionParamsFieldConfiguration:
      type: object
      properties:
        number_format:
          $ref: >-
            #/components/schemas/NumberDefinitionParamsFieldConfigurationNumberFormat
          description: Number format
        scale:
          type: integer
          description: >-
            Number scale. Indicates the number of decimal places of precision
            for the number value
      required:
        - scale
    NumberDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    NumberDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/NumberDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/NumberDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    ToggleDefinitionParamsFieldConfiguration:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code. ex: #fbd400'
    ToggleDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    ToggleDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/ToggleDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/ToggleDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_type
        - name
    DateDefinitionParamsFieldConfigurationDisplayFormat:
      type: string
      enum:
        - value: local
        - value: friendly
        - value: usa
        - value: euro
        - value: iso
      default: local
    DateDefinitionParamsFieldConfigurationTimeFormat:
      type: string
      enum:
        - value: twelve_hour
        - value: twenty_four_hour
      default: twelve_hour
    DateDefinitionParamsFieldConfiguration:
      type: object
      properties:
        display_format:
          $ref: >-
            #/components/schemas/DateDefinitionParamsFieldConfigurationDisplayFormat
        display_timezone:
          type: boolean
          default: false
        include_time:
          type: boolean
          default: false
        time_format:
          $ref: >-
            #/components/schemas/DateDefinitionParamsFieldConfigurationTimeFormat
      required:
        - display_format
    DateDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    DateDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/DateDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/DateDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    SelectDefinitionParamsFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
      required:
        - display_name
    SelectDefinitionParamsFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectDefinitionParamsFieldConfigurationOptionsItems
      required:
        - options
    SelectDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    SelectDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/SelectDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    SelectMultiDefinitionParamsFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
      required:
        - display_name
    SelectMultiDefinitionParamsFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectMultiDefinitionParamsFieldConfigurationOptionsItems
      required:
        - options
    SelectMultiDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    SelectMultiDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/SelectMultiDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectMultiDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    UserSingleDefinitionParamsFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserSingleDefinitionParamsFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionParamsFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserSingleDefinitionParamsFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserSingleDefinitionParamsFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserSingleDefinitionParamsFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionParamsFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - member_options_type
        - notify_members
    UserSingleDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UserSingleDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UserSingleDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserSingleDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    UserMultiDefinitionParamsFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserMultiDefinitionParamsFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionParamsFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserMultiDefinitionParamsFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserMultiDefinitionParamsFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserMultiDefinitionParamsFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionParamsFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - member_options_type
        - notify_members
    UserMultiDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UserMultiDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UserMultiDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserMultiDefinitionParamsFieldType'
          description: Field type
        name:
          type: string
          description: Field definition name
      required:
        - field_configuration
        - field_type
        - name
    CreateFieldDefinitionParamsData:
      oneOf:
        - $ref: '#/components/schemas/TextDefinitionParams'
        - $ref: '#/components/schemas/LongTextDefinitionParams'
        - $ref: '#/components/schemas/RatingDefinitionParams'
        - $ref: '#/components/schemas/NumberDefinitionParams'
        - $ref: '#/components/schemas/ToggleDefinitionParams'
        - $ref: '#/components/schemas/DateDefinitionParams'
        - $ref: '#/components/schemas/SelectDefinitionParams'
        - $ref: '#/components/schemas/SelectMultiDefinitionParams'
        - $ref: '#/components/schemas/UserSingleDefinitionParams'
        - $ref: '#/components/schemas/UserMultiDefinitionParams'
    CreateFieldDefinitionParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/CreateFieldDefinitionParamsData'
    TextDefinitionFieldConfiguration:
      type: object
      properties: {}
    TextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    TextDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/TextDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/TextDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    LongTextDefinitionFieldConfiguration:
      type: object
      properties: {}
    LongTextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    LongTextDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/LongTextDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/LongTextDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    RatingDefinitionFieldConfigurationStyle:
      type: string
      enum:
        - value: star
        - value: heart
        - value: thumbs_up
    RatingDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `style` icon symbols. ex: #fbd400'
        max_value:
          type: integer
        style:
          oneOf:
            - $ref: '#/components/schemas/RatingDefinitionFieldConfigurationStyle'
            - type: 'null'
          description: Field type
      required:
        - max_value
    RatingDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    RatingDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/RatingDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/RatingDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    NumberDefinitionFieldConfigurationNumberFormat:
      type: string
      enum:
        - value: bitrate
        - value: bits
        - value: duration
        - value: framerate
        - value: frequency
        - value: storage
        - value: timecode
    NumberDefinitionFieldConfiguration:
      type: object
      properties:
        number_format:
          oneOf:
            - $ref: >-
                #/components/schemas/NumberDefinitionFieldConfigurationNumberFormat
            - type: 'null'
          description: Number format
        scale:
          type: integer
          description: >-
            Number scale. Indicates the number of decimal places of precision
            for the number value
      required:
        - scale
    NumberDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    NumberDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/NumberDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/NumberDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    ToggleDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code. ex: #fbd400'
      required:
        - color
    ToggleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    ToggleDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/ToggleDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/ToggleDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    DateDefinitionFieldConfigurationDisplayFormat:
      type: string
      enum:
        - value: local
        - value: friendly
        - value: usa
        - value: euro
        - value: iso
      default: local
    DateDefinitionFieldConfigurationTimeFormat:
      type: string
      enum:
        - value: twelve_hour
        - value: twenty_four_hour
      default: twelve_hour
    DateDefinitionFieldConfiguration:
      type: object
      properties:
        display_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationDisplayFormat'
        display_timezone:
          type: boolean
          default: false
        include_time:
          type: boolean
          default: false
        time_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationTimeFormat'
      required:
        - display_format
    DateDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    DateDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/DateDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/DateDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    SelectDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/SelectDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    SelectMultiDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectMultiDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectMultiDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectMultiDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/SelectMultiDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectMultiDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    UserSingleDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserSingleDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserSingleDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserSingleDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserSingleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserSingleDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/UserSingleDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserSingleDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    UserMultiDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserMultiDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserMultiDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserMultiDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserMultiDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/UserMultiDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserMultiDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    FieldDefinition:
      oneOf:
        - $ref: '#/components/schemas/TextDefinition'
        - $ref: '#/components/schemas/LongTextDefinition'
        - $ref: '#/components/schemas/RatingDefinition'
        - $ref: '#/components/schemas/NumberDefinition'
        - $ref: '#/components/schemas/ToggleDefinition'
        - $ref: '#/components/schemas/DateDefinition'
        - $ref: '#/components/schemas/SelectDefinition'
        - $ref: '#/components/schemas/SelectMultiDefinition'
        - $ref: '#/components/schemas/UserSingleDefinition'
        - $ref: '#/components/schemas/UserMultiDefinition'
    FieldDefinitionResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FieldDefinition'
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
    await client.metadataFields.metadataFieldDefinitionsCreate("eaa1947f-edab-4864-b90d-993c2f2092d9", {
        data: {
            fieldType: "select",
            name: "Fields definition name",
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

client.metadata_fields.metadata_field_definitions_create(
    account_id="eaa1947f-edab-4864-b90d-993c2f2092d9",
    data={
        "field_type": "select",
        "name": "Fields definition name"
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

	url := "https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions"

	payload := strings.NewReader("{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Fields definition name\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Fields definition name\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Fields definition name\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions', [
  'body' => '{
  "data": {
    "field_type": "select",
    "name": "Fields definition name"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Fields definition name\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "field_type": "select",
    "name": "Fields definition name"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/eaa1947f-edab-4864-b90d-993c2f2092d9/metadata/field_definitions")! as URL,
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

# Delete account level custom field definitions

DELETE https://api.frame.io/v4/accounts/{account_id}/metadata/field_definitions/{field_definition_id}

Delete account level custom field definitions. <br>Rate Limits: 60 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata-fields/metadata-field-definitions-delete

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Delete account level custom field definitions
  version: endpoint_metadataFields.metadata.field_definitions.delete
paths:
  /v4/accounts/{account_id}/metadata/field_definitions/{field_definition_id}:
    delete:
      operationId: metadata-field-definitions-delete
      summary: Delete account level custom field definitions
      description: >-
        Delete account level custom field definitions. <br>Rate Limits: 60 calls
        per 1.00 minute(s) per account_user
      tags:
        - - subpackage_metadataFields
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: field_definition_id
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
                $ref: >-
                  #/components/schemas/Metadata
                  Fields_metadata.field_definitions.delete_Response_204
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
    Metadata Fields_metadata.field_definitions.delete_Response_204:
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
    await client.metadataFields.metadataFieldDefinitionsDelete("f8587237-f0ae-4327-83c4-c090a3c56ee0", "27588110-4a54-44fc-abb3-5d8a5dcc1892");
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.metadata_fields.metadata_field_definitions_delete(
    account_id="f8587237-f0ae-4327-83c4-c090a3c56ee0",
    field_definition_id="27588110-4a54-44fc-abb3-5d8a5dcc1892"
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

	url := "https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892"

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

url = URI("https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Delete.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.delete("https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('DELETE', 'https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892");
var request = new RestRequest(Method.DELETE);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f8587237-f0ae-4327-83c4-c090a3c56ee0/metadata/field_definitions/27588110-4a54-44fc-abb3-5d8a5dcc1892")! as URL,
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

# List account level field definitions

GET https://api.frame.io/v4/accounts/{account_id}/metadata/field_definitions

List account level field definitions. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata-fields/metadata-field-definitions-index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List account level field definitions
  version: endpoint_metadataFields.metadata.field_definitions.index
paths:
  /v4/accounts/{account_id}/metadata/field_definitions:
    get:
      operationId: metadata-field-definitions-index
      summary: List account level field definitions
      description: >-
        List account level field definitions. <br>Rate Limits: 100 calls per
        1.00 minute(s) per account_user
      tags:
        - - subpackage_metadataFields
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: filters
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdMetadataFieldDefinitionsGetParametersFilters
        - name: include
          in: query
          description: ''
          required: false
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdMetadataFieldDefinitionsGetParametersInclude
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
                $ref: '#/components/schemas/FieldDefinitionsWithIncludesResponse'
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
    V4AccountsAccountIdMetadataFieldDefinitionsGetParametersFilters:
      type: object
      properties:
        exclude_immutable:
          type: boolean
          description: Filters out read-only fields.
        exclude_inactive:
          type: boolean
          description: Filters out inactive fields.
    V4AccountsAccountIdMetadataFieldDefinitionsGetParametersInclude:
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
    DateDefinitionFieldConfigurationDisplayFormat:
      type: string
      enum:
        - value: local
        - value: friendly
        - value: usa
        - value: euro
        - value: iso
      default: local
    DateDefinitionFieldConfigurationTimeFormat:
      type: string
      enum:
        - value: twelve_hour
        - value: twenty_four_hour
      default: twelve_hour
    DateDefinitionFieldConfiguration:
      type: object
      properties:
        display_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationDisplayFormat'
        display_timezone:
          type: boolean
          default: false
        include_time:
          type: boolean
          default: false
        time_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationTimeFormat'
      required:
        - display_format
    DateDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
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
    LongTextDefinitionFieldConfiguration:
      type: object
      properties: {}
    LongTextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    NumberDefinitionFieldConfigurationNumberFormat:
      type: string
      enum:
        - value: bitrate
        - value: bits
        - value: duration
        - value: framerate
        - value: frequency
        - value: storage
        - value: timecode
    NumberDefinitionFieldConfiguration:
      type: object
      properties:
        number_format:
          oneOf:
            - $ref: >-
                #/components/schemas/NumberDefinitionFieldConfigurationNumberFormat
            - type: 'null'
          description: Number format
        scale:
          type: integer
          description: >-
            Number scale. Indicates the number of decimal places of precision
            for the number value
      required:
        - scale
    NumberDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    RatingDefinitionFieldConfigurationStyle:
      type: string
      enum:
        - value: star
        - value: heart
        - value: thumbs_up
    RatingDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `style` icon symbols. ex: #fbd400'
        max_value:
          type: integer
        style:
          oneOf:
            - $ref: '#/components/schemas/RatingDefinitionFieldConfigurationStyle'
            - type: 'null'
          description: Field type
      required:
        - max_value
    RatingDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectMultiDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectMultiDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectMultiDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    TextDefinitionFieldConfiguration:
      type: object
      properties: {}
    TextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    ToggleDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code. ex: #fbd400'
      required:
        - color
    ToggleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserMultiDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserMultiDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserMultiDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserMultiDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserSingleDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserSingleDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserSingleDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserSingleDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserSingleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    FieldDefinitionWithIncludes:
      oneOf:
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/DateDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/DateDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: date variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/LongTextDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/LongTextDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: long_text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/NumberDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/NumberDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: number variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/RatingDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/RatingDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: rating variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/SelectDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/SelectDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: select variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/SelectMultiDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/SelectMultiDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: select_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/TextDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/TextDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: text variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/ToggleDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/ToggleDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: toggle variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/UserMultiDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/UserMultiDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: user_multi variant
        - type: object
          properties:
            field_type:
              $ref: '#/components/schemas/UserSingleDefinitionFieldType'
              description: Field type
            created_at:
              type: string
              format: date-time
              description: Created Timestamp
            creator_id:
              type: string
              format: uuid
              description: Field definition creator ID
            field_configuration:
              $ref: '#/components/schemas/UserSingleDefinitionFieldConfiguration'
            id:
              type: string
              format: uuid
              description: Field definition ID
            mutable:
              type: boolean
              description: Field definition mutability. System fields cannot be updated.
            name:
              type: string
              description: FieldDefinition Name
            updated_at:
              type: string
              format: date-time
              description: Updated Timestamp
            creator:
              $ref: '#/components/schemas/User'
          required:
            - field_type
            - created_at
            - creator_id
            - field_configuration
            - id
            - mutable
            - name
            - updated_at
          description: user_single variant
      discriminator:
        propertyName: field_type
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
    FieldDefinitionsWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/FieldDefinitionWithIncludes'
          description: Field definitions
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
    await client.metadataFields.metadataFieldDefinitionsIndex("c989d726-e67f-46ff-9a50-c30ca56bd2da", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.metadata_fields.metadata_field_definitions_index(
    account_id="c989d726-e67f-46ff-9a50-c30ca56bd2da"
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

	url := "https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions"

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

url = URI("https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/c989d726-e67f-46ff-9a50-c30ca56bd2da/metadata/field_definitions")! as URL,
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

# Update account level custom field definitions

PATCH https://api.frame.io/v4/accounts/{account_id}/metadata/field_definitions/{field_definition_id}
Content-Type: application/json

Update account level custom field definitions. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/metadata-fields/metadata-field-definitions-update

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Update account level custom field definitions
  version: endpoint_metadataFields.metadata.field_definitions.update
paths:
  /v4/accounts/{account_id}/metadata/field_definitions/{field_definition_id}:
    patch:
      operationId: metadata-field-definitions-update
      summary: Update account level custom field definitions
      description: >-
        Update account level custom field definitions. <br>Rate Limits: 10 calls
        per 1.00 minute(s) per account_user
      tags:
        - - subpackage_metadataFields
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: field_definition_id
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
                $ref: '#/components/schemas/FieldDefinitionResponse'
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
              $ref: '#/components/schemas/UpdateFieldDefinitionParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    UpdateTextDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateTextDefinitionParams:
      type: object
      properties:
        field_type:
          $ref: '#/components/schemas/UpdateTextDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateLongTextDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateLongTextDefinitionParams:
      type: object
      properties:
        field_type:
          $ref: '#/components/schemas/UpdateLongTextDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateRatingDefinitionParamsFieldConfigurationStyle:
      type: string
      enum:
        - value: star
        - value: heart
        - value: thumbs_up
    UpdateRatingDefinitionParamsFieldConfiguration:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `style` icon symbols. ex: #fbd400'
        max_value:
          type: integer
        style:
          $ref: >-
            #/components/schemas/UpdateRatingDefinitionParamsFieldConfigurationStyle
          description: Field type
    UpdateRatingDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateRatingDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UpdateRatingDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UpdateRatingDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateNumberDefinitionParamsFieldConfigurationNumberFormat:
      type: string
      enum:
        - value: bitrate
        - value: bits
        - value: duration
        - value: framerate
        - value: frequency
        - value: storage
        - value: timecode
    UpdateNumberDefinitionParamsFieldConfiguration:
      type: object
      properties:
        number_format:
          $ref: >-
            #/components/schemas/UpdateNumberDefinitionParamsFieldConfigurationNumberFormat
          description: Number format
        scale:
          type: integer
          description: >-
            Number scale. Indicates the number of decimal places of precision
            for the number value
    UpdateNumberDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateNumberDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UpdateNumberDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UpdateNumberDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateToggleDefinitionParamsFieldConfiguration:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code. ex: #fbd400'
    UpdateToggleDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateToggleDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UpdateToggleDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UpdateToggleDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateDateDefinitionParamsFieldConfigurationDisplayFormat:
      type: string
      enum:
        - value: local
        - value: friendly
        - value: usa
        - value: euro
        - value: iso
      default: local
    UpdateDateDefinitionParamsFieldConfigurationTimeFormat:
      type: string
      enum:
        - value: twelve_hour
        - value: twenty_four_hour
      default: twelve_hour
    UpdateDateDefinitionParamsFieldConfiguration:
      type: object
      properties:
        display_format:
          $ref: >-
            #/components/schemas/UpdateDateDefinitionParamsFieldConfigurationDisplayFormat
        display_timezone:
          type: boolean
          default: false
        include_time:
          type: boolean
          default: false
        time_format:
          $ref: >-
            #/components/schemas/UpdateDateDefinitionParamsFieldConfigurationTimeFormat
    UpdateDateDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateDateDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UpdateDateDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UpdateDateDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateSelectDefinitionParamsFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
      required:
        - display_name
    UpdateSelectDefinitionParamsFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/UpdateSelectDefinitionParamsFieldConfigurationOptionsItems
    UpdateSelectDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateSelectDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: '#/components/schemas/UpdateSelectDefinitionParamsFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UpdateSelectDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateSelectMultiDefinitionParamsFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type: string
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
      required:
        - display_name
    UpdateSelectMultiDefinitionParamsFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/UpdateSelectMultiDefinitionParamsFieldConfigurationOptionsItems
    UpdateSelectMultiDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateSelectMultiDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: >-
            #/components/schemas/UpdateSelectMultiDefinitionParamsFieldConfiguration
        field_type:
          $ref: '#/components/schemas/UpdateSelectMultiDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateUserSingleDefinitionParamsFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UpdateUserSingleDefinitionParamsFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UpdateUserSingleDefinitionParamsFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UpdateUserSingleDefinitionParamsFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UpdateUserSingleDefinitionParamsFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UpdateUserSingleDefinitionParamsFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UpdateUserSingleDefinitionParamsFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - member_options_type
        - notify_members
    UpdateUserSingleDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateUserSingleDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: >-
            #/components/schemas/UpdateUserSingleDefinitionParamsFieldConfiguration
        field_type:
          $ref: '#/components/schemas/UpdateUserSingleDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateUserMultiDefinitionParamsFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UpdateUserMultiDefinitionParamsFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UpdateUserMultiDefinitionParamsFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UpdateUserMultiDefinitionParamsFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UpdateUserMultiDefinitionParamsFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UpdateUserMultiDefinitionParamsFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UpdateUserMultiDefinitionParamsFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - member_options_type
        - notify_members
    UpdateUserMultiDefinitionParamsFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: date
        - value: user_multi
        - value: user_single
    UpdateUserMultiDefinitionParams:
      type: object
      properties:
        field_configuration:
          $ref: >-
            #/components/schemas/UpdateUserMultiDefinitionParamsFieldConfiguration
        field_type:
          $ref: '#/components/schemas/UpdateUserMultiDefinitionParamsFieldType'
          description: Field type of the field definition to be updated
        name:
          type: string
          description: Field definition name
      required:
        - field_type
    UpdateFieldDefinitionParamsData:
      oneOf:
        - $ref: '#/components/schemas/UpdateTextDefinitionParams'
        - $ref: '#/components/schemas/UpdateLongTextDefinitionParams'
        - $ref: '#/components/schemas/UpdateRatingDefinitionParams'
        - $ref: '#/components/schemas/UpdateNumberDefinitionParams'
        - $ref: '#/components/schemas/UpdateToggleDefinitionParams'
        - $ref: '#/components/schemas/UpdateDateDefinitionParams'
        - $ref: '#/components/schemas/UpdateSelectDefinitionParams'
        - $ref: '#/components/schemas/UpdateSelectMultiDefinitionParams'
        - $ref: '#/components/schemas/UpdateUserSingleDefinitionParams'
        - $ref: '#/components/schemas/UpdateUserMultiDefinitionParams'
    UpdateFieldDefinitionParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/UpdateFieldDefinitionParamsData'
    TextDefinitionFieldConfiguration:
      type: object
      properties: {}
    TextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    TextDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/TextDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/TextDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    LongTextDefinitionFieldConfiguration:
      type: object
      properties: {}
    LongTextDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    LongTextDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/LongTextDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/LongTextDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    RatingDefinitionFieldConfigurationStyle:
      type: string
      enum:
        - value: star
        - value: heart
        - value: thumbs_up
    RatingDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `style` icon symbols. ex: #fbd400'
        max_value:
          type: integer
        style:
          oneOf:
            - $ref: '#/components/schemas/RatingDefinitionFieldConfigurationStyle'
            - type: 'null'
          description: Field type
      required:
        - max_value
    RatingDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    RatingDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/RatingDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/RatingDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    NumberDefinitionFieldConfigurationNumberFormat:
      type: string
      enum:
        - value: bitrate
        - value: bits
        - value: duration
        - value: framerate
        - value: frequency
        - value: storage
        - value: timecode
    NumberDefinitionFieldConfiguration:
      type: object
      properties:
        number_format:
          oneOf:
            - $ref: >-
                #/components/schemas/NumberDefinitionFieldConfigurationNumberFormat
            - type: 'null'
          description: Number format
        scale:
          type: integer
          description: >-
            Number scale. Indicates the number of decimal places of precision
            for the number value
      required:
        - scale
    NumberDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    NumberDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/NumberDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/NumberDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    ToggleDefinitionFieldConfiguration:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code. ex: #fbd400'
      required:
        - color
    ToggleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    ToggleDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/ToggleDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/ToggleDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    DateDefinitionFieldConfigurationDisplayFormat:
      type: string
      enum:
        - value: local
        - value: friendly
        - value: usa
        - value: euro
        - value: iso
      default: local
    DateDefinitionFieldConfigurationTimeFormat:
      type: string
      enum:
        - value: twelve_hour
        - value: twenty_four_hour
      default: twelve_hour
    DateDefinitionFieldConfiguration:
      type: object
      properties:
        display_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationDisplayFormat'
        display_timezone:
          type: boolean
          default: false
        include_time:
          type: boolean
          default: false
        time_format:
          $ref: '#/components/schemas/DateDefinitionFieldConfigurationTimeFormat'
      required:
        - display_format
    DateDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    DateDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/DateDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/DateDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    SelectDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/SelectDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    SelectMultiDefinitionFieldConfigurationOptionsItems:
      type: object
      properties:
        color:
          type:
            - string
            - 'null'
          description: 'Color value hex code for the `display_name`. ex: #fbd400'
        display_name:
          type: string
          description: Option display name
        id:
          type: string
          format: uuid
      required:
        - display_name
    SelectMultiDefinitionFieldConfiguration:
      type: object
      properties:
        enable_add_new:
          type: boolean
          default: true
          description: Allow or disallow adding in new option(s) from the grid/list view
        options:
          type: array
          items:
            $ref: >-
              #/components/schemas/SelectMultiDefinitionFieldConfigurationOptionsItems
      required:
        - options
    SelectMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    SelectMultiDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/SelectMultiDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/SelectMultiDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    UserSingleDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserSingleDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserSingleDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserSingleDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserSingleDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserSingleDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserSingleDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserSingleDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/UserSingleDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserSingleDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    UserMultiDefinitionFieldConfigurationCustomMembersItemsType:
      type: string
      enum:
        - value: user
        - value: account_user_group
    UserMultiDefinitionFieldConfigurationCustomMembersItems:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: User Id
        type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItemsType
      required:
        - id
        - type
    UserMultiDefinitionFieldConfigurationMemberOptionsType:
      type: string
      enum:
        - value: all_project_members
        - value: custom
    UserMultiDefinitionFieldConfiguration:
      type: object
      properties:
        custom_members:
          type: array
          items:
            $ref: >-
              #/components/schemas/UserMultiDefinitionFieldConfigurationCustomMembersItems
        member_options_type:
          $ref: >-
            #/components/schemas/UserMultiDefinitionFieldConfigurationMemberOptionsType
        notify_members:
          type: boolean
      required:
        - custom_members
        - member_options_type
        - notify_members
    UserMultiDefinitionFieldType:
      type: string
      enum:
        - value: text
        - value: long_text
        - value: select
        - value: select_multi
        - value: rating
        - value: number
        - value: toggle
        - value: user_single
        - value: user_multi
        - value: date
    UserMultiDefinition:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        creator_id:
          type: string
          format: uuid
          description: Field definition creator ID
        field_configuration:
          $ref: '#/components/schemas/UserMultiDefinitionFieldConfiguration'
        field_type:
          $ref: '#/components/schemas/UserMultiDefinitionFieldType'
          description: Field type
        id:
          type: string
          format: uuid
          description: Field definition ID
        mutable:
          type: boolean
          description: Field definition mutability. System fields cannot be updated.
        name:
          type: string
          description: FieldDefinition Name
        updated_at:
          type: string
          format: date-time
          description: Updated Timestamp
      required:
        - created_at
        - creator_id
        - field_configuration
        - field_type
        - id
        - mutable
        - name
        - updated_at
    FieldDefinition:
      oneOf:
        - $ref: '#/components/schemas/TextDefinition'
        - $ref: '#/components/schemas/LongTextDefinition'
        - $ref: '#/components/schemas/RatingDefinition'
        - $ref: '#/components/schemas/NumberDefinition'
        - $ref: '#/components/schemas/ToggleDefinition'
        - $ref: '#/components/schemas/DateDefinition'
        - $ref: '#/components/schemas/SelectDefinition'
        - $ref: '#/components/schemas/SelectMultiDefinition'
        - $ref: '#/components/schemas/UserSingleDefinition'
        - $ref: '#/components/schemas/UserMultiDefinition'
    FieldDefinitionResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/FieldDefinition'
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
    await client.metadataFields.metadataFieldDefinitionsUpdate("04b05344-de73-46fd-853e-93374ebb1459", "0961fcee-7c6f-4a36-8a50-7350a34e2281", {
        data: {
            fieldType: "select",
            name: "Updated-Field-Name",
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

client.metadata_fields.metadata_field_definitions_update(
    account_id="04b05344-de73-46fd-853e-93374ebb1459",
    field_definition_id="0961fcee-7c6f-4a36-8a50-7350a34e2281",
    data={
        "field_type": "select",
        "name": "Updated-Field-Name"
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

	url := "https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281"

	payload := strings.NewReader("{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Updated-Field-Name\"\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Updated-Field-Name\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Updated-Field-Name\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281', [
  'body' => '{
  "data": {
    "field_type": "select",
    "name": "Updated-Field-Name"
  }
}',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281");
var request = new RestRequest(Method.PATCH);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"field_type\": \"select\",\n    \"name\": \"Updated-Field-Name\"\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": [
    "field_type": "select",
    "name": "Updated-Field-Name"
  ]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/04b05344-de73-46fd-853e-93374ebb1459/metadata/field_definitions/0961fcee-7c6f-4a36-8a50-7350a34e2281")! as URL,
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
# Copy version stack

POST https://api.frame.io/v4/accounts/{account_id}/version_stacks/{version_stack_id}/copy
Content-Type: application/json

Copy version stack. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/copy

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Copy version stack
  version: endpoint_versionStacks.copy
paths:
  /v4/accounts/{account_id}/version_stacks/{version_stack_id}/copy:
    post:
      operationId: copy
      summary: Copy version stack
      description: >-
        Copy version stack. <br>Rate Limits: 10 calls per 1.00 minute(s) per
        account_user
      tags:
        - - subpackage_versionStacks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: version_stack_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: copy_metadata
          in: query
          description: Whether to copy metadata values along with the version stack
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
                $ref: '#/components/schemas/VersionStackCopyResponse'
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
        description: Version stack params
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VersionStackCopyParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    VersionStackCopyParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder ID. Defaults to version stack parent ID.
    VersionStackCopyParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStackCopyParamsData'
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
    VersionStack:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: Version Stack ID
        name:
          type: string
          description: Version Stack Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder ID
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
        head_version:
          $ref: '#/components/schemas/File'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - head_version
    VersionStackCopyResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStack'
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
    await client.versionStacks.copy("f01c1659-23f9-4d84-ae6a-6022a98a8228", "478c067b-2ca2-4f52-8ad1-136d443b8ae8", {
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

client.version_stacks.copy(
    account_id="f01c1659-23f9-4d84-ae6a-6022a98a8228",
    version_stack_id="478c067b-2ca2-4f52-8ad1-136d443b8ae8",
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

	url := "https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy"

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

url = URI("https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy', [
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
var client = new RestClient("https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy");
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/f01c1659-23f9-4d84-ae6a-6022a98a8228/version_stacks/478c067b-2ca2-4f52-8ad1-136d443b8ae8/copy")! as URL,
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

# Create version stack

POST https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/version_stacks
Content-Type: application/json

Create a new Version Stack under the parent folder. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/create

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Create version stack
  version: endpoint_versionStacks.create
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/version_stacks:
    post:
      operationId: create
      summary: Create version stack
      description: >-
        Create a new Version Stack under the parent folder. <br>Rate Limits: 10
        calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_versionStacks
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
                $ref: '#/components/schemas/VersionStackWithIncludesResponse'
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
          description: Unprocessable Entity
          content: {}
        '429':
          description: Too many requests
          content: {}
      requestBody:
        description: Request body
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VersionStackCreateParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    VersionStackCreateParamsData:
      type: object
      properties:
        file_ids:
          type: array
          items:
            type: string
            format: uuid
          description: >
            An array of file IDs in the Version Stack.

            <br/>

            The Version Stack will be created by "stacking" the `file_ids`
            argument in order from left (oldest/bottom version in the stack) to
            right (newest/top version in the stack).

            <br/>

            Two file IDs are required and up to a maximum of ten. Files must
            exist in the parent directory identified in the path.
      required:
        - file_ids
    VersionStackCreateParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStackCreateParamsData'
      required:
        - data
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
    VersionStackWithIncludes:
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
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
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
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - head_version
    VersionStackWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStackWithIncludes'
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
    await client.versionStacks.create("d922c686-b384-4b35-847a-4573a4291cf2", "d790613f-f283-4eb0-9a96-341def7d5987", {
        data: {
            fileIds: [
                "8726ca45-0cc1-4c80-86ce-30dc35ffbdbe",
                "d14056db-0e13-44fe-9618-f6a2aef8becf",
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

client.version_stacks.create(
    account_id="d922c686-b384-4b35-847a-4573a4291cf2",
    folder_id="d790613f-f283-4eb0-9a96-341def7d5987",
    data={
        "file_ids": [
            "8726ca45-0cc1-4c80-86ce-30dc35ffbdbe",
            "d14056db-0e13-44fe-9618-f6a2aef8becf"
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

	url := "https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks"

	payload := strings.NewReader("{\n  \"data\": {\n    \"file_ids\": [\n      \"8726ca45-0cc1-4c80-86ce-30dc35ffbdbe\",\n      \"d14056db-0e13-44fe-9618-f6a2aef8becf\"\n    ]\n  }\n}")

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

url = URI("https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"file_ids\": [\n      \"8726ca45-0cc1-4c80-86ce-30dc35ffbdbe\",\n      \"d14056db-0e13-44fe-9618-f6a2aef8becf\"\n    ]\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.post("https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"file_ids\": [\n      \"8726ca45-0cc1-4c80-86ce-30dc35ffbdbe\",\n      \"d14056db-0e13-44fe-9618-f6a2aef8becf\"\n    ]\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks', [
  'body' => '{
  "data": {
    "file_ids": [
      "8726ca45-0cc1-4c80-86ce-30dc35ffbdbe",
      "d14056db-0e13-44fe-9618-f6a2aef8becf"
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
var client = new RestClient("https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "{\n  \"data\": {\n    \"file_ids\": [\n      \"8726ca45-0cc1-4c80-86ce-30dc35ffbdbe\",\n      \"d14056db-0e13-44fe-9618-f6a2aef8becf\"\n    ]\n  }\n}", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["Content-Type": "application/json"]
let parameters = ["data": ["file_ids": ["8726ca45-0cc1-4c80-86ce-30dc35ffbdbe", "d14056db-0e13-44fe-9618-f6a2aef8becf"]]] as [String : Any]

let postData = JSONSerialization.data(withJSONObject: parameters, options: [])

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/d922c686-b384-4b35-847a-4573a4291cf2/folders/d790613f-f283-4eb0-9a96-341def7d5987/version_stacks")! as URL,
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

# List version stack children

GET https://api.frame.io/v4/accounts/{account_id}/version_stacks/{version_stack_id}/children

List the children (files) in a given version stack.
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


Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List version stack children
  version: endpoint_versionStacks.index
paths:
  /v4/accounts/{account_id}/version_stacks/{version_stack_id}/children:
    get:
      operationId: index
      summary: List version stack children
      description: >
        List the children (files) in a given version stack.

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
        - - subpackage_versionStacks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: version_stack_id
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
              #/components/schemas/V4AccountsAccountIdVersionStacksVersionStackIdChildrenGetParametersInclude
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
    V4AccountsAccountIdVersionStacksVersionStackIdChildrenGetParametersInclude:
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
    await client.versionStacks.index("8bef47ed-9887-466d-a639-5d52f2fd0ddf", "4ac012af-305d-4785-94f2-05b4253cb367", {
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

client.version_stacks.index(
    account_id="8bef47ed-9887-466d-a639-5d52f2fd0ddf",
    version_stack_id="4ac012af-305d-4785-94f2-05b4253cb367",
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

	url := "https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links"

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

url = URI("https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/8bef47ed-9887-466d-a639-5d52f2fd0ddf/version_stacks/4ac012af-305d-4785-94f2-05b4253cb367/children?include=media_links")! as URL,
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

# List version stacks

GET https://api.frame.io/v4/accounts/{account_id}/folders/{folder_id}/version_stacks

List version stacks in a given folder.  <br>Rate Limits: 5 calls per 1 second(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/list

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List version stacks
  version: endpoint_versionStacks.list
paths:
  /v4/accounts/{account_id}/folders/{folder_id}/version_stacks:
    get:
      operationId: list
      summary: List version stacks
      description: >-
        List version stacks in a given folder.  <br>Rate Limits: 5 calls per 1
        second(s) per account_user
      tags:
        - - subpackage_versionStacks
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
              #/components/schemas/V4AccountsAccountIdFoldersFolderIdVersionStacksGetParametersInclude
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
                $ref: '#/components/schemas/VersionStacksWithIncludesResponse'
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
    V4AccountsAccountIdFoldersFolderIdVersionStacksGetParametersInclude:
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
    VersionStackWithIncludes:
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
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
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
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - head_version
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
    VersionStacksWithIncludesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/VersionStackWithIncludes'
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
    await client.versionStacks.list("60a45d1c-0647-4a13-82fc-9a43954ef33e", "74c27d7d-d2b0-433a-91ef-ac3f4f260c1c", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.version_stacks.list(
    account_id="60a45d1c-0647-4a13-82fc-9a43954ef33e",
    folder_id="74c27d7d-d2b0-433a-91ef-ac3f4f260c1c"
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

	url := "https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks"

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

url = URI("https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/60a45d1c-0647-4a13-82fc-9a43954ef33e/folders/74c27d7d-d2b0-433a-91ef-ac3f4f260c1c/version_stacks")! as URL,
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

# Move version stack

PATCH https://api.frame.io/v4/accounts/{account_id}/version_stacks/{version_stack_id}/move
Content-Type: application/json

Move version stack to a folder. <br>Rate Limits: 10 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/move

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Move version stack
  version: endpoint_versionStacks.move
paths:
  /v4/accounts/{account_id}/version_stacks/{version_stack_id}/move:
    patch:
      operationId: move
      summary: Move version stack
      description: >-
        Move version stack to a folder. <br>Rate Limits: 10 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_versionStacks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: version_stack_id
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
                $ref: '#/components/schemas/VersionStackResponse'
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
              $ref: '#/components/schemas/VersionStackMoveParams'
components:
  schemas:
    UUID:
      type: string
      format: uuid
    VersionStackMoveParamsData:
      type: object
      properties:
        parent_id:
          type: string
          format: uuid
          description: Destination folder ID
    VersionStackMoveParams:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStackMoveParamsData'
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
    VersionStack:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
        id:
          type: string
          format: uuid
          description: Version Stack ID
        name:
          type: string
          description: Version Stack Name
        parent_id:
          type:
            - string
            - 'null'
          format: uuid
          description: Parent Folder ID
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
        head_version:
          $ref: '#/components/schemas/File'
      required:
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - head_version
    VersionStackResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStack'
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
    await client.versionStacks.move("1923d7db-db9f-4fc3-8bab-c27231dba938", "ebc9961e-2703-49b3-845a-197b72206f67", {
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

client.version_stacks.move(
    account_id="1923d7db-db9f-4fc3-8bab-c27231dba938",
    version_stack_id="ebc9961e-2703-49b3-845a-197b72206f67",
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

	url := "https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move"

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

url = URI("https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Patch.new(url)
request["Content-Type"] = 'application/json'
request.body = "{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}"

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.patch("https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move")
  .header("Content-Type", "application/json")
  .body("{\n  \"data\": {\n    \"parent_id\": \"2e426fe0-f965-4594-8b2b-b4dff1dc00ec\"\n  }\n}")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('PATCH', 'https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move', [
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
var client = new RestClient("https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move");
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

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/1923d7db-db9f-4fc3-8bab-c27231dba938/version_stacks/ebc9961e-2703-49b3-845a-197b72206f67/move")! as URL,
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

# Show version stack

GET https://api.frame.io/v4/accounts/{account_id}/version_stacks/{version_stack_id}

Show version stack details. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/version-stacks/show

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: Show version stack
  version: endpoint_versionStacks.show
paths:
  /v4/accounts/{account_id}/version_stacks/{version_stack_id}:
    get:
      operationId: show
      summary: Show version stack
      description: >-
        Show version stack details. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_versionStacks
      parameters:
        - name: account_id
          in: path
          description: ''
          required: true
          schema:
            $ref: '#/components/schemas/UUID'
        - name: version_stack_id
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
              #/components/schemas/V4AccountsAccountIdVersionStacksVersionStackIdGetParametersInclude
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VersionStackWithIncludesResponse'
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
    V4AccountsAccountIdVersionStacksVersionStackIdGetParametersInclude:
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
    VersionStackWithIncludes:
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
        type:
          $ref: '#/components/schemas/AssetCommonWithIncludesType'
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
        - created_at
        - id
        - name
        - parent_id
        - project_id
        - type
        - updated_at
        - view_url
        - head_version
    VersionStackWithIncludesResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/VersionStackWithIncludes'
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
    await client.versionStacks.show("6c2dc800-2e07-4a56-b80d-ab92db601c66", "7fe8a8aa-a644-421a-9702-a189bfefe455", {
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

client.version_stacks.show(
    account_id="6c2dc800-2e07-4a56-b80d-ab92db601c66",
    version_stack_id="7fe8a8aa-a644-421a-9702-a189bfefe455",
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

	url := "https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links"

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

url = URI("https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/6c2dc800-2e07-4a56-b80d-ab92db601c66/version_stacks/7fe8a8aa-a644-421a-9702-a189bfefe455?include=media_links")! as URL,
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
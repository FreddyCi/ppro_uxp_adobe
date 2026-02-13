# List account user roles

GET https://api.frame.io/v4/accounts/{account_id}/users

List user roles for a given account. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/account-permissions/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List account user roles
  version: endpoint_accountPermissions.index
paths:
  /v4/accounts/{account_id}/users:
    get:
      operationId: index
      summary: List account user roles
      description: >-
        List user roles for a given account. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_accountPermissions
      parameters:
        - name: account_id
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
                $ref: '#/components/schemas/AccountUserRolesResponse'
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
    AccountUserRoleRole:
      type: string
      enum:
        - value: member
        - value: owner
        - value: admin
        - value: reviewer
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
    AccountUserRole:
      type: object
      properties:
        role:
          oneOf:
            - $ref: '#/components/schemas/AccountUserRoleRole'
            - type: 'null'
          description: Account User Role
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
    AccountUserRolesResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/AccountUserRole'
          description: Account User Roles
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
    await client.accountPermissions.index("e46d25c2-c54a-4fe4-a206-928d69e63f97", {});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.account_permissions.index(
    account_id="e46d25c2-c54a-4fe4-a206-928d69e63f97"
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

	url := "https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users"

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

url = URI("https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/e46d25c2-c54a-4fe4-a206-928d69e63f97/users")! as URL,
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

# List accounts

GET https://api.frame.io/v4/accounts

List accounts for the current user. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/accounts/index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List accounts
  version: endpoint_accounts.index
paths:
  /v4/accounts:
    get:
      operationId: index
      summary: List accounts
      description: >-
        List accounts for the current user. <br>Rate Limits: 100 calls per 1.00
        minute(s) per account_user
      tags:
        - - subpackage_accounts
      parameters:
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
                $ref: '#/components/schemas/AccountsResponse'
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
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    AccountRolesItems:
      type: string
      enum:
        - value: admin
        - value: member
        - value: owner
    Account:
      type: object
      properties:
        created_at:
          type: string
          format: date-time
          description: Created Timestamp
        display_name:
          type: string
          description: Account Name
        id:
          type: string
          format: uuid
          description: Account ID
        image:
          type:
            - string
            - 'null'
          description: The account image url
        mounted_storage_enabled:
          type:
            - boolean
            - 'null'
          description: Whether mounted storage is enabled for this account
        roles:
          type: array
          items:
            $ref: '#/components/schemas/AccountRolesItems'
          description: Account User Roles
        storage_limit:
          type:
            - integer
            - 'null'
          description: >-
            The number of bytes of non-archived storage in the account. Value is
            nil when there is no limit
        storage_usage:
          type: integer
          description: The number of bytes of non-archived storage the account is using
        updated_at:
          type: string
          format: date-time
          description: Update timestamp
        v4_migrated_at:
          type:
            - string
            - 'null'
          format: date-time
          description: Migration timestamp
      required:
        - created_at
        - display_name
        - id
        - roles
        - storage_limit
        - storage_usage
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
    AccountsResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Account'
          description: Accounts
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
    await client.accounts.index({});
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.accounts.index()

```

```go
package main

import (
	"fmt"
	"net/http"
	"io"
)

func main() {

	url := "https://api.frame.io/v4/accounts"

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

url = URI("https://api.frame.io/v4/accounts")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts');

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts");
var request = new RestRequest(Method.GET);
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts")! as URL,
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

# List audit logs

GET https://api.frame.io/v4/accounts/{account_id}/audit_logs

List audit logs with filtering capabilities via query params. <br>Rate Limits: 100 calls per 1.00 minute(s) per account_user

Reference: https://next.developer.frame.io/platform/api-reference/accounts/auditlog-index

## OpenAPI Specification

```yaml
openapi: 3.1.1
info:
  title: List audit logs
  version: endpoint_accounts.auditlog.index
paths:
  /v4/accounts/{account_id}/audit_logs:
    get:
      operationId: auditlog-index
      summary: List audit logs
      description: >-
        List audit logs with filtering capabilities via query params. <br>Rate
        Limits: 100 calls per 1.00 minute(s) per account_user
      tags:
        - - subpackage_accounts
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
              #/components/schemas/V4AccountsAccountIdAuditLogsGetParametersInclude
        - name: filters
          in: query
          description: ''
          required: false
          schema:
            $ref: '#/components/schemas/Filters'
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
        - name: api-version
          in: header
          description: ''
          required: true
          schema:
            $ref: >-
              #/components/schemas/V4AccountsAccountIdAuditLogsGetParametersApiVersion
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuditLogsResponse'
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
    V4AccountsAccountIdAuditLogsGetParametersInclude:
      type: string
      enum:
        - value: user
    FiltersEventType:
      type: string
      enum:
        - value: access_request_approved
        - value: access_request_denied
        - value: access_request_submitted
        - value: account_aup_migration_created
        - value: account_aup_migration_deleted
        - value: account_aup_migration_downgrade_completed
        - value: account_aup_migration_downgrade_failed
        - value: account_aup_migration_downgrade_requested
        - value: account_aup_migration_product_migrated
        - value: account_aup_migration_started
        - value: account_aup_migration_updated
        - value: account_aup_user_migration_completed
        - value: account_aup_user_migration_created
        - value: account_aup_user_migration_deleted
        - value: account_aup_user_migration_failed
        - value: account_aup_user_migration_on_hold
        - value: account_aup_user_migration_started
        - value: account_aup_user_migration_unheld
        - value: account_aup_user_migration_updated
        - value: account_delinquent
        - value: account_field_created
        - value: account_field_deleted
        - value: account_field_updated
        - value: account_fio_version_migrated
        - value: account_locked
        - value: account_member_created
        - value: account_member_deleted
        - value: account_member_updated
        - value: account_mfa_enforced
        - value: account_ownership_transferred
        - value: account_permissions_granted_to_user
        - value: account_restored
        - value: account_updated
        - value: account_user_deleted
        - value: account_user_group_created
        - value: account_user_group_deleted
        - value: account_user_group_members_added
        - value: account_user_group_members_removed
        - value: account_user_group_updated
        - value: account_user_updated
        - value: action_created
        - value: action_deleted
        - value: action_updated
        - value: admin_update_to_v4
        - value: allowed_domain_created
        - value: allowed_domain_deleted
        - value: anonymous_user_created
        - value: asset_assignee_changed
        - value: asset_copied
        - value: asset_created
        - value: asset_deleted
        - value: asset_metadata_created
        - value: asset_moved
        - value: asset_restored
        - value: asset_status_changed
        - value: asset_updated
        - value: asset_versioned
        - value: assets_unversioned
        - value: bulk_account_deletion_started
        - value: bulk_assets_deleted
        - value: bulk_assets_restored
        - value: bulk_assets_retranscoded
        - value: bulk_emails_updated
        - value: bulk_projects_activated
        - value: bulk_projects_deactivated
        - value: bulk_users_removed
        - value: collaborator_added
        - value: collaborator_deleted
        - value: collection_updated
        - value: comment_completed
        - value: comment_created
        - value: comment_deleted
        - value: comment_liked
        - value: comment_uncompleted
        - value: comment_updated
        - value: email_address_changed
        - value: email_change_confirmation_requested
        - value: email_confirmed
        - value: file_uploaded
        - value: google_auth_disabled
        - value: google_auth_enabled
        - value: high_risk_sign_up
        - value: join_presentation_request_approved
        - value: join_project_request_approved
        - value: join_request_accepted
        - value: join_request_created
        - value: join_request_declined
        - value: join_request_deleted
        - value: join_request_reset
        - value: join_review_link_request_approved
        - value: join_team_request_approved
        - value: label_updated
        - value: login_factor_created
        - value: login_factor_validated
        - value: media_created
        - value: media_deleted
        - value: metadata_value_updated
        - value: new_device_login
        - value: new_user_email_confirmation_requested
        - value: oauth_app_created
        - value: oauth_app_deleted
        - value: oauth_app_disabled
        - value: oauth_app_enabled
        - value: oauth_app_updated
        - value: password_changed
        - value: password_reset_requested
        - value: pending_account_member_created
        - value: pending_account_member_deleted
        - value: pending_collaborator_created
        - value: pending_collaborator_deleted
        - value: pending_reviewer_created
        - value: pending_reviewer_deleted
        - value: pending_team_member_created
        - value: pending_team_member_deleted
        - value: plan_created
        - value: plan_deleted
        - value: plan_updated
        - value: preference_updated
        - value: presentation_created
        - value: presentation_deleted
        - value: presentation_updated
        - value: project_activated
        - value: project_archive_completed
        - value: project_archived
        - value: project_created
        - value: project_deactivated
        - value: project_deleted
        - value: project_field_created
        - value: project_field_deleted
        - value: project_field_updated
        - value: project_invite_link_created
        - value: project_invite_link_revoked
        - value: project_moved
        - value: project_permissions_granted_to_account_user_group
        - value: project_permissions_granted_to_user
        - value: project_restored
        - value: project_unarchive_completed
        - value: project_unarchived
        - value: project_updated
        - value: push_tokens_added
        - value: push_tokens_deleted
        - value: resource_control_policies_updated
        - value: resource_invite_sent
        - value: review_link_assets_added
        - value: review_link_assets_deleted
        - value: review_link_created
        - value: review_link_deleted
        - value: review_link_emailed
        - value: review_link_updated
        - value: reviewer_created
        - value: reviewer_deleted
        - value: role_added
        - value: role_removed
        - value: sbwm_template_created
        - value: sbwm_template_deleted
        - value: sbwm_template_updated
        - value: session_refreshed
        - value: session_revoked
        - value: share_activity_tracking_consent_changed
        - value: share_branding_preset_updated
        - value: share_created
        - value: share_deleted
        - value: share_invites_sent
        - value: share_reviewers_added
        - value: share_reviewers_removed
        - value: share_updated
        - value: share_viewed
        - value: subscription_cancelled
        - value: subscription_card_updated
        - value: subscription_created
        - value: subscription_line_item_created
        - value: subscription_line_item_deleted
        - value: subscription_restored
        - value: subscription_updated
        - value: team_created
        - value: team_creator_updated
        - value: team_deleted
        - value: team_lifecycle_policy_updated
        - value: team_member_created
        - value: team_member_deleted
        - value: team_member_reset
        - value: team_member_updated
        - value: team_updated
        - value: transcript_completed_self
        - value: transcript_diarization_consent_changed
        - value: transfer_batch_completed
        - value: user_anonymized
        - value: user_deactivated
        - value: user_login
        - value: user_login_attempt
        - value: user_logout
        - value: user_mfa_enforced
        - value: user_reactivated
        - value: user_signup
        - value: user_token_created
        - value: user_token_deleted
        - value: user_token_disabled
        - value: user_token_enabled
        - value: user_token_updated
        - value: user_updated
        - value: v4_planned_migration_creation_failed
        - value: webhook_created
        - value: webhook_deleted
        - value: webhook_updated
        - value: workfront_asset_approval_status_updated
        - value: workspace_permissions_granted_to_account_user_group
        - value: workspace_permissions_granted_to_user
    FiltersResourceType:
      type: string
      enum:
        - value: account
        - value: account_field_definition
        - value: account_member
        - value: account_user_group
        - value: action
        - value: allowed_domain
        - value: anonymous_user
        - value: asset
        - value: asset_metadata
        - value: collaborator
        - value: collection
        - value: comment
        - value: comment_impression
        - value: folder
        - value: join_request
        - value: login_factor
        - value: media
        - value: oauth_app
        - value: pending_account_member
        - value: pending_collaborator
        - value: pending_reviewer
        - value: pending_team_member
        - value: plan
        - value: presentation
        - value: project
        - value: project_field_definition
        - value: project_invite_link
        - value: project_preference
        - value: reset_token
        - value: review_link
        - value: reviewer
        - value: sbwm_template
        - value: share
        - value: subscription
        - value: subscription_line_item
        - value: team
        - value: team_member
        - value: transfer_batch
        - value: user
        - value: user_token
        - value: v4_planned_migration
        - value: version_stack
        - value: webhook
    Filters:
      type: object
      properties:
        event_type:
          $ref: '#/components/schemas/FiltersEventType'
          description: Filter by event type
        from_date:
          type: string
          format: date
          description: 'Start date for search, Format: ISO8601 extended [YYYY-MM-DD]'
        ip_address:
          type: string
          description: >-
            Filter by IP address. This supports both IPv4 (1.1.1.1) and IPv6
            (2001:db8:3333:4444:5555:6666:7777:8888)
        project_id:
          type: string
          format: uuid
          description: Filter by Project ID (UUID)
        resource_id:
          type: string
          format: uuid
          description: Filter by Resource ID (UUID)
        resource_type:
          $ref: '#/components/schemas/FiltersResourceType'
          description: Filter by resource type
        to_date:
          type: string
          format: date
          description: 'End date for search, Format: ISO8601 extended [YYYY-MM-DD]'
        user_id:
          type: string
          format: uuid
          description: Filter by User ID (UUID)
        workspace_id:
          type: string
          format: uuid
          description: Filter by Workspace ID (UUID)
    RequestAfterOpaqueCursor:
      type: string
    RequestPageSize:
      type: integer
      default: 50
    IncludeTotalCount:
      type: boolean
      default: false
    V4AccountsAccountIdAuditLogsGetParametersApiVersion:
      type: string
      enum:
        - value: '4.0'
    AuditLogwithIncludesEventType:
      type: string
      enum:
        - value: access_request_approved
        - value: access_request_denied
        - value: access_request_submitted
        - value: account_aup_migration_created
        - value: account_aup_migration_deleted
        - value: account_aup_migration_downgrade_completed
        - value: account_aup_migration_downgrade_failed
        - value: account_aup_migration_downgrade_requested
        - value: account_aup_migration_product_migrated
        - value: account_aup_migration_started
        - value: account_aup_migration_updated
        - value: account_aup_user_migration_completed
        - value: account_aup_user_migration_created
        - value: account_aup_user_migration_deleted
        - value: account_aup_user_migration_failed
        - value: account_aup_user_migration_on_hold
        - value: account_aup_user_migration_started
        - value: account_aup_user_migration_unheld
        - value: account_aup_user_migration_updated
        - value: account_delinquent
        - value: account_field_created
        - value: account_field_deleted
        - value: account_field_updated
        - value: account_fio_version_migrated
        - value: account_locked
        - value: account_member_created
        - value: account_member_deleted
        - value: account_member_updated
        - value: account_mfa_enforced
        - value: account_ownership_transferred
        - value: account_permissions_granted_to_user
        - value: account_restored
        - value: account_updated
        - value: account_user_deleted
        - value: account_user_group_created
        - value: account_user_group_deleted
        - value: account_user_group_members_added
        - value: account_user_group_members_removed
        - value: account_user_group_updated
        - value: account_user_updated
        - value: action_created
        - value: action_deleted
        - value: action_updated
        - value: admin_update_to_v4
        - value: allowed_domain_created
        - value: allowed_domain_deleted
        - value: anonymous_user_created
        - value: asset_assignee_changed
        - value: asset_copied
        - value: asset_created
        - value: asset_deleted
        - value: asset_metadata_created
        - value: asset_moved
        - value: asset_restored
        - value: asset_status_changed
        - value: asset_updated
        - value: asset_versioned
        - value: assets_unversioned
        - value: bulk_account_deletion_started
        - value: bulk_assets_deleted
        - value: bulk_assets_restored
        - value: bulk_assets_retranscoded
        - value: bulk_emails_updated
        - value: bulk_projects_activated
        - value: bulk_projects_deactivated
        - value: bulk_users_removed
        - value: collaborator_added
        - value: collaborator_deleted
        - value: collection_updated
        - value: comment_completed
        - value: comment_created
        - value: comment_deleted
        - value: comment_liked
        - value: comment_uncompleted
        - value: comment_updated
        - value: email_address_changed
        - value: email_change_confirmation_requested
        - value: email_confirmed
        - value: file_uploaded
        - value: google_auth_disabled
        - value: google_auth_enabled
        - value: high_risk_sign_up
        - value: join_presentation_request_approved
        - value: join_project_request_approved
        - value: join_request_accepted
        - value: join_request_created
        - value: join_request_declined
        - value: join_request_deleted
        - value: join_request_reset
        - value: join_review_link_request_approved
        - value: join_team_request_approved
        - value: label_updated
        - value: login_factor_created
        - value: login_factor_validated
        - value: media_created
        - value: media_deleted
        - value: metadata_value_updated
        - value: new_device_login
        - value: new_user_email_confirmation_requested
        - value: oauth_app_created
        - value: oauth_app_deleted
        - value: oauth_app_disabled
        - value: oauth_app_enabled
        - value: oauth_app_updated
        - value: password_changed
        - value: password_reset_requested
        - value: pending_account_member_created
        - value: pending_account_member_deleted
        - value: pending_collaborator_created
        - value: pending_collaborator_deleted
        - value: pending_reviewer_created
        - value: pending_reviewer_deleted
        - value: pending_team_member_created
        - value: pending_team_member_deleted
        - value: plan_created
        - value: plan_deleted
        - value: plan_updated
        - value: preference_updated
        - value: presentation_created
        - value: presentation_deleted
        - value: presentation_updated
        - value: project_activated
        - value: project_archive_completed
        - value: project_archived
        - value: project_created
        - value: project_deactivated
        - value: project_deleted
        - value: project_field_created
        - value: project_field_deleted
        - value: project_field_updated
        - value: project_invite_link_created
        - value: project_invite_link_revoked
        - value: project_moved
        - value: project_permissions_granted_to_account_user_group
        - value: project_permissions_granted_to_user
        - value: project_restored
        - value: project_unarchive_completed
        - value: project_unarchived
        - value: project_updated
        - value: push_tokens_added
        - value: push_tokens_deleted
        - value: resource_control_policies_updated
        - value: resource_invite_sent
        - value: review_link_assets_added
        - value: review_link_assets_deleted
        - value: review_link_created
        - value: review_link_deleted
        - value: review_link_emailed
        - value: review_link_updated
        - value: reviewer_created
        - value: reviewer_deleted
        - value: role_added
        - value: role_removed
        - value: sbwm_template_created
        - value: sbwm_template_deleted
        - value: sbwm_template_updated
        - value: session_refreshed
        - value: session_revoked
        - value: share_activity_tracking_consent_changed
        - value: share_branding_preset_updated
        - value: share_created
        - value: share_deleted
        - value: share_invites_sent
        - value: share_reviewers_added
        - value: share_reviewers_removed
        - value: share_updated
        - value: share_viewed
        - value: subscription_cancelled
        - value: subscription_card_updated
        - value: subscription_created
        - value: subscription_line_item_created
        - value: subscription_line_item_deleted
        - value: subscription_restored
        - value: subscription_updated
        - value: team_created
        - value: team_creator_updated
        - value: team_deleted
        - value: team_lifecycle_policy_updated
        - value: team_member_created
        - value: team_member_deleted
        - value: team_member_reset
        - value: team_member_updated
        - value: team_updated
        - value: transcript_completed_self
        - value: transcript_diarization_consent_changed
        - value: transfer_batch_completed
        - value: user_anonymized
        - value: user_deactivated
        - value: user_login
        - value: user_login_attempt
        - value: user_logout
        - value: user_mfa_enforced
        - value: user_reactivated
        - value: user_signup
        - value: user_token_created
        - value: user_token_deleted
        - value: user_token_disabled
        - value: user_token_enabled
        - value: user_token_updated
        - value: user_updated
        - value: v4_planned_migration_creation_failed
        - value: webhook_created
        - value: webhook_deleted
        - value: webhook_updated
        - value: workfront_asset_approval_status_updated
        - value: workspace_permissions_granted_to_account_user_group
        - value: workspace_permissions_granted_to_user
    AuditLogwithIncludesResourceType:
      type: string
      enum:
        - value: account
        - value: account_field_definition
        - value: account_member
        - value: account_user_group
        - value: action
        - value: allowed_domain
        - value: anonymous_user
        - value: asset
        - value: asset_metadata
        - value: collaborator
        - value: collection
        - value: comment
        - value: comment_impression
        - value: folder
        - value: join_request
        - value: login_factor
        - value: media
        - value: oauth_app
        - value: pending_account_member
        - value: pending_collaborator
        - value: pending_reviewer
        - value: pending_team_member
        - value: plan
        - value: presentation
        - value: project
        - value: project_field_definition
        - value: project_invite_link
        - value: project_preference
        - value: reset_token
        - value: review_link
        - value: reviewer
        - value: sbwm_template
        - value: share
        - value: subscription
        - value: subscription_line_item
        - value: team
        - value: team_member
        - value: transfer_batch
        - value: user
        - value: user_token
        - value: v4_planned_migration
        - value: version_stack
        - value: webhook
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
    AuditLogwithIncludes:
      type: object
      properties:
        account_id:
          type: string
          format: uuid
        event_type:
          $ref: '#/components/schemas/AuditLogwithIncludesEventType'
        inserted_at:
          type: string
        ip_address:
          type: string
        project_id:
          type:
            - string
            - 'null'
          format: uuid
        resource_id:
          type: string
          format: uuid
        resource_type:
          $ref: '#/components/schemas/AuditLogwithIncludesResourceType'
        user:
          $ref: '#/components/schemas/User'
        user_id:
          type: string
          format: uuid
        workspace_id:
          type:
            - string
            - 'null'
          format: uuid
      required:
        - account_id
        - event_type
        - inserted_at
        - ip_address
        - project_id
        - resource_id
        - resource_type
        - user_id
        - workspace_id
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
    AuditLogsResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/AuditLogwithIncludes'
          description: Audit logs
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
    await client.accounts.auditlogIndex("ff7c4bb6-557e-4edd-8b7d-f62642e3b83a", {
        filters: {},
        apiVersion: "4.0",
    });
}
main();

```

```python
from frameio import Frameio

client = Frameio(
    base_url="https://api.frame.io"
)

client.accounts.auditlog_index(
    account_id="ff7c4bb6-557e-4edd-8b7d-f62642e3b83a",
    filters={},
    api_version="4.0"
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

	url := "https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("api-version", "4.0")

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

url = URI("https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["api-version"] = '4.0'

response = http.request(request)
puts response.read_body
```

```java
HttpResponse<String> response = Unirest.get("https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D")
  .header("api-version", "4.0")
  .asString();
```

```php
<?php

$client = new \GuzzleHttp\Client();

$response = $client->request('GET', 'https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D', [
  'headers' => [
    'api-version' => '4.0',
  ],
]);

echo $response->getBody();
```

```csharp
var client = new RestClient("https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D");
var request = new RestRequest(Method.GET);
request.AddHeader("api-version", "4.0");
IRestResponse response = client.Execute(request);
```

```swift
import Foundation

let headers = ["api-version": "4.0"]

let request = NSMutableURLRequest(url: NSURL(string: "https://api.frame.io/v4/accounts/ff7c4bb6-557e-4edd-8b7d-f62642e3b83a/audit_logs?filters=%7B%7D")! as URL,
                                        cachePolicy: .useProtocolCachePolicy,
                                    timeoutInterval: 10.0)
request.httpMethod = "GET"
request.allHTTPHeaderFields = headers

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
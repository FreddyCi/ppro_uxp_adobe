# T012.5 Live Testing Instructions for Adobe UXP Developer Tools

## Current Status ✅
- **UXP Panel Built**: Successfully built with `pnpm build:uxp`
- **Azure Storage**: Configured for cloud storage integration
- **Environment Variables**: Configured with IMS credentials and Azure storage settings
- **Host Application**: Configured for Premiere Pro ("premierepro") using working manifest format
- **Manifest Fixed**: Updated to match working UXP Premiere Pro format with proper entrypoints structure

## Testing Steps

### 1. Connect Premiere Pro to UXP Developer Tools
**⚠️ Important**: Premiere Pro must be running and connected before loading the plugin

1. **Launch Adobe Premiere Pro** (version 25.4.1 or later)
2. In Premiere Pro, go to **Window** → **Extensions** → **UXP Developer Tools**
3. This should connect Premiere Pro to the UXP service
4. Verify connection status in UXP Developer Tools shows Premiere Pro as connected

### 2. Load Panel in UXP Developer Tools
**Path**: `/Users/christopherkruger/Projects/Adobe/UXP_PoC/premiere-pro-uxp-panel/dist-uxp`

1. Open **Adobe UXP Developer Tools** (should show Premiere Pro connected)
2. Click **"Add Plugin"** or **"Load Plugin"**  
3. Navigate to the `dist-uxp` folder (path above)
4. Select `manifest.json` (configured for Premiere Pro with "premierepro" and proper entrypoints)
5. Click **"Load"** to install in Premiere Pro
6. **Expected Result**: Panel appears in Premiere Pro without console errors

### 3. Test IMS Authentication Flow
**What to Test**: Login/logout functionality with real IMS tokens

1. Look for **"Login"** button in the header
2. Click **"Login"** and observe loading state
3. Check browser developer tools for IMS OAuth requests
4. **Expected Result**: 
   - Loading spinner appears
   - Authentication completes successfully  
   - Header shows "Authenticated" status with green indicator
   - Token gets cached in localStorage

### 4. Test Service Status Indicators  
**What to Test**: Real-time service connection status

1. Observe service status indicators in header:
   - **Firefly**: Should show connection attempt
   - **Azure Blob**: Should connect to Azure cloud storage
   - **Gemini**: May show as disconnected (not yet implemented)
   - **Premiere**: Should detect UXP environment

2. **Expected Results**:
   - Azure Blob: Green "Connected" status (Azure cloud)
   - Visual feedback with StatusLight components
   - Real-time updates as connections change

### 5. Test Toast Notification System
**What to Test**: Toast notifications using React Spectrum components

1. Click **"Test Toast Notifications"** button
2. Should see sequence of toasts:
   - Info toast (blue)
   - Warning toast (orange) 
   - Error toast (red)
   - Success toast (green)

3. **Expected Results**:
   - Toasts appear in top-right corner
   - Auto-dismiss after 5 seconds
   - Manual close with × button works
   - No console errors

### 6. Test Loading States
**What to Test**: Loading components and progress indicators

1. Click **"Test Loading States"** button
2. Observe loading overlay covering the panel
3. **Expected Results**:
   - Loading spinner with "Loading services..." message
   - Semi-transparent overlay
   - Completes with success toast after 2 seconds

### 7. UXP Environment Compatibility
**What to Monitor**: React Spectrum components in UXP

- **Panel Rendering**: All components display correctly
- **Theme**: Dark theme matching Premiere Pro interface
- **Performance**: Responsive interaction without lag
- **Console**: No React Spectrum compatibility errors
- **Focus Management**: Tab navigation works properly

## Environment Details

### IMS Configuration (Development)
- **Client ID**: `f39e1cd1c58f498990859085569...`
- **Scopes**: `openid,AdobeID,firefly_api,ff_apis,firefly_enterprise`
- **Environment**: Development/Testing credentials

### Azure Storage Configuration
- **Storage Account**: Azure cloud storage
- **Container**: `uxp-images`
- **Status**: Connected to Azure cloud

## Expected Outcomes

### ✅ Success Criteria
- Panel loads in UDT without errors
- Authentication flow completes with valid tokens
- Azure Blob connects to Azure cloud storage
- Toast notifications display correctly
- Loading states provide clear feedback
- React Spectrum components render properly

### ⚠️ Potential Issues to Document
- Performance in UXP environment
- React Spectrum dark theme compatibility
- Network timeout behavior
- Error handling edge cases
- Memory usage in UXP context

## Troubleshooting

### If "No applications are connected to the service" Error
1. **Launch Premiere Pro** (version 25.4.1 or later)
2. In Premiere Pro: **Window** → **Extensions** → **UXP Developer Tools**
3. Wait for connection to establish in UXP Developer Tools
4. Verify Premiere Pro appears as "Connected" in UXP Developer Tools
5. Try loading the plugin again

### If Panel Doesn't Load
1. Check `dist-uxp/manifest.json` exists
2. Verify `dist-uxp/index.html` has no ES modules
3. Check UXP Developer Tools console for errors

### If Authentication Fails
1. Verify internet connection for IMS requests
2. Check browser network tab for 401/403 errors  
3. Validate IMS credentials in `.env.local`

### If Azure Storage Connection Fails
1. Confirm Azure Storage account is accessible
2. Check network connectivity to Azure endpoints
3. Verify connection string and credentials in environment variables

## Ready for Testing! 🚀

The panel is built and ready for live testing in Adobe UXP Developer Tools. All components use React Spectrum design system and should integrate properly with the Premiere Pro interface.
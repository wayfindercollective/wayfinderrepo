# Intercom Messenger Styling Guide - Void Underground

## Overview
To fully customize the Intercom messenger interface to match the Void Underground website styling, you'll need to configure settings in the Intercom dashboard. The code sets basic colors, but full customization requires dashboard configuration.

## Brand Colors
- **Primary Cyan**: `#00FFFF`
- **Magenta**: `#FF00FF`
- **Background Black**: `#000000`
- **White Text**: `#FFFFFF`

## Dashboard Configuration Steps

1. **Go to Intercom Dashboard**
   - Navigate to: https://app.intercom.com/
   - Log in with your account

2. **Access Messenger Settings**
   - Go to: **Settings** > **Messenger** > **Appearance**
   - Or: **Settings** > **Messenger** > **Customize**

3. **Configure Colors**
   - **Primary Color**: Set to `#00FFFF` (Cyan)
   - **Background Color**: Set to `#000000` (Black)
   - **Text Color**: Set to `#FFFFFF` (White)
   - **Accent Color**: Set to `#FF00FF` (Magenta) for highlights

4. **Configure Fonts**
   - **Primary/Display Font**: `Orbitron` (for headings and titles)
     - Weights: 600, 700
     - Google Fonts URL: https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700
   - **Body Font**: `Inter` (for body text and messages)
     - Weights: 400, 600, 700
     - Google Fonts URL: https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700
   - **Monospace Font**: `IBM Plex Mono` (for code/technical text)
     - Weights: 500, 600
     - Google Fonts URL: https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600
   
   **In Intercom Dashboard:**
   - Go to **Settings** > **Messenger** > **Appearance** > **Customize**
   - Look for "Font Family" or "Typography" settings
   - Set:
     - **Heading Font**: `Orbitron, sans-serif`
     - **Body Font**: `Inter, sans-serif`
     - **Monospace Font**: `IBM Plex Mono, monospace` (if available)
   
   **Note:** If Intercom doesn't support custom fonts directly, you may need to:
   - Use CSS injection (if available in your plan)
   - Or use the closest available system fonts:
     - For Orbitron: Use a bold sans-serif like `Arial Black` or `Impact`
     - For Inter: Use `Arial`, `Helvetica`, or `system-ui`

5. **Messenger Appearance**
   - **Border Radius**: 12px (to match site buttons)
   - **Shadow/Glow**: Enable subtle cyan glow effect if available

6. **Message Bubbles**
   - **Your Messages**: Cyan background (`#00FFFF`) with black text
   - **Visitor Messages**: Dark background (`#1B1B1B`) with white text

## Code Configuration
The component already sets:
- `action_color: '#00FFFF'` - Cyan for buttons/actions
- `background_color: '#000000'` - Black background
- `hide_default_launcher: true` - Uses custom button only

## Additional Customization
For advanced styling, Intercom may offer:
- Custom CSS injection (if available in your plan)
- Custom HTML templates
- Branded messenger themes

Check Intercom's documentation for your specific plan features.

## Testing
After making changes in the dashboard:
1. Clear browser cache
2. Refresh the website
3. Open the messenger to see updated styling
4. Test on different devices/browsers

## Notes
- Some styling options may vary based on your Intercom plan
- Changes in the dashboard may take a few minutes to propagate
- The messenger iframe is sandboxed, so direct CSS injection is limited
- Focus on dashboard settings for best results


# Character Reference Guide

## Overview

The **Character Reference** feature in Luma Dream Machine allows you to generate images with specific people or characters that maintain consistent facial features across multiple generations. This is perfect for creating branded content, storytelling, or any scenario where you need the same person to appear in different contexts.

---

## How It Works

### The Identity System

You can define up to **4 different identities** (labeled A, B, C, D), and for each identity, you can provide up to **4 reference images**:

```
Identity A: [Image 1, Image 2, Image 3, Image 4] ← Person #1
Identity B: [Image 1, Image 2, Image 3, Image 4] ← Person #2  
Identity C: [Image 1, Image 2, Image 3, Image 4] ← Person #3
Identity D: [Image 1, Image 2, Image 3, Image 4] ← Person #4
```

### Why Multiple Images?

- **1 image**: Basic consistency (may vary slightly)
- **2-3 images**: Good consistency (different angles help)
- **4 images**: Best consistency (AI fully understands the face)

**Pro Tip**: Use images with different angles, expressions, and lighting for best results!

---

## Step-by-Step Usage

### 1. Enable Character Reference

1. Navigate to the **Luma Dream Machine** section
2. Select **"Image"** generation mode
3. Check the box: ☑️ **Use Character Reference (Optional)**

### 2. Select an Identity

Click one of the identity buttons to start:
- **[A (0/4)]** - Identity A (0 images uploaded)
- **[B (0/4)]** - Identity B (0 images uploaded)
- **[C (0/4)]** - Identity C (0 images uploaded)
- **[D (0/4)]** - Identity D (0 images uploaded)

The selected identity will be highlighted in **blue** (accent color).

### 3. Upload Reference Images

For the selected identity, you'll see 4 reference slots:

```
Reference 1
[Select Image] ← Click to choose an image

Reference 2
[Select Image]

Reference 3
[Select Image]

Reference 4
[Select Image]
```

**To add an image**:
1. Click **"Select Image"**
2. Browse and select a JPG, JPEG, or PNG file
3. The filename will appear when selected
4. Click **"Remove"** to delete if needed

**The counter updates**: As you add images, watch the identity button change from **A (0/4)** → **A (1/4)** → **A (2/4)** etc.

### 4. Add More Identities (Optional)

To add additional people:
1. Click a different identity button (B, C, or D)
2. Upload 1-4 reference images for that person
3. Repeat for up to 4 different people

### 5. Write Your Prompt

Describe the scene you want:
- **Single person**: "A professional headshot in a business suit"
- **Multiple people**: "Two people having coffee at a café"
- **Specific scenario**: "A woman presenting on stage at a conference"

### 6. Generate!

Click **"Generate Image"** and the AI will:
1. Upload your reference images to Azure Storage
2. Send them to Luma API with your prompt
3. Generate an image maintaining the facial features from your references

---

## Use Cases & Examples

### 📸 Single Identity Use Cases

#### **Personal Branding**
```
Identity A: 4 photos of yourself
Prompt: "Professional LinkedIn profile photo with modern office background"
Result: You in different professional settings
```

#### **Product Marketing**
```
Identity A: 4 photos of brand ambassador
Prompt: "Person holding our new product with excited expression"
Result: Consistent brand ambassador across campaigns
```

#### **Storytelling**
```
Identity A: 4 photos of main character
Prompt: "Character walking through a futuristic city at sunset"
Result: Same character in various story scenes
```

### 👥 Multiple Identity Use Cases

#### **Team Photos**
```
Identity A: 4 photos of CEO
Identity B: 4 photos of CTO
Prompt: "Two executives shaking hands in modern office"
Result: Recognizable executives in professional setting
```

#### **Social Content**
```
Identity A: 4 photos of influencer #1
Identity B: 4 photos of influencer #2
Prompt: "Two friends laughing while having coffee"
Result: Both influencers together in relatable scene
```

#### **Family/Group Scenarios**
```
Identity A: 4 photos of person #1
Identity B: 4 photos of person #2
Identity C: 4 photos of person #3
Prompt: "Three people celebrating at a birthday party"
Result: All three recognizable people in the celebration
```

### 🎨 Creative Applications

#### **Historical Recreation**
```
Identity A: 4 photos of person
Prompt: "Person dressed as a medieval knight in castle courtyard"
Result: Your face in historical context
```

#### **Fantasy Scenarios**
```
Identity A: 4 photos of yourself
Prompt: "Superhero flying over New York City at night"
Result: You as a superhero
```

#### **Before/After Concepts**
```
Identity A: 4 current photos
Prompt: "Person 30 years older with gray hair and glasses"
Result: Age progression visualization
```

---

## Best Practices

### ✅ DO:
- **Use clear, well-lit photos** of the person's face
- **Provide multiple angles** (front view, side view, slight angle)
- **Include different expressions** (smiling, neutral, serious)
- **Use high-quality images** (not blurry or pixelated)
- **Keep file sizes reasonable** (under 10MB per image)

### ❌ DON'T:
- Use heavily filtered or edited photos
- Upload images with multiple people (focus on one face)
- Use images with sunglasses, masks, or face obstructions
- Mix different people in the same identity
- Expect perfect results with only 1 reference image

---

## Technical Details

### What Happens Behind the Scenes

1. **Image Upload**:
   - Selected images are read from your local filesystem
   - Uploaded to Azure Storage with unique blob names
   - Secure HTTPS URLs are generated

2. **Character Reference Object**:
   ```json
   {
     "identity0": { "images": ["url1", "url2", "url3", "url4"] },
     "identity1": { "images": ["url1", "url2"] },
     "identity2": { "images": ["url1"] }
   }
   ```
   - Only populated identities are included
   - Each identity has an array of image URLs

3. **API Request**:
   - Sent to Luma Dream Machine with character reference
   - Combined with your text prompt
   - Model: photon-1 or photon-flash-1
   - Aspect ratio: Your selected ratio

4. **Generation**:
   - AI analyzes reference images to learn facial features
   - Generates new image maintaining those features
   - Downloads and saves to local gallery

### Supported Formats
- **Image Types**: JPG, JPEG, PNG
- **File Size**: Recommended under 10MB per image
- **Resolution**: Higher quality = better consistency

---

## Troubleshooting

### "No Character References" Error
**Problem**: Clicked generate without selecting any images  
**Solution**: Upload at least 1 image to at least 1 identity

### Inconsistent Results
**Problem**: Generated face doesn't match references well  
**Solution**: 
- Add more reference images (aim for 3-4)
- Use clearer, better-lit photos
- Try different angles/expressions
- Ensure photos are high quality

### "Azure SAS Missing" Error
**Problem**: Azure storage not configured  
**Solution**: Contact admin - requires `VITE_AZURE_CONTAINER_SAS_URL` environment variable

### Face Doesn't Appear in Image
**Problem**: Prompt doesn't mention person/people  
**Solution**: Explicitly describe people in prompt (e.g., "A woman..." or "Two people...")

---

## Workflow Tips

### Efficient Identity Management

**Organize by Project**:
```
Identity A: Client Brand Ambassador
Identity B: Company CEO  
Identity C: Product Spokesperson
Identity D: [Keep empty for ad-hoc use]
```

**Switch Between Identities**:
- Click identity buttons to switch
- Each identity remembers its images
- You can view/edit any identity anytime

**Remove and Replace**:
- Click "Remove" button on any image
- Upload a different photo in its place
- Changes apply immediately

### Generation Strategies

**Test with One Identity First**:
1. Upload 3-4 images to Identity A
2. Generate a simple test image
3. Verify consistency before adding more identities

**Iterate on Prompts**:
1. Use same reference images
2. Try different prompt variations
3. Find what works best for your use case

**Combine with Other Features**:
- Use Character Reference + Style Reference for specific artistic styles
- Use Character Reference + Image Reference for composition control

---

## Limitations & Considerations

### Current Limitations:
- **Maximum 4 identities** per generation
- **Maximum 4 images** per identity
- **File picker only** (no gallery selection for character refs)
- **Requires Azure storage** for image upload

### Privacy & Ethics:
- ⚠️ **Only use photos you have permission to use**
- ⚠️ **Respect people's likeness rights**
- ⚠️ **Don't use for deepfakes or impersonation**
- ⚠️ **Follow platform terms of service**

### Performance:
- More reference images = slightly longer processing time
- Multiple identities = more complex generation
- High-resolution references may increase upload time

---

## FAQ

**Q: Can I save my identities for later?**  
A: Currently, identities are stored in session state. They'll reset if you reload the panel.

**Q: Can I use the same person across multiple generations?**  
A: Yes! Keep the reference images loaded and generate multiple times with different prompts.

**Q: What's the difference between Identity A, B, C, D?**  
A: Just labels for organization. Use A for your main person, B for secondary, etc.

**Q: Can I mix character reference with other features?**  
A: Yes! You can use character reference alongside style reference (but not with image reference or modify image in the same generation).

**Q: How do I know which identity is selected?**  
A: The selected identity button will be highlighted in blue (accent color).

**Q: Can I delete all images at once?**  
A: Click "Remove" on each image individually, or uncheck "Use Character Reference" to disable the feature.

---

## Support

For issues or questions:
- Check the browser console for detailed error messages
- Verify Azure SAS token is configured correctly
- Ensure images are valid JPG/JPEG/PNG format
- Try with fewer reference images if experiencing errors

---

*Last Updated: October 6, 2025*

# 📸 Test Receipts for OCR

This folder contains sample receipts to test the OCR (Optical Character Recognition) feature.

## 🧪 How to Test:

### Method 1: Screenshot HTML Files
1. Open any `.html` file in browser
2. Take a screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
3. Save as image
4. Upload to Paylockr → Expenses → "SCAN RECEIPT"

### Method 2: Use Real Receipts
- Take photo of any restaurant bill
- Take photo of Uber/Ola receipt
- Take photo of shopping invoice

---

## 📋 Sample Receipts Included:

### 1. `sample-receipt-1.html` - Cafe Coffee Day
**Expected Extraction:**
- Amount: ₹472.50
- Date: 15/06/2024
- Category: Food & Dining
- Vendor: Cafe Coffee Day

### 2. `sample-receipt-2-uber.html` - Uber Trip
**Expected Extraction:**
- Amount: Rs. 300
- Date: 20/06/2024
- Category: Transportation
- Vendor: Uber

---

## ✅ What OCR Looks For:

1. **Amount:** ₹ or Rs. followed by numbers
2. **Date:** DD/MM/YYYY or DD-MM-YYYY format
3. **Vendor:** First line of text (usually company name)
4. **Category:** Auto-detected from keywords:
   - "food", "restaurant", "cafe" → Food & Dining
   - "uber", "ola", "transport" → Transportation
   - "software", "subscription" → Software & Tools
   - "office", "supplies" → Office Supplies

---

## 💡 Tips for Best Results:

✅ **DO:**
- Use clear, well-lit photos
- Keep receipt flat
- Include full receipt in frame
- Use printed receipts

❌ **DON'T:**
- Use blurry photos
- Use handwritten receipts
- Crop out important parts
- Use dark/shadowy photos

---

## 🚀 Quick Test:

1. Open `sample-receipt-1.html` in browser
2. Screenshot it
3. Go to Paylockr → Expenses
4. Click "SCAN RECEIPT"
5. Upload screenshot
6. Should auto-add: ₹472.50 expense in Food & Dining category!

---

**Happy Testing! 🎉**

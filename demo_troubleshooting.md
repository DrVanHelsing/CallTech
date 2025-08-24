# 🛠️ Demo Troubleshooting Guide

## 🔍 **Common Issues & Quick Fixes**

### **Issue 1: "No speech detected"**
**Symptoms**: Recording works but transcript is empty
**Solutions**:
- ✅ Check browser microphone permissions (look for mic icon in address bar)
- ✅ Speak louder and closer to microphone
- ✅ Check Windows microphone privacy settings
- ✅ Try a different browser (Chrome recommended)
- ✅ Ensure microphone isn't muted in Windows

### **Issue 2: Customer not identified**
**Symptoms**: AI doesn't recognize name or phone number
**Solutions**:
- ✅ Use exact names: "Sarah", "John", or "Maria" 
- ✅ Use exact phone endings: "5678", "1234", or "9876"
- ✅ Speak clearly: "My name is Sarah" or "My phone ends in 5678"
- ✅ Click "Reset Customer" and try again

### **Issue 3: Services not responding**
**Symptoms**: Connection errors or timeouts
**Solutions**:
- ✅ Check all services are running:
  - Frontend: http://localhost:8080/
  - Node API: http://localhost:3001/api/health
  - Python STT: http://localhost:8001/docs
- ✅ Restart services if needed: `npm run start:all`
- ✅ Check Windows Firewall isn't blocking ports

### **Issue 4: Audio quality problems**
**Symptoms**: Poor transcription accuracy
**Solutions**:
- ✅ Use a good quality microphone/headset
- ✅ Minimize background noise
- ✅ Speak at normal pace, not too fast
- ✅ Ensure stable internet connection
- ✅ Close other audio applications

### **Issue 5: Browser compatibility**
**Symptoms**: Features not working properly
**Solutions**:
- ✅ Use Google Chrome (recommended)
- ✅ Enable microphone permissions
- ✅ Allow "Insecure origins" for localhost if needed
- ✅ Disable browser extensions that might interfere
- ✅ Try incognito/private mode

## 🚀 **Service Restart Commands**

### **Restart All Services**
```bash
npm run start:all
```

### **Restart Individual Services**
```bash
# Frontend only
npm run dev

# Node.js API only  
npm run start:server

# Python backend only
npm run start:python
```

### **Kill All Processes (if stuck)**
```bash
taskkill /F /IM "python.exe" 2>$null; taskkill /F /IM "node.exe" 2>$null
```

## ✅ **Quick Health Checks**

### **1. Frontend Health**
- Visit: http://localhost:8080/
- Should see: "AI Call Center Agent" interface
- Check: Voice button is visible and clickable

### **2. Node.js API Health**
- Visit: http://localhost:3001/api/health
- Should see: `{"ok":true}`
- Check: No connection errors

### **3. Python STT Health**
- Visit: http://localhost:8001/docs
- Should see: FastAPI documentation page
- Check: Whisper model loaded successfully in terminal

### **4. Customer Database**
- Visit: http://localhost:3001/api/customers
- Should see: JSON array with 3 customers
- Check: Sarah, John, and Maria are listed

## 🎯 **Demo Best Practices**

### **Before Starting Demo**
1. ✅ Test microphone with a simple recording
2. ✅ Verify all 3 services are running
3. ✅ Have backup scenarios ready
4. ✅ Close unnecessary applications
5. ✅ Ensure stable internet connection

### **During Demo**
1. ✅ Speak clearly and at normal volume
2. ✅ Wait for system responses before continuing
3. ✅ Show different customers to demonstrate flexibility
4. ✅ Explain what's happening behind the scenes
5. ✅ Have the quick reference guide handy

### **If Demo Fails**
1. ✅ Stay calm and explain the technology
2. ✅ Use backup recorded examples if available
3. ✅ Switch to manual customer selection if voice fails
4. ✅ Highlight the successful parts that did work
5. ✅ Address questions about real-world implementation

## 📞 **Emergency Backup Plan**

If voice recognition completely fails during demo:

1. **Explain the concept** using the documentation
2. **Show the interface** and explain each component
3. **Demonstrate customer data** via browser dev tools
4. **Walk through the architecture** (STT → AI → Response)
5. **Discuss business benefits** and use cases

## 🔧 **Technical Architecture Overview**

For technical audiences, explain:

1. **Speech-to-Text**: OpenAI Whisper (local processing)
2. **AI Processing**: OpenRouter with Mistral AI
3. **Customer Database**: JSON-based simulation
4. **Frontend**: React with real-time voice recording
5. **Backend**: Node.js Express API + Python FastAPI

## 📈 **Success Metrics**

A successful demo should show:
- ✅ Voice recognition working consistently
- ✅ Customer identification in 1-2 attempts
- ✅ Accurate account information retrieval
- ✅ Natural conversation flow
- ✅ Professional telecommunications responses

---
**💡 Remember**: Even if technical issues occur, the concept and business value are what matter most to your audience!

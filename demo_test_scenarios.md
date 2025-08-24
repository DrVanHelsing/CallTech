# Voice AI Telecommunications Demo - Sample Prompt Flow

## 🎯 **Complete Test Scenarios** (Now with Voice Responses!)

### **Scenario 1: New Customer Call - Account Balance Inquiry**
```
👤 User: "My name is Sarah" (User speaks)
🤖 AI: "Hello Sarah Johnson! I've accessed your account. How can I help you today?" (AI speaks back)

👤 User: "What's my current balance?" (User speaks)
🤖 AI: "Your current balance is $89.99. Your next bill is due on March 15, 2024. Would you like me to explain any charges or help with payment options?" (AI speaks response)

👤 User: "When was my last payment?" (User speaks)
🤖 AI: "Your last payment was on February 15, 2024. You're set up with auto-pay using your credit card. Is there anything specific about your billing you'd like me to review?" (AI speaks response)
```

### **Scenario 2: Full Voice Conversation - Technical Support**
```
👤 User: "I'm John" (User speaks)
🤖 AI: "Hello John Doe! I've accessed your account. How can I help you today?" (AI speaks)

👤 User: "My internet is really slow today" (User speaks)
🤖 AI: "I'm sorry to hear you're experiencing slow internet speeds. I can see you have our Basic Internet plan with 100 Mbps. Let me help troubleshoot this. First, try unplugging your router for 30 seconds, then plug it back in. Have you noticed if the slowdown affects all devices or just specific ones?" (AI speaks detailed response)

👤 User: "It's affecting my laptop mostly" (User speaks)
🤖 AI: "That suggests it might be a device-specific issue rather than your internet connection. Try connecting to a different WiFi network temporarily, or restart your laptop's network adapter. If the issue persists, I can schedule a technical support appointment. Would you like me to check for any service outages in your area first?" (AI speaks solution)
```

## 🎭 **Voice Conversation Features**

### **🔊 Text-to-Speech (TTS) Features:**
- ✅ **Immediate Voice Response** - AI speaks every response
- ✅ **Professional Voice** - Uses system's best available voice
- ✅ **Optimal Speed** - Configured for clarity (0.9x speed)
- ✅ **Natural Interruption** - Voice stops when user starts recording
- ✅ **Visual Feedback** - Button shows speaking status with animation

### **💬 Conversation History:**
- ✅ **Real-time Chat Display** - Shows both user and AI messages
- ✅ **Message Bubbles** - User messages on right, AI on left
- ✅ **Conversation Memory** - Displays last 6 exchanges
- ✅ **Clear Function** - Reset conversation when switching topics

### **🎵 Audio States:**
- 🎤 **Ready** - Green microphone button
- 🔴 **Recording** - Red pulsing button with square icon
- ⚙️ **Processing** - Spinning loader animation
- 🔊 **AI Speaking** - Blue pulsing button with sound wave animation

## 🗣️ **Enhanced Demo Flow**

### **Step 1: Voice Greeting (30 seconds)**
1. User clicks microphone (or it can auto-start)
2. Says: "My name is Sarah"
3. **AI responds with voice**: "Hello Sarah Johnson! I've accessed your account..."
4. **Conversation appears** in chat-style bubbles

### **Step 2: Voice Q&A (45 seconds)**
1. User: "What's my current balance?"
2. **AI speaks**: "Your current balance is $89.99..."
3. **Shows conversation history** building up
4. User: "When is my next payment due?"
5. **AI speaks**: "Your next bill is due on March 15th..."

### **Step 3: Natural Conversation Flow (60 seconds)**
1. Demonstrate **interruption** - start recording while AI is speaking
2. Show **conversation history** with multiple exchanges
3. Test **different customer** - "Reset Customer" and try "I'm John"
4. **AI speaks welcome** for new customer with different account info

## 📱 **Conversational Interface Elements**

### **Voice Button States:**
- **🟢 Green (Ready)**: "Ready to listen - Say your name or last 4 digits"
- **🔴 Red (Recording)**: "Recording - Click to stop"  
- **🔵 Blue (Speaking)**: "AI Speaking - Please wait..."
- **⚪ Gray (Processing)**: "Processing query..."

### **Conversation Display:**
- **User messages**: Blue bubbles on the right
- **AI responses**: Gray bubbles on the left
- **Timestamps**: Visible on hover
- **Scroll**: Auto-scrolls to latest message
- **Clear button**: Reset conversation history

## 🎯 **New Demo Highlights**

### **🎙️ True Voice Conversation:**
- No typing or reading required
- Natural back-and-forth dialogue
- Professional AI voice responses
- Realistic customer service experience

### **🧠 Conversation Memory:**
- Chat history persists during session
- Context maintained across questions
- Visual conversation flow
- Easy to follow dialogue progression

### **⚡ Seamless Experience:**
- Voice stops automatically when user speaks
- No overlapping audio
- Smooth transitions between speaking and listening
- Professional call center experience

## 🛠️ **Technical Implementation**

### **Browser TTS Integration:**
- Uses Web Speech API `speechSynthesis`
- Configurable voice selection (prefers professional voices)
- Optimized speech rate and pitch
- Automatic speech cancellation

### **Conversation State Management:**
- Real-time message history
- User/AI message differentiation  
- Timestamp tracking
- Memory management (last 6 messages displayed)

### **Enhanced UX:**
- Visual speaking indicators
- Button state management
- Conversation scrolling
- Clear conversation functionality

---

**💡 This creates a truly conversational AI experience - users can have natural voice conversations with the telecommunications AI, just like calling a professional customer service center!**

### **Scenario 3: Service Upgrade Request**
```
👤 User: "My phone ends in 9876"
🤖 AI: "Hello Maria Rodriguez! I've accessed your account. How can I help you today?"

👤 User: "I want to upgrade my internet speed"
🤖 AI: "I'd be happy to help you upgrade! You currently have our Fiber Gigabit plan with 1000 Mbps. You're using 780GB out of your 1000GB monthly allowance. Are you looking for even faster speeds, or are you experiencing performance issues with your current plan?"

👤 User: "I need faster upload speeds for work"
🤖 AI: "Perfect! For work applications requiring faster uploads, I can offer you our Business Fiber Pro plan with symmetrical 2 Gig speeds - that's 2000 Mbps download AND upload. This would be $149.99/month, an increase of $25 from your current plan. The upgrade includes priority technical support. Would you like me to process this upgrade?"
```

### **Scenario 4: Billing Question and Payment**
```
👤 User: "This is Sarah Johnson"
🤖 AI: "Hello Sarah Johnson! I've accessed your account. How can I help you today?"

👤 User: "Why is my bill higher this month?"
🤖 AI: "Let me review your current bill of $89.99. This includes your Premium Internet + TV Bundle, and I can see you have Fiber 500 Mbps internet with Premium Cable Package. Compared to previous months, this appears to be your standard rate. Are you seeing a specific charge that looks unfamiliar, or has your usage increased recently?"

👤 User: "Can I set up automatic payments?"
🤖 AI: "I see you already have auto-pay set up with your credit card on file. Your payments are automatically processed on the 15th of each month. Would you like to change the payment date or update your payment method? I can also help you switch to bank account auto-pay for a $5 monthly discount."
```

### **Scenario 5: Service Outage and Support**
```
👤 User: "My name is John"
🤖 AI: "Hello John Doe! I've accessed your account. How can I help you today?"

👤 User: "My TV channels aren't working"
🤖 AI: "I'm sorry you're having trouble with your TV service. I can see you have our Basic Internet plan, and I notice you don't currently have TV service on your account. Are you trying to access streaming services through your internet connection, or are you interested in adding TV service to your plan?"

👤 User: "I want to add TV service"
🤖 AI: "Excellent! I can add TV service to your existing internet plan. Our most popular option would upgrade you to our Internet + TV Bundle for $79.99/month - that's only $30 more than your current $49.99 Basic Internet plan. This includes 200+ channels and premium streaming access. Would you like me to explain the channel lineup or process this upgrade?"
```

### **Scenario 6: Complex Customer Service**
```
👤 User: "My phone number ends in 5678"
🤖 AI: "Hello Sarah Johnson! I've accessed your account. How can I help you today?"

👤 User: "I've been having problems for weeks and nobody helps me"
🤖 AI: "I sincerely apologize for the ongoing issues you've experienced. I can see you've had 3 support tickets, with your last contact on February 10, 2024. Your satisfaction rating shows 4.5/5, but clearly we haven't resolved everything to your satisfaction. Let me prioritize getting this fixed for you. Can you tell me specifically what problems you're still experiencing?"

👤 User: "My internet keeps cutting out"
🤖 AI: "Intermittent connectivity issues can be very frustrating, especially when they persist. Given your history with this issue, I'd like to escalate this to our technical specialist team and schedule a priority service appointment. I can also offer you a service credit for the inconvenience. Would you prefer a technician visit tomorrow or would you like me to connect you directly with our advanced technical support team right now?"
```

## 🎭 **Quick Test Phrases**

### **Customer Identification:**
- "My name is Sarah"
- "I'm John Doe"  
- "My phone ends in 9876"
- "This is Maria"

### **Common Inquiries:**
- "What's my current balance?"
- "When is my next bill due?"
- "What plan am I on?"
- "How much data have I used?"
- "My internet is slow"
- "I want to upgrade my service"
- "Can you help me with my bill?"
- "I need technical support"

### **Service Requests:**
- "I want to add TV service"
- "Can I upgrade my internet speed?"
- "How do I set up automatic payments?"
- "I want to change my plan"
- "Can you schedule a service appointment?"

## 📊 **Expected AI Response Patterns**

### **Professional Greeting:**
- Always addresses customer by name after identification
- Confirms account access
- Asks how they can help

### **Account-Specific Information:**
- References actual customer data (plan, balance, usage)
- Provides specific dates and amounts
- Mentions payment methods and service history

### **Technical Support:**
- Provides basic troubleshooting steps
- Asks clarifying questions
- Offers escalation when appropriate

### **Service Changes:**
- Explains current services
- Provides pricing for upgrades
- Confirms changes before processing

### **Empathetic Responses:**
- Acknowledges customer frustration
- Apologizes for issues
- Offers solutions and escalation paths

## 🔧 **Testing Tips**

1. **Start with customer identification** - always begin with name or phone
2. **Test edge cases** - try unclear pronunciation or background noise
3. **Verify data accuracy** - ensure AI uses correct customer information
4. **Test conversational flow** - ask follow-up questions
5. **Try interruptions** - see how system handles corrections
6. **Test escalation triggers** - mention anger or dissatisfaction

## 🎯 **Success Metrics**

- ✅ **Customer Identified** correctly within 1-2 attempts
- ✅ **Account Information** provided accurately
- ✅ **Natural Conversation** flows smoothly
- ✅ **Technical Issues** handled with appropriate steps
- ✅ **Service Changes** explained clearly with pricing
- ✅ **Escalation Offered** when issues are complex

Use these scenarios to demonstrate the full capabilities of your telecommunications voice AI system!

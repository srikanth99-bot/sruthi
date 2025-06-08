# Backend API Setup for Razorpay

## Required APIs

### 1. Create Order API
**Endpoint:** `POST /api/razorpay/create-order`

```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency,
      receipt: receipt,
      notes: notes
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Verify Payment API
**Endpoint:** `POST /api/razorpay/verify-payment`

```javascript
const crypto = require('crypto');

app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    
    if (razorpay_signature === expectedSign) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Webhook Handler
**Endpoint:** `POST /api/razorpay/webhook`

```javascript
app.post('/api/razorpay/webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (webhookSignature === expectedSignature) {
      // Process webhook event
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      
      // Update payment status in your database
      console.log('Payment event:', event, paymentEntity);
      
      res.json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Environment Variables for Backend

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// پایگاه داده ساده در حافظه
let users = {};

// استفاده از Body Parser برای پردازش درخواست‌ها
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// مسیری برای متصل شدن به کیف پول
app.post('/wallet/connect', (req, res) => {
    const { wallet_address } = req.body;
    const username = req.query.username || 'Guest';

    if (!users[username]) {
        users[username] = { wallet_address, invites: 0, rewards: 0 };
    } else {
        users[username].wallet_address = wallet_address;
    }

    res.json({ success: true, wallet_address: wallet_address });
});

// مسیری برای پرداخت 400 HMSTR
app.post('/payment', (req, res) => {
    const { wallet_address, amount } = req.body;
    const username = req.query.username || 'Guest';

    if (amount !== 400) {
        return res.status(400).json({ error: 'Amount must be 400 HMSTR' });
    }

    if (!users[username]) {
        users[username] = { wallet_address, invites: 0, rewards: 0 };
    }

    // پرداخت موفقیت‌آمیز
    users[username].rewards += 400;
    res.json({ success: true, message: 'Payment successful!', rewards: users[username].rewards });
});

// مسیری برای دریافت پاداش
app.post('/rewards/withdraw', (req, res) => {
    const username = req.query.username || 'Guest';
    const user = users[username];

    if (!user || user.rewards <= 0) {
        return res.status(400).json({ error: 'No rewards available for withdrawal' });
    }

    // برداشت پاداش
    user.rewards = 0;
    res.json({ success: true, message: 'Rewards withdrawn successfully!' });
});

// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


const express = require('express');
const cors = require('cors');
const { rateLimiterMiddleware } = require('./middlewares/rateLimiterMiddleware');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT;

const corsOptions = {
	origin: ['http://localhost:3000', 'http://localhost:3001'],
	optionSuccessStatus: 200,
	credentials: true,
};

app.use(rateLimiterMiddleware);
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Late limiting API is live');
});

try {
    app.listen(port, () => {
        console.log(`Rate limiting server is running on port ${port}`);
    });
} catch (err) {
    process.exit(1);
}
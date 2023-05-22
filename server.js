const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const app = require('./app');

const port = process.env.PORT || 4008;
app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});

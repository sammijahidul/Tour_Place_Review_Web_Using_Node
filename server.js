const app = require('./app');

const port = 4008
app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`);
});

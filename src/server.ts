import app from './app';

const port = 3000;

app.listen(port, () => {
    console.log(`🟢 Server running! Access in http://localhost:${port}`);
});

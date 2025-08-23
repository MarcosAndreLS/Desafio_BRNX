import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

import app from './src/app.js';
import { assertEnv } from './src/config/env.js';

assertEnv();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Commi-Ecommerce corriendo en puerto ${PORT}`);
});

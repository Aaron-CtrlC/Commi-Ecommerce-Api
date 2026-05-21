import express from 'express';

import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Acá se montarán las rutas de los módulos:
// import productRoutes from './modules/product/product.route.js';
// import authRoutes from './modules/auth/auth.route.js';
// app.use(productRoutes);
// app.use(authRoutes);

app.use(errorHandler);

export default app;

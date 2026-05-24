import express from 'express';

import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js';
import categoryRoutes from './modules/category/category.route.js';
import userRoutes from './modules/user/user.route.js';
import productRoutes from './modules/product/product.route.js';

const app = express();
app.use(express.json());

app.use(categoryRoutes);
app.use(userRoutes);
app.use(productRoutes);

app.use(errorHandler);

export default app;

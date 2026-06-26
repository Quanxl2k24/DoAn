import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import phimRoutes from './routes/phimRoutes';
import rapRoutes from './routes/rapRoutes';
import phongRoutes from './routes/phongRoutes';
import suatChieuRoutes from './routes/suatChieuRoutes';
import gheRoutes from './routes/gheRoutes';
import loaiGheRoutes from './routes/loaiGheRoutes';
import datVeRoutes from './routes/datVeRoutes';
import adminRoutes from './routes/adminRoutes';
import ngayLeRoutes from './routes/ngayLeRoutes';

const app = express();

app.use(cors({
  origin: true, // Cho phép tất cả các origin gửi request (quan trọng khi dùng ngrok)
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/phims', phimRoutes);
app.use('/api/raps', rapRoutes);
app.use('/api/phongs', phongRoutes);
app.use('/api/suat-chieus', suatChieuRoutes);
app.use('/api/ghes', gheRoutes);
app.use('/api/loai-ghes', loaiGheRoutes);
app.use('/api/dat-ve', datVeRoutes);
app.use('/api/ngay-les', ngayLeRoutes);
app.use('/api/admin', adminRoutes);

export default app;
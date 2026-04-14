import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import galleryController from '../controllers/gallery.controller.js';

const galleryRouter = express.Router();

galleryRouter.use(authenticateUser);

galleryRouter.get('/', galleryController.getGalleryItems);
galleryRouter.post('/create', galleryController.addGalleryItem);
galleryRouter.delete('/delete/:id', galleryController.deleteGalleryItem);

export default galleryRouter;

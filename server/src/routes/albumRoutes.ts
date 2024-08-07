import { Router } from 'express';
import AlbumService from "../services/albumService";
import AlbumController from '../controllers/albumController';

const router = Router();
const albumService = new AlbumService();
const albumController = new AlbumController(albumService);

// Get all tracks for a specific album by its ID
router.get('/albums/details/:id/tracks', (req, res) => albumController.findTracksByAlbumId(req, res));

// Get a specific album by its ID
router.get('/albums/details/:id', (req, res) => albumController.findAlbumById(req, res));

// Get all albums
router.get('/albums', (req, res) => albumController.listAllAlbums(req, res));

// Get all albums with pagination
router.get('/albums/pages', albumController.getAllAlbumsWithPages);

// Get random 8 albums
router.get('/albums/random/:numOfAlbums', (req, res) => albumController.fetchRandomNAlbums(req, res));

// Fetch album image
router.get('/albums/details/:id/image', (req, res) => albumController.fetchAlbumImage(req, res));

export default router;

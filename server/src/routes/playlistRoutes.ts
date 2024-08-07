import { Router } from 'express';
import { PlaylistService } from "../services/playlistService";
import { PlaylistController } from '../controllers/playlistController';
import { AppDataSource } from '../db';
import { UserService } from '../services/userService';
import AuthController from '../controllers/authController';
import AuthService from '../services/authService';


const router = Router();
const playlistService = new PlaylistService(AppDataSource, new UserService());
const playlistController = new PlaylistController(playlistService);

const authService = new AuthService();
const userService = new UserService();
const authController = new AuthController(userService, authService);

router.post('/playlists/generate', (req, res) => playlistController.generatePlaylistBasedOnTrack(req, res));
// router.put('/playlists/:playlistId/tracks', (req, res) => playlistController.addTracksToPlaylist(req, res));

// List all playlists
router.get('/all-playlists', playlistController.listAllPlaylists);
// Find playlists by user
router.get('/playlists/user/:userId', playlistController.findPlaylistsByUser);

router.get('/playlists', authController.authUser, playlistController.findPlaylistsForUser);
// Create playlist for user
router.post('/playlists', authController.authUser, playlistController.createPlaylistForUser);
// Add track to playlist
router.post('/playlists/track', authController.authUser, playlistController.addTrackToPlaylist);


router.get('/playlists/:id', playlistController.findPlaylistById);


export default router;

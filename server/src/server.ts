//import router from "./routes";
import { Pool, QueryResult } from "pg";
import AuthService from "./Service/authService";
import UserService from "./Service/userService";
import AuthController from "./Controller/authController";
import UserController from "./Controller/userController";
import AlbumService from "./Service/albumService";
import TrackService from "./Service/trackService";
import AlbumController from "./Controller/albumController";
import TrackController from "./Controller/trackController";
import {test} from "./Utils/musicBrainz";

const express = require("express");
const cors = require("cors");
const config = require("./config");
// const routes = require('./routes');

// 创建连接池
const pool = new Pool({
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
});

// 创建服务
const authService = new AuthService(pool);
const userService = new UserService(pool);
const albumService = new AlbumService(pool);
const trackService = new TrackService(pool);

// 创建控制器
const auth = new AuthController(userService, authService);
const user = new UserController(userService);
const album = new AlbumController(albumService);
const track = new TrackController(trackService);

const app = express();

app.use(
    cors({
        origin: "*", // 允许所有前端域名
    })
);

// 设置路由
const router = express.Router();
// router.get('/user/:id', user.getUserById);
// router.get('/user/byName/:name', user.getUserByName);
// router.post('/user', user.registerUser);
// router.get('/test', user.test);
// router.post('/login', auth.loginUser);

// 用户登录逻辑
router.get("/user/:id", (req: any, res: any) => user.getUserById(req, res));
router.get("/user/byName/:name", (req: any, res: any) =>
    user.getUserByName(req, res)
);
router.post("/user", (req: any, res: any) => user.registerUser(req, res));
router.get("/test", (req: any, res: any) => user.test(req, res));

router.post("/login", (req: any, res: any) => auth.loginUser(req, res));

// 专辑查询
router.get("/album/:id", (req: any, res: any) => album.getTracks(req, res));
// 歌曲查询
router.get("/track/:id", (req: any, res: any) => user.getUserByName(req, res));


app.use(express.json());
app.use("/api", router);


test();

app.listen(config.server_port, () => {
    console.log(
        `Server running at http://${config.server_host}:${config.server_port}/`
    );
});

module.exports = app;

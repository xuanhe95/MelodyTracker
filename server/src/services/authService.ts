import { Pool, QueryResult } from "pg";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const privateKey = process.env.privateKey || 'private';

class AuthService {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
    }

    // 用户登录
    loginUser = async (req: Request, res: Response): Promise<string | null> => {
        const { username, password } = req.body;
        const sql = "SELECT * FROM users WHERE username = $1";
        const result: QueryResult = await this.pool.query(sql, [username]);
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ message: "用户名不存在" });
            return null;
        }

        if (user.password !== password) {
            res.status(401).json({ message: "用户名或密码错误" });
            return null;
        } else {
            const token = this.generateToken({ username });
            return token;
        }
    };

    // 用户验证
    verifyToken = (token: string): JwtPayload | null => {
        try {
            return jwt.verify(token, privateKey) as JwtPayload;
        } catch (err) {
            return null;
        }
    };
    
    // 生成token
    generateToken = (payload: any): string => {
        return jwt.sign(payload, privateKey, { expiresIn: "1h" });
    };
}

export default AuthService;

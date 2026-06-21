import { type Request , type  Response , type NextFunction} from 'express'
import { createClient } from '@supabase/supabase-js';




export async function AuthMiddlware(req: Request, res: Response, next: NextFunction): Promise<void> {

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
        res.status(400).json({
            error: "Bad request"
        })
        return;
    }
    const client = createClient(url, key);

    if (client !== undefined && client !== null){
            const authHeader = req.headers.authorization;
            if (!authHeader) {
            res.status(401).json({ error: "Unauthorized request. Missing authorization token." });
            return;
            }
            const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
            const {error} = await client.auth.getUser(jwt);


            if (error){
                console.log("Auth middleware validation failed: " + error.message);
                res.status(401).json({
                error: "Unauthorized request."
            })
        }
        else{
            next();
        }
    }
    else{
        res.status(401).json({
            error: "Unauthorized request."
        })
    }
}
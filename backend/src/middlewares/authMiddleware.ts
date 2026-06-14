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
        const jwt = req.headers.authorization;
        const {data, error} = await client.auth.getUser(jwt);


            if (error){
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
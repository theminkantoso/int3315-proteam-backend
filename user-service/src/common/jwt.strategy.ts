import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// type JwtPayload = {
//     id: string;
//     email: string;
//     role: number;
//   };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor () {
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
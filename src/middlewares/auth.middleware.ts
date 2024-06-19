import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
    private url = 'http://localhost:3001/users/can-do';

    constructor(private permissionId: number) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest();
            const token = request.headers.authorization;

            if (!token) {
                throw new UnauthorizedException("El token no existe");
            }

            const response = await axios.get(`${this.url}/${this.permissionId}`, {
                headers: {
                    Authorization: token,
                },
            });

            // Aquí podrías agregar lógica adicional para procesar la respuesta
            // Ejemplo: if (response.data.allowed) { return true; } else { throw new UnauthorizedException(); }
            return true;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException(error?.message);
        }
    }
}
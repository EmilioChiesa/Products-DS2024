//Importamos las dependencias necesarias
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
    // URL del servicio que valida si el usuario tiene permisos
    private url = 'http://localhost:3001/users/can-do';

    constructor(private permissionId: number) {} // ID del permiso que se va a validar (Lo defino en cada guardia que cree)
 
    async canActivate(context: ExecutionContext): Promise<boolean> { // Método que se ejecuta antes de cada petición
        try {
            const request: Request = context.switchToHttp().getRequest(); // Obtenemos la petición
            const token = request.headers.authorization; // Obtenemos el token del header

            if (!token) { // Si no hay token, muestro una excepción
                throw new UnauthorizedException("El token no existe");
            }
            // Hago una petición al servicio que valida si el usuario tiene permisos
            const response = await axios.get(`${this.url}/${this.permissionId}`, { // Agrego el ID del permiso del guard
                headers: {
                    Authorization: token, // Envío el token en el header
                },
            });

            return true; // Si la petición fue exitosa, retorno true
        } catch (error) { // Si ocurre un error, muestro una excepción
            console.error(error);
            throw new UnauthorizedException(error?.message);
        }
    }
}
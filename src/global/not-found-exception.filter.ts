import * as path from 'path';
import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
     catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
         response.redirect('/404'); // Redirect to localhost:3003/404 whenever there's a page not found exception
        
        
    }
} 
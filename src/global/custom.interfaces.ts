import { FastifyReply, FastifyRequest } from 'fastify';


export interface Reply extends FastifyReply{
    view(page: string, data?: object): FastifyReply
  }
  

/**
 * Created this to deal with an error where the js compiled output could not find the inbuilt Request interface. 
 * Enabled implicit import of Request interface to user.controller.tsx 
 */
export interface customRequest extends Request{
  
} 



  
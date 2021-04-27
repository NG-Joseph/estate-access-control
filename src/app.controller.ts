import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';




import { Reply } from './global/custom.interfaces';


import renderEngine from './global/render.engine';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get()
  home(@Res() reply: Reply){

    reply.view('home.html', {nextUrl: '/next'})


    
  }  
  
}

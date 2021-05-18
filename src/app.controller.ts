import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';




import { Reply } from './global/custom.interfaces';






@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get()
  home(@Res() reply: Reply){

    reply.view('home.html', {Image: 'This is a link to an imaginary image'})  
    /* reply.view() allows you to pass data as props (similar to React props) into html pages.
     * They can be used in the html pages with a double curly brace {{}} e.g <img src="{{Image}}"> */


    
  }  
  
}

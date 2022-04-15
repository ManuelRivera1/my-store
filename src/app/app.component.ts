import { Component, OnInit} from '@angular/core';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  template:'<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-store';
  imgParent = '';
  showImg = true;
  token = '';
  imgRta = '';
  constructor(
    private authService : AuthService,
    private tokenService : TokenService,
    private usersService : UsersService,
    private filesService : FilesService,
  ){}
  ngOnInit(){
    const token = this.tokenService.getToken();
    if(token){
      this.authService.getProfile().subscribe();
    }
  }
  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }
  createUser() {
    this.usersService.create({
      name: 'Admin',
      email: 'admin@hmail.com',
      password: '12345',
      role: 'admin',
    })
    .subscribe(rta => {
      console.log(rta);
    });
  }
  download() {
    this.filesService.getFile('mys.pdf', 'https://damp-spire-59848.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }
  onUpload(event : Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      });
    }
  }
}

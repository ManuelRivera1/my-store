import { Component, OnInit } from '@angular/core';

import { OnExit } from './../../../guards/exit.guard'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnExit {

  constructor() { }

  ngOnInit(): void {
  }

  onExit(){
    const rta = confirm('LOgica desde copm, esta seguro de salir');
    return rta;
  }

}

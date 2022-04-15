import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighLight]'
})
export class HighLightDirective {
  @HostListener('mouseenter') onMouseEnter(){
    this.element.nativeElement.style.backgroundColor = 'red'
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.element.nativeElement.style.backgroundColor = ''
  }

  constructor( private element:ElementRef) {
   }

}

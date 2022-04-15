import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { CustomPreloadService } from './services/custom-preload.service';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule),
    data: {
      preload:true,
    }
  },
  {
    path: 'cms',
    canActivate: [AdminGuard],
    loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule)
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    //preloadingStrategy: PreloadAllModules //precargar moduls mientras carga solo cuando no tiene muchos modulos
    //preloadingStrategy: CustomPreloadService //precargar moduls segun el services custom-preload-service
    preloadingStrategy: QuicklinkStrategy //precargar moduls pero se debe agregar en cada moduls que se necesite en imports QuicklinkModule
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

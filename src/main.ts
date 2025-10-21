import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// ✅ Aqui combinamos as configurações do appConfig com os providers adicionais
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(), // Importante para HttpClient funcionar
    provideAnimations()
  ]
}).catch(err => console.error(err));

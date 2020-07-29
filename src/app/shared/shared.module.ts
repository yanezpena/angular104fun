import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '../components/components.module';

@NgModule({
	declarations: [HeaderComponent, FooterComponent, SidebarComponent],
	imports: [CommonModule, MaterialModule, TranslateModule, ComponentModule],
	exports: [HeaderComponent, FooterComponent, SidebarComponent],
})
export class SharedModule {}

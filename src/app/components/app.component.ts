import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SpotifyService } from '../services/spotify/spotify.service';
import { CookieService } from 'ngx-cookie-service';
import { MatIconRegistry } from '@angular/material/icon';
import { DialogService } from '../services/dialog/dialog.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { Option } from '../models/option.interface';
import { ContextMenuService } from '../services/context-menu/context-menu.service';
import { DateAdapter } from '@angular/material/core';
import { ResizeService } from '../services/resize-service/resize.service';

@Component({
  selector : 'app-root',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.scss' ],
  providers : [
    SpotifyService,
    CookieService,
    DialogService,
    ContextMenuService
  ]
})
export class AppComponent implements OnInit {

  @ViewChild('content', { read : ViewContainerRef }) entry: ViewContainerRef;
  title = 'Tunefy';
  componentRef: any;

  private _contextMenuOptions = [];
  private _hasOptionsUpdated = false;

  constructor(iconRegistry: MatIconRegistry,
              private _resolver: ComponentFactoryResolver,
              private _contextMenuService: ContextMenuService,
              private _dateAdapter: DateAdapter<Date>,
              private _resizeService: ResizeService) {
    this._dateAdapter.setLocale('pl');
    iconRegistry.registerFontClassAlias('devices', 'icon-tunefy-devices');
    iconRegistry.registerFontClassAlias('lyrics', 'icon-tunefy-lyrics');
  }

  ngOnInit(): void {
    this._contextMenuService.hasOptionsUpdated().subscribe((options: Option[]) => {
      this._contextMenuOptions = options;
      this._hasOptionsUpdated = true;
    });
    this.onResize();
    this._contextMenuService.shouldCloseContextMenu().subscribe(this.destroyContextMenu.bind(this));
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.createComponent(event);
  }

  onResize(): void {
    const size = {
      width : window.innerWidth,
      height : window.innerHeight
    };
    this._resizeService.updateSize(size);
  }

  private createComponent(event: MouseEvent): void {
    if (this._contextMenuOptions.length > 0 && this._hasOptionsUpdated) {
      this.entry.clear();
      this.destroyContextMenu();
      const factory = this._resolver.resolveComponentFactory(ContextMenuComponent);
      this.componentRef = this.entry.createComponent(factory);
      this.componentRef.instance.options = this._contextMenuOptions;
      this.componentRef.instance.event = event;
      this._hasOptionsUpdated = false;
    }
  }

  private destroyContextMenu(): void {
    this.componentRef?.destroy();
  }

}

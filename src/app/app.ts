import { Component, inject, Injector, afterNextRender } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  private injector = inject(Injector);
  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() =>
        afterNextRender(
          () => {
            const heading = document.querySelector<HTMLElement>('main h1');
            if (heading) {
              heading.setAttribute('tabindex', '-1');
              heading.focus({ preventScroll: true });
              document.title = heading.textContent + ' · AutoAndes';
            }
          },
          { injector: this.injector },
        ),
      );
  }
}

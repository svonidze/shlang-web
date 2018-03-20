import { InputService } from './services/input.service';
import { TestBed, async } from '@angular/core/testing';

import { InputComponent } from './components/input.component';
import { WordListComponent } from './components/word-list.component';

describe('InputComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent, WordListComponent],
      providers: [InputService]
    }).compileComponents();
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(InputComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  // }));
});

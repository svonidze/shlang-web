import { ChromeExtentionTestPage } from './app.po';

describe('chrome-extention-test App', () => {
  let page: ChromeExtentionTestPage;

  beforeEach(() => {
    page = new ChromeExtentionTestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

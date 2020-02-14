import { TestBed, inject } from '@angular/core/testing';

import { MenuSetupService } from './menu-setup.service';

describe('MenuSetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuSetupService]
    });
  });

  it('should be created', inject([MenuSetupService], (service: MenuSetupService) => {
    expect(service).toBeTruthy();
  }));
});

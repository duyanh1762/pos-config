import { TestBed } from '@angular/core/testing';

import { IsWareHouseGuard } from './is-ware-house.guard';

describe('IsWareHouseGuard', () => {
  let guard: IsWareHouseGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsWareHouseGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

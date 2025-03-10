import { TestBed } from '@angular/core/testing';

import { DatetimePickerLibService } from './datetime-picker-lib.service';

describe('DatetimePickerLibService', () => {
  let service: DatetimePickerLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatetimePickerLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

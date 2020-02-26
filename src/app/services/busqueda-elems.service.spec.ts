import { TestBed, inject } from '@angular/core/testing';

import { BusquedaElemsService } from './busqueda-elems.service';

describe('BusquedaElemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusquedaElemsService]
    });
  });

  it('should be created', inject([BusquedaElemsService], (service: BusquedaElemsService) => {
    expect(service).toBeTruthy();
  }));
});

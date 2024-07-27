import {ApiService} from "./api.service";
import {TestBed} from "@angular/core/testing";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";

describe('ApiService', () => {
  let service: ApiService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClientTesting()]
    })
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  it('should retrieve dashboard data', () => {
      service.getDashboard()
        .subscribe(data => {
          expect(data).withContext('No data returned');
        })
  })
})

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Income, IncomeList, MonthlyIncome } from '../finance/income/income.data';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private SRC_URL = 'http://127.0.0.1:8000';


    constructor(private http: HttpClient) {}

    getIncome(): Observable<Income[]> {
        return this.http.get<Income[]>(`${this.SRC_URL}/income`).pipe(
            map((response: any) => {
                return response.map((item: any) => ({
                category: item.category,
                amount: item.amount,
                date: item.date,
                year: item.year,
                month: item.month,
                month_text: item.month_text,
                target_month: item.target_month,
                target_month_text: item.target_month_text,
                notes: item.notes
                }));
            })
        );
    }

    addIncome(payload: any): Observable<Object> {
        return this.http.post(`${this.SRC_URL}/income`, payload)
    }

}
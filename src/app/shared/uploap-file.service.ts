import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient) {}

  public uploadFile(file: File): Observable<Response> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>('/api/v1/image-upload', formData);
  }
}
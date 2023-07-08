import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageUploadSuccessfullDto } from './image-upload.dto';
import { backendHost } from '../config/config';

const uploadImageUrl = backendHost + '/image-upload';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadImage(image: File): Observable<ImageUploadSuccessfullDto> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<ImageUploadSuccessfullDto>(uploadImageUrl, formData);
  }
}

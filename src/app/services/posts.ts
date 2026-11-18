import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostsServicio {
  private readonly url = 'https://jsonplaceholder.typicode.com/posts';
  private readonly http = inject(HttpClient);

  obtenerPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  crearPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.url, post);
  }

  actualizarPost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.url}/${id}`, post);
  }

  eliminarPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
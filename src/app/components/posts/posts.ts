import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostsServicio } from '../../services/posts';
import { Auth } from '../../services/auth';
import { Post as PostModel } from '../../models/post';

@Component({
  imports: [FormsModule],
  selector: 'app-post',
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Post implements OnInit {
  private servicio = inject(PostsServicio);
  private auth = inject(Auth);
  private router = inject(Router);

  posts = signal<PostModel[]>([]);
  titulo = '';
  cuerpo = '';
  postEditandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.servicio.obtenerPosts().subscribe({
      next: (datos) => this.posts.set(datos.slice(0, 15)),
    });
  }

  guardarPost(): void {
    if (!this.titulo.trim() || !this.cuerpo.trim()) return;

    const idEditar = this.postEditandoId();

    if (idEditar) {
      this.servicio.actualizarPost(idEditar, { title: this.titulo, body: this.cuerpo }).subscribe({
        next: () => {
          this.posts.update((lista) =>
            lista.map((p) => (p.id === idEditar ? { ...p, title: this.titulo, body: this.cuerpo } : p))
          );
          this.limpiarFormulario();
        },
      });
    } else {
      const nuevo = { title: this.titulo, body: this.cuerpo, userId: 1 };
      this.servicio.crearPost(nuevo).subscribe({
        next: (res) => {
          const postCreado = { ...res, id: Date.now() };
          this.posts.update((lista) => [postCreado, ...lista]);
          this.limpiarFormulario();
        },
      });
    }
  }

  prepararEdicion(post: PostModel): void {
    this.postEditandoId.set(post.id);
    this.titulo = post.title;
    this.cuerpo = post.body;
  }

  eliminar(id: number): void {
    this.servicio.eliminarPost(id).subscribe({
      next: () => {
        this.posts.update((lista) => lista.filter((p) => p.id !== id));
      },
    });
  }

  limpiarFormulario(): void {
    this.titulo = '';
    this.cuerpo = '';
    this.postEditandoId.set(null);
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
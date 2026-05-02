import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '@app/shared/models/player.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements AfterViewInit, OnInit {
  @Input() player!: Player; 
  @Output() cerrarModal = new EventEmitter<void>();

  @ViewChild('miVideo') videoRef!: ElementRef<HTMLVideoElement>;

  private sanitizer = inject(DomSanitizer);
  
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  isWaiting = true;
  safeVideoUrl!: SafeResourceUrl;

  ngOnInit() {
    if (this.player && this.player.videoUrl) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.player.videoUrl);
    }
  }

  ngAfterViewInit() {

    const video = this.videoRef.nativeElement;

    video.oncanplay = () => this.isWaiting = false;
    video.onwaiting = () => this.isWaiting = true;
    video.onplaying = () => this.isWaiting = false;
    video.onloadedmetadata = () => this.duration = video.duration;
    video.ontimeupdate = () => this.currentTime = video.currentTime;

    video.oncanplay = () => {
      video.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.warn("Autoplay blocked:", error);
      });
      video.oncanplay = null;
    };
  }

  togglePlay() {
    const video = this.videoRef.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  stopVideo() {
    const video = this.videoRef.nativeElement;
    video.pause();
    video.currentTime = 0;
    this.isPlaying = false;
  }

  cambiarVolumen(event: any) {
    this.videoRef.nativeElement.volume = event.target.value / 100;
  }

  seekVideo(event: any) {
    const video = this.videoRef.nativeElement;
    video.currentTime = event.target.value;
  }

  toggleFullScreen() {
    const video = this.videoRef.nativeElement;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen();
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  notificarCierre() {
    this.stopVideo(); 
    this.cerrarModal.emit();
  }
}
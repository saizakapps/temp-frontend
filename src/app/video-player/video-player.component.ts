import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  videoUrl: any;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.videoUrl = params['url'];
    });
  }

  ngOnInit(): void {

  }

}

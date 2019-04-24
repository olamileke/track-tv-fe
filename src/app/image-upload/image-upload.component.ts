import { Component, OnInit, EventEmitter , Output, ViewChild, Renderer2 } from '@angular/core';

import { UserService } from '../user.service';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  imgsrc:string;

  name:string;

  imgSelected:boolean=false;

  imgLoader:boolean=false;

  image:any;

  interval:any;

  trackFile:any;

  sessionStorage:boolean;

  @ViewChild('fileupload') fileupload;

  @ViewChild('info') info;

  @ViewChild('buttons') buttons;

  @Output() closeImgUpload=new EventEmitter();

  constructor(private userservice:UserService, private renderer:Renderer2, private config:ConfigService) { }

  ngOnInit() {

    this.imgsrc=this.config.profileImage;

    this.name=JSON.parse(sessionStorage.profile).name === null ? JSON.parse(localStorage.profile).name.split(' ')[1] : JSON.parse(sessionStorage.profile).name.split(' ')[1];  	

  	this.sessionStorage=sessionStorage.profile !== null ? this.sessionStorage=true : this.sessionStorage=false;

  }


  openDialog() {

  	this.fileupload.nativeElement.click();
  }


  imageSelect(event:any) {

  	if(event.files.length > 0) {

  		this.image=event.files[0];

  		this.imgSelected=true;
  	}
  }

  // UPLOADING THE SELECTED IMAGE

  upload() {

  	const formData=new FormData;

    this.createInterval();

  	formData.append('image', this.image);

    formData.append('imagesize', this.image.size);

  	this.userservice.uploadImage(formData).subscribe(res => { 

          const resKeys=Object.keys(res);

          if(resKeys.indexOf('status') !== -1) {

            this.trackFile=res;

            this.imgLoader=true;

            this.renderer.addClass(this.info.nativeElement, 'uploaded');

            this.imgSelected=false;
          }

          // SETTING THE NEW PROFILE IMAGE PATH IN THE BROWSER IF IT IS SUCCESSFUL AND CLOSING THE 
          // THE IMAGE UPLOAD COMPONENT

          if(resKeys.indexOf('data') !== -1) {

            this.imgsrc=res.data;

            this.renderer.addClass(this.buttons.nativeElement, 'uploaded');

             if(this.sessionStorage) {

                sessionStorage.profileImage=this.imgsrc;
              }
              else {

                localStorage.profileImage=this.imgsrc;
              }

            setTimeout(() => {

                this.closeImgUpload.emit(this.imgsrc);
            },2500)
          }

      });
  }


  createInterval() {

     this.interval=setInterval(() => {
      
        if(this.userservice.errorupload) {

          this.imgLoader=false;

          this.userservice.errorupload=false;

          this.imgSelected=true;

          clearInterval(this.interval);
        }
    },1000)
  }

}

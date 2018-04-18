new Vue({
  el: "#app",
  data(){
    return {
      position: {
          latitude: null,
          longitude: null,
      },
      picture: null
    }
  },
  mounted(){
      this.initializeMedia();
      this.initializeLocation();
  },
  methods: {
      getLocation() {
          var vm = this;
          if (!('geolocation' in navigator)) {
              return;
          }

          this.$refs.locationBtn.style.display = 'none';
          this.$refs.locationLoader.style.display = 'block';

          navigator.geolocation.getCurrentPosition(function (position) {    //vm.showPosition);  // {
              vm.$refs.locationBtn.style.display = 'inline';
              vm.$refs.locationLoader.style.display = 'none';
              vm.position.latitude = position.coords.latitude;
              vm.position.longitude = position.coords.longitude;
             }, function (err) {
              console.log(err);
              vm.$refs.locationBtn.style.display = 'inline';
              vm.$refs.locationLoader.style.display = 'none';
              alert('Couldn\'t fetch location, please enter manually!');
              vm.fetchedLocation = {lat: null, lng: null};
          }, {timeout: 7000});

      },
      initializeLocation() {
          if (!('geolocation' in navigator)) {
              this.$refs.locationBtn.style.display = 'none';
          }
      },
      initializeMedia() {
          var vm = this;
          if (!('mediaDevices' in navigator)) {
              navigator.mediaDevices = {};
          }

          if (!('getUserMedia' in navigator.mediaDevices)) {
              navigator.mediaDevices.getUserMedia = function (constraints) {
                  var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                  if (!getUserMedia) {
                      return Promise.reject(new Error('getUserMedia is not implemented!'));
                  }

                  return new Promise(function (resolve, reject) {
                      getUserMedia.call(navigator, constraints, resolve, reject);
                  });
              }
          }
          navigator.mediaDevices.getUserMedia({video: true})
              .then(function (stream) {
                  vm.$refs.videoPlayer.srcObject = stream;
                  vm.$refs.videoPlayer.style.display = 'block';
                  vm.$refs.imagePickerArea.style.display = 'none';
              })
              .catch(function (err) {
                  vm.$refs.imagePickerArea.style.display = 'block';
              });
      },
      startVideo() {
          this.initializeMedia();
          this.initializeLocation();
      },
      captureImage() {
          var vm = this;
          vm.$refs.canvasElement.style.display = 'block';
          vm.$refs.videoPlayer.style.display = 'none';
          vm.$refs.captureBtn.style.display = 'none';
         // vm.$refs.initBtn.style.display = 'none';
          vm.$refs.locationLoader.style.display = 'none';
          var context = vm.$refs.canvasElement.getContext('2d');
          context.drawImage(vm.$refs.videoPlayer, 0, 0, canvas.width, vm.$refs.videoPlayer.videoHeight / (vm.$refs.videoPlayer.videoWidth / canvas.width));
          vm.$refs.videoPlayer.srcObject.getVideoTracks().forEach(function (track) {
              track.stop();
          });
          vm.picture = vm.dataURItoBlob(vm.$refs.canvasElement.toDataURL());
          console.log(this.picture);
      },
      closeVideoPlayer() {
          var vm = this;
          vm.$refs.imagePickerArea.style.display = 'none';
          vm.$refs.videoPlayer.style.display = 'none';
          vm.$refs.canvasElement.style.display = 'none';
      },
      dataURItoBlob(dataURI) {
          var byteString = atob(dataURI.split(',')[1]);
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          var blob = new Blob([ab], {type: mimeString});
          return blob;
      }
  }
});

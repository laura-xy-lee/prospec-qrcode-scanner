var app = new Vue({
    el: '#app',
    data: {
        scanner: null,
        activeCameraId: null,
        cameras: [],
        scans: []
    },
    mounted: function () {
        var self = this;
        self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
        self.scanner.addListener('scan', function (content, image) {
            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            function showTime() {
                var today = new Date();
                var h = today.getHours();
                var m = today.getMinutes();
                var s = today.getSeconds();
                // add a zero in front of numbers<10
                m = checkTime(m);
                s = checkTime(s);
                return h + ":" + m + ":" + s;
            }
            var obj = JSON.parse(content);
            if (obj.password == "XK`Y3$yda/<ffVt") {
                var content = "[" + showTime() + "] Hello " + obj.name
            } else {
                var content = "[" + showTime() + "] Bad password"
            }
            self.scans.unshift({ date: +(Date.now()), content: content});

            // Post employee scanned data to DB
            var scanStatus = document.getElementById('scan-status');
            axios.post('/scan', {
                timestamp: Date.now(),
                employeeId: obj.employeeid,
                password: obj.password
            })
            .then(function (response) {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            self.cameras = cameras;
            if (cameras.length > 0) {
                self.activeCameraId = cameras[0].id;
                self.scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    },
    methods: {
        formatName: function (name) {
            return name || '(unknown)';
        },
        selectCamera: function (camera) {
            this.activeCameraId = camera.id;
            this.scanner.start(camera);
        }
    }
});

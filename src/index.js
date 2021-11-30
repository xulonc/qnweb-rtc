import VConsole from 'vconsole';
import QNRTC, { QNLogLevel } from "qnweb-rtc";
const vConsole = new VConsole();

const mClient = QNRTC.createClient();

let tracks = [];

mClient.on('connection-state-changed', function (connectionState) {
    console.warn('connection-state-changed', connectionState);
});

mClient.on('user-joined', function (user) {
    console.warn('user-joined用户加入', user);
});

mClient.on('user-left', function (user) {
    console.warn('user-left', user);
});

//第二个参数回调(QNRemoteAudioTrack | QNRemoteVideoTrack)[] ，表示这是一个数组，里面的类型可以是QNRemoteAudioTrack
// 也可以是QNRemoteVideoTrack
mClient.on('user-published', async function (userId, tracks) {//
    console.warn('user-published有流发布', userId, tracks)
    const { videoTracks, audioTracks } = await mClient.subscribe(tracks)
    videoTracks.forEach(it => {
        it.play(document.getElementById("container"))
    })
    audioTracks.forEach(it => {
        it.play(document.getElementById("container"))
    })

});
mClient.on('user-unpublished', async function (userId, track) {
    console.warn('user-unpublished有有取消', userId, track);


});
window.loginRoom = async function () {
    let roomid = document.getElementById("roomid").value;
    let userid = document.getElementById("userid").value;
    console.warn(roomid, userid)
    if (roomid && userid) {
        fetch(`https://www.koafun.com/qiniu/getroomtoken?roomid=${roomid}&userid=${userid}`)
            .then(res => {
                return res.text();
            })
            .then(async (token) => {
                //登陆房间
                console.warn("token", token)
                let result = await mClient.join(token);
                console.warn("登陆result", result)
            })
            .catch(error => {
                console.warn("fetch error", error)
            })
    }
}

window.publishStream = async function () {

    // let canvas = await canvasTrack();
    // let audio = await audioTrack();
    // tracks.concat(canvas,audio);

    let microCameraTracks = await microPhoneAndCameraTracks();
    let result = await mClient.publish(tracks.concat(microCameraTracks));
    console.warn("推流", result)

}
window.leaveRoom = async function () {
    let result = await mClient.leave();
    console.warn("退出", result)
}
window.audioTrack = async function () {
    let track = null
    try {
        track = await QNRTC.createMicrophoneAudioTrack({
            encoderConfig: {
                sampleRate: 16000, // 采样率
                stereo: true // 使用双声道
            }
        });
    } catch (error) {
        conson.warn("音频流errror", error)
    }
    if (track) {
        return track;
    }
}
window.microPhoneAndCameraTracks = async function () {
    let audioVideoTracks = null;//返回数组[音频track，视频track]
    try {
        audioVideoTracks = await QNRTC.createMicrophoneAndCameraTracks()
    } catch (error) {
        console.warn('麦克风和相机流', error)
    }
    if (audioVideoTracks) {
        return audioVideoTracks;
    }

}
window.canvasTrack = async function () {
    let track = null;
    try {
        track = await QNRTC.createCanvasVideoTrack({
            width: 200, // 画布宽
            height: 200, // 画布高
            sources: [
                {
                    source: "http://pili-playback.qnsdk.com/ivs_background_1280x720.png",
                    x: 0, // 图片所处画布的左上角坐标 x
                    y: 0, // 图片所处画布的左上角坐标 y
                    width: 100, // 图片占据的宽度
                    height: 100 // 图片占据的高度
                },
                {
                    source: "http://pili-playback.qnsdk.com/ivs_background_1280x720.png",
                    x: 100,
                    y: 100,
                    width: 100,
                    height: 100
                }
            ],
            tag: "canvas-track"
        });
    } catch (error) {
        console.warn("画布流error", error)
    }
    if (track) {
        return track;
    }

}

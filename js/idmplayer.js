var idmVideoPlayer = Object.create(HTMLElement.prototype);
idmVideoPlayer.getDataTags = function() {
  for (var att, i = 0, atts = this.attributes, n = atts.length; i < n; i++){
      att = atts[i];
      console.log(att.nodeName,':',att.nodeValue)
      console.log()
  }
};

idmVideoPlayer.generateVideo = function(w,h) {
console.log('init time:',new Date().getTime() / 1000);

  var element=this.firstChild;
  var loader=element.nextSibling;
  var dynamicData=[];

  for (var att, i = 0, atts = this.attributes, n = atts.length; i < n; i++){
    att = atts[i];
    if (att.nodeName.includes("data-idm-")){
      var tmp={'key':att.nodeName.replace('data-idm-',''),'val':att.nodeValue}
      dynamicData.push(tmp)

    }

      // console.log(att.nodeName,':',att.nodeValue)
      // console.log()
  }
console.log('building json :',new Date().getTime() / 1000);
var data = {
    "response_format": "json",
    "video": {
        "output_formats": [
            {
                "format": "VIDEO_MP4_V_X264_"+w+"X"+h+"_1600_A_AAC_128"
            }
        ],
        "data":   dynamicData,
        "storyboard_id": this.getAttribute("idm-id"),
        "account_id": 2008,
        "priority":"HIGH",
        "authentication_token": document.getElementById("idmplayer").getAttribute("token")
    }
};
console.log(data);
console.log('sending json :',new Date().getTime() / 1000);
var xhr = new XMLHttpRequest();
xhr.open( 'POST','https://usa-api.idomoo.com/api/cg', true);
xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xhr.send(JSON.stringify(data));

  xhr.onloadend = function (e) {
    console.log('got response :',new Date().getTime() / 1000);
    console.log('got response :',e.target.response);
    //
var videoUrl=JSON.parse(e.target.response).video.output_formats[0].links[0].url;


element.src = videoUrl;
element.autoPlay = true;
console.log('init play :',new Date().getTime() / 1000);
element.onplaying = function() {
  loader.remove();
    console.log('play started :',new Date().getTime() / 1000);
};


element.play();
  };
};






function initIdmPlayer(){
  var IdmVideo = document.registerElement('idm-video', {
    prototype: idmVideoPlayer
  });
  var dVideos= document.getElementsByTagName('idm-video')
  for (var i,i=0;i<dVideos.length;i++){
    var video = document.createElement('video');

    dVideos[i].appendChild(video);
   video.preload = "auto"
    video.controls = dVideos[i].getAttribute("controls");
    video.setAttribute("width",dVideos[i].getAttribute("width"));
    video.setAttribute("height",dVideos[i].getAttribute("height"));

    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = '@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}'
    document.getElementsByTagName('head')[0].appendChild(style)
var top=(parseInt(dVideos[i].getAttribute("height")))/2-25
var left=(parseInt(dVideos[i].getAttribute("width")))/2-25
  var loader = document.createElement('div');
loader.setAttribute("style",'position:absolute;top:'+top+';left:'+left+';border: 3px solid #f3f3f3;border-top: 3px solid #3498db;border-radius: 50%;width: 50px;height: 50px;animation: spin 1s linear infinite;');


  dVideos[i].appendChild(loader);
  dVideos[i].generateVideo(dVideos[i].getAttribute("width"),dVideos[i].getAttribute("height"));
  }
}

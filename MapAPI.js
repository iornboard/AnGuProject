
//<script src="MarkerClustering.js"></script>



//  updateCctv 함수에서 사용할 마커 배열
var LatAndLng = [];
var LatAndLngOfLight = [];
var cctvRanges = []; 
var markers = [];
var markers_Light = [];

var markOnOff = true; 
var markOnOffLight = true; 

const promise = new Promise((resolve, reject)=> {
    resolve()  
});




function DongJackAjax(){
    return new Promise((resolve, reject) => {
    
        $.ajax({
           url: "/csvjson.json",
            dataType:"json",
            success: function(result){
                      var num = result;
                        resolve(num);
            }
        });
    })
}


function LightAjax(){
    return new Promise((resolve, reject) => {
    
        $.ajax({
           url: "/ligthjson.json",
            dataType:"json",
            success: function(result){
                      var num = result;
                        resolve(num);
            }
        });
    })
}

function DoBongAjax(){
    return new Promise((resolve, reject) => {
    
        $.ajax({
           url: "/dobong_cctv.json",
            dataType:"json",
            success: function(result){
                      var num = result;
                        resolve(num);
            }
        });
    })
}

function GumChunAjax(){
    return new Promise((resolve, reject) => {
    
        $.ajax({
           url: "/gumchun_cctv.json",
            dataType:"json",
            success: function(result){
                      var num = result;
                        resolve(num);
            }
        });
    })
}

function JongRoAjax(){
    return new Promise((resolve, reject) => {
    
        $.ajax({
           url: "/jongro_cctv.json",
            dataType:"json",
            success: function(result){
                      var num = result;
                        resolve(num);
            }
        });
    })
}



// 맵 기본 설정 
mapDiv = document.getElementById("map");
var map = new naver.maps.Map('map', {                          
       center: new naver.maps.LatLng(37.648694, 127.064194),
       zoom :20
    });


var infoWindow = new naver.maps.InfoWindow({
  anchorSkew: true
});

map.setCursor('pointer');



//-------------------------------------------------------------------------------------------------------------------------------

// 프로미스 동기 실행 부분
// 1)맵 생성 >> 2)데이터 받아오기 >> 3)마커 만들기

    
    promise
    .then(DongJackAjax)
    .then((result) =>{	
        
        processFile(result);

    })
    .then(DoBongAjax)
    .then((result) =>{	

        processFile(result)
    })
    .then(GumChunAjax)
    .then((result) =>{	

        processFile(result)
    })
    .then(JongRoAjax)
    .then((result) =>{	

        processFile(result)
    })
    .then(LightAjax)
    .then((result) =>{	
        
        processFile_Light(result);

    })
    .then(() =>{	

        // 여기에 리스트 추가 함수를 넣으면 될 듯
        
        LatAndLng.forEach(item => {
        var range =  new makeCctvRange(item[0],item[1],item[2]);  // 마커 객체를 생성
        var marker = new naver.maps.Marker(makeMaker(item[0],item[1],"cctv"));
        
        marker.addListener('mouseover', onMouseOver);
        marker.addListener('mouseout', onMouseOut);

        hideMarker(map, range);
        hideMarker(map, marker);

        cctvRanges.push(range);  // cctvRanges배열에 추가
        markers.push (marker);
        })			

        return new Promise((resolve, reject) =>{
        resolve();
        })
    })
    .then(() =>{	

        console.log(LatAndLngOfLight); 
        

        LatAndLngOfLight.forEach(item => {
            
        var marker = new naver.maps.Marker(makeMaker(item[0],item[1],"light"));

        hideMarker(map, marker);

        markers_Light.push(marker);
        })
    
        return new Promise((resolve, reject) =>{
        resolve();
        })

    })
    .then(() =>{	

        // >>마커 객체를 생성 + 배열에 추가




    });



//-------------------------------------------------------------------------------------------------------------------------------

// >>cctv 범위를 만드는 함수

function makeCctvRange(lat,lng,met) {  

    var circle = new naver.maps.Circle({
            map: map,
            center: naver.maps.LatLng(lat,lng),
            radius: met,
           fillColor: 'green',
          fillOpacity: 0.5
        });
    return circle;
};


// >>마커 객체를 만드는 함수

function makeMaker(lat,lng,type) {  
    
    if(type == "cctv")
    {
        var markerOptions = {
                position: naver.maps.LatLng(lat,lng),
               map: map,
                icon: {
                 url: '/cctvIconNon.png',
            size: new naver.maps.Size(50, 52),
                  origin: new naver.maps.Point(0,0),
                    anchor: new naver.maps.Point(15,25)
               }
        }
    }


    if(type == "light")
    {
        var markerOptions = {
                position: naver.maps.LatLng(lat,lng),
               map: map,
                icon: {
                 url: '/lightIconNon.png',
            size: new naver.maps.Size(50, 52),
                  origin: new naver.maps.Point(0,0),
                    anchor: new naver.maps.Point(15,25)
               }
        }
    }
    
return markerOptions;
};


//-----------------------------------------------------------------------------이벤트-------------------------------------------------------------


naver.maps.Event.addListener(map, 'zoom_changed', function() {
    updateMarkers(map, markers,'cctv');
});


naver.maps.Event.addListener(map, 'dragend', function() {  
    updateMarkers(map, markers,'cctv');
});


$("#ToGum-Chun").on("click", function(e) {
   e.preventDefault();

    map.panTo(naver.maps.LatLng(naver.maps.LatLng(37.456923, 126.895488)));
});
   


$("#ToDo-Bong").on("click", function(e) {
   e.preventDefault();

    map.panTo(naver.maps.LatLng(naver.maps.LatLng(37.668691, 127.047094)));
});



$("#ToJong-Ro").on("click", function(e) {
   e.preventDefault();

    map.panTo(naver.maps.LatLng(naver.maps.LatLng(37.573159 , 126.979472)));
}); 



$("#ToDong-Jack").on("click", function(e) {
   e.preventDefault();

    map.panTo(naver.maps.LatLng(naver.maps.LatLng(37.512433, 126.939536)));
});


$("#showLightMarker").on("click", function(e) {
   e.preventDefault();
   	
	markOnOffLight = true;
	markOnOff = false;  

	hideAll(markers);
	hideAll(cctvRanges);
	showAll(markers_Light);
});


$("#showCctvMarker").on("click", function(e) {
   e.preventDefault();
	
	markOnOff = true;  
	markOnOffLight = false;
	
	hideAll(markers_Light);
	showAll(markers);
	showAll(cctvRanges);
});



$("#showAllMarker").on("click", function(e) {
   e.preventDefault();
	
	markOnOff = true;  
	markOnOffLight = true; 
	
	showAll(markers_Light);
	showAll(markers);
	showAll(cctvRanges);
});



//-------------------------------------------------------------------------------함수-------------------------------------------------------------


// >> 화면에 표시되는 위치의 마커만 표시하는 함수 


function updateMarkers(map, markers) {

  var mapBounds = map.getBounds();          // getBounds - (보이는 영역의 경계 객체를 반환)
  var marker, position, cctv;

  if( markOnOff == true){
    for (var i = 0; i < markers.length; i++) {
      
          cctv = cctvRanges[i]
          marker = markers[i]
          position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {     // 객체의 경계내의 지정한 좌표가 있는지 여부를 확인 (bool)
            showMarker(map, cctv);
            showMarker(map, marker);
      }else{ 
            hideMarker(map, cctv);
           	hideMarker(map, marker);
      }
    }
  }

  if(markOnOffLight == true){
    for (var i = 0; i < markers_Light.length; i++) {
      
          marker = markers_Light[i]
          position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {     // 객체의 경계내의 지정한 좌표가 있는지 여부를 확인 (bool)
           showMarker(map, marker);
      }else{ 
           hideMarker(map, marker);
      }
    }
  }
}



function showMarker(map, marker) {    // 마커를 보여주는 함수

    if (marker.setMap()) return;
    marker.setMap(map);
}

function hideMarker(map, marker) {    // 마커를 숨기는 함수

    if (!marker.setMap()) return;
    marker.setMap(null);
}





function showAll(arr){
	arr.forEach(item => {	
	showMarker(map, item)
	})
};
	

function hideAll(arr){
	arr.forEach(item => {	
	hideMarker(map, item)
	})
};








//-------------------------------------------------------------------------------데이터 처리 함수-------------------------------------------------------------


 function processFile(file) {

    
  file.forEach(item => {

    var lat = item.Lat;
    var lng = item.Lng;
  
  
    if (item.pixel_all == null && item.pixel200 != null) { // 픽셀 값이 여러개 있는 경우(평균값으로 met 출력)
  
      if (item.pixel41 == null) { item.pixel41 = 0 }
      if (item.pixel130 == null) { item.pixel130 = 0 }
      if (item.pixel200 == null) { item.pixel200 = 0 }
      if (item.count == null) { item.count = 0 }
  
  
      var met = ((item.pixel41 * 5) + (item.pixel130 * 10) + (item.pixel200 * 15)) / item.count
    }
  
    else if (item.pixel_all != null && item.pixel200 == null) { // 픽셀 값이 한개만 있는 경우(값이 없으면 0으로 met 반환)
  
      if (item.pixel_all == 41) { var met = 5 }
      if (item.pixel_all == 130) { var met = 10 }
      if (item.pixel_all == 200) { var met = 15 }
      if (item.pixel_all == "") { var met = 0}

    }
  
    else if (item.pixel_all == null && item.pixel200 == null) { // 픽셀값이 없는 경우
  
      var met = 0;
    }
    
    var arr = [lat, lng, met];
    LatAndLng.push(arr);
  })
      
         };



function processFile_Light(file) {
    
    file.forEach(item => {

    var lat = item.Lat;   	
    var lng = item.Lng; 

    var arr = [lat,lng];
    LatAndLngOfLight.push(arr);
    })
     
         };

//------------------------------------------------------------------------------함수-------------------------------------------------------------




function onMouseOver(e) {
    var marker = e.overlay;

    marker.setIcon({
    url: '/cctvIconOFF.png',
            size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0,0),
            anchor: new naver.maps.Point(15,25)
        });
}


function onMouseOut(e) {
    var marker = e.overlay;

    marker.setIcon({
    url: '/cctvIconNon.png',
    size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0,0),
            anchor: new naver.maps.Point(15,25)
        });
}



//-------------------------------------------------------------------------------함수-------------------------------------------------------------


function searchCoordinateToAddress(latlng) {

  infoWindow.close();

  naver.maps.Service.reverseGeocode({
    coords: latlng,
    orders: [
      naver.maps.Service.OrderType.ADDR,
      naver.maps.Service.OrderType.ROAD_ADDR
    ].join(',')
  }, function(status, response) {
    if (status === naver.maps.Service.Status.ERROR) {
      if (!latlng) {
        return alert('ReverseGeocode Error, Please check latlng');
      }
      if (latlng.toString) {
        return alert('ReverseGeocode Error, latlng:' + latlng.toString());
      }
      if (latlng.x && latlng.y) {
        return alert('ReverseGeocode Error, x:' + latlng.x + ', y:' + latlng.y);
      }
      return alert('ReverseGeocode Error, Please check latlng');
    }

    var address = response.v2.address,
        htmlAddresses = [];

    if (address.jibunAddress !== '') {
        htmlAddresses.push('[지번 주소] ' + address.jibunAddress);
    }

    if (address.roadAddress !== '') {
        htmlAddresses.push('[도로명 주소] ' + address.roadAddress);
    }

    infoWindow.setContent([
      '<div style="padding:10px;min-width:200px;line-height:150%;">',
      '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
      htmlAddresses.join('<br />'),
      '</div>'
    ].join('\n'));

    infoWindow.open(map, latlng);
  });
}




function searchAddressToCoordinate(address) {
  naver.maps.Service.geocode({
    query: address
  }, function(status, response) {
    if (status === naver.maps.Service.Status.ERROR) {
      if (!address) {
        return alert('Geocode Error, Please check address');
      }
      return alert('Geocode Error, address:' + address);
    }

    if (response.v2.meta.totalCount === 0) {
      return alert('No result.');
    }

    var htmlAddresses = [],
      item = response.v2.addresses[0],
      point = new naver.maps.Point(item.x, item.y);

    if (item.roadAddress) {
      htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
    }

    if (item.jibunAddress) {
      htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
    }

    if (item.englishAddress) {
      htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
    }

    infoWindow.setContent([
      '<div style="padding:10px;min-width:200px;line-height:150%;">',
      '<h4 style="margin-top:5px;">검색 주소 : '+ address +'</h4><br />',
      htmlAddresses.join('<br />'),
      '</div>'
    ].join('\n'));

    map.setCenter(point);
    infoWindow.open(map, point);
  });
}

function initGeocoder() {
  if (!map.isStyleMapReady) {
    return;
  }

  map.addListener('click', function(e) {
    searchCoordinateToAddress(e.coord);
  });

  $('#address').on('keydown', function(e) {
    var keyCode = e.which;

   if (keyCode === 13) { // Enter Key
      searchAddressToCoordinate($('#address').val());
    }
  });

  $('#submit').on('click', function(e) {
    e.preventDefault();

    searchAddressToCoordinate($('#address').val());
  });

}

naver.maps.onJSContentLoaded = initGeocoder;
naver.maps.Event.once(map, 'init_stylemap', initGeocoder);






//----------------------------------------------------------------------------------------------------------------------

$(document).ready(function(){


  var htmlMarker1 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
  },
  htmlMarker2 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
  },
  htmlMarker3 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
  },
  htmlMarker4 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
  },
  htmlMarker5 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url('+ HOME_PATH +'/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
  };

  function onLoad() {
  var data = accidentDeath.searchResult.accidentDeath;

  for (var i = 0, ii = data.length; i < ii; i++) {
    var spot = data[i],
        latlng = new naver.maps.LatLng(spot.grd_la, spot.grd_lo),
        marker = new naver.maps.Marker({
            position: latlng,
            draggable: true
        });

    markers.push(marker);
  }

  var markerClustering = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 8,
    map: map,
    markers: markers,
    disableClickZoom: false,
    gridSize: 120,
    icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
    indexGenerator: [10, 100, 200, 500, 1000],
    stylingFunction: function(clusterMarker, count) {
        $(clusterMarker.getElement()).find('div:first-child').text(count);
    }
  });



  
  }


});




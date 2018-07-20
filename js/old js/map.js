function initialize() {
  var myLatlng = new google.maps.LatLng(37.39361,120.9842195)
  var mapOptions = {
    center: {lat: 13.1162266, lng: 121.07937049999998},
    zoom: 3,
    draggable: false,
    styles: [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#292121"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0e1b34"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#0e1b34"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "gamma": 0.01
                },
                {
                    "lightness": 20
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "saturation": -31
                },
                {
                    "lightness": -33
                },
                {
                    "weight": "0.82"
                },
                {
                    "gamma": 0.8
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#4e2424"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "-35"
                },
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#ccb0b0"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": "-2"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#752e2e"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#222b42"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 30
                },
                {
                    "saturation": 30
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": 20
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 20
                },
                {
                    "saturation": -20
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 10
                },
                {
                    "saturation": -30
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "saturation": 25
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": -20
                }
            ]
        }
    ]
  }

  var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  i = 0;
  var markers = [];
  for ( pos in myData ) {
    i = i + 1;  
    var row = myData[pos];
    window.console && console.log(row);
    var newLatlng = new google.maps.LatLng(row[0], row[1]);

    var smallIcon = {
        url: "images/marker.png",
        size: new google.maps.Size(60, 60),
        scaledSize: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0,0)
    }
    var bigIcon = {
        url: "images/marker.png",
        size: new google.maps.Size(70, 70),
        scaledSize: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0,0)
    }

    var marker = new google.maps.Marker({
        position: newLatlng,
        map: map,
        zIndex: 99999999,
        title: row[2],
        id: row[3],
        loc_info: row[4],
        icon: smallIcon,
    });

    var openedInfoWindow = null;

    var infowindow = new google.maps.InfoWindow();                

    google.maps.event.addListener(marker, 'click', function(){
        window.location.href = "content.html#section"+(this.id + 1)
    });

    google.maps.event.addListener(marker, 'mouseover', (function() {
      this.setIcon(bigIcon);       
      if(openedInfoWindow != null){                         
        openedInfoWindow.close(); 
        openedInfoWindow = null;
      }else{
        var a = "";

        a = '<a href ="content.html#section'+(this.id +1)+'"><img class="gif-previews" src="previews/'+(this.id)+'.gif">';
        a += '<h2><span>'+ this.title +'</span></h2>';                                  

        infowindow.setContent(a); 
        infowindow.open(map, this); 
        openedInfoWindow = infowindow;
        google.maps.event.addListener(infowindow, 'closeclick', function() {
          openedInfoWindow = null;            
        });
      } 
    }));

    google.maps.event.addListener(marker, 'mouseout', function() {
        this.setIcon(smallIcon);
        openedInfoWindow.close();          

    });


    markers.push(marker);
  }

  setTimeout(function(){
    map.panTo({lat: 10.73811315, lng: 121.7421336});
    smoothZoom(map, 10.5, map.getZoom());

    setTimeout(function(){
      $("#over_map").fadeIn();
      typeWriter();
    }, 3000);
  }, 500);
  google.maps.event.trigger(map, 'resize');

}

function smoothZoom (map, max, cnt) {
  if (cnt >= max) {
    return;
  }else {
    z = google.maps.event.addListener(map, 'zoom_changed', function(event){
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
    });
    setTimeout(function(){map.setZoom(cnt)}, 140);
  }
}  
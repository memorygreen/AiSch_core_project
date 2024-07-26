let markers = [];  // 마커를 담을 배열
let mapContainer, mapOption, map, geocoder, infowindow;
let userLocation = null; // 사용자의 위치를 저장할 변수

// 페이지가 로드될 때 지도를 초기화하고 이벤트 리스너를 추가
document.addEventListener('DOMContentLoaded', (event) => {
    initMap(); // 지도 초기화
    loadLocations(); // 위치 데이터 로드
});

// 지도 초기화 함수
function initMap() {
    mapContainer = document.getElementById('map'); // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 초기 중심좌표 (서울시청)
        level: 7 // 지도의 확대 레벨
    };

    // 지도 생성
    map = new kakao.maps.Map(mapContainer, mapOption);

    // 장소 검색 객체 생성
    geocoder = new kakao.maps.services.Geocoder();

    // 인포윈도우 생성
    infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 사용자 위치 요청
    if (navigator.geolocation) {
        // 위치 정보를 가져와 지도의 중심을 사용자 위치로 설정
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(userLocation);
        }, function (error) {
            alert('위치 정보를 가져오는데 실패했습니다.');
            userLocation = new kakao.maps.LatLng(37.566826, 126.9786567); // 기본 위치로 설정
            map.setCenter(userLocation);
        });
    } else {
        alert('사용자의 위치 정보를 가져올 수 없는 브라우저입니다.');
        userLocation = new kakao.maps.LatLng(37.566826, 126.9786567); // 기본 위치로 설정
        map.setCenter(userLocation);
    }
}

// JSON 파일에서 위치 데이터를 로드하는 함수
function loadLocations() {
    fetch('/json/response_1721976844536.json')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(item => {
                console.log('Address:', item.주소); // 주소 확인을 위한 로그
                geocodeAddress(item.주소, item.시설명);
            });
        })
        .catch(error => console.error('Error loading locations:', error));
}

// 주소를 위도와 경도로 변환하고 마커를 지도에 표시하는 함수
function geocodeAddress(address, name) {
    geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log('Geocode result:', result[0]); // 결과 확인을 위한 로그
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            // 커스텀 마커 이미지 설정
            const imageSrc = '/images/map_marker.png'; // 마커 이미지 URL
            const imageSize = new kakao.maps.Size(30, 30); // 마커 이미지 크기
            const imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커 이미지의 좌표
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage // 커스텀 마커 이미지 적용
            });
            // 인포윈도우생성
            kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(
                    `<div style="padding:5px;">
                        
                        ${name}
                        <br>
                        ${address}
                    
                    </div>
                    
                    `);
                infowindow.open(map, marker);
            });

            markers.push(marker);
        } else {
            console.error('Geocode failed for address:', address, 'with status:', status); // 오류 로그
        }
    });
}

// 지도 위에 표시되고 있는 마커를 모두 제거하는 함수
function removeMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = []; // 마커 배열을 초기화
}

let markers = [];  // 마커를 담을 배열
let mapContainer, mapOption, map, geocoder, infowindow;
let userLocation = null; // 사용자의 위치를 저장할 변수
let userMarker = null; // 사용자의 위치를 표시할 마커

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
            addUserMarker(userLocation); // 사용자 위치 마커 추가
        }, function (error) {
            alert('위치 정보를 가져오는데 실패했습니다.');
            userLocation = new kakao.maps.LatLng(35.1475, 126.9239); // 기본 위치로 설정
            map.setCenter(userLocation);
            addUserMarker(userLocation); // 사용자 위치 마커 추가
        });
    } else {
        alert('사용자의 위치 정보를 가져올 수 없는 브라우저입니다.');
        userLocation = new kakao.maps.LatLng(35.1475, 126.9239); // 기본 위치로 설정
        map.setCenter(userLocation);
        addUserMarker(userLocation); // 사용자 위치 마커 추가
    }
}

// 사용자 위치를 표시하는 마커를 추가하는 함수
function addUserMarker(position) {
    // 기존 사용자 마커가 있으면 제거
    if (userMarker) {
        userMarker.setMap(null);
    }

    // 사용자 위치 마커 이미지 설정
    const userImageSrc = '/images/free-icon97.png'; // 사용자 마커 이미지 URL (사용자에 맞는 이미지로 변경)
    const userImageSize = new kakao.maps.Size(30, 30); // 마커 이미지 크기
    const userImageOption = { offset: new kakao.maps.Point(15, 30) }; // 마커 이미지의 좌표
    const userMarkerImage = new kakao.maps.MarkerImage(userImageSrc, userImageSize, userImageOption);

    userMarker = new kakao.maps.Marker({
        map: map,
        position: position,
        image: userMarkerImage // 사용자 마커 이미지 적용
    });
}

// JSON 파일에서 위치 데이터를 로드하는 함수
function loadLocations() {
    fetch('/json/response_1721976844536.json')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(item => {
                console.log('Address:', item); // 주소 확인을 위한 로그
                geocodeAddress(item.주소, item.시설명, item.시설종류);
            });
        })
        .catch(error => console.error('Error loading locations:', error));
}

// 주소를 위도와 경도로 변환하고 마커를 지도에 표시하는 함수
function geocodeAddress(address, name, facilityType) {
    geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log('Geocode result:', result[0]); // 결과 확인을 위한 로그
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 커스텀 마커 이미지 설정
            const imageSrc = '/images/map_marker.png'; // 마커 이미지 URL
            const imageSize = new kakao.maps.Size(30, 30); // 마커 이미지 크기
            const imageOption = { offset: new kakao.maps.Point(15, 30) }; // 마커 이미지의 좌표
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage // 커스텀 마커 이미지 적용
            });

            // 커스텀 오버레이 내용 설정
            let content = `
            <div class="wrap" style="background-color: #fbebec;border-radius: 20px;width: 300px;height: 188px;word-break: break-all;padding: 20px;">
                <div class="info">
                    <div class="close" onclick="closeOverlay()" title="닫기"></div>
                    <div class="title" style="margin-bottom: 10px;">
                        <div class="img" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
                            <img src="../images/free-icon99.png" width="70" height="67">
                            <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; margin-left: 24px;">
                                ${name}
                                <div class="jibun ellipsis">${facilityType}</div>
                            </div>
                        </div>
                    </div>
                    <div class="body">
                        <div class="desc" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
                            <div class="ellipsis" style="display: flex; flex-direction: column;">
                                <p id="Custom_overlay_p" style="font-size: 15px !important;">${address}</p>
                                <div class="jibun ellipsis">${facilityType}</div>
                                <div>
                                    <a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            // 커스텀 오버레이 생성
            const overlay = new kakao.maps.CustomOverlay({
                content: content,
                position: marker.getPosition(),
                xAnchor: 0.5,
                yAnchor: 1
            });

            // 마커 클릭 이벤트 리스너 추가
            kakao.maps.event.addListener(marker, 'click', function () {
                // 지도 중심을 마커 위치로 이동
                map.setCenter(coords);
                // 모든 오버레이 닫기
                markers.forEach(markerObj => markerObj.overlay.setMap(null));
                // 현재 마커의 오버레이 열기
                overlay.setMap(map);
                // 오버레이의 위치를 다시 설정
                overlay.setPosition(marker.getPosition());
            });

            // 마커와 오버레이를 배열에 저장
            markers.push({ marker: marker, overlay: overlay });
        } else {
            console.error('Geocode failed for address:', address, 'with status:', status); // 오류 로그
        }
    });
}

// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    markers.forEach(markerObj => markerObj.overlay.setMap(null));
}


// 지도 위에 표시되고 있는 마커를 모두 제거하는 함수
function removeMarker() {
    markers.forEach(({ marker, overlay }) => {
        marker.setMap(null);
        overlay.setMap(null);
    });
    markers = []; // 마커 배열을 초기화
}

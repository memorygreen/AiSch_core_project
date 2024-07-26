
let markers = [];  // 마커를 담을 배열

// 지도와 관련된 변수 및 객체 정의
const mapContainer = document.getElementById('map_top'); // 지도를 표시할 div
const mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표 (서울시청)
    level: 3 // 지도의 확대 레벨
};

// 지도생성
const map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체 생성
const ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 페이지가 로드되면 자동으로 장소 검색 실행
searchPlaces();

// 키워드로 장소를 검색
function searchPlaces() {
    const keyword = document.getElementById('keyword').value;

    if (!keyword.trim()) {
        alert('키워드를 입력해주세요!');
        return;
    }

    // 장소검색 키워드로 장소검색 요청합
    ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출 함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료되면 검색 목록과 마커를 표출
        displayPlaces(data);

        // 페이지 번호 표출
        displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
}

// 검색 결과 목록, 마커 표시 함수
function displayPlaces(places) {
    const listEl = document.getElementById('placesList');
    const menuEl = document.getElementById('menu_wrap');
    const fragment = document.createDocumentFragment();
    const bounds = new kakao.maps.LatLngBounds();

    // 검색 결과 목록에 추가된 항목 제거
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커 제거
    removeMarker();

    for (let i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시
        const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
        const marker = addMarker(placePosition, i);
        const itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해 LatLngBounds 객체에 좌표를 추가
        bounds.extend(placePosition);
        (function (marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

            itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout = function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목 검색결과 목록 Element에 추가
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {
    const el = document.createElement('li');
    let itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
        '<div class="info">' +
        '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 마커를 생성하고 지도 위에 마커 표시하는 함수
function addMarker(position, idx) {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'; // 마커 이미지 url, 스프라이트 이미지를 사용합니다
    const imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
    const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage
    });

    marker.setMap(map); // 지도 위 마커 표시
    markers.push(marker);  // 배열에 생성된 마커 추가

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = []; // 마커 배열을 초기화
}

// 검색결과 목록 하단 페이지번호 표시 함수
function displayPagination(pagination) {
    const paginationEl = document.getElementById('pagination');
    const fragment = document.createDocumentFragment();

    // 기존 추가 페이지번호 삭제
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (let i = 1; i <= pagination.last; i++) {
        const el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출 함수 인포윈도우에 장소명 표시
function displayInfowindow(marker, title) {
    const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element 제거 함수
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

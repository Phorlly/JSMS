
let url = 'http://ip-api.com/json/?fields=61439';
fetch(url).then(res => res.json()).then(data => console.table(res));



//const findMyLocation = () => {
//    let status = document.querySelector(".status");

//    const success = (position) => {
//        console.log(position)
//        let latitude = position.coords.latitude;
//        let longitude = position.coords.longitude;
//        console.log({ lat: latitude, long: longitude })

//        let urlApi = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&localityLanguage=km`;
//        let geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=km`;

//        fetch(urlApi)
//            .then(res => res.json())
//            .then(data => {
//                console.table(data.address)
//                status.textContent = data.address.town
//            }).catch(() => console.log("Error fetching data from API"));
//        fetch(geoApiUrl)
//            .then(res => res.json())
//            .then(data => {
//                console.table(data)
//                status.textContent = data.principalSubdivision
//            })
//    }

//    const error = () => {
//        status.textContent = "Unable to get your location";
//    }

//    let dataId = navigator.geolocation.watchPosition(success, error);
//    navigator.geolocation.clearWatch(dataId)

//}

//document.querySelector(".find-location").addEventListener("click", findMyLocation);


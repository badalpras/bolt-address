export function calculateOptimalRoute(
  startPoint,
  waypoints,
  directionsService
) {
  return new Promise((resolve, reject) => {
    if (waypoints.length === 0) {
      reject(new Error('No waypoints provided'));
      return;
    }

    const waypointObjects = waypoints.map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      stopover: true
    }));

    directionsService.route({
      origin: new window.google.maps.LatLng(startPoint.lat, startPoint.lng),
      destination: new window.google.maps.LatLng(startPoint.lat, startPoint.lng),
      waypoints: waypointObjects,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK && result) {
        resolve(result);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}
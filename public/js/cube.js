//		if (!Detector.webgl) Detector.addGetWebGLMessage();
var camera, scene, renderer, control, mesh, controls;
init();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(700, 700);
    renderer.sortObjects = false;
    document.body.appendChild(renderer.domElement);

    //CAMERA
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(15, 5, 15);

    //SCENE
    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(500, 100));

    //LIGHTS
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);

    hemiLight2 = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight2.color.setHSL(0.6, 1, 0.6);
    hemiLight2.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight2.position.set(0, -500, 0);
    scene.add(hemiLight2);

    //Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    // instantiate a loader
    var loader2 = new THREE.JSONLoader();
    // load a resource

    var url;
    $.get(
        "/api/url/" + getCookie("modelNumber"),
        function (data) {
            console.log(data.url);
            url = data.url;
        }
    ).then(function (url) {
        loader2.load(
            // resource URL
            url.toString(),
            // Function when resource is loaded
            function (geometry, materials) {

                if (materials != undefined) {
                    var material = new THREE.MultiMaterial(materials);
                } else {
                    material = new THREE.MeshBasicMaterial({
                        color: 0x245252
                    });
                }
                var object = new THREE.Mesh(geometry, material);

                scene.add(object);
            }
        )
    });

    render();
}


//Resets Window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

//Render Scene and Update
function render() {
    requestAnimationFrame(render);
    //    camera.position = new THREE.Vector3(0, mesh.position.y, 0);    
    controls.update();
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
setTimeout(function(){
    init();
    animate();
}, 300 );


if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

var container = document.getElementById("modal_container");
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;

function init() {

    /* Camera */
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 3;

    /* Scene */
    scene = new THREE.Scene();
    lighting = false;

    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    var loader = new THREE.GLTFLoader();
    loader.load(
        "../img/uploads/stacy.glb",
        function ( gltf ) {
            var scale = 1.1;
            bus.body = gltf.scene.children[0];
            bus.body.name = “body”;
            bus.body.scale.set (scale,scale,scale);
            bus.body.castShadow = true;
            bus.frame.add(bus.body);
            scene.add( gltf );
        },
    );

    /* Renderer */
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    //renderer.setClearColor(new THREE.Color(0x000000, 0));

    container.appendChild(renderer.domElement);

    /* Controls */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    /* Events */
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);
}


function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}


function onKeyboardEvent(e) {
    if (e.code === 'KeyL') {
        lighting = !lighting;

        if (lighting) {
            ambient.intensity = 0.25;
            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);
        } else {
            ambient.intensity = 1.0;
            scene.remove(keyLight);
            scene.remove(fillLight);
            scene.remove(backLight);

        }
    }
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}


function render() {
    renderer.render(scene, camera);
}

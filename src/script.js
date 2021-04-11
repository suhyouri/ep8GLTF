import './style.css'
import * as THREE from 'three'
import io from "socket.io-client"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const socket = io()
let rotation = 0.0

socket.on("rotation", function (data) {
    if (data) {
      rotation = data;
    } else {
      console.log("error!");
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
const loader = new GLTFLoader();

// Object
const gltfLoader = new GLTFLoader();
let snowMan

gltfLoader.load("/models/snowman.gltf", (gltf) => {
  gltf.scene.scale.set(0.2, 0.2, 0.2);
  gltf.scene.position.set(0, 0, 0);

  snowMan = gltf.scene;
  scene.add(gltf.scene);
});

/**
 * Lights
 */
 const ambientLight = new THREE.AmbientLight(0xffffff, 2);
 scene.add(ambientLight);
 
 const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
 directionalLight.position.set(-5, 5, 0);
 directionalLight.position.set(5, 5, 0);
 directionalLight.position.set(-5, 5, 5);
 scene.add(directionalLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl')
})

renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
 const tick = () =>
 {
    //console.log('tick')
     // Update objects
     if(snowMan){
        snowMan.rotation.y = rotation;
      }
     // Render
     renderer.render(scene, camera)
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as THREE from 'three';
import * as Stats from 'stats.js';
import { ServerService } from '../server.service';
import { Direction } from '../Enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // показать/скрыть чат
  chatIsVisible = false;

  // инициализация three.js
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  canvas?: HTMLCanvasElement;
  renderer: any;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraDirection = new THREE.Vector3(0, 0, 0);
  stats = new Stats();
  //Начальные данные для камеры
  scale = 0.3;
  mousex = 0;
  mousey = 0;
  //Константа для движения
  constMove = 0.4;
  

  plane1 = this.createPlane({ x: 0, y: 15, z: -30 }, { l: 50, h: 50, b: 10 }, "#FFFFFF");
  plane2 = this.createPlane({ x: -30, y: 15, z: 0 }, { l: 10, h: 60, b: 100 });
  plane3 = this.createPlane({ x: 30, y: 15, z: 0 }, { l: 10, h: 60, b: 100 }, '#FF00FF');
  plane4 = this.createPlane({ x: 0, y: 45, z: 0 }, { l: 50, h: 10, b: 100 }, '#BB00BB');
  plane5 = this.createPlane({ x: 0, y: -15, z: 0 }, { l: 50, h: 10, b: 100 }, '#BB00BB');

  cube = this.createCube();
  sphere = this.createSphere();
  plane = this.createPlane();

  sceneElems = [
    this.cube,
    this.sphere,
    this.plane,
    this.plane1,
    this.plane2,
    this.plane4,
    this.plane5,
    this.plane3
  ];

  EVENTS = this.serverService.getEvents();

  room: string = "";

  // выйти из игры при обновлении страницы
  /* @HostListener('window:beforeunload', ['$event'])
  onWindowOnload(event: any) {
    this.cookieService.get('game') ? this.cookieService.delete('game') : null;
  } */

  // обработка нажатия клавиши
  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 't':
        this.chatIsVisible = true;
        break;
      case 'Escape':
        this.chatIsVisible ? this.chatIsVisible = false : console.log('You open Menu!');
        break;
      case 'w' || 'ц':
        this.move(Direction.Forward);
        this.serverService.move(Direction.Forward);
        break;
      case 'a' || 'ф':
        this.move(Direction.Left);
        this.serverService.move(Direction.Left);
        break;
      case 's' || 'ы':
        this.move(Direction.Back);
        this.serverService.move(Direction.Back);
        break;
      case 'd' || 'в':
        this.move(Direction.Right);
        this.serverService.move(Direction.Right);
        break;
    }
  }

  move(direction: Direction) {
    switch (direction) {
      case Direction.Forward: {
        this.camera.position.x-=this.constMove * Math.sin(Math.PI * this.mousex);
        this.camera.position.z-=this.constMove * Math.cos(Math.PI * this.mousex);
        break;
      }
      case Direction.Back: {
        this.camera.position.x+=this.constMove * Math.sin(Math.PI * this.mousex);
        this.camera.position.z+=this.constMove * Math.cos(Math.PI * this.mousex);
        break;
      }
      case Direction.Right: {
        this.camera.position.x+=this.constMove * Math.sin(Math.PI * this.mousex + Math.PI/2);
        this.camera.position.z+=this.constMove * Math.cos(Math.PI * this.mousex + Math.PI/2);
        break;
      }
      case Direction.Left: {
        this.camera.position.x+=this.constMove * Math.sin(Math.PI * this.mousex - Math.PI/2);
        this.camera.position.z+=this.constMove * Math.cos(Math.PI * this.mousex - Math.PI/2);
        break;
      }
    }
  }

  calcCos(vect1: any, vect2: any): any {
    return this.scalMult(vect1, vect2) / (this.vectModule(vect1) * this.vectModule(vect2));
  }

  scalMult(vect1: any, vect2: any) {
    return vect1.x * vect2.x + vect1.z * vect2.z;
  }

  vectModule(vect: any) {
    return Math.sqrt(vect.x**2 + vect.z**2);
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.serverService.stopMove();
        break;
      case 'a':
        this.serverService.stopMove();
        break;
      case 's':
        this.serverService.stopMove();
        break;
      case 'd':
        this.serverService.stopMove();
        break;
    }
  }

   @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.camera.rotation.order = "YXZ"; // this is not the default
    this.mousex = - ( event.clientX / this.renderer.domElement.clientWidth ) * 2 + 1;
    this.mousey = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
    this.camera.rotation.x = this.mousey / this.scale;
    this.camera.rotation.y = this.mousex / this.scale;
    // console.log(this.mousex);
    }

  @HostListener('window:resize', ['$event'])
  resize(event: any) {
    this.onWindowResize();
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  constructor(
    private router: Router,
    private serverService: ServerService,
    private cookieService: CookieService
  ) {
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    // sockets
    serverService.on(this.EVENTS.LEAVE_GAME, (result: any) => this.onLeaveGame(result));
    serverService.on(this.EVENTS.SPEED_SHANGE, (result: any) => this.onSpeedChange(result));

    // инициализация игры

    // renderer
    this.renderer = new THREE.WebGLRenderer();

    // geometry
    this.initElems();
    this.addLight();
    this.addAmbientLight();
    this.createAxesHelper();
  }

  ngOnInit(): void {
    !this.cookieService.get('token') ? this.router.navigate(['authorization']) : null;
    !this.cookieService.get('game') ? this.router.navigate(['rooms']) : null;


    // scene initialization
    
    //create the scene
    this.scene.background = new THREE.Color(0xbfd1e5);

    //create camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 5000);
    this.camera.position.set(5, 10, 30);
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));

    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 0.6, 0.6);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(100);
    this.scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 13500;

    //Setup the renderer
    this.canvas = document.getElementById('gameScene') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setClearColor(0xbfd1e5);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.shadowMap.enabled = true;

    this.animate();
  }

  leaveGame() {
    this.serverService.leaveGame();
  }

  onLeaveGame(data: any) {
    if (data.result) {
      this.cookieService.get('game') ? this.cookieService.delete('game') : null;
      this.router.navigate(['rooms']);
    }
  }


  speedUp() {
    this.serverService.speedUp();
  }

  speedDown() {
    this.serverService.speedDown();
  }

  onSpeedChange(data: any) {
    if(data.result == 'up') {
      this.constMove += 0.5;
    };
    if(data.result == 'down' && this.constMove > 0.5) {
      this.constMove -= 0.5;
    }
  }



  addLight() {
    this.renderer.shadowMap.enabled = true;
    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.shadow.autoUpdate = true;
    light.position.set(3, 3, 3);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    this.scene.add(light);
    this.scene.add(light.target);

    const lightHelper = new THREE.DirectionalLightHelper(light);
    this.scene.add(lightHelper);

    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // this.scene.add( helper );
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(light);
  }

  initElems() {
    this.sceneElems.forEach(elem => this.scene.add(elem));
  }

  createCube() {
    const geometry = new THREE.TorusGeometry(1.5, 0.5, 8, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0xfcc742,
      emissive: 0x111111,
      //specular: 0xffffff,
      metalness: 1,
      roughness: 0.55
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
  }

  createSphere() {
    const geometry = new THREE.SphereGeometry(4, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0da520,
      emissive: 0x000000,
      specular: 0xbcbcbc,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(-5, -5, -5);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    return sphere;
  }

  createPlane(coords = { x: 0, y: 0, z: 0 }, scale = { l: 0, h: 0, b: 0 }, color = '#FF0000') {

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: color }));

    blockPlane.position.set(coords.x, coords.y, coords.z);
    blockPlane.scale.set(scale.l, scale.h, scale.b);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    return blockPlane;
  }

  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(15);
    this.scene.add(axesHelper);
  }


  animate() {
    this.stats.begin();
    this.sceneElems[0].rotation.x += 0.01;
    this.sceneElems[0].rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate.bind(this));
  }

  ngOnDestroy() {
    document.getElementById('gameScene')?.remove();
  }
}
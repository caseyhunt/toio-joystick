
//toio connection stuff

const CUBE_ID_ARRAY = [ 0, 1, 2 ];
const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

// Global Variables.
const gCubes = [ undefined, undefined, undefined ];


var slider1 = document.getElementById("slider1");
var speed1 = 0xFF;

  const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
  const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
  const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
  const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';

  const connectNewCube = () => {

      const cube = {
          device:undefined,
          sever:undefined,
          service:undefined,
          soundChar:undefined,
          moveChar:undefined,
          lightChar:undefined

      };

      // Scan only toio Core Cubes
      const options = {
          filters: [
              { services: [ SERVICE_UUID ] },
          ],
      }

      navigator.bluetooth.requestDevice( options ).then( device => {
          cube.device = device;
          if( cube === gCubes[0] ){
              turnOnLightCian( cube );

              const cubeID = 1;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }else if( cube === gCubes[1] ){
              turnOnLightGreen( cube );
              spinCube( cube );
              const cubeID = 2;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }
          changeConnectCubeButtonStatus( undefined, cube, false );
          return device.gatt.connect();
      }).then( server => {
          cube.server = server;
          return server.getPrimaryService( SERVICE_UUID );
      }).then(service => {
          cube.service = service;
          return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.moveChar = characteristic;
          return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.soundChar = characteristic;
          return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.lightChar = characteristic;
          if( cube === gCubes[0] ){
            turnOnLightCian( cube );
            spinCube( cube );
            enableMoveButtons();
          }else if( cube === gCubes[1] ){
            turnOnLightGreen( cube );
          }else{
            turnOnLightRed( cube );
          }
      });

      return cube;
  }



  // Cube Commands
  // -- Light Commands
  const turnOffLight = ( cube ) => {

      const CMD_TURN_OFF = 0x01;
      const buf = new Uint8Array([ CMD_TURN_OFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const turnOnLightGreen = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('green');
      }

  }

  const turnOnLightCian = ( cube ) => {

      // Cian light
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('cyan');

      }

  }

  const turnOnLightRed = ( cube ) => {

      // Red light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const spinCube = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('spin');
      }

  }

  const changeButtonStatus = ( btID, enabled ) => {
      document.getElementById( btID ).disabled = !enabled;
  }

  const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {

      if( idButton ){
          changeButtonStatus( 'btConnectCube' + ( idButton + 1 ), enabled );
      }else{
          if( gCubes[0] === cube ){
              changeButtonStatus( 'btConnectCube1', enabled );
          }else if( gCubes[1] === cube ){
              changeButtonStatus( 'btConnectCube2', enabled );
          }else{
              changeButtonStatus( 'btConnectCube3', enabled );
          }
      }

  }

  const cubeMove = ( x, y,cubeno) => {
      const cube = gCubes[cubeno];
      var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
      let maxspeed = 100;
      let stopmot = 0;
      //stop the motors prior to doing the math on them
      if(x==0 && y!=0){
        stopmot =1;
        motor2 = motor2-0.5;
        motor1=0;
      }else if(y==0 && x!=0){
        stopmot=2;
        x = x-0.5;
        y = 0;
      }else if(y==0 && x==0){
        stopmot=3;
        x = 0;
        y = 0;
      }else{
      x = x-0.5;
      y = y-0.5;
    }

    //calculate whether the motor should go forward or backward.
    //motor speeds are encoded as -.5 to .5 so if it's over 0 then it should go forward.
      let m1fw;
      let m2fw;

      if(y<0){
        m1fw = true;
        m2fw = true
      }else{
        m1fw = false;
        m2fw = false
      }
      // if(motor2<0){
      //   m2fw = true;
      // }else{
      //   m2fw = false;
      // }


      let motor1;
      let motor2;

      // x = Math.floor(Math.abs(x)*2*255);
      // x = x.toString(16);
      // console.log(x);
      // x = "0x" + x;
      //
      // y = Math.floor(Math.abs(y)*2*255);
      // y = y.toString(16);
      // console.log(y);
      // y = "0x" + y;



      if(x>0 && Math.abs(y)>0.15){
        console.log(Math.floor(Math.abs(x)*2*maxspeed),Math.floor(Math.abs(y)*2*maxspeed));
          motor1 = Math.floor(Math.abs(y)*2*maxspeed);
          motor2 = Math.floor(motor1-Math.abs(motor2*x*0.1));
          //motor2 = Math.floor(motor1/Math.abs(x*maxspeed*.25));
          motor1 = motor1.toString(16);
          motor1 = "0x" + motor1;
          motor2 = motor2.toString(16);
          motor2 = "0x" + motor2;


      }else if(x==0 && Math.abs(y)>0.15){

    console.log(Math.floor(Math.abs(x)*2*maxspeed),Math.floor(Math.abs(y)*2*maxspeed));
          motor1 = Math.floor(Math.abs(y)*2*maxspeed);
      motor1 = motor1.toString(16);
      motor1 = "0x" + motor1;
      motor2 = motor1;
    }else if(x<=0 && Math.abs(y)>0.15){
      console.log(Math.floor(Math.abs(x)*2*maxspeed),Math.floor(Math.abs(y)*2*maxspeed));
        motor2 = Math.floor(Math.abs(y)*2*maxspeed);
        motor1 = Math.floor(motor1-Math.abs(motor2*x*.1));
        //motor1 = Math.floor(motor2/Math.abs(x*maxspeed*.25));
        motor2 = motor2.toString(16);
        motor2 = "0x" + motor2;
        motor1 = motor1.toString(16);
        motor1 = "0x" + motor1;
      }else if(Math.abs(y)<=0.15 && x>0){
        console.log(Math.floor(Math.abs(x)*2*maxspeed),Math.floor(Math.abs(y)*2*maxspeed));
        motor1 = Math.floor(Math.abs(x)*2*maxspeed);
        motor2 = motor1;
        m2fw = false;
        m1fw = true;
      }else if(Math.abs(y)<=0.15 && x<=0){
        console.log(Math.floor(Math.abs(x)*2*maxspeed),Math.floor(Math.abs(y)*2*maxspeed));
        motor2 = Math.floor(Math.abs(x)*2*maxspeed);
        motor1 = motor2;
        m1fw = false;
        m2fw = true;
      }


      //write forward and backward values
      if(m1fw == true && m2fw==true){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x01, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x32, 0x01, 0x01, 0x32]);
      }else if(m1fw == false && m2fw==true){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x01, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x01, 0x01, 0x32]);
    }else if(m1fw == true && m2fw == false){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x02, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x96, 0x02, 0x01, 0x64]);

    }else{
       buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x02, motor2]);
        //  buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x02, 0x02, 0x64]);
    }

      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
        console.log(buf);
          cube.moveChar.writeValue( buf );
          console.log('move');

      }

  }

  for( let cubeId of CUBE_ID_ARRAY ){
      document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {

          if( cubeId === 0 ){
              gCubes[0] = connectNewCube();
              console.log('cube 0 connected (cyan)');
          }else if( cubeId === 1 ){
              gCubes[1] = connectNewCube();
              console.log('cube 1 connected (green)');
          }else{
              gCubes[2] = connectNewCube();
              console.log('cube 3 connected (red)');
          }

        });
    }




//joystick stuff

mousedown = false;
centerx = 175;
centery = 175;

document.getElementById("joystick-shaft").addEventListener("mousedown", function(){moveStick(true)});
document.getElementById("joystick-base").addEventListener("mousemove", function(){moveStick(mousedown)});
document.getElementsByTagName("html")[0].addEventListener("mouseup", function(){moveStick(false)});
document.getElementsByTagName("html")[0].addEventListener("mousemove", function(){moveStick(mousedown)});
document.getElementById("joystick-shaft").addEventListener("touchstart", function(){moveStick(true)});
document.getElementById("joystick-base").addEventListener("touchmove", function(){moveStick(mousedown)});
document.getElementsByTagName("html")[0].addEventListener("touchend", function(){moveStick(false)});
document.getElementsByTagName("html")[0].addEventListener("touchmove", function(){moveStick(mousedown)});


let xmap;
let ymap;
function moveStick(mouse){
  mousedown = mouse;


  //console.log(mouse);
  if(mouse==true){
    // console.log(event.pageY);
    // console.log(event.pageX);

    //calculate if the cursor is in the circle
    if(Math.pow((event.pageY - 175), 2)+ Math.pow((event.pageX - 175),2) < Math.pow(50,2)){
      document.getElementById('joystick-shaft').style.top = event.pageY-125;
        document.getElementById('joystick-shaft').style.left = event.pageX-125;
        ymap = (event.pageY-100)/150;
        xmap = (event.pageX-100)/150;

        // console.log((event.pageY-100)/150);
        // console.log((event.pageX-100)/150);
        //document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(" + 0 + "," + 255*xmap + "," + 255*ymap + ")";
      }else{
        //console.log("outside circle");
        let adjangle = Math.atan((Math.abs(event.pageY - 175)/Math.abs(event.pageX - 175)));
        if(event.pageY>=175){
         ymap = Math.sin(adjangle)*50+50;
      }else {
        ymap = -Math.sin(adjangle)*50+50;
      }
      if(event.pageX>=175){;
        xmap = Math.cos(adjangle)*50+50;
     }else{
       xmap = -Math.cos(adjangle)*50+50;
     }
     document.getElementById('joystick-shaft').style.top = ymap;
     document.getElementById('joystick-shaft').style.left = xmap;
     ymap = ymap/100;
     xmap = xmap/100;
     }

     // console.log(ymap);
     // console.log(xmap);


      }
    else{
        ymap = 0;
        xmap = 0;
        document.getElementById('joystick-shaft').style.top = 50;
        document.getElementById('joystick-shaft').style.left = 50;

    }
          //  document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(" + 0 + "," + 255*xmap + "," + 255*ymap + ")";

}

let timeron = true;
let timer = 0;


addTime();
// for(i=0;i<100;i++){
//   setTimeout(function(){
//   addTime();
// },5000);
// }
let xpos = 0;
let ypos = 0;

function addTime(){


  if(timer<5){
    timer++;
  }else{
    timer = 0;
  }
  setTimeout(function(){
  addTime();

  if(gCubes[0]!=undefined){
    if(xmap!=xpos || ymap!=ypos){
      cubeMove(xmap, ymap, 0);
      xpos = xmap;
      ypos = ymap;
    }

}
},100);
//console.log(timer);
}

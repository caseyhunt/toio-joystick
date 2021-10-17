let inside;
let pressed;
let dragging;
let angle;
let brad = 300;
let nrad = .3*brad;
let center = 200;
let outx = 0;
let outy =0;
let circx = 100;
let circy = 100;
let outsidetol = 0.1;

function setup() {
  var myCanvas = createCanvas(400, 400);
  myCanvas.parent("canvas");

}

function draw() {
  background(255);
  //draw inner and outer circle
  circle(center, center, brad);

    inside = insideCirc(center,center, (brad/2)-(brad/2)*outsidetol);

     push();
  if(inside==true){
    fill(0,0,0);

  }else{
    fill(100,0,0);
  }

    pop();

  dragging = insideCirc(center,center,nrad/2);
  if(inside == true && pressed == true){
    nubx = mouseX;
    nuby = mouseY;
  circle(mouseX,mouseY,nrad);
  }else if(inside == false && pressed == true){
    angle = atan(abs(mouseY - center)/Math.abs(mouseX - center));
    if(mouseY<center){
      nuby = -(sin(angle)*((brad/2)-(brad/2)*outsidetol))+center;
    }else{
    nuby = (sin(angle)*((brad/2)-(brad/2)*outsidetol))+center;
    }
    if(mouseX<center){
      nubx = -(cos(angle)*((brad/2)-(brad/2)*outsidetol))+center;
    }else{
    nubx = (cos(angle)*((brad/2)-(brad/2)*outsidetol))+center;
    }
    circle(nubx, nuby, nrad);
  }
  else{
    nubx = center;
    nuby = center;
      circle(center,center,nrad);
  }

  outx = (nubx-center)/((brad-brad*outsidetol)/2);
  outy = (nuby-center)/((brad-brad*outsidetol)/2);
  if(outy <0){
    fw1 = true;
    fw2 = true;
  }else if(outy>0){
    fw1 = false;
    fw2 = false;
  }

  //this is the output x and y
  //these values are a number betwen -1 and 1
  //speed is absolute value
  //left/right motor speed are a function of a fraction of the speed.
  //print(abs(outx*255), abs(outy*255));
  // outx = abs(outx*255);
  // outy = abs(outy*255);

  // circx += outx;
  // circy += outy;
  //
  // circle(circx,circy,30);

}


//is the cursor inside the circle?
function insideCirc(centerx, centery, crad){
  if(pow(mouseX-centerx,2)+pow(mouseY-centery,2) < pow(crad,2)){
     return true;
     }else{
      return false;
     }
}

function mousePressed(){

  pressed = true;


}

function mouseReleased(){
  pressed = false;
}

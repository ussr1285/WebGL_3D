"use strict";

var gl;
var theta = [0, 0, 0];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = yAxis; // 초기 회전 축
var modelMatrix, viewMatrix, projectionMatrix;
var modelMatrixLoc, viewMatrixLOC, projectionMatrixLoc;

var thetaLoc;
var vertices;
var normalsArray = [];
var pointsArray = [];
const origin_speed = 2;
var rotationSpeed = origin_speed;
var translationMatrix = translate(0, 0, 0);
var translationMatrixLOC;
var canvas;
var cameraZ = 3.5; // 초기 카메라 z 위치
var cameraPos = [0, 0, 3.5];
var targetPos = [0, 0, 0];
var upVector = [0, 1, 0];

var translateX = 0;
var translateY = 0;
var initialScale = 1;
var initialScaleMatrix;
var initialScaleMatrixLoc;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0); // directional light

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0); // 𝐿𝑎
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑑
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑠

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0); // 𝑘𝑎
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑑
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑠
var materialShininess = 100.0; // 𝛼: a shininess for specular term

var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);

var program;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  vertices = [
    // M의 첫번째 일직선 작대기
    // front
    [-0.9199999999999999, -0.35000000000000003, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.880109375, -0.35000000000000003, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.880109375, 0.0500000000000001, 0.0],
    [-0.880109375, -0.35000000000000003, 0.0],
    // back
    [-0.9199999999999999, -0.35000000000000003, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.880109375, -0.35000000000000003, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.880109375, -0.35000000000000003, 0.1],
    // surface x  // 동동다 다다동 011 100
    [-0.9199999999999999, -0.35000000000000003, 0.0],
    [-0.9199999999999999, -0.35000000000000003, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.9199999999999999, -0.35000000000000003, 0.0],
    [-0.880109375, -0.35000000000000003, 0.0],
    [-0.880109375, -0.35000000000000003, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.0],
    [-0.880109375, -0.35000000000000003, 0.0],
    // surface y
    [-0.880109375, -0.35000000000000003, 0.0],
    [-0.880109375, -0.35000000000000003, 0.1],
    [-0.9199999999999999, -0.35000000000000003, 0.1],
    [-0.9199999999999999, -0.35000000000000003, 0.1],
    [-0.9199999999999999, -0.35000000000000003, 0.0],
    [-0.880109375, -0.35000000000000003, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.880109375, 0.0500000000000001, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    // M의 첫번째 대각선 작대기
    // 앞면
    [-0.72, -0.35000000000000003, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.76, -0.35000000000000003, 0.0],
    [-0.880109375, 0.0500000000000001, 0.0],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.72, -0.35000000000000003, 0.0],
    // 뒷면
    [-0.72, -0.35000000000000003, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.76, -0.35000000000000003, 0.1],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.72, -0.35000000000000003, 0.1],
    // surface // 동동다 다다동 011 100
    [-0.72, -0.35000000000000003, 0.0],
    [-0.72, -0.35000000000000003, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.1],
    [-0.9199999999999999, 0.0500000000000001, 0.0],
    [-0.72, -0.35000000000000003, 0.0],
    [-0.880109375, 0.0500000000000001, 0.0],
    [-0.880109375, 0.0500000000000001, 0.1],
    [-0.76, -0.35000000000000003, 0.1],
    [-0.76, -0.35000000000000003, 0.1],
    [-0.76, -0.35000000000000003, 0.0],
    [-0.880109375, 0.0500000000000001, 0.0],

    // M의 두번째 대각선 작대기
    // 앞면
    [-0.72, -0.35000000000000003, 0.0],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.76, -0.35000000000000003, 0.0],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.76, -0.35000000000000003, 0.0],
    // 뒷면
    [-0.72, -0.35000000000000003, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.76, -0.35000000000000003, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.76, -0.35000000000000003, 0.1],
    // surface
    [-0.76, -0.35000000000000003, 0.0],
    [-0.76, -0.35000000000000003, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.76, -0.35000000000000003, 0.0],
    [-0.72, -0.35000000000000003, 0.0],
    [-0.72, -0.35000000000000003, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.72, -0.35000000000000003, 0.0],

    // M의 두번째 일직선 작대기
    // 앞면
    [-0.6399999999999999, -0.35000000000000003, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.6, -0.35000000000000003, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.6, -0.35000000000000003, 0.0],
    // 뒷면
    [-0.6399999999999999, -0.35000000000000003, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6, -0.35000000000000003, 0.1],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, -0.35000000000000003, 0.1],
    // surface x
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.6, -0.35000000000000003, 0.0],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.6, -0.35000000000000003, 0.0],
    [-0.6, -0.35000000000000003, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, -0.35000000000000003, 0.1],
    // surface y
    [-0.6, -0.35000000000000003, 0.0],
    [-0.6, -0.35000000000000003, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.1],
    [-0.6399999999999999, -0.35000000000000003, 0.0],
    [-0.6, -0.35000000000000003, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],

    // J의 작대기
    // 앞면
    [-0.6399999999999999, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.1],
    [-0.6, 0.0500000000000001, 0.0],
    [-0.6399999999999999, 0.0500000000000001, 0.0],
    [-0.11875000000000002, 0.10000000000000003, 0.0],
    // 뒷면
    [-0.11875000000000002, -0.2765625, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    [-0.11875000000000002, -0.2765625, 0.0],
    [-0.06888671874999996, -0.2765625, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    [-0.11875000000000002, 0.10000000000000003, 0.1],

    // surface x
    [-0.11875000000000002, -0.2765625, 0.1],
    [-0.06888671874999996, 0.10000000000000003, 0.1],
    [-0.11875000000000002, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.1],
    [-0.06888671874999996, 0.10000000000000003, 0.1],
    [-0.11875000000000002, -0.2765625, 0.0],
    [-0.11875000000000002, -0.2765625, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.0],
    [-0.11875000000000002, -0.2765625, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    // surfcae y
    [-0.06888671874999996, 0.10000000000000003, 0.1],
    [-0.06888671874999996, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.1],
    [-0.11875000000000002, 0.10000000000000003, 0.0],
    [-0.06888671874999996, 0.10000000000000003, 0.0],
    [-0.11875000000000002, -0.2765625, 0.0],

    // J의 곡선
    [-0.11875000000000002, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.1],
    [-0.06888671874999996, -0.2765625, 0.0],
    [-0.11875000000000002, -0.2765625, 0.0],
    [-0.06874999999999998, -0.2, 0.0],
    [-0.09375, -0.24999999999999994, 0.0],
    [-0.11875000000000002, -0.27499999999999997, 0.0],
    [-0.14375000000000004, -0.24999999999999994, 0.0],
    [-0.16874999999999996, -0.22500000000000003, 0.0],
    [-0.19374999999999998, -0.2, 0.0],
    [-0.06874999999999998, -0.2, 0.1],
    [-0.09375, -0.24999999999999994, 0.1],
    [-0.11875000000000002, -0.27499999999999997, 0.1],
    [-0.14375000000000004, -0.24999999999999994, 0.1],
    [-0.16874999999999996, -0.22500000000000003, 0.1],
    [-0.19374999999999998, -0.2, 0.1],
    [-0.06874999999999998, -0.2, 0.0],
    [-0.06874999999999998, -0.2, 0.1],
    [-0.19374999999999998, -0.2, 0.1],
    [-0.19374999999999998, -0.2, 0.1],
    [-0.19374999999999998, -0.2, 0.0],
    [-0.06874999999999998, -0.2, 0.0],
    [-0.09375, -0.24999999999999994, 0.0],
    [-0.09375, -0.24999999999999994, 0.1],
    [-0.14375000000000004, -0.24999999999999994, 0.1],
    [-0.14375000000000004, -0.24999999999999994, 0.1],
    [-0.14375000000000004, -0.24999999999999994, 0.0],
    [-0.09375, -0.24999999999999994, 0.0],
    [-0.11875000000000002, -0.27499999999999997, 0.0],
    [-0.11875000000000002, -0.27499999999999997, 0.1],
    [-0.16874999999999996, -0.22500000000000003, 0.1],
    [-0.16874999999999996, -0.22500000000000003, 0.1],
    [-0.16874999999999996, -0.22500000000000003, 0.0],
    [-0.11875000000000002, -0.27499999999999997, 0.0],
    [0.6265624999999999, -0.2, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.6265624999999999, -0.2, 0.1],
    [0.40156250000000004, -0.175, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.6265624999999999, -0.2, 0.0],
    [0.6265624999999999, -0.2, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.6265624999999999, -0.2, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.40156250000000004, -0.175, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.40156250000000004, -0.175, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.40156250000000004, -0.175, 0.0],
    [0.40156250000000004, -0.175, 0.1],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.40156250000000004, -0.175, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, -0.175, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.6265624999999999, 0.10000000000000003, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.6265624999999999, 0.10000000000000003, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.6265624999999999, 0.10000000000000003, 0.1],
    [0.6265624999999999, 0.10000000000000003, 0.1],
    [0.6265624999999999, 0.10000000000000003, 0.0],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.1],
    [0.3265625000000001, -0.04999999999999999, 0.0],
    [0.40156250000000004, 0.07500000000000001, 0.0],
  ];

  function triangle(a, b, c) {
    // 삼각형의 두 변 벡터를 계산합니다.
    var t1 = subtract(vertices[b], vertices[a]); // 벡터 AB
    var t2 = subtract(vertices[c], vertices[a]); // 벡터 AC

    // t1과 t2 벡터의 외적을 통해 노말 벡터를 계산합니다.
    var normal = cross(t1, t2); // 두 벡터의 외적을 사용해 노말 벡터를 구함
    var normal = vec3(normal); // vec3 함수를 사용하여 3차원 벡터로 변환
    normal = normalize(normal); // 노말 벡터를 정규화합니다.

    // 삼각형의 각 정점에 노말 벡터를 저장합니다.
    normalsArray.push(normal); // 계산된 노말 벡터를 노말 배열에 추가
    normalsArray.push(normal); // 노말 벡터
    normalsArray.push(normal); // 노말 벡터
  }

  function computeNormalsForTriangleFan(startOfFANVertices, endOfFANVertices) {
    // 팬의 중심점
    for (let i = 1; i < endOfFANVertices - 1; i++) {
      const vec1 = subtract(vertices[i], vertices[startOfFANVertices]);
      const vec2 = subtract(vertices[i + 1], vertices[startOfFANVertices]);

      let normal = cross(vec1, vec2);
      normal = normalize(normal); // 노말 벡터 정규화

      // 각 삼각형에 대한 노말 벡터 저장
      normalsArray.push(normal);
      normalsArray.push(normal);
      normalsArray.push(normal);
    }
  }

  let sum_i = 0;
  let i = 0;
  
  while (i < 120) {
    triangle(i, i + 1, i + 2);
    i += 3;
  }
  sum_i = sum_i + i;

  i = 0;
  while (i < 36) {
    triangle(sum_i+i, sum_i+i + 1, sum_i+i + 2);
    i += 3;
  }
  sum_i = sum_i + i;

  i = 12;
  computeNormalsForTriangleFan(sum_i, sum_i + i);
  sum_i = sum_i + i;

  i = 18;
  computeNormalsForTriangleFan(sum_i, sum_i + i);
  sum_i = sum_i + i;

  i = 0;
  while (i < 60) {
    triangle(sum_i+i, sum_i+i + 1, sum_i+i + 2);
    i += 3;
  }
  sum_i = sum_i + i;

//   console.log(sum_i);

  //  Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  if (!program) {
    alert("Shader issue");
    return;
  }
  gl.useProgram(program);

  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.2);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);

  // Load the data into the GPU

  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0); //   gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Associate out shader variables with our data buffer

  //   var vPosition = gl.getAttribLocation(program, "vPosition");
  //   gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  //   gl.enableVertexAttribArray(vPosition);

  modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
  viewMatrixLOC = gl.getUniformLocation(program, "viewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  translationMatrixLOC = gl.getUniformLocation(program, "translationMatrix");
  initialScaleMatrixLoc = gl.getUniformLocation(program, "initialScaleMatrix");

  modelMatrix = mat4();
  viewMatrix = mat4();
  projectionMatrix = mat4();
  initialScaleMatrix = mat4();

  projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100.0); // fovy, aspect, near, far
  viewMatrix = lookAt(cameraPos, targetPos, upVector);

  gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
  gl.uniformMatrix4fv(viewMatrixLOC, false, flatten(viewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(translationMatrixLOC, false, flatten(translationMatrix));
  gl.uniformMatrix4fv(
    initialScaleMatrixLoc,
    false,
    flatten(initialScaleMatrix)
  );

  thetaLoc = gl.getUniformLocation(program, "theta");

  document.getElementById("viewFromFront").onclick = function (e) {
    cameraPos = [0, 0, 3.5];
    viewMatrix = lookAt(cameraPos, targetPos, upVector);
  };
  document.getElementById("viewFromRightSide").onclick = function (e) {
    cameraPos = [3.5, 0, 0];
    viewMatrix = lookAt(cameraPos, targetPos, upVector);
  };
  document.getElementById("viewFromLeftSide").onclick = function (e) {
    cameraPos = [-3.5, 0, 0];
    viewMatrix = lookAt(cameraPos, targetPos, upVector);
  };
  document.getElementById("viewFromUp").onclick = function (e) {
    cameraPos = [0, 5.5, 0.001];
    viewMatrix = lookAt(cameraPos, targetPos, upVector);
  };

  document.getElementById("toggleRot").onclick = function (e) {
    if (rotationSpeed == 0.0) {
      rotationSpeed = origin_speed;
    } else {
      rotationSpeed = 0.0;
    }
  };

  document.getElementById("rotX").onclick = function (e) {
    axis = xAxis;
  };
  document.getElementById("rotY").onclick = function (e) {
    axis = yAxis;
  };
  document.getElementById("rotZ").onclick = function (e) {
    axis = zAxis;
  };
  document.getElementById("initial_distance_z").oninput = function (e) {
    var distanceZ = 50 - parseFloat(e.target.value);
    cameraPos = [cameraPos[0], cameraPos[1], distanceZ];
    viewMatrix = lookAt(cameraPos, targetPos, upVector);
  };

  document.getElementById("initial_height").oninput = function (e) {
    translateY = e.target.value / 100;
    translationMatrix = translate(translateX, translateY, 0);
  };

  document.getElementById("initial_posx").oninput = function (e) {
    translateX = e.target.value / 100 - 1.0;
    translationMatrix = translate(translateX, translateY, 0);
  };

  document.getElementById("initial_scailing").oninput = function (e) {
    initialScale = e.target.value;
    initialScaleMatrix = scalem(initialScale, initialScale, initialScale);
  };

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  theta[axis] += rotationSpeed;
  modelMatrix = rotateX(theta[xAxis]);
  modelMatrix = mult(modelMatrix, rotateY(theta[yAxis]));
  modelMatrix = mult(modelMatrix, rotateZ(theta[zAxis]));

  gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));
  gl.uniformMatrix4fv(viewMatrixLOC, false, flatten(viewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(translationMatrixLOC, false, flatten(translationMatrix));
  gl.uniformMatrix4fv(
    initialScaleMatrixLoc,
    false,
    flatten(initialScaleMatrix)
  );

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  var current_ver = 0;
  // M
  gl.drawArrays(gl.TRIANGLES, current_ver, 120);
  current_ver += 120;
  // J
  gl.drawArrays(gl.TRIANGLES, current_ver, 36);
  current_ver += 36;
  gl.drawArrays(gl.TRIANGLE_FAN, current_ver, 12);
  current_ver += 12;
  gl.drawArrays(gl.TRIANGLE_FAN, current_ver, 18);
  current_ver += 18;
  // C
  gl.drawArrays(gl.TRIANGLES, current_ver, 60);
  current_ver += 60;

  requestAnimFrame(render);
}

"use strict";

function scale_coordinates(coordinates, scale) {
  return coordinates.map(function (coordinate) {
    return [coordinate[0] * scale, coordinate[1] * scale];
  });
}

function translate_coordinates(coordinates, offset) {
  return coordinates.map(function (coordinate) {
    return [coordinate[0] + offset, coordinate[1]];
  });
}

function modify_height_coordinates(coordinates, height) {
  return coordinates.map(function (coordinate) {
    return [coordinate[0], coordinate[1] + height];
  });
}

var M_scale_slider;
var M_offset_slider;
var J_scale_slider;
var J_offset_slider;
var C_scale_slider;
var C_offset_slider;
var initial_height_slider;
// var initial_scale_slider;
var bufferId;

var coordinates = {
  // object M, J, C. 1024x1024 에서의 좌표.
  M: [
    // M의 첫번째 일직선 작대기
    [102.4, 256.0],
    [102.4, 768.0],
    [153.46, 256.0],
    [102.4, 768.0],
    [153.46, 768.0],
    [153.46, 256.0],
    // M의 첫번째 대각선 작대기
    [358.4, 256.0],
    [102.4, 768.0],
    [307.2, 256.0],
    [153.46, 768.0],
    [102.4, 768.0],
    [358.4, 256.0],
    // M의 두번째 대각선 작대기
    [358.4, 256.0],
    [512.0, 768.0],
    [307.2, 256.0],
    [512.0, 768.0],
    [460.8, 768.0],
    [307.2, 256.0],
    // M의 두번째 일직선 작대기
    [460.8, 256.0],
    [460.8, 768.0],
    [512.0, 256.0],
    [460.8, 768.0],
    [512.0, 768.0],
    [512.0, 256.0],
  ],
  J: [
    // J의 작대기
    [102.4, 665.6],
    [102.4, 280.0],
    [153.46, 665.6],
    [102.4, 280.0],
    [153.46, 280.0],
    [153.46, 665.6],
    // J의 곡선
    [153.6, 358.4],
    [128.0, 307.2],
    [102.4, 281.6],
    [76.8, 307.2],
    [51.2, 332.8],
    [25.6, 358.4],
  ],
  C: [
    // C 상단
    [665.6, 358.4],
    [435.2, 384.0],
    [358.4, 512.0],
    // C 중간
    [435.2, 384.0],
    [358.4, 512.0],
    [435.2, 640.0],
    // C 하단
    [358.4, 512.0],
    [435.2, 640.0],
    [665.6, 665.6],
  ],
  line: [
    [20, 20],
    [980, 20],
    [980, 980],
    [20, 980],
  ],
  dot: [
    [20, 20],
    [980, 20],
    [980, 980],
    [20, 980],
  ],
};

var displayed_coordinates = JSON.parse(JSON.stringify(coordinates));

let display_scale = 1.0;
let display_height = 300;

let M_scale = 0.4;
let J_scale = 0.5;
let C_scale = 0.5;

let M_offset = 0;
let J_offset = 400;
let C_offset = 500;

displayed_coordinates["M"] = scale_coordinates(
  displayed_coordinates["M"],
  M_scale
);
displayed_coordinates["J"] = scale_coordinates(
  displayed_coordinates["J"],
  J_scale
);
displayed_coordinates["C"] = scale_coordinates(
  displayed_coordinates["C"],
  C_scale
);

displayed_coordinates["M"] = translate_coordinates(
  displayed_coordinates["M"],
  M_offset
);
displayed_coordinates["J"] = translate_coordinates(
  displayed_coordinates["J"],
  J_offset
);
displayed_coordinates["C"] = translate_coordinates(
  displayed_coordinates["C"],
  C_offset
);

displayed_coordinates["M"] = modify_height_coordinates(
  displayed_coordinates["M"],
  display_height
);
displayed_coordinates["J"] = modify_height_coordinates(
  displayed_coordinates["J"],
  display_height
);
displayed_coordinates["C"] = modify_height_coordinates(
  displayed_coordinates["C"],
  display_height
);

function updateAndRender() {
  displayed_coordinates["M"] = scale_coordinates(coordinates["M"], M_scale);
  displayed_coordinates["J"] = scale_coordinates(coordinates["J"], J_scale);
  displayed_coordinates["C"] = scale_coordinates(coordinates["C"], C_scale);

  displayed_coordinates["M"] = translate_coordinates(
    displayed_coordinates["M"],
    M_offset
  );
  displayed_coordinates["J"] = translate_coordinates(
    displayed_coordinates["J"],
    J_offset
  );
  displayed_coordinates["C"] = translate_coordinates(
    displayed_coordinates["C"],
    C_offset
  );

  displayed_coordinates["M"] = modify_height_coordinates(
    displayed_coordinates["M"],
    display_height
  );
  displayed_coordinates["J"] = modify_height_coordinates(
    displayed_coordinates["J"],
    display_height
  );
  displayed_coordinates["C"] = modify_height_coordinates(
    displayed_coordinates["C"],
    display_height
  );

  // WebGL 렌더링 준비
  var vertices = [];
  for (var key in displayed_coordinates) {
    if (displayed_coordinates.hasOwnProperty(key)) {
      for (var i = 0; i < displayed_coordinates[key].length; i++) {
        vertices.push(displayed_coordinates[key][i][0] / 512.0 - 1.0); // X 좌표 조정
        vertices.push(displayed_coordinates[key][i][1] / 512.0 - 1.0); // Y 좌표 조정
      }
    }
  }

  // WebGL 버퍼 업데이트
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // 다시 렌더링
  render();
}

var gl;

window.onload = function init() {
  initial_height_slider = document.getElementById("initial_height");
  // initial_scale_slider = document.getElementById("initial_scale");

  function update_height(event) {
    display_height = parseInt(event.target.value);
    updateAndRender();
  }

  function update_scale(event) {
    display_scale = parseInt(event.target.value);
    updateAndRender();
  }

  initial_height_slider.addEventListener("input", update_height);
  // initial_scale_slider.addEventListener("input", update_scale);

  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  var vertices = [];

  for (var key in displayed_coordinates) {
    if (displayed_coordinates.hasOwnProperty(key)) {
      for (var i = 0; i < displayed_coordinates[key].length; i++) {
        vertices.push(displayed_coordinates[key][i][0] / 512.0 - 1.0);
        vertices.push(displayed_coordinates[key][i][1] / 512.0 - 1.0);
      }
    }
  }
  // console.log(vertices);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // M
  gl.drawArrays(gl.TRIANGLES, 0, 24);

  // J
  gl.drawArrays(gl.TRIANGLES, 24, 6);
  gl.drawArrays(gl.TRIANGLE_FAN, 30, 6);

  // C
  gl.drawArrays(gl.TRIANGLES, 36, 9);

  // LINES
  gl.drawArrays(gl.LINE_LOOP, 45, 4);
  // POINTS
  gl.drawArrays(gl.POINTS, 49, 4);
}

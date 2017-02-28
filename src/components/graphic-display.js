import React, { Component } from 'react'
import engine from '../core/engine'
import browserSize from '../core/browser-size'
import refresher from '../refresher'
import socket from '../socket'

import { calcGamePayout } from '../util/math'


// Styling
function style(theme, width) {
  function combineTheme(obj) {
    if (typeof obj[theme] === 'string')
      return obj[theme];
    else
      return Object.assign({}, obj.base, obj[theme]);
  }

  function combineState(obj) {
    // Possible states and their inheritance graph. All derive also from base.
    var states = {
      playing: [],
      cashed: [],
      lost: [],
      starting: [],
      startingBetting: ['starting', 'playing'],
      progress: [],
      progressPlaying: ['progress', 'playing'],
      progressCashed: ['progress', 'cashed'],
      ended: [],
      endedCashed: ['ended', 'cashed']
    };

    var ret = {};

    Object.keys(states).forEach(function(state) {
      var sups = states[state];
      var res = Object.assign({}, obj.base || {});
      sups.forEach(function(sup) {
        Object.assign(res, obj[sup] || {});
      });
      Object.assign(res, obj[state]);
      ret[state] = res;
    });

    return ret;
  }

  // Multiply one percent of canvas width x times
  function fontSizeNum(times) {
    return times * width / 100;
  }

  // Return the font size in pixels of one percent
  // of the width canvas by x times.
  function fontSizePx(times) {
    var fontSize = fontSizeNum(times);
    return fontSize.toFixed(2) + 'px';
  }

  var strokeStyle = combineTheme({
    white: 'Black',
    black: '#b0b3c1'
  });

  var fillStyle = combineTheme({
    white: 'black',
    black: '#b0b3c1'
  });

  return {
    fontSizeNum: fontSizeNum,
    fontSizePx: fontSizePx,
    graph: combineState({
      base: {
        lineWidth: 4,
        strokeStyle: strokeStyle
      },
      playing: {
        lineWidth: 6,
        strokeStyle: '#7cba00'
      },
      cashed: {
        /* strokeStyle = "Grey", */
        lineWidth: 6
      }
    }),
    axis: {
      lineWidth: 1,
      font: '10px Verdana',
      textAlign: 'center',
      strokeStyle: strokeStyle,
      fillStyle: fillStyle
    },
    data: combineState({
      base: {
        textAlign: 'center',
        textBaseline: 'middle'
      },
      starting: {
        font: fontSizePx(5) + ' Verdana',
        fillStyle: 'grey'
      },
      progress: {
        font: fontSizePx(20) + ' Verdana',
        fillStyle: fillStyle
      },
      progressPlaying: {
        fillStyle: '#7cba00'
      },
      ended: {
        font: fontSizePx(15) + ' Verdana',
        fillStyle: 'red'
      }
    })
  };
}

var XTICK_LABEL_OFFSET = 20;
var XTICK_MARK_LENGTH = 5;
var YTICK_LABEL_OFFSET = 11;
var YTICK_MARK_LENGTH = 5;

// Measure the em-Height by CSS hackery as height text measurement is not
// available on most browsers. From:
//   https://galacticmilk.com/journal/2011/01/html5-typographic-metrics/#measure
function getEmHeight(font) {
  var sp = document.createElement("span");
  sp.style.font = font;
  sp.style.display = "inline";
  sp.textContent = "Hello world!";

  document.body.appendChild(sp);
  var emHeight = sp.offsetHeight;
  document.body.removeChild(sp);
  return emHeight;
}

// Function to calculate the distance in semantic values between ticks. The
// parameter s is the minimum tick separation and the function produces a
// prettier value.
function tickSeparation(s) {
  if (!Number.isFinite(s)) {
    throw new Error("Is not a number: ", s)
  }

  var r = 1;
  while (true) {
    if (r > s) return r;
    r *= 2;

    if (r > s) return r;
    r *= 5;
  }
}


function Graph() {
  this.canvas      = null;
  this.ctx         = null;
  this.animRequest = null;
  this.renderBound = this.render.bind(this);
}

Graph.prototype.startRendering = function(canvasNode) {
  console.assert(!this.canvas && !this.ctx);


  if (!canvasNode.getContext)
    return console.error('No canvas');

  this.ctx = canvasNode.getContext('2d');
  this.canvas = canvasNode;
  this.configPlotSettings(true);

  this.animRequest = window.requestAnimationFrame(this.renderBound);
};

Graph.prototype.stopRendering = function() {
  window.cancelAnimationFrame(this.animRequest);
  this.canvas = this.ctx = null;
};

Graph.prototype.configPlotSettings = function(forceUpdate) {

	const config = {
		controlsSize: 'large', // can also be 'small'
		currentTheme: 'white',
		height: ((browserSize.height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.graphicDisplayHeight() ) - 10, // 10 refers to some inside margin
		// Width
    //   Desktop: the container component is contained in a col-sm-15 which is 62.5% of the screen, and it has padding left and right of 10 each (20 total). Then the graph is inside a col-md-12 which is 50% minus [ 4 cols * 10 padding per side (2) = 80]
     // Mobile: the container component is contained in a col-xs-24 so 100% - 60 from padding
		width: browserSize.isMobile() ? browserSize.width - 60 : ((browserSize.width * 0.625 * 0.5) - 100)
	};

  // From: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio =
    this.ctx.webkitBackingStorePixelRatio ||
    this.ctx.mozBackingStorePixelRatio ||
    this.ctx.msBackingStorePixelRatio ||
    this.ctx.oBackingStorePixelRatio ||
    this.ctx.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;

  // Only update these settings if they really changed to avoid rendering hiccups.
  if (this.canvasWidth !== config.width ||
    this.canvasHeight !== config.height ||
    this.devicePixelRatio !== devicePixelRatio ||
    this.backingStoreRatio !== backingStoreRatio ||
    forceUpdate
  ) {
    this.canvasWidth = config.width;
    this.canvasHeight = config.height;
    this.devicePixelRatio = devicePixelRatio;
    this.backingStoreRatio = backingStoreRatio;

    // Use CSS to *always* get the correct canvas geometry.
    this.canvas.style.width = config.width + 'px';
    this.canvas.style.height = config.height + 'px';

    // Scale the canvas element by ratio to account for HiDPI.
    this.canvas.width = config.width * ratio;
    this.canvas.height = config.height * ratio;
  }

  // Transform the entire scene to make the HiDPI scaling transparent.
  this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  this.style = style(config.currentTheme, this.canvasWidth);
	
  // The minimum separation of ticks in pixels.
  this.xMinTickSeparation = 2 * this.ctx.measureText("10000").width;
  this.yMinTickSeparation = getEmHeight(this.style.axis.font) *
    (config.controlsSize === 'small'? 1.75 : 4);

  /* Geometry of the canvas. This are physical measures in pixels. The
   origin O is at the upper left corner and the y-axis is pointing down.

   x
   O   ↦      ├╌╌╌╌╌╌plotwidth╌╌╌╌╌╌┤
   ╭──────────────────────────────────╮           ┬
   y ↧ │                                  │           ╎
   │        │                         │   ┬       ╎
   │        │                         │   ╎       ╎
   │        │                         │  plot     ╎
   │        │                         │ height  canvas
   │        │                         │   ╎     height
   ┬   │   ─────┼──────────────────────   │   ┴       ╎
   ╎   │        │                         │           ╎
   ystart │        │                         │           ╎
   ╎   │                                  │           ╎
   ┴   ╰──────────────────────────────────╯           ┴
   ├╌xstart╌┤
   */
  this.xStart = 30;
  this.yStart = 20;
  this.plotWidth = this.canvasWidth - this.xStart;
  this.plotHeight = this.canvasHeight - this.yStart;

  /* Geometry of the graph. This are semantic measures. On the x-Axis this
   is the time in ms since game start and the multiplier on the y-Axis.

   ╭──────────────────────────────────╮
   │                                  │
   │        │                         │   ╦  <--- payout end
   │        │                         │   ║
   │        │                         │ payout
   │        │                         │   ║
   │    p ↥ │                         │   ║
   │   ─────┼──────────────────────   │   ╩  <--- payout beg
   │      O │ ↦                       │
   │        │ t                       │
   │                                  │
   ╰──────────────────────────────────╯
   ╠═══════ time ════════╣
   */
  // Minimum of 10 Seconds on x-Axis.
  this.XTimeMinValue = 10000;
  // Minimum multiplier of 2.00x on y-Axis.
  this.YPayoutMinValue = 200;
};

Graph.prototype.calculatePlotValues = function() {
  this.currentTime = engine.getElapsedTimeWithLag();
  this.currentPayout = 100 * engine.getCurrentPayout();


  // Plot variables
  this.XTimeBeg = 0;
  this.XTimeEnd = Math.max(this.XTimeMinValue, this.currentTime);
  this.YPayoutBeg = 100;
  this.YPayoutEnd = Math.max(this.YPayoutMinValue, this.currentPayout);

  // Translation between semantic and physical measures.
  this.XScale = this.plotWidth / (this.XTimeEnd - this.XTimeBeg);
  this.YScale = this.plotHeight / (this.YPayoutEnd - this.YPayoutBeg);
};

// Best would be to add this to the transformation matrix, but that
// transforms text entirely too. D'oh.
Graph.prototype.trX = function(t) {
  return this.XScale * (t - this.XTimeBeg);
};

Graph.prototype.trY = function(p) {
  return - (this.YScale * (p - this.YPayoutBeg));
};

Graph.prototype.render = function() {
  this.calculatePlotValues();
  this.clean();

  // Translate to the graph origin.
  this.ctx.save();
  this.ctx.translate(this.xStart, this.canvasHeight - this.yStart);
  this.drawAxes();
  this.drawGraph();
  this.ctx.restore();

  // Render the game data untranslated.
  this.drawGameData();

  this.animRequest = window.requestAnimationFrame(this.renderBound);
};

Graph.prototype.clean = function() {
  this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

Graph.prototype.drawGraph = function() {
  var style = this.style.graph;
  var ctx = this.ctx;

  // Style the line depending on the game state.
  Object.assign(ctx,
    // Playing and not cashed out
    engine.currentlyPlaying() ? style.playing : style.progress
  );

  var tstep =
    this.YPayoutEnd < 1000 ?
      // For < 10.00x step 100ms.
      100 :
      // After 10.00x the graph is pretty smooth. Make sure
      // that we move at least two pixels horizontally.
      Math.max(100, Math.floor(2 / this.XScale));

  ctx.beginPath();
  for (var t = this.XTimeBeg; t < this.currentTime; t += tstep) {
    var x = this.trX(t);
    var y = this.trY(100 * calcGamePayout(t));
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};

Graph.prototype.drawAxes = function() {
  var ctx = this.ctx;
  Object.assign(ctx, this.style.axis);

  // Calcuate separation values.
  var payoutSeparation = tickSeparation(this.yMinTickSeparation / this.YScale);
  var timeSeparation = tickSeparation(this.xMinTickSeparation / this.XScale);

  // Draw tick marks and axes.
  var x, y, payout, time;
  ctx.beginPath();

  // Draw Payout tick marks.
  payout = this.YPayoutBeg + payoutSeparation;
  for (; payout < this.YPayoutEnd; payout += payoutSeparation) {
    y = this.trY(payout);
    ctx.moveTo(0, y);
    ctx.lineTo(XTICK_MARK_LENGTH, y);
  }

  // Draw time tick marks.
  time = timeSeparation;
  for (; time < this.XTimeEnd; time += timeSeparation) {
    x = this.trX(time);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, -YTICK_MARK_LENGTH);
  }

  // Draw background axes
  var x0 = this.trX(this.XTimeBeg), x1 = this.trX(this.XTimeEnd),
    y0 = this.trY(this.YPayoutBeg), y1 = this.trY(this.YPayoutEnd);
  ctx.moveTo(x0, y1);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x1, y0);

  // Finish drawing tick marks and axes.
  ctx.stroke();

  // Draw payout tick labels.
  payout = this.YPayoutBeg + payoutSeparation;
  for (; payout < this.YPayoutEnd; payout += payoutSeparation) {
    y = this.trY(payout);
    ctx.fillText((payout / 100) + 'x', -XTICK_LABEL_OFFSET, y);
  }

  // Draw time tick labels.
  time = 0;
  for (; time < this.XTimeEnd; time += timeSeparation) {
    x = this.trX(time);
    ctx.fillText(time / 1000, x, YTICK_LABEL_OFFSET);
  }
};

Graph.prototype.drawGameData = function() {
  var style = this.style.data;
  var ctx = this.ctx;


  if (socket.status === 'CONNECTING' || socket.status === 'DISCONNECTED') {
		Object.assign(ctx, { ...style.ended, ...{ font: this.style.fontSizePx(12) + ' Verdana'}});
		ctx.fillText(
			socket.status,
			this.canvasWidth / 2,
			this.canvasHeight / 2
		);
		return;
	}



  switch (engine.gameState) {
    case 'GAME_STARTING':
      var timeLeft = ((engine.startTime - Date.now()) / 1000).toFixed(1);
      Object.assign(ctx, style.starting);
      ctx.fillText(
        'Next round in ' + timeLeft + 's',
        this.canvasWidth / 2,
        this.canvasHeight / 2
      );
      break;

    case 'GAME_IN_PROGRESS':
      Object.assign(ctx, engine.currentlyPlaying() ?
        style.progressPlaying : style.progress);
      ctx.fillText(
        (this.currentPayout / 100).toFixed(2) + 'x',
        this.canvasWidth / 2,
        this.canvasHeight / 2
      );
      break;

    case 'GAME_ENDED':
      Object.assign(ctx, style.ended);
      ctx.fillText(
        'Busted', this.canvasWidth / 2,
        this.canvasHeight / 2 - this.style.fontSizeNum(15) / 2
      );

      ctx.fillText(
        '@ ' + formatDecimals(engine.bust, 2) + 'x',
        this.canvasWidth / 2,
        this.canvasHeight / 2 + this.style.fontSizeNum(15) / 2
      );
      break;

		case 'GAME_STOPPED':
			Object.assign(ctx, style.ended);
			ctx.fillText(
				'paused', this.canvasWidth / 2,
				this.canvasHeight / 2 - this.style.fontSizeNum(15) / 2
			);

			break;


    default:
       console.warn('unknown game state: ', engine.gameState);
  }
};



// Note, this FLOORS
function formatDecimals (n, decimals) {
  if (typeof decimals === 'undefined') {
    if (n % 100 === 0)
      decimals = 0;
    else
      decimals = 2;
  }

  let floorFactor = Math.pow(10, decimals);
  n = Math.floor(n * floorFactor) / floorFactor;


  return n.toFixed(decimals).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

class GraphicDisplay extends Component {

  constructor() {
    super();
    this.graph = new Graph();
  }

  componentDidMount() {
    this.graph.startRendering(this._canvas);
  }

  componentWillUnmount() {
    this.graph.stopRendering();
  }

  componentDidUpdate() {
  	this.graph.configPlotSettings(false);
  }

  render() {
    return <div className="col-xs-24">
			<canvas ref={ c => this._canvas = c } />
		</div>
  }
}

export default refresher(GraphicDisplay,
  [browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED']
);
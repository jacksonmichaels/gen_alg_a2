// You can change this,
// but will need to change swatch-holder's tile settings in CSS
const SWATCH_SIZE = 300;

// Looping Animation inspirations
// https://www.thisiscolossal.com/2018/11/hand-drawn-gifs-by-benjamin-zimmerman/
// https://www.thisiscolossal.com/2018/04/animation-of-sinusoidal-waves-in-gifs-by-etienne-jacob/
// https://www.thisiscolossal.com/2018/08/gifs-by-marcus-martinez/
//

let animations = [
  //================================================
  // TODO: Copy and paste this example to make your own animations

  {
    title: "Brain",
    description: "a set of dots in the shape of a brain. The changing sizes symbolize individual neurons activating independantly while the color represents the whole working together",
    isActive: true, // Set this to "true" to show this animation
    data: {
      dots: []
    },
    setup(p) {
      this.loopTime = 3;
      var x_scale = p.width / brain_arr[0].length
      var y_scale = p.height / brain_arr.length * 0.8
      for (let y = 0; y < brain_arr.length; y++) {
        var row = brain_arr[y]
        var line = []
        for (let x = 0; x < row.length; x++) {
          var dot = new Dot()
          dot.pos[0] = x_scale * x + x_scale / 2
          dot.pos[1] = y_scale * y + y_scale / 2
          dot.size = brain_arr[y][x] / 255
          line.push(dot);
        }
        this.data.dots.push(line);
      }
      console.log(this.data.dots)
    },
    draw(p, t) {
      let pct = (t % this.loopTime) / this.loopTime;
      let pct_rad = pct * 2.0 * Math.PI;
      let max_dist = 100;
      p.background(0);
      for (let y = 0; y < brain_arr.length; y++) {
        var row = brain_arr[y]
        for (let x = 0; x < row.length; x++) {
          var dot = this.data.dots[y][x]
          var dist = ((dot.pos[0] - p.width / 2) ** 2 + (dot.pos[1] - (p.height * 0.8) / 2) ** 2) ** 0.5;
          var color = (dist / max_dist * 255) + (255 - pct * 255)
          color %= 255;
          var x_offset = Math.cos(pct_rad) * 2;
          var y_offset = Math.sin(pct_rad) * 2;

          var x_noise = p.noise(x_offset + dot.pos[0], y_offset + dot.pos[1]) * 1;
          var y_noise = p.noise(y_offset + dot.pos[1], x_offset + dot.pos[0]) * 1;

          // p.circle(dot.pos[0],dot.pos[1], 15 * dot.size * p.noise(dot.pos[0] + x_offset, dot.pos[1] + y_offset));
          if (dot.size != 0) {
            p.fill(color, 100, 50);
            p.stroke(color, 100, 50);

            p.circle(
              x_noise + dot.pos[0],
              y_noise + dot.pos[1],
              5 * dot.size + 4 * p.noise(dot.pos[0] + x_offset, dot.pos[1] + y_offset));
          }
        }
      }

    },
  },
  {
    title: "Lightning",
    description: "for this animation I wanted to attempt to make clouds. They dont look perfect but still make a very interesting effect. I found that they looekd better when the background was more transparent but that harmed the lightning",
    isActive: true,

    setup(p) {
      this.loopTime = 10;
      this.steps = 20;
      this.pct = 0;
      this.stride = 20;
      p.background(200, 50, 10, 1);
      this.strikes = 50;
      this.tps = this.loopTime / this.strikes;
      this.dt = 0;
      this.prev_t = 0;
    },
    draw_lightning(p, x_0, y_0) {
      var x = x_0;
      var y = y_0;
      var length;
      var x_n;
      var y_n;
      var theta;
      var deflect = Math.PI;
      while (y < p.height) {
        length = 50 + 50 * p.noise(x * 10, y * 10);
        theta = 0.5 * Math.PI + (p.noise(x,y)-0.5) * deflect;
        x_n = x + Math.cos(theta)
        y_n = y + Math.sin(theta)
        p.line(x,y,x_n,y_n);
        x = x_n;
        y = y_n;
      }
    },
    draw(p, t) {
      this.dt += t - this.prev_t;
      this.prev_t = t;
      this.pct = (t % this.loopTime) / this.loopTime;
      p.background(200, 50, 10, 0.3);

      if (this.dt >= this.tps) {
        p.stroke(50, 100, 50);
        this.draw_lightning(p, p.noise(this.pct * 50, 100) * p.width,0);
        this.dt = 0;
        console.log("T")
      }

      p.stroke(0, 0, 30);
      p.fill(0, 0, 30)
      for (var x = -50; x < p.width + 50; x += this.stride) {
        for (var y = -100; y < p.height / 5; y += this.stride) {
          var xpos = (x + this.pct * p.width) % (p.width + 100) - 50;
          p.circle(xpos, y, 10 + p.noise(xpos * 0.02, y) * this.stride * 5)
        }
      }
    },
  },
  {
    title: "Triangle Hole",
    description: "for this I wanted to play around with the only rotation and scaling. To do this i draw N triangles scaling and rotating the canvas on each iteration",
    isActive: true,

    setup(p) {
      this.loopTime = 10;
      this.steps = 20;
      this.pct = 0;
      p.background(0, 0, 0, 1);
      this.triangle = [-0.866, -0.5, 0.866, -0.5, 0.0, 1.0]
      this.scalar = p.height;
    },
    draw(p, t) {
      p.background(0, 0, 0, 0.1);
      this.pct = (t % this.loopTime) / this.loopTime;
      var pct_theta = this.pct * Math.PI * 2;
      p.translate(p.width / 2, p.height / 2)
      p.rotate(Math.PI * 2 * this.pct)
      p.noFill();
      for (var i = 0; i < this.steps; i++) {
        var percent = i / this.steps
        percent += (Math.sin(pct_theta) + 1) / 2
        p.stroke(lerp(0, 255, percent), 100, 50)
        p.triangle(
          this.triangle[0] * this.scalar,
          this.triangle[1] * this.scalar,
          this.triangle[2] * this.scalar,
          this.triangle[3] * this.scalar,
          this.triangle[4] * this.scalar,
          this.triangle[5] * this.scalar,
        );
        p.scale(0.8, 0.8)
        p.rotate(0.2)
      }
    },
  },
  {
    title: "Playing with fractals",
    description: "for this example I wanted to experiment with fractals. I looked up a fractal implementation online and modified it to be more interesting and dynamic. Also playing with semi-transparent backgrounds to give a slight trail effect",
    isActive: true, // Set this to "true" to show this animation

    setup(p) {
      this.loopTime = 5;
      this.max_steps = 10;
      this.steps = 1;
      this.theta = Math.PI / 8;
      this.pct = 0;
      this.smooth_pct = this.pct;

    },
    //https://codepen.io/ma77os/pen/OJPVrP
    recur_draw(p, step, size) {
      p.stroke(step / this.max_steps * 255, 100, 50)
      if (step > this.steps) {
        return;
      } else if (step == this.steps) {
        var new_size = lerp(0, size, 1 - ((this.max_steps * this.smooth_pct) - Math.floor(this.max_steps * this.smooth_pct)));
        p.line(0, 0, 0, new_size)
      } else {
        p.line(0, 0, 0, size)
        p.push()
        p.translate(0, size)
        p.push();
        p.rotate(this.theta);
        this.recur_draw(p, step + 1, size * 0.8);
        p.pop();
        p.push();
        p.rotate(-1 * this.theta);
        this.recur_draw(p, step + 1, size * 0.8);
        p.pop();
        p.pop();
      }
    },
    draw(p, t) {
      p.background('rgba(0,0,0, 0.15)')
      p.stroke(50, 100, 20);
      // Remember how I said % (modulo) was good for looping?
      // This turns t, a value that goes up indefinitely
      // into pct, a value that loops from 0 to 1
      this.pct = (t % this.loopTime) / this.loopTime;
      //       This one is in radians, for things that go around a circle
      let pctTheta = Math.PI * 2 * this.pct;


      p.translate(p.width / 2, p.height / 2)

      this.smooth_pct = (Math.cos(pctTheta) + 1) / 2.0;
      var smooth_step = this.max_steps - this.max_steps * this.smooth_pct;

      this.steps = Math.floor(smooth_step)
      this.theta = Math.PI / 3 + Math.PI * (Math.sin(this.smooth_pct) - 0.5) * 0.4;

      var size = 30;
      this.recur_draw(p, 0, size)
      p.rotate(Math.PI)
      this.recur_draw(p, 0, size)
    },
  },
];

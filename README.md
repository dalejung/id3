id3
===

interactive d3

[Demo](https://rawgithub.com/dalejung/id3/master/demo/context.html)

```javascript
var svg = d3.select('body').append('svg:svg');
var svg2 = d3.select('body').append('svg:svg');
var focus_svg = d3.select('body').append('svg:svg').attr('class', 'focus');

focus = Figure();
focus.width(WIDTH)
  .margin({'left':40})
  .height(100)
  .index(df.index);

focus(focus_svg);
focus.layer(line2, 'focus');
var brush = focus.brush();

fig = Figure();
fig
  .width(WIDTH)
  .height(HEIGHT)
  .index(df.index);
fig(svg);

fig.x.attach(brush);

fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

// default to only first 100
fig.xchange([0, 100]);

fig.default_layout();

fig2 = Figure();
fig2
  .margin({'left':40})
  .width(WIDTH)
  .height(300)
  .index(df.index);
fig2(svg2);

fig2.x.attach(brush);
fig2.layer(line, 'line');
fig2.layer(line, 'line');
fig2.grid();
```

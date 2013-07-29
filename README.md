id3
===

interactive d3

[Demo](https://rawgithub.com/dalejung/id3/master/demo/context.html)

```javascript
// create focus figure
focus = Figure();
focus.width(800)
  .margin({'left':40})
  .height(100)
  .index(df.index);

focus(focus_svg);
focus.layer(line2, 'focus');
// expose brush
var brush = focus.brush();

fig = Figure();
fig
  .width(WIDTH)
  .height(HEIGHT)
  .index(df.index);
fig(svg);

// link axis with brush
fig.x.attach(brush);

fig.layer(line, 'line');
fig.layer(line2, 'line2');
fig.layer(candle, 'candle');

// Data Layer plus adding geoms to data.
var markers = Layer().data({'x': df.gap_up, 'y': df.open})
  .geom(Marker()
    .color('blue')
    .type('circle')
    .size(13))
  .geom(Marker()
    .color('yellow')
    .type('circle')
    .size(8));
fig.layer(markers, 'gapup');
```

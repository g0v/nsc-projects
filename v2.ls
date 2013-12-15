url = \budget.json
x = y = 250
position = 0

org <- d3.json url
color = d3.scale.ordinal!range <[#F6B4FF #AA8BE8 #86A0FF #A6D7E8 #C0FFEC]>

svg = d3.select \#visual
  .append \svg
  .append \g
    .attr \id \circles
    .attr \transform 'translate(0,0)'
data = []
amount = []
for name of org => do
  amount.push org[name][0]
  data.push {n: name, v: org[name][0]}

max = d3.max amount
min = d3.min amount
scale = d3.scale.linear!
  .domain [0, max]
  .range [0, y]

data.sort -> d3.descending &0.v, &1.v

svg.selectAll \g
  .data data
  .enter!
    .append \g
      .attr \transform -> 'translate(' + (x) + ',' + (y*2 - scale &0.v) + ')'
      .attr \class \cg
        ..append \circle
          .attr \class \circle
          .attr \r -> if scale(&0.v) < 2 then 2 else scale(&0.v)
          .style \stroke \#ECECEC
          .style \fill -> color &0.v
        ..append \text
          .attr \class \label
          .attr \y -> -(scale &0.v/1.5)
          .attr \transform 'rotate(320)'
          .text -> if &1 then &0.n + ' ' + d3.round(&0.v/100, 0) + '億元(' + d3.round(&0.v*100/max, 2) + '%)' else &0.n + ' ' + d3.round(&0.v/100, 0) + '億元'
        ..append \text
          .attr \class \label
          .attr \y -> (scale &0.v) + 15
          .attr \x -2
          .text -> &1+1

expand = ->
  pager-reset!
  svg.selectAll \g.cg
    .transition!
    .duration 1000
    .delay -> &1 * 2
    .attr \transform -> 'translate(' + (x+&1*50) + ',' + (y*2 - scale &0.v) + ')'
    .attr \class \appear

collapse = ->
  pager-reset!
  svg.selectAll \g.appear
    .transition!
    .duration 1000
    .attr \transform -> 'translate(' + (x) + ',' + (y*2 - scale &0.v) + ')'
    .attr \class \cg

pager-next = ->
  position -= window.screen.width * 0.9
  svg
    .transition!
    .duration 400
    .attr \transform 'translate('+position+',0)'

pager-prev = ->
  position += window.screen.width * 0.9
  svg
    .transition!
    .duration 400
    .attr \transform 'translate('+position+',0)'

pager-reset= ->
  svg
    .transition!
    .duration 400
    .attr \transform 'translate(0,0)'

d3.select \#prev
  .on \click pager-prev
d3.select \#next
  .on \click pager-next
d3.select \#collapse
  .on \click collapse
d3.select \#expand
  .on \click expand
setTimeout expand,2000


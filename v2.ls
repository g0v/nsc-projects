url = \budget.json
x = y = 250
screenw = window.screen.width
position = 0

org <- d3.json url
color = d3.scale.ordinal!range <[ #5782c8 #d08edd #4c6fc8 #e8b0e6 ]>

svg = d3.select \#visual
  .append \svg
  .append \g
    .attr \id \circles
    .attr \transform 'translate(0,0)'
data = []
amount = []
vmax = 0
for name of org => do
  amount.push org[name][0]
  a = Math.sqrt org[name][0]
  vmax = a unless a < vmax
  data.push {n: name, v:a, a:org[name][0]}

max = d3.max amount
min = d3.min amount
amount = null
scale = d3.scale.linear!
  .domain [0, vmax]
  .range [0, y]

data.sort -> d3.descending &0.v, &1.v

#data
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
          .style \opacity 0.6
        ..append \text
          .attr \class \label
          .attr \y -> -(scale &0.v/1.3)
          .attr \transform 'rotate(320)'
          .style \opacity 0
          .text -> 'NO.'+(&1+1)+' '+&0.n
          #.text -> if &1 then &0.n + ' ' + d3.round(&0.a/100, 0) + '億元(' + d3.round(&0.a*100/max, 2) + '%)' else &0.n + ' ' + d3.round(&0.a/100, 0) + '億元'

#legend
svg.selectAll \g.lg
  .data <[ 100000 1000000 10000000 ]>
  .enter!
    .append \g
      .attr \transform -> 'translate('+(screenw-300)+','+ (scale Math.sqrt &0)+')'
      .attr \class \lg
        ..append \circle
          .attr \class \lc
          .attr \r -> scale Math.sqrt &0
          .style \stroke \#000
          .style \opacity 0.3
          .style \fill \#ECECEC
        ..append \line
          .attr \x1 -> (scale Math.sqrt &0)
          .attr \y1 -> (scale Math.sqrt &0) *0.5
          .attr \x2 120
          .attr \y2 -> (scale Math.sqrt &0) *0.5
          .style \stroke \#999
        ..append \text
          .attr \class \lt
          .attr \x -> 125
          .attr \y -> (scale Math.sqrt &0)*0.5 + 5
          .text ->
            if &0 >= 10000000
              '100兆'
            else if  &0 >= 1000000 
              '10兆'
            else
              '1兆'

#function
expand = ->
  pager-reset!
  svg.selectAll \g.cg
    .transition!
    .duration 1000
    .delay -> &1 * 2
    .attr \transform -> 'translate(' + (x+&1*50) + ',' + (y*2 - scale &0.v) + ')'
  svg.selectAll \.label
    .transition!
    .duration 1000
    .delay -> &1 * 2
    .style \opacity 1

collapse = ->
  pager-reset!
  svg.selectAll \g.cg
    .transition!
    .duration 1000
    .attr \transform -> 'translate(' + (x) + ',' + (y*2 - scale &0.v) + ')'
    .attr \class \cg
  svg.selectAll \.label
    .transition!
    .duration 1000
    .delay -> 1
    .style \opacity 0

pager-next = ->
  position -= window.screen.width * 0.9
  svg
    .transition!
    .duration 400
    .attr \transform 'translate('+position+',0)'
  svg.selectAll \g.lg
    .transition!
    .duration 1200
    .attr \transform -> 'translate(' + (screenw-300-position) + ',' + (scale Math.sqrt &0) + ')'

pager-prev = ->
  p = position + window.screen.width * 0.9
  if p > 0
    position := 0
  else
    position := p
  svg
    .transition!
    .duration 400
    .attr \transform 'translate('+position+',0)'
  svg.selectAll \g.lg
    .transition!
    .duration 1200
    .attr \transform -> 'translate(' + (screenw-300-position) + ',' + (scale Math.sqrt &0) + ')'

pager-reset= ->
  svg
    .transition!
    .duration 400
    .attr \transform 'translate(0,0)'
  svg.selectAll \g.lg
    .transition!
    .duration 1200
    .attr \transform -> 'translate(' + (screenw-300) + ',' + (scale Math.sqrt &0) + ')'

d3.select \#prev
  .on \click pager-prev
d3.select \#next
  .on \click pager-next
d3.select \#collapse
  .on \click collapse
d3.select \#expand
  .on \click expand
d3.select \body
  .on \keydown ->
    if d3.event.keyCode == 39
      d3.select \#next .on(\click)()
    else if d3.event.keyCode == 37
      d3.select \#prev .on(\click)()
setTimeout expand,2000


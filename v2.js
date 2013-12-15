// Generated by LiveScript 1.2.0
(function(){
  var url, x, y, position;
  url = 'budget.json';
  x = y = 250;
  position = 0;
  d3.json(url, function(org){
    var color, svg, data, amount, name, max, min, scale, x$, expand, collapse, pagerNext, pagerPrev, pagerReset;
    color = d3.scale.ordinal().range(['#F6B4FF', '#AA8BE8', '#86A0FF', '#A6D7E8', '#C0FFEC']);
    svg = d3.select('#visual').append('svg').append('g').attr('id', 'circles').attr('transform', 'translate(0,0)');
    data = [];
    amount = [];
    for (name in org) {
      amount.push(org[name][0]);
      data.push({
        n: name,
        v: org[name][0]
      });
    }
    max = d3.max(amount);
    min = d3.min(amount);
    scale = d3.scale.linear().domain([0, max]).range([0, y]);
    data.sort(function(){
      return d3.descending(arguments[0].v, arguments[1].v);
    });
    x$ = svg.selectAll('g').data(data).enter().append('g').attr('transform', function(){
      return 'translate(' + x + ',' + (y * 2 - scale(arguments[0].v)) + ')';
    }).attr('class', 'cg');
    x$.append('circle').attr('class', 'circle').attr('r', function(){
      if (scale(arguments[0].v) < 2) {
        return 2;
      } else {
        return scale(arguments[0].v);
      }
    }).style('stroke', '#ECECEC').style('fill', function(){
      return color(arguments[0].v);
    });
    x$.append('text').attr('class', 'label').attr('y', function(){
      return -scale(arguments[0].v / 1.5);
    }).attr('transform', 'rotate(320)').text(function(){
      if (arguments[1]) {
        return arguments[0].n + ' ' + d3.round(arguments[0].v / 100, 0) + '億元(' + d3.round(arguments[0].v * 100 / max, 2) + '%)';
      } else {
        return arguments[0].n + ' ' + d3.round(arguments[0].v / 100, 0) + '億元';
      }
    });
    x$.append('text').attr('class', 'label').attr('y', function(){
      return scale(arguments[0].v) + 15;
    }).attr('x', -2).text(function(){
      return arguments[1] + 1;
    });
    expand = function(){
      pagerReset();
      return svg.selectAll('g.cg').transition().duration(1000).delay(function(){
        return arguments[1] * 2;
      }).attr('transform', function(){
        return 'translate(' + (x + arguments[1] * 50) + ',' + (y * 2 - scale(arguments[0].v)) + ')';
      }).attr('class', 'appear');
    };
    collapse = function(){
      pagerReset();
      return svg.selectAll('g.appear').transition().duration(1000).attr('transform', function(){
        return 'translate(' + x + ',' + (y * 2 - scale(arguments[0].v)) + ')';
      }).attr('class', 'cg');
    };
    pagerNext = function(){
      position -= window.screen.width * 0.9;
      return svg.transition().duration(400).attr('transform', 'translate(' + position + ',0)');
    };
    pagerPrev = function(){
      position += window.screen.width * 0.9;
      return svg.transition().duration(400).attr('transform', 'translate(' + position + ',0)');
    };
    pagerReset = function(){
      return svg.transition().duration(400).attr('transform', 'translate(0,0)');
    };
    d3.select('#prev').on('click', pagerPrev);
    d3.select('#next').on('click', pagerNext);
    d3.select('#collapse').on('click', collapse);
    d3.select('#expand').on('click', expand);
    return setTimeout(expand, 2000);
  });
}).call(this);
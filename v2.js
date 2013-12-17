// Generated by LiveScript 1.2.0
(function(){
  var url, x, y, screenw, position;
  url = 'budget.json';
  x = y = 250;
  screenw = window.screen.width;
  position = 0;
  d3.json(url, function(org){
    var color, svg, data, amount, vmax, name, a, max, min, scale, x$, y$, expand, collapse, pagerNext, pagerPrev, pagerReset;
    color = d3.scale.ordinal().range(['#5782c8', '#d08edd', '#4c6fc8', '#e8b0e6']);
    svg = d3.select('#visual').append('svg').append('g').attr('id', 'circles').attr('transform', 'translate(0,0)');
    data = [];
    amount = [];
    vmax = 0;
    for (name in org) {
      amount.push(org[name][0]);
      a = Math.sqrt(org[name][0]);
      if (!(a < vmax)) {
        vmax = a;
      }
      data.push({
        n: name,
        v: a,
        a: org[name][0]
      });
    }
    max = d3.max(amount);
    min = d3.min(amount);
    amount = null;
    scale = d3.scale.linear().domain([0, vmax]).range([0, y]);
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
    }).style('opacity', 0.6);
    x$.append('text').attr('class', 'label').attr('y', function(){
      return -scale(arguments[0].v / 1.3);
    }).attr('transform', 'rotate(320)').style('opacity', 0).text(function(){
      return 'NO.' + (arguments[1] + 1) + ' ' + arguments[0].n;
    });
    y$ = svg.selectAll('g.lg').data(['100000', '1000000', '10000000']).enter().append('g').attr('transform', function(){
      return 'translate(' + (screenw - 300) + ',' + scale(Math.sqrt(arguments[0])) + ')';
    }).attr('class', 'lg');
    y$.append('circle').attr('class', 'lc').attr('r', function(){
      return scale(Math.sqrt(arguments[0]));
    }).style('stroke', '#000').style('opacity', 0.3).style('fill', '#ECECEC');
    y$.append('line').attr('x1', function(){
      return scale(Math.sqrt(arguments[0]));
    }).attr('y1', function(){
      return scale(Math.sqrt(arguments[0])) * 0.5;
    }).attr('x2', 120).attr('y2', function(){
      return scale(Math.sqrt(arguments[0])) * 0.5;
    }).style('stroke', '#999');
    y$.append('text').attr('class', 'lt').attr('x', function(){
      return 125;
    }).attr('y', function(){
      return scale(Math.sqrt(arguments[0])) * 0.5 + 5;
    }).text(function(){
      if (arguments[0] >= 10000000) {
        return '100兆';
      } else if (arguments[0] >= 1000000) {
        return '10兆';
      } else {
        return '1兆';
      }
    });
    expand = function(){
      pagerReset();
      svg.selectAll('g.cg').transition().duration(1000).delay(function(){
        return arguments[1] * 2;
      }).attr('transform', function(){
        return 'translate(' + (x + arguments[1] * 50) + ',' + (y * 2 - scale(arguments[0].v)) + ')';
      });
      return svg.selectAll('.label').transition().duration(1000).delay(function(){
        return arguments[1] * 2;
      }).style('opacity', 1);
    };
    collapse = function(){
      pagerReset();
      svg.selectAll('g.cg').transition().duration(1000).attr('transform', function(){
        return 'translate(' + x + ',' + (y * 2 - scale(arguments[0].v)) + ')';
      }).attr('class', 'cg');
      return svg.selectAll('.label').transition().duration(1000).delay(function(){
        return 1;
      }).style('opacity', 0);
    };
    pagerNext = function(){
      position -= window.screen.width * 0.9;
      svg.transition().duration(400).attr('transform', 'translate(' + position + ',0)');
      return svg.selectAll('g.lg').transition().duration(1200).attr('transform', function(){
        return 'translate(' + (screenw - 300 - position) + ',' + scale(Math.sqrt(arguments[0])) + ')';
      });
    };
    pagerPrev = function(){
      var p;
      p = position + window.screen.width * 0.9;
      if (p > 0) {
        position = 0;
      } else {
        position = p;
      }
      svg.transition().duration(400).attr('transform', 'translate(' + position + ',0)');
      return svg.selectAll('g.lg').transition().duration(1200).attr('transform', function(){
        return 'translate(' + (screenw - 300 - position) + ',' + scale(Math.sqrt(arguments[0])) + ')';
      });
    };
    pagerReset = function(){
      svg.transition().duration(400).attr('transform', 'translate(0,0)');
      return svg.selectAll('g.lg').transition().duration(1200).attr('transform', function(){
        return 'translate(' + (screenw - 300) + ',' + scale(Math.sqrt(arguments[0])) + ')';
      });
    };
    d3.select('#prev').on('click', pagerPrev);
    d3.select('#next').on('click', pagerNext);
    d3.select('#collapse').on('click', collapse);
    d3.select('#expand').on('click', expand);
    d3.select('body').on('keydown', function(){
      if (d3.event.keyCode === 39) {
        return d3.select('#next').on('click')();
      } else if (d3.event.keyCode === 37) {
        return d3.select('#prev').on('click')();
      }
    });
    return setTimeout(expand, 2000);
  });
}).call(this);

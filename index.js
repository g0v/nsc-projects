// Generated by LiveScript 1.2.0
var budgetCtrl;
budgetCtrl = function($scope){
  var color;
  color = d3.scale.category20c();
  color = d3.scale.ordinal().range(['#F6B4FF', '#AA8BE8', '#86A0FF', '#A6D7E8', '#C0FFEC']);
  import$($scope, {
    inst: "",
    name: "",
    query: "",
    update: function(){
      return d3.select('#svg').selectAll('g.inst circle').attr('fill', function(it){
        if ($scope.query && it.name && it.name.indexOf($scope.query) >= 0) {
          return '#f00';
        }
        if (it.inst) {
          return color(it.inst);
        } else {
          return 'none';
        }
      });
    }
  });
  $scope.$watch('query', function(){
    console.log($scope.query);
    return $scope.update();
  });
  return d3.json('budget.json', function(data){
    var radius, bubble, svg, root, instHash, circleHash, key, dept, x$, y$, z$, z1$;
    radius = 900;
    bubble = d3.layout.pack().sort(null).size([radius, radius]).padding(1.5);
    svg = d3.select('#svg');
    root = {
      children: []
    };
    instHash = {};
    circleHash = {};
    root = {
      children: (function(){
        var results$ = [];
        for (key in data) {
          results$.push({
            name: key,
            inst: key,
            value: Math.sqrt(data[key][0]),
            c: (fn$())
          });
        }
        return results$;
        function fn$(){
          var ref$, results$ = [];
          for (dept in data[key][1]) {
            results$.push({
              name: dept,
              inst: key,
              value: Math.sqrt((ref$ = data[key][1][dept]) > 1 ? ref$ : 1)
            });
          }
          return results$;
        }
      }())
    };
    x$ = svg.selectAll('g.inst').data(bubble.nodes(root));
    y$ = x$.enter();
    z$ = y$.append('g').attr('class', 'inst');
    z$.attr('transform', function(it){
      return "translate(" + it.x + " " + it.y + ")";
    });
    z$.append('circle').attr('r', function(it){
      return it.r;
    }).attr('fill', function(it){
      if (it.inst) {
        return color(it.inst);
      } else {
        return 'none';
      }
    }).call(function(it){
      return circleHash[it.name] = this;
    });
    z$.each(function(d){
      var this$ = this;
      d3.select(this).on('mouseover', function(e){
        var bubble, x$, y$;
        $scope.$apply(function(e){
          return $scope.inst = d.inst;
        });
        if (d.r < 20) {
          $scope.$apply(function(e){
            return $scope.name = "";
          });
          return;
        }
        bubble = d3.layout.pack().sort(null).size([2 * d.r, 2 * d.r]).padding(1.5);
        x$ = d3.select(this$).selectAll('g.dept').data(bubble.nodes({
          children: d.c
        }));
        y$ = x$.enter().append('g').attr('class', 'dept');
        y$.attr('transform', function(it){
          return "translate(" + (it.x - d.r) + " " + (it.y - d.r) + ")";
        });
        y$.append('circle').attr('r', function(it){
          return it.r;
        }).attr('fill', function(it){
          if (it.name) {
            return color(it.name);
          } else {
            return 'none';
          }
        }).on('mouseover', function(it){
          return $scope.$apply(function(e){
            return $scope.name = it.name;
          });
        });
        return d3.select(this$).selectAll('g.dept').style('opacity', 1);
      });
      if (d.r < 20) {
        return;
      }
      return d3.select(this).on('mouseout', function(e){
        return d3.select(this$).selectAll('g.dept').style('opacity', 0);
      });
    });
    z1$ = y$.append('g').attr('class', 'inst-text');
    z1$.attr('transform', function(it){
      return "translate(" + it.x + " " + it.y + ")";
    });
    z1$.append('text').attr('class', 'name').text(function(it){
      if (it.r > 15) {
        return it.name;
      } else {
        return "";
      }
    });
    return x$;
  });
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
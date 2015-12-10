var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );

var tv = 2000;

// instantiate graphs
var node1_disk_graph = new Rickshaw.Graph( {
  element: document.getElementById("node1_disk_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'disk_dev_read_bytes' }, {name: 'disk_dev_write_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );node1_disk_graph.render();

var node1_net_graph = new Rickshaw.Graph( {
  element: document.getElementById("node1_net_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'network_interface_in_bytes' }, {name: 'network_interface_out_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );node1_net_graph.render();

var node1_cpu_graph = new Rickshaw.Graph( {
  element: document.getElementById("node1_cpu_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [
      { name: 'kernel_all_cpu_user' }, 
      { name: 'kernel_all_cpu_sys'  },
      { name: 'kernel_all_cpu_idle'  },
      { name: 'kernel_all_cpu_wait_total'  },
      { name: 'kernel_all_cpu_irq_hard'  },
      { name: 'kernel_all_cpu_irq_soft'  }
    ], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );node1_cpu_graph.render();

var node1_disk_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: node1_disk_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('node1_disk_y_axis')
} );

var node1_disk_preview = new Rickshaw.Graph.RangeSlider( {
  graph: node1_disk_graph,
  element: document.getElementById('node1_disk_preview'),
} );

var node1_disk_legend = new Rickshaw.Graph.Legend( {
  graph: node1_disk_graph,
  element: document.getElementById('node1_disk_legend')
} );
var node1_disk_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: node1_disk_graph,
  legend: node1_disk_legend
} );


var node1_disk_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: node1_disk_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );


var node1_net_preview = new Rickshaw.Graph.RangeSlider( {
  graph: node1_net_graph,
  element: document.getElementById('node1_net_preview'),
} );

var node1_net_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: node1_net_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('node1_net_y_axis')
} );
var node1_net_legend = new Rickshaw.Graph.Legend( {
  graph: node1_net_graph,
  element: document.getElementById('node1_net_legend')

} );

var node1_net_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: node1_net_graph,
  legend: node1_net_legend
} );


var node1_net_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: node1_net_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );

var node1_cpu_preview = new Rickshaw.Graph.RangeSlider( {
  graph: node1_cpu_graph,
  element: document.getElementById('node1_cpu_preview'),
} );

var node1_cpu_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: node1_cpu_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('node1_cpu_y_axis')
} );
var node1_cpu_legend = new Rickshaw.Graph.Legend( {
  graph: node1_cpu_graph,
  element: document.getElementById('node1_cpu_legend')

} );

var node1_cpu_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: node1_cpu_graph,
  legend: node1_cpu_legend
} );


var node1_cpu_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: node1_cpu_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
    return content;
  }
} );


// Local host socket
var node1_serversocket = new WebSocket("ws://52.34.183.118:8080/ws");

// On message, parse and data write to buffer
node1_serversocket.onmessage = function(e) {
  s = JSON.parse(e.data);
  var disk_data = { 
    disk_dev_write_bytes: parseInt(s["disk_dev_write_bytes"]), 
    disk_dev_read_bytes: parseInt(s["disk_dev_read_bytes"])
  };

  var net_data = { 
    network_interface_in_bytes: parseInt(s["network_interface_in_bytes"]), 
    network_interface_out_bytes: parseInt(s["network_interface_out_bytes"])
  };

  var cpu_data = { 
    kernel_all_cpu_user: parseInt(s["kernel_all_cpu_user"]), 
    kernel_all_cpu_sys: parseInt(s["kernel_all_cpu_sys"]),
    kernel_all_cpu_idle: parseInt(s["kernel_all_cpu_idle"]),
    kernel_all_cpu_wait_total: parseInt(s["kernel_all_cpu_wait_total"]),
    kernel_all_cpu_irq_hard: parseInt(s["kernel_all_cpu_irq_hard"]),
    kernel_all_cpu_irq_soft: parseInt(s["kernel_all_cpu_irq_soft"])
  };

  node1_disk_graph.series.addData(disk_data);
  node1_net_graph.series.addData(net_data);
  node1_cpu_graph.series.addData(cpu_data);

  node1_disk_graph.render();
  node1_net_graph.render();
  node1_cpu_graph.render();
};

var node1_disk_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: node1_disk_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); node1_disk_previewXAxis.render();

var node1_net_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: node1_net_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); node1_net_previewXAxis.render();

var node1_cpu_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: node1_cpu_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); node1_cpu_previewXAxis.render();
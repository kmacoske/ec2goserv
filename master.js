var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );

var tv = 2000;

// instantiate graphs
var disk_graph = new Rickshaw.Graph( {
  element: document.getElementById("disk_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'disk_dev_read_bytes' }, {name: 'disk_dev_write_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );disk_graph.render();

var net_graph = new Rickshaw.Graph( {
  element: document.getElementById("net_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'network_interface_in_bytes' }, {name: 'network_interface_out_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );net_graph.render();

var cpu_graph = new Rickshaw.Graph( {
  element: document.getElementById("cpu_chart"),
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
} );cpu_graph.render();

var disk_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: disk_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('disk_y_axis')
} );

var disk_preview = new Rickshaw.Graph.RangeSlider( {
  graph: disk_graph,
  element: document.getElementById('disk_preview'),
} );

var disk_legend = new Rickshaw.Graph.Legend( {
  graph: disk_graph,
  element: document.getElementById('disk_legend')
} );
var disk_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: disk_graph,
  legend: disk_legend
} );


var disk_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: disk_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );


var net_preview = new Rickshaw.Graph.RangeSlider( {
  graph: net_graph,
  element: document.getElementById('net_preview'),
} );

var net_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: net_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('net_y_axis')
} );
var net_legend = new Rickshaw.Graph.Legend( {
  graph: net_graph,
  element: document.getElementById('net_legend')

} );

var net_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: net_graph,
  legend: net_legend
} );


var net_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: net_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );

var cpu_preview = new Rickshaw.Graph.RangeSlider( {
  graph: cpu_graph,
  element: document.getElementById('cpu_preview'),
} );

var cpu_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: cpu_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('cpu_y_axis')
} );
var cpu_legend = new Rickshaw.Graph.Legend( {
  graph: cpu_graph,
  element: document.getElementById('cpu_legend')

} );

var cpu_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: cpu_graph,
  legend: cpu_legend
} );


var cpu_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: cpu_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
    return content;
  }
} );


// Local host socket
var serversocket = new WebSocket("ws://127.0.0.1:8080/ws");

// On message, parse and data write to buffer
serversocket.onmessage = function(e) {
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
    // kernel_all_cpu_idle: parseInt(s["kernel_all_cpu_idle"]),
    kernel_all_cpu_wait_total: parseInt(s["kernel_all_cpu_wait_total"]),
    kernel_all_cpu_irq_hard: parseInt(s["kernel_all_cpu_irq_hard"]),
    kernel_all_cpu_irq_soft: parseInt(s["kernel_all_cpu_irq_soft"])
  };

  disk_graph.series.addData(disk_data);
  net_graph.series.addData(net_data);
  cpu_graph.series.addData(cpu_data);

  disk_graph.render();
  net_graph.render();
  cpu_graph.render();
};

var disk_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: disk_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); disk_previewXAxis.render();

var net_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: net_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); net_previewXAxis.render();

var cpu_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: cpu_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); cpu_previewXAxis.render();
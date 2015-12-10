var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );

var tv = 2000;

// instantiate graphs
var master_disk_graph = new Rickshaw.Graph( {
  element: document.getElementById("master_disk_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'disk_dev_read_bytes' }, {name: 'disk_dev_write_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );master_disk_graph.render();

var master_net_graph = new Rickshaw.Graph( {
  element: document.getElementById("master_net_chart"),
  height: 200,
  renderer: 'line',
  series: new Rickshaw.Series.FixedDuration(
    [{ name: 'network_interface_in_bytes' }, {name: 'network_interface_out_bytes'}], undefined, {
    timeInterval: tv,
    maxDataPoints: 500,
    timeBase: new Date().getTime() / 1000
    }
  )
} );master_net_graph.render();

var master_cpu_graph = new Rickshaw.Graph( {
  element: document.getElementById("master_cpu_chart"),
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
} );master_cpu_graph.render();

var master_disk_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: master_disk_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('master_disk_y_axis')
} );

var master_disk_preview = new Rickshaw.Graph.RangeSlider( {
  graph: master_disk_graph,
  element: document.getElementById('master_disk_preview'),
} );

var master_disk_legend = new Rickshaw.Graph.Legend( {
  graph: master_disk_graph,
  element: document.getElementById('master_disk_legend')
} );
var master_disk_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: master_disk_graph,
  legend: master_disk_legend
} );


var master_disk_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: master_disk_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );


var master_net_preview = new Rickshaw.Graph.RangeSlider( {
  graph: master_net_graph,
  element: document.getElementById('master_net_preview'),
} );

var master_net_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: master_net_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('master_net_y_axis')
} );
var master_net_legend = new Rickshaw.Graph.Legend( {
  graph: master_net_graph,
  element: document.getElementById('master_net_legend')

} );

var master_net_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: master_net_graph,
  legend: master_net_legend
} );


var master_net_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: master_net_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) +  " bytes/sec" + '<br>' + date;
    return content;
  }
} );

var master_cpu_preview = new Rickshaw.Graph.RangeSlider( {
  graph: master_cpu_graph,
  element: document.getElementById('master_cpu_preview'),
} );

var master_cpu_y_ticks = new Rickshaw.Graph.Axis.Y( {
  graph: master_cpu_graph,
  orientation: 'left',
  tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
  element: document.getElementById('master_cpu_y_axis')
} );
var master_cpu_legend = new Rickshaw.Graph.Legend( {
  graph: master_cpu_graph,
  element: document.getElementById('master_cpu_legend')

} );

var master_cpu_shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
  graph: master_cpu_graph,
  legend: master_cpu_legend
} );


var master_cpu_hoverDetail = new Rickshaw.Graph.HoverDetail( {
  graph: master_cpu_graph,
  formatter: function(series, x, y) {
    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
    return content;
  }
} );


// Local host socket
var master_serversocket = new WebSocket("ws://52.11.202.215:8080/ws");

// On message, parse and data write to buffer
master_serversocket.onmessage = function(e) {
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

  master_disk_graph.series.addData(disk_data);
  master_net_graph.series.addData(net_data);
  master_cpu_graph.series.addData(cpu_data);

  master_disk_graph.render();
  master_net_graph.render();
  master_cpu_graph.render();
};

var master_disk_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: master_disk_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); master_disk_previewXAxis.render();

var master_net_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: master_net_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); master_net_previewXAxis.render();

var master_cpu_previewXAxis = new Rickshaw.Graph.Axis.Time({
  graph: master_cpu_preview.previews[0],
  timeFixture: new Rickshaw.Fixtures.Time.Local(),
  ticksTreatment: ticksTreatment
}); master_cpu_previewXAxis.render();
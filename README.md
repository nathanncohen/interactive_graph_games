Interactive graph games visualization
-------------------------------------

This repository gathers some code to help visualize Cops & Robbers games on
graphs.

It provides:

- a ``index.html`` page that displays (through [d3js](https://d3js.org/)) the graph, as
  well as the position of cops and robbers.

  To start a http server that serves this .html page, run ``python2 -m
  SimpleHTTPServer 5001`` in the main directory.

- a ``server.py`` file that answers the interactive requests made by the
  javascript code. Two important things are defined in the graph:

  - The graph itself

  - A function that is triggered whenever the user clicks on a vertex: this
    function returns the (possibly updated) positions of cops and robbers on the
    graph.

  To start this second http server, one can type ``execfile("server.py")`` in
  Sage.

Once both scripts are started, one can connect with a browser to
http://127.0.0.1:5001/. The default strategy consists of one cop with speed 1
following a robber with speed 2 (played by the user).

Nathann
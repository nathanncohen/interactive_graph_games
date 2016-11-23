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

Nathann
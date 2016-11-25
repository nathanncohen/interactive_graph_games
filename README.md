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
  javascript code. It calls the functions of ``strategy.py``

  To start this second http server, one can type ``execfile("server.py")`` in
  Sage.

- a ``strategy.py`` file that defines the graph and the strategy (see its
  documentation).

Once both servers run, one can connect with a browser to
http://127.0.0.1:5001/. The default strategy consists of one cop with speed 1
following a robber with speed 2 (played by the user).

Nathann
Interactive graph games visualization
-------------------------------------

This repository gathers some code to help visualize Cops & Robbers games on
graphs.

It provides:

- a ``index.html`` page that displays (through [d3js](https://d3js.org/)) the graph, as
  well as the position of cops and robbers.

- a ``server.py`` file that answers the interactive requests made by the
  javascript code. It calls the functions of ``strategy.py``

  To start this http server, one can type ``execfile("server.py")`` in Sage.

- a ``strategy.py`` file that defines the graph and the strategy (see its
  documentation).

Once the server runs, one can connect with a browser to
http://127.0.0.1:5000/. The default strategy consists of one cop with speed 1
following a robber with speed 2 (played by the user).

Nathann
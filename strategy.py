# This file implements the strategy itself.
#
# It must contain 3 functions at least:
#
# - 'graph()' returns the Graph object on which the game is played
#
# - 'initial_configuration()' returns the initial configuration (see below)
#
# - 'click(v,**kwds)' is called whenever the user clicks a vertex v, and must
#   return the next configuration as a dictionary. It receives as arguments the
#   vertex v, as well as all variables defining a configuration.
#
# A *configuration* is currently defined by three dictionaries associating a
# value to each vertex of the graph.
#
# - ``focused[v]``   indicates whether vertex v is focused in the drawing.
# - ``robweight[v]`` indicates the quantity of robbers at vertex v
# - ``copweight[v]`` indicates the quantity of cops at vertex v

from sage.all import *

g = graphs.RandomTree(50)

def graph():
    return g

def initial_configuration():
    copweight = {v:0 for v in g}
    robweight = {v:0 for v in g}

    robweight[0] = 1 # initial robber position
    copweight[2] = 1    # initial cop position
    return {"focused": {},
            "robweight" : robweight,
            "copweight" : copweight,
    }

def click(v, focused, robweight, copweight):
    global g
    robber = (u for u in robweight if robweight[u]).next()

    if g.distance(v,robber) <= 2:
        robweight[robber] = 0
        robweight[v] = 1
        robber = v

        for u,k in copweight.items(): # The cop greedily moves toward the robber
            if not k:
                continue
            if u!=v:
                copweight[u] = 0
                copweight[g.shortest_path(u,v)[1]] = 1

    return {
        "focused": {u: bool(g.distance(u,robber)<=2) for u in g},
        "robweight" : robweight,
        "copweight" : copweight,
    }

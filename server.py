# This file implements the Ajax server, and queries the functions of
# ``strategy.py``

from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import strategy

strategy = reload(strategy)

app = Flask(__name__)
CORS(app)

current_configuration = strategy.initial_configuration()

@app.route('/click_on_node', methods=['POST'])
def click_on_node():
    r"""

    This function receives the new node clicked, and returns the (possibly
    updated) distribution of cops, robbers, and focused vertices.

    """
    global current_configuration
    import strategy
    # strategy = reload(strategy)
    v = json.loads(request.form.keys()[0])['node_clicked'] # the node clicked

    try:
        current_configuration = strategy.click(v,**current_configuration)
    except Exception as e:
        print e
        raise

    return json.dumps(current_configuration)

@app.route('/get_graph', methods=['POST'])
def get_graph():
    r"""
    This function returns the graph as a json object
    """
    g = strategy.graph()
    data = {"link_distance": 50, "link_strength": 2, "edge_thickness": 4, "loops": [], "edge_labels": False, "vertex_size": 7, "vertex_labels": True, "directed": False, "gravity": 0.0, "charge": 0, "pos":[], "gravity": 0.04, "charge": -120}
    data['nodes'] = [{"group": "0", "name": v} for v in g]
    data['links'] = [{"strength": 0, "target": u, "color": "#aaa", "curve": 0, "source": v, "name": ""} for u,v in g.edges(labels=False)]
    print data
    return json.dumps(data)

# "pos": [[6.123233995736766e-17, -1.0], [-0.9510565162951535, -0.3090169943749475], ...],

if __name__ == "__main__":
    app.run()

from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
from sage.all import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Welcome to Python Flask!eee"

g = graphs.RandomTree(50)
oldv = 0
copweight = {v:0 for v in g}
robweight = {v:0 for v in g}
robweight[0] = 1
copweight[0] = 1
copweight[10] = 1

@app.route('/click_on_node', methods=['POST'])
def click_on_node():
    r"""

    This function receives the new node clicked, and returns the distribution of
    cops, robbers, and focused vertices.

    """
    global g, oldv, copweight, robweight
    v = json.loads(request.form.keys()[0])['node_clicked'] # the node clicked

    if g.distance(v,oldv) <= 2:
        robweight[oldv] = 0
        robweight[v] = 1
        oldv = v

        for u,k in copweight.items():
            if not k:
                continue
            copweight[u] = 0
            copweight[g.shortest_path(u,v)[1]] = 1

    print robweight

    return json.dumps({
        "focused": {'v'+str(u): bool(g.distance(u,oldv)<=2) for u in g},
        "robweight" : {'v'+str(v):val for v,val in robweight.items()},
        "copweight" : {'v'+str(v):val for v,val in copweight.items()},
    })

@app.route('/get_graph', methods=['POST'])
def get_graph():
    global g
    data = {"link_distance": 50, "link_strength": 2, "edge_thickness": 4, "loops": [], "edge_labels": False, "vertex_size": 7, "vertex_labels": True, "directed": False, "gravity": 0.0, "charge": 0, "pos":[], "gravity": 0.04, "charge": -120}
    data['nodes'] = [{"group": "0", "name": v} for v in g]
    data['links'] = [{"strength": 0, "target": u, "color": "#aaa", "curve": 0, "source": v, "name": ""} for u,v in g.edges(labels=False)]
    print data
    return json.dumps(data)

# "pos": [[6.123233995736766e-17, -1.0], [-0.9510565162951535, -0.3090169943749475], [-0.5877852522924732, 0.8090169943749473], [0.5877852522924729, 0.8090169943749476], [0.9510565162951536, -0.3090169943749472], [1.5308084989341916e-16, -0.5], [-0.4755282581475767, -0.1545084971874739], [-0.29389262614623674, 0.4045084971874736], [0.2938926261462364, 0.40450849718747384], [0.4755282581475769, -0.15450849718747348]],



if __name__ == "__main__":
    app.run()

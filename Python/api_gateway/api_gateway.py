from flask import Flask, jsonify, request, render_template, redirect
import logging
import requests

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)  # Adjust level to DEBUG for more verbosity
logger = logging.getLogger(__name__)

SERVICES = {
   'task_service': 'http://list_service:5001',
    'archive_service': 'http://archive_service:5002',
}

@app.route('/')
def send_to_default():
    return redirect('/tasks')

@app.route('/<string:list_id>')
def index(list_id):
    task_list = get_tasks_from_list(list_id).json
    print(task_list)
    logger.info('Task list: {}'.format(task_list))
    return render_template("index.html", task_list=task_list, js_path="/static/scripts/dynamic.js", archive=False)

class APIGateway:
    @staticmethod
    def forwardGet(servicename, path):
        url = f"{SERVICES[servicename]}{path}"
        try:
            response = requests.get(url)
            return response.json()
        except Exception as e:
            return {'error': e}

    @staticmethod
    def forwardPost(servicename, path, data):
        url = f"{SERVICES[servicename]}{path}"
        try:
            response = requests.post(url, json=data)
            return response.json()
        except Exception as e:
            return {'error': e}

    @staticmethod
    def forwardPut(servicename, path, data):
        url = f"{SERVICES[servicename]}{path}"
        try:
            response = requests.put(url, json=data)
            return response.json()
        except Exception as e:
            return {'error': e}

    @staticmethod
    def forwardDelete(servicename, path):
        url = f"{SERVICES[servicename]}{path}"
        try:
            response = requests.delete(url)
            return response.json()
        except Exception as e:
            return {'error': e}

@app.route('/api/tasks/<string:list_id>', methods=['GET'])
def get_tasks_from_list(list_id):
    return jsonify(APIGateway.forwardGet(
        'task_service',
        f'/tasks/{list_id}',
    ))

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task_from_list(task_id):
    return jsonify(APIGateway.forwardGet(
        'task_service',
        f'/tasks/{task_id}',
    ))

@app.route('/add/<string:list_id>', methods=['POST'])
def add_task(list_id):
    return jsonify(APIGateway.forwardPost(
        'task_service',
        f'/tasks',
        request.json,
    ))

@app.route('/update/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    return jsonify(APIGateway.forwardPut(
        'task_service',
        f'/tasks/{task_id}',
        request.json,
    ))

@app.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):

    task = get_task_from_list(task_id).json[0]

    jsonify(APIGateway.forwardPost(
        'archive_service',
        f'/tasks',
        task,
    ))

    return jsonify(APIGateway.forwardDelete(
        'task_service',
        f'/tasks/{task_id}',
    ))

@app.route('/archive')
def send_to_archive():
    return redirect('/archive/tasks')

@app.route('/archive/<string:list_id>')
def archive_list(list_id):
    task_list = get_tasks_from_archive(list_id).json
    return render_template("index.html", task_list=task_list, js_path="/static/scripts/dynamic_archive.js", archive=True)

@app.route('/api/tasks/<string:list_id>', methods=['GET'])
def get_tasks_from_archive(list_id):
    return jsonify(APIGateway.forwardGet(
        'archive_service',
        f'/tasks/{list_id}',
    ))

@app.route('/archive/add/<string:list_id>', methods=['POST'])
def add_task_to_archive(list_id):
    return jsonify(APIGateway.forwardPost(
        'archive_service',
        f'/tasks',
        request.json,
    ))

@app.route('/archive/delete/<int:task_id>', methods=['DELETE'])
def delete_task_from_archive(task_id):
    return jsonify(APIGateway.forwardDelete(
        'archive_service',
        f'/tasks/{task_id}',
    ))

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8080)
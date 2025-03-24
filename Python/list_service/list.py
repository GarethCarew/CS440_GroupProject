from flask import Flask, request, jsonify
import sqlite3
import logging
import json
app = Flask(__name__)

logging.basicConfig(level=logging.INFO)  # Adjust level to DEBUG for more verbosity
logger = logging.getLogger(__name__)

def get_db_connection():
	conn = sqlite3.connect('list.db')
	conn.row_factory = sqlite3.Row
	return conn


def init_db():
	connection = get_db_connection()
	with open('list.sql', 'r') as f:
		connection.executescript(f.read())
	connection.commit()
	connection.close()


# @app.route('/api/books', methods=['GET'])
# def get_books():
# 	conn = get_db_connection()
# 	books = conn.execute('SELECT * FROM tasks').fetchall()
# 	conn.close()
# 	return jsonify([dict(book) for book in books])


@app.route('/')
def test():
	return 'Hello World!'

@app.route('/tasks/<string:list_id>', methods=['GET'])
def get_tasks_from_list(list_id):
	conn = get_db_connection()
	book = conn.execute('SELECT * FROM tasks WHERE listID = ?', (list_id,)).fetchall()
	conn.close()

	# Get column names from the query

	if book:
		column_names = book[0].keys()

		# Convert rows to a list of dictionaries
		data_as_dicts = [dict(zip(column_names, row)) for row in book]

		# Convert to JSON
		json_data = json.dumps(data_as_dicts, indent=4)
	else:
		data_as_dicts = []

	return data_as_dicts

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task_from_list(task_id):
	conn = get_db_connection()
	book = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
	conn.close()

	# Get column names from the query

	if book:
		column_names = book.keys()

		# Convert rows to a list of dictionaries
		data_as_dicts = [dict(zip(column_names, book))]

		# Convert to JSON
		json_data = json.dumps(data_as_dicts, indent=4)
	else:
		data_as_dicts = []

	return data_as_dicts

@app.route('/tasks', methods=['POST'])
def add_task():
	if not request.json:
		return jsonify({'error': 'No data provided'}), 500

	required_fields = ['list_id', 'name']
	if not all(field in request.json for field in required_fields):
		return jsonify({'error': 'Missing required fields'}), 550

	conn = get_db_connection()
	cursor = conn.execute(
    	'INSERT INTO tasks (listID, description, complete) VALUES (?, ?, ?)',
    	(request.json['list_id'], request.json['name'], 0)
	)
	task_id = cursor.lastrowid
	conn.commit()
	conn.close()

	return jsonify({'id': task_id, 'message': 'Book added successfully'}), 201


# ADD HERE THE REST OF THE FUNCTIONS FOR THE OTHER OPERATIONS:
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
	if not request.json:
		return jsonify({'error': 'No data provided'}), 400
	required_fields = ['name', 'complete', 'list_id']
	if not all(field in request.json for field in required_fields):
		return jsonify({'error': 'Missing required fields'}), 400

	conn = get_db_connection()
	cursor = conn.execute(
    	'UPDATE tasks SET description = ?, complete = ?, listID = ? WHERE id = ?',
    	(request.json['name'], request.json['complete'], request.json['list_id'], task_id)
	)
	conn.commit()
	conn.close()

	return jsonify({'id': task_id, 'message': 'Task updated successfully'}), 201


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):

	conn = get_db_connection()
	cursor = conn.execute(
    	'DELETE FROM tasks WHERE id = ?', (task_id,)
	)
	conn.commit()
	conn.close()

	return jsonify({'id': task_id, 'message': 'Task deleted successfully'}), 201

if __name__ == '__main__':
	init_db()
	app.run(host='0.0.0.0', port=5001)
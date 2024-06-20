from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import logging
import os
from pymongo import MongoClient, errors

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('todo_app')

# MongoDB connection
mongo_uri = f"mongodb://{os.environ['MONGO_HOST']}:{os.environ['MONGO_PORT']}"
client = MongoClient(mongo_uri)

# Ensure the 'test_db' database and 'todo_items' collection are ready for use
try:
    db = client['test_db']
    collection = db['todos']
except errors.PyMongoError as e:
    logger.error(f"Error connecting to MongoDB: {e}")
    raise

class TodoListView(APIView):

    def get(self, request):
        try:
            # Fetch all todo items, excluding the MongoDB default '_id' field
            todo_items = list(collection.find({}, {'_id': 0}))
            return Response(todo_items, status=status.HTTP_200_OK)
        except errors.PyMongoError as e:
            logger.error(f"Error fetching todo items: {e}")
            return Response({'error': 'Error fetching todo items'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            todo_item = request.data
            if not todo_item:
                return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the todo item here if needed (e.g., check required fields)
            # Example validation (optional):
            if 'id' not in todo_item or 'text' not in todo_item or 'completed' not in todo_item:
                return Response({'error': 'Invalid data: id, text, and completed are required'}, status=status.HTTP_400_BAD_REQUEST)

            # Insert the todo item into the collection
            collection.insert_one(todo_item)
            return Response({'message': 'Todo item added successfully'}, status=status.HTTP_201_CREATED)
        except errors.PyMongoError as e:
            logger.error(f"Error adding todo item: {e}")
            return Response({'error': 'Error adding todo item'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'error': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, todo_id):
        logger.info(f"DELETE request received for id: {todo_id}")
        try:
            # Convert the id to ObjectId if necessary
            result = collection.delete_one({'id': int(todo_id)})
            if result.deleted_count == 0:
                return Response({'error': 'Todo item not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'message': 'Todo item deleted successfully'}, status=status.HTTP_200_OK)
        except errors.PyMongoError as e:
            logger.error(f"Error deleting todo item: {e}")
            return Response({'error': 'Error deleting todo item'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'error': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, todo_id):
        logger.info(f"PUT request received for id: {todo_id}")
        try:
            todo_item = request.data
            if not todo_item:
                return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate the todo item here if needed (e.g., check required fields)
            # Example validation (optional):
            if 'id' not in todo_item or 'text' not in todo_item or 'completed' not in todo_item:
                return Response({'error': 'Invalid data: id, text, and completed are required'}, status=status.HTTP_400_BAD_REQUEST)

            # Update the todo item in the collection
            result = collection.update_one({'id': int(todo_id)}, {'$set': todo_item})
            if result.modified_count == 0:
                return Response({'error': 'Todo item not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response({'message': 'Todo item updated successfully'}, status=status.HTTP_200_OK)
        except errors.PyMongoError as e:
            logger.error(f"Error updating todo item: {e}")
            return Response({'error': 'Error updating todo item'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({'error': 'Unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

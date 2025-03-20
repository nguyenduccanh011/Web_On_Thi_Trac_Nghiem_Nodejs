# Web On Thi Trac Nghiem Nodejs

## Models

### Question

The `Question` model represents a question in the system.

- `question_id`: Integer, primary key, auto-increment.
- `question_text`: Text, not null.
- `correct_answer`: String(255), not null.
- `category_id`: Integer, not null, foreign key referencing `ExamCategory`.
- `difficulty`: Enum('easy', 'medium', 'hard').
- `explanation`: Text.
- `created_at`: Date, default value is now.
- `updated_at`: Date.

### Answer

The `Answer` model represents an answer option for a question.

- `answer_id`: Integer, primary key, auto-increment.
- `answer_text`: String(255), not null.
- `question_id`: Integer, not null, foreign key referencing `Question`.
- `is_correct`: Boolean, not null, default value is false.
- `created_at`: Date, default value is now.
- `updated_at`: Date.

## API Endpoints

### Create a Question

To create a new question with answers, send a POST request to `/questions` with the following JSON body:

```json
{
  "question_text": "What is the capital of France?",
  "correct_answer": "Paris",
  "category_id": 1,
  "difficulty": "easy",
  "explanation": "Paris is the capital of France.",
  "answers": [
    { "answer_text": "Paris", "is_correct": true },
    { "answer_text": "London", "is_correct": false },
    { "answer_text": "Berlin", "is_correct": false },
    { "answer_text": "Madrid", "is_correct": false }
  ]
}
```

### Get a Question

To get a question with its answers, send a GET request to `/questions/:id`.

### Update a Question

To update a question, send a PUT request to `/questions/:id` with the updated data.

### Delete a Question

To delete a question, send a DELETE request to `/questions/:id`.

### Search Questions

To search for questions, send a GET request to `/questions/search?q=searchTerm`.

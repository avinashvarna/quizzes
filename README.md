# Quizzes
Quizzes for samskritam practice

## Adding a new quiz
1. Create JSON file with quiz.
JSON file should contain a dict with:
- "name": name of the quiz
- "topic": [optional] topic of the quiz - used to group quizzes in the dropdown menu
- "questions": an array of objects, with each object having:
  - "q" field with the question (HTML is allowed)
  - "choices" field with a list of entries for the multiple choices
  - "answer" field with the index of the correct answer within the choices array
2. Add the JSON file to the [data](data) directory

Scripts to generate quizzes from various existing data are in [scripts](scripts).


## Acknowledgements
The UI is based on the [Quiz App](https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript)

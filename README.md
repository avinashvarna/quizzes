# Quizzes
Quizzes for samskritam practice

## Adding a new quiz
1. Create JSON file with questions.
JSON file should contain an array of objects, with each object having:
- "q" field with the question (HTML is allowed)
- "choices" field with a list of entries for the multiple choices
- "answer" field with the index of the correct answer within the choices array
2. Add the JSON file to the [data](data) directory
3. Add an entry to [quizzes.json](quizzes.json) with the relevant info for the quiz

## Acknowledgements
The UI is based on the [Quiz App](https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript)

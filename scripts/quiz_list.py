# -*- coding: utf-8 -*-
"""
Created on Wed Dec 29 19:23:26 2021

@author: avinashvarna
"""


import datetime
import json
import pathlib


if __name__ == "__main__":
    _start_time = datetime.datetime.now()

    quizzes = []

    files = pathlib.Path('data').glob('*.json')
    for file in files:
        with open(file, encoding='utf-8') as f:
            quiz = json.load(f)
            questions = quiz.pop('questions')
            quiz['file'] = file.as_posix()
            quiz['num_questions'] = len(questions)
            if 'topic' not in quiz:
                quiz['topic'] = 'विविधानि'
            quizzes.append(quiz)

    quizzes.sort(key=lambda x: x['topic'])
    with open('build/quizzes.json', 'w', encoding='utf-8') as f:
        json.dump(quizzes, f, ensure_ascii=False, indent=2)

    _end_time = datetime.datetime.now()
    delta = _end_time - _start_time
    print(f"Took {delta} ({delta.total_seconds()} s)")
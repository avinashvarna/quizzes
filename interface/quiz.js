const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const quiz = document.getElementById('quiz');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];
let MAX_QUESTIONS = 10;
let quiz_name = null;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
	MAX_QUESTIONS = Math.min(MAX_QUESTIONS, availableQuesions.length);
    getNewQuestion();
    quiz.classList.remove('hidden');
    loader.classList.add('hidden');
};

endQuiz = () => {
	localStorage.setItem('mostRecentScore', `${score} / ${questionCounter}`);
	//go to the end page
	return window.location.assign('end.html');
}

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        endQuiz();
		return;
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.q;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
		if(number < currentQuestion.choices.length) {
			choice.innerHTML = currentQuestion.choices[number];
			choice.parentElement.style.display = "flex";
		} else {
			choice.innerHTML = "";
			choice.parentElement.style.display = "none";
		}
		choice.parentElement.classList.remove('correct');
		choice.parentElement.classList.remove('incorrect');
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
	nextQuestionBtn.disabled = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore();
        } else {
			choices[currentQuestion.answer].parentElement.classList.add('correct');
		}

        selectedChoice.parentElement.classList.add(classToApply);
		nextQuestionBtn.disabled = false;
    });
});

incrementScore = () => {
    score += 1;
    scoreText.innerText = score;
};

const quiz_name_files = new Map();

fetch('quizzes.json')
.then((res) => res.json())
.then((res) => {
	quiz_name = res[0]["name"];
	res.forEach((quiz) => {
		quiz_name_files.set(quiz["name"], quiz["file"]);
		});
})
.then(() => {
	// Parse query params to find quiz type and number of questions
	const params = new URLSearchParams(window.location.search);
	if(params.has('questions')) {
		MAX_QUESTIONS = params.get('questions');
	}
	if(params.has('quiz_name')) {
		let temp = params.get('quiz_name');
		if(quiz_name_files.has(temp)) {
			quiz_name = temp;
		} else {
			alert("Selected quiz type not recognized. Defaulting to " + quiz_name);
		}
	}
	return quiz_name_files.get(quiz_name);
})
.then((file_path) => {
	fetch(file_path)
	.then((res) => res.json())
	.then((res) => {
		questions = res.questions;
		startGame();
	})
	.catch((err) => {
		console.error(err);
	});
})
.catch((err) => {
	console.error(err);
});
